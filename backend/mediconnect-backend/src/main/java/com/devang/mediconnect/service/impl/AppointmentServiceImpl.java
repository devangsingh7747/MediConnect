package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.Appointment;
import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.repository.AppointmentRepository;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.service.AppointmentService;
import com.devang.mediconnect.service.EmailService;
import com.devang.mediconnect.service.NotificationService;
import com.devang.mediconnect.util.ProblemSpecializationMapper;

@Service
public class AppointmentServiceImpl
        implements AppointmentService {

        private final AppointmentRepository appointmentRepository;
        private final DoctorRepository doctorRepository;
        private final EmailService emailService;
        private final NotificationService notificationService;

        public AppointmentServiceImpl(
                AppointmentRepository appointmentRepository,
                DoctorRepository doctorRepository,
                EmailService emailService,
                NotificationService notificationService) {

                this.appointmentRepository = appointmentRepository;
                this.doctorRepository = doctorRepository;
                this.emailService = emailService;
                this.notificationService = notificationService;
        }

        @Override
        public Appointment saveAppointment(
                Appointment appointment) {

                String specialization =
                        ProblemSpecializationMapper.getSpecialization(
                                appointment.getProblem()
                        );

                /*
                * Only doctors who match the specialization
                * and are currently AVAILABLE are considered.
                */
                List<Doctor> doctors =
                        doctorRepository
                                .findBySpecializationIgnoreCaseAndAvailabilityIgnoreCase(
                                        specialization,
                                        "AVAILABLE"
                                );

                if (doctors.isEmpty()) {

                throw new RuntimeException(
                        "No doctor is currently available for this health problem. "
                                + "Please try again later."
                );
                }

                Doctor assignedDoctor = null;

                for (Doctor doctor : doctors) {

                /*
                * Skip incomplete doctor profiles.
                */
                if (
                        doctor.getFirstName() == null
                                || doctor.getFirstName().isBlank()
                                || doctor.getLastName() == null
                                || doctor.getLastName().isBlank()
                                || doctor.getSpecialization() == null
                                || doctor.getSpecialization().isBlank()
                                || doctor.getEmail() == null
                                || doctor.getEmail().isBlank()
                ) {
                        continue;
                }

                String doctorName =
                        doctor.getFirstName().trim()
                                + " "
                                + doctor.getLastName().trim();

                boolean alreadyBooked =
                        appointmentRepository
                                .existsByDoctorNameAndAppointmentDateAndAppointmentTime(
                                        doctorName,
                                        appointment.getAppointmentDate(),
                                        appointment.getAppointmentTime()
                                );

                if (!alreadyBooked) {

                        assignedDoctor = doctor;
                        break;
                }
                }

                if (assignedDoctor == null) {

                throw new RuntimeException(
                        "All matching doctors are already booked for the "
                                + "selected date and time. Please choose another slot."
                );
                }

                String assignedDoctorName =
                        assignedDoctor.getFirstName().trim()
                                + " "
                                + assignedDoctor.getLastName().trim();

                appointment.setDoctorName(
                        assignedDoctorName
                );

                appointment.setDoctorEmail(
                        assignedDoctor.getEmail().trim()
                );

                appointment.setStatus(
                        "Pending"
                );

                Appointment savedAppointment =
                        appointmentRepository.save(
                                appointment
                        );

                /*
                * Patient notification after booking.
                */
                notificationService.saveNotification(
                        savedAppointment.getPatientEmail(),
                        "📅 Appointment Booked",
                        "Your appointment with Dr. "
                                + savedAppointment.getDoctorName()
                                + " has been booked successfully.",
                        "APPOINTMENT_BOOKED"
                );

                /*
                * Doctor notification after a patient books.
                */
                notificationService.saveNotification(
                        savedAppointment.getDoctorEmail(),
                        "🩺 New Appointment Request",
                        savedAppointment.getPatientName()
                                + " requested an appointment for "
                                + savedAppointment.getProblem()
                                + " on "
                                + savedAppointment.getAppointmentDate()
                                + " at "
                                + savedAppointment.getAppointmentTime()
                                + ".",
                        "NEW_APPOINTMENT_REQUEST"
                );

                /*
                * Email failure should not undo successful booking.
                */
                try {

                emailService.sendAppointmentEmail(
                        savedAppointment.getPatientEmail(),
                        savedAppointment.getPatientName(),
                        savedAppointment.getProblem(),
                        savedAppointment.getDoctorName(),
                        savedAppointment.getAppointmentDate(),
                        savedAppointment.getAppointmentTime()
                );

                } catch (Exception exception) {

                System.err.println(
                        "Appointment was booked, but confirmation email "
                                + "could not be sent: "
                                + exception.getMessage()
                );
                }

                return savedAppointment;
        }

        @Override
        public List<Appointment> getAllAppointments() {

                return appointmentRepository.findAll();
        }

        @Override
        public Appointment getAppointmentById(
                Long id) {

                return appointmentRepository
                        .findById(id)
                        .orElse(null);
        }

        @Override
        public Appointment updateAppointment(
                Long id,
                Appointment appointment) {

                Appointment existingAppointment =
                        appointmentRepository
                                .findById(id)
                                .orElse(null);

                if (existingAppointment == null) {

                return null;
                }

                existingAppointment.setPatientName(
                        appointment.getPatientName()
                );

                existingAppointment.setPatientEmail(
                        appointment.getPatientEmail()
                );

                existingAppointment.setProblem(
                        appointment.getProblem()
                );

                existingAppointment.setDoctorName(
                        appointment.getDoctorName()
                );

                existingAppointment.setDoctorEmail(
                        appointment.getDoctorEmail()
                );

                existingAppointment.setAppointmentDate(
                        appointment.getAppointmentDate()
                );

                existingAppointment.setAppointmentTime(
                        appointment.getAppointmentTime()
                );

                existingAppointment.setStatus(
                        appointment.getStatus()
                );

                return appointmentRepository.save(
                        existingAppointment
                );
        }

        @Override
        public Appointment updateAppointmentStatus(
                Long id,
                String status) {

                Appointment appointment =
                        appointmentRepository
                                .findById(id)
                                .orElse(null);

                if (appointment == null) {

                return null;
                }

                appointment.setStatus(status);

                Appointment updatedAppointment =
                        appointmentRepository.save(
                                appointment
                        );

                /*
                * Patient receives status-change notification.
                */
                notificationService.saveNotification(
                        updatedAppointment.getPatientEmail(),
                        "📌 Appointment " + status,
                        "Your appointment with Dr. "
                                + updatedAppointment.getDoctorName()
                                + " has been "
                                + status.toLowerCase()
                                + ".",
                        "APPOINTMENT_" + status.toUpperCase()
                );

                /*
                * Doctor receives a notification when the
                * patient cancels an appointment.
                */
                if (
                        "Cancelled".equalsIgnoreCase(status)
                                && updatedAppointment.getDoctorEmail() != null
                                && !updatedAppointment
                                        .getDoctorEmail()
                                        .isBlank()
                ) {

                notificationService.saveNotification(
                        updatedAppointment.getDoctorEmail(),
                        "❌ Appointment Cancelled",
                        updatedAppointment.getPatientName()
                                + " cancelled the appointment scheduled for "
                                + updatedAppointment.getAppointmentDate()
                                + " at "
                                + updatedAppointment.getAppointmentTime()
                                + ".",
                        "APPOINTMENT_CANCELLED"
                );
                }

                /*
                * Email failure should not undo status update.
                */
                try {

                emailService.sendStatusUpdateEmail(
                        updatedAppointment.getPatientEmail(),
                        updatedAppointment.getPatientName(),
                        updatedAppointment.getProblem(),
                        updatedAppointment.getDoctorName(),
                        updatedAppointment.getAppointmentDate(),
                        updatedAppointment.getAppointmentTime(),
                        updatedAppointment.getStatus()
                );

                } catch (Exception exception) {

                System.err.println(
                        "Appointment status was updated, but email "
                                + "could not be sent: "
                                + exception.getMessage()
                );
                }

                return updatedAppointment;
        }

        @Override
        public void deleteAppointment(
                Long id) {

                appointmentRepository.deleteById(id);
        }

        @Override
        public List<Appointment> getAppointmentsByDoctorEmail(
                String doctorEmail) {

                /*
                * New appointments are fetched directly
                * using the reliable doctorEmail column.
                */
                List<Appointment> appointmentsByEmail =
                        appointmentRepository
                                .findByDoctorEmailIgnoreCaseOrderByAppointmentDateAscAppointmentTimeAsc(
                                        doctorEmail
                                );

                if (!appointmentsByEmail.isEmpty()) {

                return appointmentsByEmail;
                }

                /*
                * Legacy fallback:
                * Old appointments may have doctorEmail = null.
                */
                Doctor doctor =
                        doctorRepository
                                .findByEmailIgnoreCase(
                                        doctorEmail
                                )
                                .orElse(null);

                if (doctor == null) {

                return List.of();
                }

                if (
                        doctor.getFirstName() == null
                                || doctor.getLastName() == null
                ) {

                return List.of();
                }

                String doctorName =
                        doctor.getFirstName().trim()
                                + " "
                                + doctor.getLastName().trim();

                return appointmentRepository
                        .findByDoctorNameOrderByAppointmentDateAscAppointmentTimeAsc(
                                doctorName
                        );
        }

        @Override
        public Appointment acceptAppointment(
                Long appointmentId) {

                Appointment appointment =
                        appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Appointment not found."
                                        )
                                );

                if (!"Pending".equalsIgnoreCase(
                        appointment.getStatus()
                )) {

                throw new RuntimeException(
                        "Only pending appointments can be accepted."
                );
                }

                return updateAppointmentStatus(
                        appointmentId,
                        "Confirmed"
                );
        }

        @Override
        public Appointment rejectAppointment(
                Long appointmentId) {

                Appointment appointment =
                        appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Appointment not found."
                                        )
                                );

                String currentStatus =
                        appointment.getStatus();

                boolean canReject =
                        "Pending".equalsIgnoreCase(currentStatus)
                                || "Confirmed".equalsIgnoreCase(
                                        currentStatus
                                );

                if (!canReject) {

                throw new RuntimeException(
                        "Only pending or confirmed appointments can be rejected."
                );
                }

                return updateAppointmentStatus(
                        appointmentId,
                        "Rejected"
                );
        }

        @Override
        public Appointment completeAppointment(
                Long appointmentId) {

                Appointment appointment =
                        appointmentRepository
                                .findById(appointmentId)
                                .orElseThrow(
                                        () -> new RuntimeException(
                                                "Appointment not found."
                                        )
                                );

                if (!"Confirmed".equalsIgnoreCase(
                        appointment.getStatus()
                )) {

                throw new RuntimeException(
                        "Only confirmed appointments can be marked as completed."
                );
                }

                return updateAppointmentStatus(
                        appointmentId,
                        "Completed"
                );
        }

        @Override
        public List<Appointment> getAppointmentsByPatientEmail(
                String patientEmail) {

        return appointmentRepository
                .findByPatientEmailIgnoreCaseOrderByAppointmentDateAscAppointmentTimeAsc(
                        patientEmail
                );
        }

        @Override
        public Appointment cancelPatientAppointment(
                Long appointmentId,
                String patientEmail) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndPatientEmailIgnoreCase(
                                appointmentId,
                                patientEmail
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Appointment not found or you are not allowed to cancel it."
                                )
                        );

        String currentStatus =
                appointment.getStatus();

        boolean canCancel =
                "Pending".equalsIgnoreCase(currentStatus)
                        || "Confirmed".equalsIgnoreCase(
                                currentStatus
                        );

        if (!canCancel) {

                throw new RuntimeException(
                        "Only pending or confirmed appointments can be cancelled."
                );
        }

        return updateAppointmentStatus(
                appointmentId,
                "Cancelled"
        );
        }

        @Override
        public Appointment acceptDoctorAppointment(
                Long appointmentId,
                String doctorEmail) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndDoctorEmailIgnoreCase(
                                appointmentId,
                                doctorEmail
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Appointment not found or it is not assigned to you."
                                )
                        );

        if (!"Pending".equalsIgnoreCase(
                appointment.getStatus()
        )) {

                throw new RuntimeException(
                        "Only pending appointments can be accepted."
                );
        }

        return updateAppointmentStatus(
                appointmentId,
                "Confirmed"
        );
        }

        @Override
        public Appointment rejectDoctorAppointment(
                Long appointmentId,
                String doctorEmail) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndDoctorEmailIgnoreCase(
                                appointmentId,
                                doctorEmail
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Appointment not found or it is not assigned to you."
                                )
                        );

        String currentStatus =
                appointment.getStatus();

        boolean canReject =
                "Pending".equalsIgnoreCase(currentStatus)
                        || "Confirmed".equalsIgnoreCase(
                                currentStatus
                        );

        if (!canReject) {

                throw new RuntimeException(
                        "Only pending or confirmed appointments can be rejected."
                );
        }

        return updateAppointmentStatus(
                appointmentId,
                "Rejected"
        );
        }

        @Override
        public Appointment completeDoctorAppointment(
                Long appointmentId,
                String doctorEmail) {

        Appointment appointment =
                appointmentRepository
                        .findByIdAndDoctorEmailIgnoreCase(
                                appointmentId,
                                doctorEmail
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Appointment not found or it is not assigned to you."
                                )
                        );

        if (!"Confirmed".equalsIgnoreCase(
                appointment.getStatus()
        )) {

                throw new RuntimeException(
                        "Only confirmed appointments can be marked as completed."
                );
        }

        return updateAppointmentStatus(
                appointmentId,
                "Completed"
        );
        }
}
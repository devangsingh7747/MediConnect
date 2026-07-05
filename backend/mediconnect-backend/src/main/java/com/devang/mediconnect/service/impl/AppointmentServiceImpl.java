package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.Appointment;
import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.repository.AppointmentRepository;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.service.AppointmentService;
import com.devang.mediconnect.util.ProblemSpecializationMapper;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;

    }

    @Override
    public Appointment saveAppointment(Appointment appointment) {

        String specialization = ProblemSpecializationMapper.getSpecialization(
                appointment.getProblem());

        List<Doctor> doctors =
                doctorRepository.findBySpecializationIgnoreCase(specialization);

        if (doctors.isEmpty()) {

            throw new RuntimeException(
                    "No doctor available for specialization: "
                            + specialization);

        }

        Doctor assignedDoctor = null;

        for (Doctor doctor : doctors) {

            String doctorName =
                    doctor.getFirstName() + " " + doctor.getLastName();

            boolean alreadyBooked =
                    appointmentRepository
                            .existsByDoctorNameAndAppointmentDateAndAppointmentTime(
                                    doctorName,
                                    appointment.getAppointmentDate(),
                                    appointment.getAppointmentTime());

            if (!alreadyBooked) {

                assignedDoctor = doctor;
                break;

            }

        }

        if (assignedDoctor == null) {

            throw new RuntimeException(
                    "No doctors are available for the selected date and time.");

        }

        appointment.setDoctorName(
                assignedDoctor.getFirstName()
                        + " "
                        + assignedDoctor.getLastName());

        appointment.setStatus("Pending");

        return appointmentRepository.save(appointment);

    }

    @Override
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();

    }

    @Override
    public Appointment getAppointmentById(Long id) {

        return appointmentRepository.findById(id).orElse(null);

    }

    @Override
    public Appointment updateAppointment(Long id, Appointment appointment) {

        Appointment existingAppointment =
                appointmentRepository.findById(id).orElse(null);

        if (existingAppointment == null) {

            return null;

        }

        existingAppointment.setPatientName(
                appointment.getPatientName());

        existingAppointment.setProblem(
                appointment.getProblem());

        existingAppointment.setDoctorName(
                appointment.getDoctorName());

        existingAppointment.setAppointmentDate(
                appointment.getAppointmentDate());

        existingAppointment.setAppointmentTime(
                appointment.getAppointmentTime());

        existingAppointment.setStatus(
                appointment.getStatus());

        return appointmentRepository.save(existingAppointment);

    }

    @Override
    public Appointment updateAppointmentStatus(Long id, String status) {

        Appointment appointment =
                appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {

            return null;

        }

        appointment.setStatus(status);

        return appointmentRepository.save(appointment);

    }

    @Override
    public void deleteAppointment(Long id) {

        appointmentRepository.deleteById(id);

    }

}
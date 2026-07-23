package com.devang.mediconnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    Long countByStatusIgnoreCase(
            String status
    );

    List<Appointment>
    findTop5ByOrderByCreatedAtDesc();

    /*
     * Secure patient appointment history.
     */
    List<Appointment>
    findByPatientEmailIgnoreCaseOrderByAppointmentDateAscAppointmentTimeAsc(
            String patientEmail
    );

    /*
     * Secure ownership lookup for patient operations.
     */
    Optional<Appointment>
    findByIdAndPatientEmailIgnoreCase(
            Long id,
            String patientEmail
    );

    /*
     * Secure ownership lookup for doctor operations.
     */
    Optional<Appointment>
    findByIdAndDoctorEmailIgnoreCase(
            Long id,
            String doctorEmail
    );

    List<Appointment>
    findByDoctorNameOrderByAppointmentDateAscAppointmentTimeAsc(
            String doctorName
    );

    List<Appointment>
    findByDoctorEmailIgnoreCaseOrderByAppointmentDateAscAppointmentTimeAsc(
            String doctorEmail
    );

    long countByDoctorName(
            String doctorName
    );

    long countByDoctorNameAndStatus(
            String doctorName,
            String status
    );

    long countByDoctorNameAndAppointmentDate(
            String doctorName,
            String appointmentDate
    );

    boolean existsByDoctorNameAndAppointmentDateAndAppointmentTime(
            String doctorName,
            String appointmentDate,
            String appointmentTime
    );
}
package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Appointment;

public interface AppointmentService {

    Appointment saveAppointment(
            Appointment appointment
    );

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(
            Long id
    );

    Appointment updateAppointment(
            Long id,
            Appointment appointment
    );

    Appointment updateAppointmentStatus(
            Long id,
            String status
    );

    void deleteAppointment(
            Long id
    );

    /*
     * Secure patient operations.
     */

    List<Appointment> getAppointmentsByPatientEmail(
            String patientEmail
    );

    Appointment cancelPatientAppointment(
            Long appointmentId,
            String patientEmail
    );

    /*
     * Secure doctor operations.
     */

    List<Appointment> getAppointmentsByDoctorEmail(
            String doctorEmail
    );

    Appointment acceptDoctorAppointment(
            Long appointmentId,
            String doctorEmail
    );

    Appointment rejectDoctorAppointment(
            Long appointmentId,
            String doctorEmail
    );

    Appointment completeDoctorAppointment(
            Long appointmentId,
            String doctorEmail
    );

    /*
     * Old methods are temporarily retained so existing
     * code continues compiling during migration.
     */

    Appointment acceptAppointment(
            Long appointmentId
    );

    Appointment rejectAppointment(
            Long appointmentId
    );

    Appointment completeAppointment(
            Long appointmentId
    );
}
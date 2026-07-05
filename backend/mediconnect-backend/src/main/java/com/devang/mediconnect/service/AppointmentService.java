package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Appointment;

public interface AppointmentService {

    Appointment saveAppointment(Appointment appointment);

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(Long id);

    Appointment updateAppointment(Long id, Appointment appointment);

    Appointment updateAppointmentStatus(Long id, String status);

    void deleteAppointment(Long id);

}
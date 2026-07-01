package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.Appointment;
import com.devang.mediconnect.repository.AppointmentRepository;
import com.devang.mediconnect.service.AppointmentService;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment saveAppointment(Appointment appointment) {
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

        Appointment existingAppointment = appointmentRepository.findById(id).orElse(null);

        if (existingAppointment == null) {
            return null;
        }

        existingAppointment.setPatientName(appointment.getPatientName());
        existingAppointment.setDoctorName(appointment.getDoctorName());
        existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        existingAppointment.setStatus(appointment.getStatus());

        return appointmentRepository.save(existingAppointment);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
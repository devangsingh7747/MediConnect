package com.devang.mediconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.entity.Appointment;
import com.devang.mediconnect.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public Appointment saveAppointment(@RequestBody Appointment appointment) {

        return appointmentService.saveAppointment(appointment);

    }

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService.getAllAppointments();

    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {

        return appointmentService.getAppointmentById(id);

    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return appointmentService.updateAppointment(id, appointment);

    }

    @PutMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return appointmentService.updateAppointmentStatus(
                id,
                request.get("status")
        );

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.noContent().build();

    }

}
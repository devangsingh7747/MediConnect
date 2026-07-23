package com.devang.mediconnect.controller;

import java.security.Principal;
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

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService =
                appointmentService;
    }

    /*
     * Secure patient appointment history.
     */
    @GetMapping("/my")
    public List<Appointment> getMyAppointments(
            Principal principal) {

        return appointmentService
                .getAppointmentsByPatientEmail(
                        principal.getName()
                );
    }

    /*
     * Secure patient cancellation.
     */
    @PutMapping("/my/{id}/cancel")
    public ResponseEntity<Appointment>
    cancelMyAppointment(
            @PathVariable Long id,
            Principal principal) {

        Appointment updatedAppointment =
                appointmentService
                        .cancelPatientAppointment(
                                id,
                                principal.getName()
                        );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }

    /*
     * Secure doctor appointment history.
     */
    @GetMapping("/doctor/me")
    public List<Appointment>
    getMyDoctorAppointments(
            Principal principal) {

        return appointmentService
                .getAppointmentsByDoctorEmail(
                        principal.getName()
                );
    }

    /*
     * Secure doctor status operations.
     */

    @PutMapping("/doctor/me/{id}/accept")
    public ResponseEntity<Appointment>
    acceptMyDoctorAppointment(
            @PathVariable Long id,
            Principal principal) {

        Appointment updatedAppointment =
                appointmentService
                        .acceptDoctorAppointment(
                                id,
                                principal.getName()
                        );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }

    @PutMapping("/doctor/me/{id}/reject")
    public ResponseEntity<Appointment>
    rejectMyDoctorAppointment(
            @PathVariable Long id,
            Principal principal) {

        Appointment updatedAppointment =
                appointmentService
                        .rejectDoctorAppointment(
                                id,
                                principal.getName()
                        );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }

    @PutMapping("/doctor/me/{id}/complete")
    public ResponseEntity<Appointment>
    completeMyDoctorAppointment(
            @PathVariable Long id,
            Principal principal) {

        Appointment updatedAppointment =
                appointmentService
                        .completeDoctorAppointment(
                                id,
                                principal.getName()
                        );

        return ResponseEntity.ok(
                updatedAppointment
        );
    }

    /*
     * Temporary legacy endpoints.
     * These remain only until every frontend page is migrated.
     */

    @PostMapping
    public Appointment saveAppointment(
            @RequestBody Appointment appointment) {

        return appointmentService
                .saveAppointment(appointment);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService
                .getAllAppointments();
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(
            @PathVariable Long id) {

        return appointmentService
                .getAppointmentById(id);
    }

    @GetMapping("/doctor/{email}")
    public List<Appointment>
    getDoctorAppointments(
            @PathVariable String email) {

        return appointmentService
                .getAppointmentsByDoctorEmail(
                        email
                );
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return appointmentService
                .updateAppointment(
                        id,
                        appointment
                );
    }

    @PutMapping("/{id}/status")
    public Appointment updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return appointmentService
                .updateAppointmentStatus(
                        id,
                        request.get("status")
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable Long id) {

        appointmentService
                .deleteAppointment(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Appointment>
    acceptAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .acceptAppointment(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Appointment>
    rejectAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .rejectAppointment(id)
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment>
    completeAppointment(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService
                        .completeAppointment(id)
        );
    }
}
package com.devang.mediconnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(
            DoctorService doctorService) {

        this.doctorService = doctorService;

    }

    @PostMapping
    public Doctor saveDoctor(
            @RequestBody Doctor doctor) {

        return doctorService.saveDoctor(doctor);

    }

    @GetMapping
    public List<Doctor> getAllDoctors() {

        return doctorService.getAllDoctors();

    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable Long id) {

        Doctor doctor =
                doctorService.getDoctorById(id);

        if (doctor == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(doctor);

    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(
            @PathVariable String email) {

        Doctor doctor =
                doctorService.getDoctorByEmail(email);

        if (doctor == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(doctor);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @RequestBody Doctor doctor) {

        Doctor updatedDoctor =
                doctorService.updateDoctor(
                        id,
                        doctor
                );

        if (updatedDoctor == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updatedDoctor);

    }

    @PutMapping("/email/{email}/availability")
    public ResponseEntity<Doctor> updateAvailability(
            @PathVariable String email,
            @RequestBody String availability) {

        Doctor updatedDoctor =
                doctorService.updateAvailability(
                        email,
                        availability
                );

        if (updatedDoctor == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updatedDoctor);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.noContent().build();

    }

}
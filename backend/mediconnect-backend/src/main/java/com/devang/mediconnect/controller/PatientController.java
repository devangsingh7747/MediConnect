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

import com.devang.mediconnect.entity.Patient;
import com.devang.mediconnect.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(
            PatientService patientService) {

        this.patientService = patientService;

    }

    @PostMapping
    public Patient savePatient(
            @RequestBody Patient patient) {

        return patientService.savePatient(patient);

    }

    @GetMapping
    public List<Patient> getAllPatients() {

        return patientService.getAllPatients();

    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {

        Patient patient =
                patientService.getPatientById(id);

        if (patient == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(patient);

    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(
            @PathVariable String email) {

        Patient patient =
                patientService.getPatientByEmail(email);

        if (patient == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(patient);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {

        Patient updatedPatient =
                patientService.updatePatient(
                        id,
                        patient
                );

        if (updatedPatient == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updatedPatient);

    }

    @PutMapping("/email/{email}")
    public ResponseEntity<Patient> updatePatientByEmail(
            @PathVariable String email,
            @RequestBody Patient patient) {

        Patient updatedPatient =
                patientService.updatePatientByEmail(
                        email,
                        patient
                );

        if (updatedPatient == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updatedPatient);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();

    }

}
package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Patient;

public interface PatientService {

    Patient savePatient(Patient patient);

    List<Patient> getAllPatients();

    Patient getPatientById(Long id);

    Patient getPatientByEmail(String email);

    Patient updatePatient(Long id, Patient patient);

    Patient updatePatientByEmail(
            String email,
            Patient patient
    );

    void deletePatient(Long id);

}
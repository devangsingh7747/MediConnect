package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Patient;

public interface PatientService {

    Patient savePatient(Patient patient);
    
    List<Patient> getAllPatients();

    Patient getPatientById(Long id);

    Patient updatePatient(Long id, Patient patient);

    void deletePatient(Long id);

}
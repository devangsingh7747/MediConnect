package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.Patient;
import com.devang.mediconnect.repository.PatientRepository;
import com.devang.mediconnect.service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    public PatientServiceImpl(
            PatientRepository patientRepository) {

        this.patientRepository = patientRepository;

    }

    @Override
    public Patient savePatient(Patient patient) {

        return patientRepository.save(patient);

    }

    @Override
    public List<Patient> getAllPatients() {

        return patientRepository.findAll();

    }

    @Override
    public Patient getPatientById(Long id) {

        return patientRepository
                .findById(id)
                .orElse(null);

    }

    @Override
    public Patient getPatientByEmail(String email) {

        return patientRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

    }

    @Override
    public Patient updatePatient(
            Long id,
            Patient patient) {

        Patient existingPatient = patientRepository
                .findById(id)
                .orElse(null);

        if (existingPatient == null) {

            return null;

        }

        existingPatient.setFirstName(
                patient.getFirstName()
        );

        existingPatient.setLastName(
                patient.getLastName()
        );

        existingPatient.setEmail(
                patient.getEmail()
        );

        existingPatient.setPhone(
                patient.getPhone()
        );

        existingPatient.setAge(
                patient.getAge()
        );

        existingPatient.setGender(
                patient.getGender()
        );

        return patientRepository.save(existingPatient);

    }

    @Override
    public Patient updatePatientByEmail(
            String email,
            Patient patient) {

        Patient existingPatient = patientRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

        if (existingPatient == null) {

            return null;

        }

        existingPatient.setFirstName(
                patient.getFirstName()
        );

        existingPatient.setLastName(
                patient.getLastName()
        );

        existingPatient.setPhone(
                patient.getPhone()
        );

        existingPatient.setAge(
                patient.getAge()
        );

        existingPatient.setGender(
                patient.getGender()
        );

        /*
         * We intentionally do not update the email here.
         * The email connects the User account and Patient profile.
         */

        return patientRepository.save(existingPatient);

    }

    @Override
    public void deletePatient(Long id) {

        patientRepository.deleteById(id);

    }

}
package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.service.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = doctorRepository.findById(id).orElse(null);

        if (existingDoctor == null) {
            return null;
        }

        existingDoctor.setFirstName(doctor.getFirstName());
        existingDoctor.setLastName(doctor.getLastName());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setEmail(doctor.getEmail());
        existingDoctor.setPhone(doctor.getPhone());
        existingDoctor.setExperience(doctor.getExperience());
        existingDoctor.setHospital(doctor.getHospital());
        existingDoctor.setAvailability(doctor.getAvailability());

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public Doctor getDoctorByEmail(String email) {

        return doctorRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

    }

    @Override
    public Doctor updateAvailability(
            String email,
            String availability) {

        Doctor doctor =
                doctorRepository
                        .findByEmailIgnoreCase(email)
                        .orElse(null);

        if (doctor == null) {

            return null;

        }

        String normalizedAvailability =
                availability == null
                        ? "UNAVAILABLE"
                        : availability
                                .replace("\"", "")
                                .trim()
                                .toUpperCase();

        if (
                !"AVAILABLE".equals(normalizedAvailability)
                && !"UNAVAILABLE".equals(normalizedAvailability)
        ) {

            normalizedAvailability = "UNAVAILABLE";

        }

        doctor.setAvailability(
                normalizedAvailability
        );

        return doctorRepository.save(doctor);

    }

}
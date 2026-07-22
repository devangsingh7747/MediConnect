package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Doctor;

public interface DoctorService {

    Doctor saveDoctor(Doctor doctor);

    List<Doctor> getAllDoctors();

    Doctor getDoctorById(Long id);

    Doctor updateDoctor(Long id, Doctor doctor);

    Doctor getDoctorByEmail(String email);

    Doctor updateAvailability(
        String email,
        String availability
    );

    void deleteDoctor(Long id);

}
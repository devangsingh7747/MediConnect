package com.devang.mediconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

}
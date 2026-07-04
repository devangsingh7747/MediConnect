package com.devang.mediconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findTop5ByOrderByCreatedAtDesc();
    
    List<Patient> findAllByOrderByCreatedAtAsc();

}
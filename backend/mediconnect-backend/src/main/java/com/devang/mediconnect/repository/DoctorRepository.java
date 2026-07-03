package com.devang.mediconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findTop5ByOrderByCreatedAtDesc();

}
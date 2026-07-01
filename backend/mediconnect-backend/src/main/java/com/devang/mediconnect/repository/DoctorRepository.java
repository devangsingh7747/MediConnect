package com.devang.mediconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}
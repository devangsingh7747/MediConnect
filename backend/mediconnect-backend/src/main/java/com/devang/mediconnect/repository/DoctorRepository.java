package com.devang.mediconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devang.mediconnect.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findTop5ByOrderByCreatedAtDesc();

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    @Query("""
    SELECT d.specialization, COUNT(d)
    FROM Doctor d
    GROUP BY d.specialization
    """)
    List<Object[]> countDoctorsBySpecialization();

}
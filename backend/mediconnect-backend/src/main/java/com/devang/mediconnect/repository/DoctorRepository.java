package com.devang.mediconnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.devang.mediconnect.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

        List<Doctor> findTop5ByOrderByCreatedAtDesc();

        List<Doctor> findBySpecializationIgnoreCase(
                String specialization
        );

        /*
        * Used during automatic appointment assignment.
        *
        * Only doctors matching both the required specialization
        * and the requested availability status will be returned.
        */
        List<Doctor>
        findBySpecializationIgnoreCaseAndAvailabilityIgnoreCase(
                String specialization,
                String availability
        );

        Optional<Doctor> findByEmailIgnoreCase(
                String email
        );

        boolean existsByEmailIgnoreCase(
                String email
        );

        @Query("""
                SELECT d.specialization, COUNT(d)
                FROM Doctor d
                WHERE d.specialization IS NOT NULL
                GROUP BY d.specialization
                """)
        List<Object[]> countDoctorsBySpecialization();

        /*
        * Optional helper for future admin/dashboard use.
        */
        @Query("""
                SELECT d
                FROM Doctor d
                WHERE LOWER(d.specialization) = LOWER(:specialization)
                AND LOWER(d.availability) = LOWER(:availability)
                """)
        List<Doctor> findMatchingAvailableDoctors(
                @Param("specialization") String specialization,
                @Param("availability") String availability
        );
}
package com.devang.mediconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Long countByStatusIgnoreCase(String status);

    List<Appointment> findTop5ByOrderByCreatedAtDesc();

}
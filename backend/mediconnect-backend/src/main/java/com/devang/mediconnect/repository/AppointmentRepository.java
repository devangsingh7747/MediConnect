package com.devang.mediconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

}
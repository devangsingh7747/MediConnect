package com.devang.mediconnect.service;

import java.util.Map;

import com.devang.mediconnect.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboardData();

    Map<String, Long> getAppointmentStatus();

    Map<String, Long> getPatientGrowth();

    Map<String, Long> getDoctorSpecializationStats();

}
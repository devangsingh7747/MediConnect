package com.devang.mediconnect.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.dto.DashboardResponse;
import com.devang.mediconnect.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardResponse getDashboardData() {
        return dashboardService.getDashboardData();
    }

    @GetMapping("/appointment-status")
    public Map<String, Long> getAppointmentStatus() {
        return dashboardService.getAppointmentStatus();
    }

}
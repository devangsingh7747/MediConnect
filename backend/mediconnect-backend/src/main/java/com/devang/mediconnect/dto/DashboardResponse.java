package com.devang.mediconnect.dto;

import java.util.List;

import com.devang.mediconnect.entity.Appointment;
import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.entity.Patient;

public class DashboardResponse {

    private Long patientCount;

    private Long doctorCount;

    private Long appointmentCount;

    private List<Patient> recentPatients;

    private List<Doctor> recentDoctors;

    private List<Appointment> recentAppointments;

    public DashboardResponse() {
    }

    public Long getPatientCount() {
        return patientCount;
    }

    public void setPatientCount(Long patientCount) {
        this.patientCount = patientCount;
    }

    public Long getDoctorCount() {
        return doctorCount;
    }

    public void setDoctorCount(Long doctorCount) {
        this.doctorCount = doctorCount;
    }

    public Long getAppointmentCount() {
        return appointmentCount;
    }

    public void setAppointmentCount(Long appointmentCount) {
        this.appointmentCount = appointmentCount;
    }

    public List<Patient> getRecentPatients() {
        return recentPatients;
    }

    public void setRecentPatients(List<Patient> recentPatients) {
        this.recentPatients = recentPatients;
    }

    public List<Doctor> getRecentDoctors() {
        return recentDoctors;
    }

    public void setRecentDoctors(List<Doctor> recentDoctors) {
        this.recentDoctors = recentDoctors;
    }

    public List<Appointment> getRecentAppointments() {
        return recentAppointments;
    }

    public void setRecentAppointments(List<Appointment> recentAppointments) {
        this.recentAppointments = recentAppointments;
    }

}
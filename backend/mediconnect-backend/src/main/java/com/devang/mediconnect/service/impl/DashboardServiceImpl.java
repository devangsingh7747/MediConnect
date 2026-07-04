package com.devang.mediconnect.service.impl;

import java.time.Month;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.devang.mediconnect.dto.DashboardResponse;
import com.devang.mediconnect.entity.Patient;
import com.devang.mediconnect.repository.AppointmentRepository;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.repository.PatientRepository;
import com.devang.mediconnect.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final AppointmentRepository appointmentRepository;

        public DashboardServiceImpl(
                PatientRepository patientRepository,
                DoctorRepository doctorRepository,
                AppointmentRepository appointmentRepository) {

                this.patientRepository = patientRepository;
                this.doctorRepository = doctorRepository;
                this.appointmentRepository = appointmentRepository;
        }

        @Override
        public DashboardResponse getDashboardData() {

                DashboardResponse response = new DashboardResponse();

                response.setPatientCount(patientRepository.count());
                response.setDoctorCount(doctorRepository.count());
                response.setAppointmentCount(appointmentRepository.count());

                response.setRecentPatients(
                        patientRepository.findTop5ByOrderByCreatedAtDesc());

                response.setRecentDoctors(
                        doctorRepository.findTop5ByOrderByCreatedAtDesc());

                response.setRecentAppointments(
                        appointmentRepository.findTop5ByOrderByCreatedAtDesc());

                response.setPendingAppointments(
                        appointmentRepository.countByStatusIgnoreCase("Pending"));

                response.setCompletedAppointments(
                        appointmentRepository.countByStatusIgnoreCase("Completed"));

                response.setCancelledAppointments(
                        appointmentRepository.countByStatusIgnoreCase("Cancelled"));

                return response;
        }

        @Override
        public Map<String, Long> getPatientGrowth() {

                List<Patient> patients = patientRepository.findAllByOrderByCreatedAtAsc();

                Map<String, Long> growth = new LinkedHashMap<>();

                for (Month month : Month.values()) {

                growth.put(month.name().substring(0, 3), 0L);

                }

                for (Patient patient : patients) {

                if (patient.getCreatedAt() != null) {

                        String month = patient.getCreatedAt()
                                .getMonth()
                                .name()
                                .substring(0, 3);

                        growth.put(
                                month,
                                growth.get(month) + 1
                        );

                }

                }

                return growth;
        }

        @Override
        public Map<String, Long> getAppointmentStatus() {

                Map<String, Long> status = new HashMap<>();

                status.put(
                        "completed",
                        appointmentRepository.countByStatusIgnoreCase("Completed"));

                status.put(
                        "pending",
                        appointmentRepository.countByStatusIgnoreCase("Pending"));

                status.put(
                        "cancelled",
                        appointmentRepository.countByStatusIgnoreCase("Cancelled"));

                return status;
        }

        @Override
        public Map<String, Long> getDoctorSpecializationStats() {

                Map<String, Long> stats = new LinkedHashMap<>();

                List<Object[]> result = doctorRepository.countDoctorsBySpecialization();

                for (Object[] row : result) {

                stats.put(
                        (String) row[0],
                        (Long) row[1]
                );

                }

                return stats;
        }

}
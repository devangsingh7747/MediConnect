package com.devang.mediconnect.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.entity.Patient;
import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.repository.PatientRepository;
import com.devang.mediconnect.repository.UserRepository;
import com.devang.mediconnect.security.JwtUtil;
import com.devang.mediconnect.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;

    }

    @Override
    @Transactional
    public User registerUser(User user) {

        String role = user.getRole();

        if (role == null || role.isBlank()) {

            role = "PATIENT";

        }

        role = role.trim().toUpperCase();

        if (
                !"PATIENT".equals(role)
                && !"DOCTOR".equals(role)
        ) {

            role = "PATIENT";

        }

        user.setRole(role);

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        createPatientProfileIfRequired(savedUser);
        createDoctorProfileIfRequired(savedUser);

        return savedUser;

    }

    @Override
    public User getUserByEmail(String email) {

        return userRepository
                .findByEmail(email)
                .orElse(null);

    }

    @Override
    @Transactional
    public String loginUser(
            String email,
            String password) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )

        );

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return null;

        }

        /*
         * Creates missing profiles for accounts that were
         * registered before automatic profile creation.
         */
        createPatientProfileIfRequired(user);
        createDoctorProfileIfRequired(user);

        return jwtUtil.generateToken(
                user.getEmail()
        );

    }

    private void createPatientProfileIfRequired(
            User user) {

        if (
                !"PATIENT".equalsIgnoreCase(
                        user.getRole()
                )
        ) {

            return;

        }

        if (
                patientRepository
                        .existsByEmailIgnoreCase(
                                user.getEmail()
                        )
        ) {

            return;

        }

        String[] nameParts =
                splitFullName(user.getFullName());

        Patient patient = new Patient();

        patient.setFirstName(nameParts[0]);
        patient.setLastName(nameParts[1]);
        patient.setEmail(user.getEmail());
        patient.setPhone(null);
        patient.setAge(null);
        patient.setGender(null);

        patientRepository.save(patient);

    }

    private void createDoctorProfileIfRequired(
            User user) {

        if (
                !"DOCTOR".equalsIgnoreCase(
                        user.getRole()
                )
        ) {

            return;

        }

        if (
                doctorRepository
                        .existsByEmailIgnoreCase(
                                user.getEmail()
                        )
        ) {

            return;

        }

        String[] nameParts =
                splitFullName(user.getFullName());

        Doctor doctor = new Doctor();

        doctor.setFirstName(nameParts[0]);
        doctor.setLastName(nameParts[1]);
        doctor.setEmail(user.getEmail());

        /*
         * The doctor will complete these fields later
         * from the Doctor Profile page.
         */
        doctor.setSpecialization(null);
        doctor.setPhone(null);
        doctor.setExperience(null);
        doctor.setHospital(null);

        /*
         * Doctor remains unavailable until the profile
         * and specialization are properly completed.
         */
        doctor.setAvailability("UNAVAILABLE");

        doctorRepository.save(doctor);

    }

    private String[] splitFullName(
            String fullNameValue) {

        String fullName =
                fullNameValue == null
                        ? ""
                        : fullNameValue.trim();

        String firstName = fullName;
        String lastName = "";

        if (fullName.contains(" ")) {

            String[] parts =
                    fullName.split("\\s+", 2);

            firstName = parts[0];
            lastName = parts[1];

        }

        return new String[]{
                firstName,
                lastName
        };

    }

}
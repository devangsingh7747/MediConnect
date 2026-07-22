package com.devang.mediconnect.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devang.mediconnect.dto.VerifyRegistrationOtpRequest;
import com.devang.mediconnect.entity.Doctor;
import com.devang.mediconnect.entity.Patient;
import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.repository.DoctorRepository;
import com.devang.mediconnect.repository.PatientRepository;
import com.devang.mediconnect.repository.UserRepository;
import com.devang.mediconnect.security.JwtUtil;
import com.devang.mediconnect.service.EmailService;
import com.devang.mediconnect.service.UserService;

@Service
public class UserServiceImpl
        implements UserService {

        private static final int OTP_EXPIRY_MINUTES = 5;
        private static final int MAX_OTP_ATTEMPTS = 5;

        private final UserRepository userRepository;
        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        private final SecureRandom secureRandom =
                new SecureRandom();

        /*
        * Temporary development OTP storage.
        *
        * Only the BCrypt OTP hash is stored.
        * The user's registration password is not stored here.
        *
        * For production deployment, this can later be replaced
        * with Redis or a database-backed OTP table.
        */
        private final Map<String, RegistrationOtpData>
                registrationOtps =
                new ConcurrentHashMap<>();

        public UserServiceImpl(
                UserRepository userRepository,
                PatientRepository patientRepository,
                DoctorRepository doctorRepository,
                BCryptPasswordEncoder passwordEncoder,
                JwtUtil jwtUtil,
                AuthenticationManager authenticationManager,
                EmailService emailService) {

                this.userRepository = userRepository;
                this.patientRepository = patientRepository;
                this.doctorRepository = doctorRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtUtil = jwtUtil;
                this.authenticationManager =
                        authenticationManager;
                this.emailService = emailService;
        }

        @Override
        public void sendRegistrationOtp(
                String emailValue) {

                String email =
                        normalizeAndValidateEmail(
                                emailValue
                        );

                if (
                        userRepository
                                .findByEmail(email)
                                .isPresent()
                ) {

                throw new RuntimeException(
                        "An account already exists with this email address."
                );
                }

                String otp =
                        generateSixDigitOtp();

                String otpHash =
                        passwordEncoder.encode(
                                otp
                        );

                RegistrationOtpData otpData =
                        new RegistrationOtpData(
                                otpHash,
                                LocalDateTime.now()
                                        .plusMinutes(
                                                OTP_EXPIRY_MINUTES
                                        ),
                                0
                        );

                /*
                * Store the OTP before sending, but remove it
                * immediately if email delivery fails.
                */
                registrationOtps.put(
                        email,
                        otpData
                );

                try {

                emailService
                        .sendRegistrationOtpEmail(
                                email,
                                otp
                        );

                } catch (Exception exception) {

                registrationOtps.remove(
                        email
                );

                throw exception;
                }
        }

        @Override
        @Transactional
        public User verifyRegistrationOtp(
                VerifyRegistrationOtpRequest request) {

                if (request == null) {

                throw new RuntimeException(
                        "Registration information is required."
                );
                }

                validateRegistrationDetails(
                        request.getFullName(),
                        request.getEmail(),
                        request.getPassword(),
                        request.getOtp()
                );

                String email =
                        normalizeAndValidateEmail(
                                request.getEmail()
                        );

                RegistrationOtpData otpData =
                        registrationOtps.get(
                                email
                        );

                if (otpData == null) {

                throw new RuntimeException(
                        "No registration OTP was found. Please request a new OTP."
                );
                }

                if (
                        LocalDateTime.now()
                                .isAfter(
                                        otpData.expiresAt()
                                )
                ) {

                registrationOtps.remove(
                        email
                );

                throw new RuntimeException(
                        "The OTP has expired. Please request a new OTP."
                );
                }

                if (
                        otpData.failedAttempts()
                                >= MAX_OTP_ATTEMPTS
                ) {

                registrationOtps.remove(
                        email
                );

                throw new RuntimeException(
                        "Too many incorrect OTP attempts. Please request a new OTP."
                );
                }

                String submittedOtp =
                        request.getOtp().trim();

                if (
                        !submittedOtp.matches(
                                "\\d{6}"
                        )
                ) {

                throw new RuntimeException(
                        "OTP must contain exactly 6 digits."
                );
                }

                if (
                        !passwordEncoder.matches(
                                submittedOtp,
                                otpData.otpHash()
                        )
                ) {

                registrationOtps.put(
                        email,
                        new RegistrationOtpData(
                                otpData.otpHash(),
                                otpData.expiresAt(),
                                otpData.failedAttempts()
                                        + 1
                        )
                );

                throw new RuntimeException(
                        "The entered OTP is incorrect."
                );
                }

                if (
                        userRepository
                                .findByEmail(email)
                                .isPresent()
                ) {

                registrationOtps.remove(
                        email
                );

                throw new RuntimeException(
                        "An account already exists with this email address."
                );
                }

                User user = new User();

                user.setFullName(
                        request.getFullName().trim()
                );

                user.setEmail(email);

                user.setPassword(
                        request.getPassword()
                );

                user.setRole(
                        request.getRole()
                );

                User savedUser =
                        registerUser(user);

                registrationOtps.remove(
                        email
                );

                return savedUser;
        }

        @Override
        @Transactional
        public User registerUser(
                User user) {

                if (user == null) {

                throw new RuntimeException(
                        "User information is required."
                );
                }

                validateRegistrationDetails(
                        user.getFullName(),
                        user.getEmail(),
                        user.getPassword(),
                        "000000"
                );

                String normalizedEmail =
                        normalizeAndValidateEmail(
                                user.getEmail()
                        );

                if (
                        userRepository
                                .findByEmail(
                                        normalizedEmail
                                )
                                .isPresent()
                ) {

                throw new RuntimeException(
                        "An account already exists with this email address."
                );
                }

                String role =
                        normalizeRole(
                                user.getRole()
                        );

                user.setFullName(
                        user.getFullName().trim()
                );

                user.setEmail(
                        normalizedEmail
                );

                user.setRole(role);

                user.setPassword(
                        passwordEncoder.encode(
                                user.getPassword()
                        )
                );

                User savedUser =
                        userRepository.save(user);

                createPatientProfileIfRequired(
                        savedUser
                );

                createDoctorProfileIfRequired(
                        savedUser
                );

                return savedUser;
        }

        @Override
        public User getUserByEmail(
                String email) {

                if (
                        email == null ||
                        email.isBlank()
                ) {

                return null;
                }

                return userRepository
                        .findByEmail(
                                email.trim()
                                        .toLowerCase(
                                                Locale.ROOT
                                        )
                        )
                        .orElse(null);
        }

        @Override
        @Transactional
        public String loginUser(
                String emailValue,
                String password) {

                String email =
                        normalizeAndValidateEmail(
                                emailValue
                        );

                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                password
                        )
                );

                User user =
                        userRepository
                                .findByEmail(email)
                                .orElse(null);

                if (user == null) {

                return null;
                }

                createPatientProfileIfRequired(
                        user
                );

                createDoctorProfileIfRequired(
                        user
                );

                return jwtUtil.generateToken(
                        user.getEmail()
                );
        }

        private String generateSixDigitOtp() {

                int otpValue =
                        secureRandom.nextInt(
                                900000
                        ) + 100000;

                return String.valueOf(
                        otpValue
                );
        }

        private String normalizeAndValidateEmail(
                String emailValue) {

                if (
                        emailValue == null ||
                        emailValue.isBlank()
                ) {

                throw new RuntimeException(
                        "Email address is required."
                );
                }

                String email =
                        emailValue.trim()
                                .toLowerCase(
                                        Locale.ROOT
                                );

                String emailPattern =
                        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

                if (
                        !email.matches(
                                emailPattern
                        )
                ) {

                throw new RuntimeException(
                        "Enter a valid email address."
                );
                }

                return email;
        }

        private void validateRegistrationDetails(
                String fullName,
                String email,
                String password,
                String otp) {

                if (
                        fullName == null ||
                        fullName.isBlank()
                ) {

                throw new RuntimeException(
                        "Full name is required."
                );
                }

                normalizeAndValidateEmail(
                        email
                );

                if (
                        password == null ||
                        password.isBlank()
                ) {

                throw new RuntimeException(
                        "Password is required."
                );
                }

                if (
                        password.length() < 6
                ) {

                throw new RuntimeException(
                        "Password must contain at least 6 characters."
                );
                }

                if (
                        otp == null ||
                        otp.isBlank()
                ) {

                throw new RuntimeException(
                        "Registration OTP is required."
                );
                }
        }

        private String normalizeRole(
                String roleValue) {

                String role =
                        roleValue;

                if (
                        role == null ||
                        role.isBlank()
                ) {

                role = "PATIENT";
                }

                role =
                        role.trim()
                                .toUpperCase(
                                        Locale.ROOT
                                );

                if (
                        !"PATIENT".equals(role) &&
                        !"DOCTOR".equals(role)
                ) {

                role = "PATIENT";
                }

                return role;
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
                        splitFullName(
                                user.getFullName()
                        );

                Patient patient =
                        new Patient();

                patient.setFirstName(
                        nameParts[0]
                );

                patient.setLastName(
                        nameParts[1]
                );

                patient.setEmail(
                        user.getEmail()
                );

                patient.setPhone(null);
                patient.setAge(null);
                patient.setGender(null);

                patientRepository.save(
                        patient
                );
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
                        splitFullName(
                                user.getFullName()
                        );

                Doctor doctor =
                        new Doctor();

                doctor.setFirstName(
                        nameParts[0]
                );

                doctor.setLastName(
                        nameParts[1]
                );

                doctor.setEmail(
                        user.getEmail()
                );

                doctor.setSpecialization(null);
                doctor.setPhone(null);
                doctor.setExperience(null);
                doctor.setHospital(null);
                doctor.setAvailability(
                        "UNAVAILABLE"
                );

                doctorRepository.save(
                        doctor
                );
        }

        private String[] splitFullName(
                String fullNameValue) {

                String fullName =
                        fullNameValue == null
                                ? ""
                                : fullNameValue.trim();

                String firstName =
                        fullName;

                String lastName = "";

                if (
                        fullName.contains(" ")
                ) {

                String[] parts =
                        fullName.split(
                                "\\s+",
                                2
                        );

                firstName =
                        parts[0];

                lastName =
                        parts[1];
                }

                return new String[]{
                        firstName,
                        lastName
                };
        }

        private record RegistrationOtpData(
                String otpHash,
                LocalDateTime expiresAt,
                int failedAttempts
        ) {
        }
}
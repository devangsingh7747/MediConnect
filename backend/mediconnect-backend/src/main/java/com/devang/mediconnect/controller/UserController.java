package com.devang.mediconnect.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.dto.LoginRequest;
import com.devang.mediconnect.dto.LoginResponse;
import com.devang.mediconnect.dto.RegistrationOtpRequest;
import com.devang.mediconnect.dto.VerifyRegistrationOtpRequest;
import com.devang.mediconnect.entity.User;
import com.devang.mediconnect.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService) {

        this.userService =
                userService;
    }

    /*
     * Direct public registration is disabled.
     * Registration must be completed using email OTP.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>>
            registerUser() {

        throw new RuntimeException(
                "Email OTP verification is required before registration."
        );
    }

    @PostMapping("/register/send-otp")
    public ResponseEntity<Map<String, String>>
            sendRegistrationOtp(
                    @RequestBody
                    RegistrationOtpRequest request) {

        userService.sendRegistrationOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "A 6-digit OTP has been sent to your email address."
                )
        );
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<User>
            verifyRegistrationOtp(
                    @RequestBody
                    VerifyRegistrationOtpRequest request) {

        User registeredUser =
                userService
                        .verifyRegistrationOtp(
                                request
                        );

        return ResponseEntity.ok(
                registeredUser
        );
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody
            LoginRequest loginRequest) {

        String token =
                userService.loginUser(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                );

        return new LoginResponse(
                token
        );
    }

    @GetMapping("/me")
    public User getCurrentUser(
            Principal principal) {

        return userService.getUserByEmail(
                principal.getName()
        );
    }

    @GetMapping("/{email}")
    public User getUserByEmail(
            @PathVariable
            String email) {

        return userService.getUserByEmail(
                email
        );
    }
}
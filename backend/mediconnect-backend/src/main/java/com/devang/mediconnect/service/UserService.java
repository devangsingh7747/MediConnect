package com.devang.mediconnect.service;

import com.devang.mediconnect.dto.VerifyRegistrationOtpRequest;
import com.devang.mediconnect.entity.User;

public interface UserService {

    User registerUser(
            User user
    );

    void sendRegistrationOtp(
            String email
    );

    User verifyRegistrationOtp(
            VerifyRegistrationOtpRequest request
    );

    User getUserByEmail(
            String email
    );

    String loginUser(
            String email,
            String password
    );
}
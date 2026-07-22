package com.devang.mediconnect.dto;

public class RegistrationOtpRequest {

    private String email;

    public RegistrationOtpRequest() {
    }

    public RegistrationOtpRequest(
            String email) {

        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }
}
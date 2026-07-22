package com.devang.mediconnect.dto;

public class VerifyRegistrationOtpRequest {

    private String fullName;
    private String email;
    private String password;
    private String role;
    private String otp;

    public VerifyRegistrationOtpRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName) {

        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(
            String role) {

        this.role = role;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(
            String otp) {

        this.otp = otp;
    }
}
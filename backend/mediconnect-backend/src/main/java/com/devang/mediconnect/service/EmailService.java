package com.devang.mediconnect.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    public void sendAppointmentEmail(
            String to,
            String patientName,
            String problem,
            String doctorName,
            String date,
            String time) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );

            helper.setTo(to);

            helper.setSubject(
                    "🏥 Appointment Confirmation | MediConnect"
            );

            String html = """
                    <html>

                    <head>

                    <style>

                    body{
                        font-family:Arial,sans-serif;
                        background:#f4f7fb;
                        padding:20px;
                    }

                    .container{
                        max-width:600px;
                        margin:auto;
                        background:white;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 4px 10px rgba(0,0,0,.1);
                    }

                    .header{
                        background:#2563eb;
                        color:white;
                        padding:20px;
                        text-align:center;
                        font-size:26px;
                        font-weight:bold;
                    }

                    .content{
                        padding:30px;
                        font-size:16px;
                        line-height:1.8;
                        color:#333;
                    }

                    .info{
                        background:#f8fafc;
                        padding:18px;
                        border-radius:10px;
                        margin-top:20px;
                    }

                    .footer{
                        background:#f1f5f9;
                        padding:15px;
                        text-align:center;
                        font-size:14px;
                        color:#666;
                    }

                    </style>

                    </head>

                    <body>

                    <div class="container">

                        <div class="header">
                            🏥 MediConnect
                        </div>

                        <div class="content">

                            <h2>Hello %s 👋</h2>

                            <p>
                                Your appointment has been booked successfully.
                            </p>

                            <div class="info">

                                <b>🩺 Problem:</b> %s <br><br>

                                <b>👨‍⚕️ Doctor:</b> Dr. %s <br><br>

                                <b>📅 Date:</b> %s <br><br>

                                <b>⏰ Time:</b> %s

                            </div>

                            <p style="margin-top:25px;">

                                Thank you for choosing
                                <b>MediConnect</b>.<br><br>

                                We wish you a speedy recovery ❤️

                            </p>

                        </div>

                        <div class="footer">

                            © 2026 MediConnect
                            • Healthcare Management System

                        </div>

                    </div>

                    </body>

                    </html>
                    """.formatted(
                    patientName,
                    problem,
                    doctorName,
                    date,
                    time
            );

            helper.setText(
                    html,
                    true
            );

            mailSender.send(message);

        } catch (MessagingException exception) {

            throw new RuntimeException(
                    "Unable to prepare appointment email.",
                    exception
            );
        }
    }

    public void sendStatusUpdateEmail(
            String to,
            String patientName,
            String problem,
            String doctorName,
            String date,
            String time,
            String status) {

        try {

            String messageText;

            if (
                    "Completed".equalsIgnoreCase(status)
            ) {

                messageText =
                        "🎉 Your appointment has been marked as "
                                + "<b>Completed</b>. "
                                + "We hope you're feeling better!";

            } else if (
                    "Cancelled".equalsIgnoreCase(status)
            ) {

                messageText =
                        "❌ Your appointment has been "
                                + "<b>Cancelled</b>. "
                                + "Please book another appointment.";

            } else if (
                    "Confirmed".equalsIgnoreCase(status)
            ) {

                messageText =
                        "✅ Your appointment has been "
                                + "<b>Confirmed</b> by the doctor.";

            } else if (
                    "Rejected".equalsIgnoreCase(status)
            ) {

                messageText =
                        "❌ Your appointment request has been "
                                + "<b>Rejected</b> by the doctor.";

            } else {

                messageText =
                        "ℹ️ Your appointment status has been updated.";
            }

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );

            helper.setTo(to);

            helper.setSubject(
                    "🏥 Appointment "
                            + status
                            + " | MediConnect"
            );

            String html = """
                    <html>

                    <body style="
                        font-family:Arial,sans-serif;
                        background:#f4f7fb;
                        padding:20px;
                    ">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 4px 10px rgba(0,0,0,.1);
                    ">

                        <div style="
                            background:#2563eb;
                            color:white;
                            padding:20px;
                            text-align:center;
                            font-size:24px;
                            font-weight:bold;
                        ">

                            🏥 MediConnect

                        </div>

                        <div style="padding:30px;">

                            <h2>Hello %s 👋</h2>

                            <p>%s</p>

                            <div style="
                                background:#f8fafc;
                                padding:18px;
                                border-radius:10px;
                            ">

                                <b>📌 Status:</b> %s <br><br>

                                <b>🩺 Problem:</b> %s <br><br>

                                <b>👨‍⚕️ Doctor:</b> Dr. %s <br><br>

                                <b>📅 Date:</b> %s <br><br>

                                <b>⏰ Time:</b> %s

                            </div>

                            <p style="margin-top:25px;">

                                Thank you for choosing
                                <b>MediConnect</b>.<br><br>

                                We are always here for your
                                healthcare needs ❤️

                            </p>

                        </div>

                        <div style="
                            background:#f1f5f9;
                            padding:15px;
                            text-align:center;
                            color:#666;
                        ">

                            © 2026 MediConnect
                            • Healthcare Management System

                        </div>

                    </div>

                    </body>

                    </html>
                    """.formatted(
                    patientName,
                    messageText,
                    status,
                    problem,
                    doctorName,
                    date,
                    time
            );

            helper.setText(
                    html,
                    true
            );

            mailSender.send(message);

        } catch (MessagingException exception) {

            throw new RuntimeException(
                    "Unable to prepare appointment status email.",
                    exception
            );
        }
    }

    public void sendRegistrationOtpEmail(
            String to,
            String otp) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );

            helper.setTo(to);

            helper.setSubject(
                    "Your MediConnect Registration OTP"
            );

            String html = """
                    <html>

                    <body style="
                        margin:0;
                        padding:30px;
                        background:#f4f7fb;
                        font-family:Arial,sans-serif;
                    ">

                        <div style="
                            max-width:560px;
                            margin:auto;
                            overflow:hidden;
                            border-radius:16px;
                            background:#ffffff;
                            box-shadow:0 6px 20px rgba(0,0,0,0.10);
                        ">

                            <div style="
                                padding:24px;
                                background:#2563eb;
                                color:#ffffff;
                                text-align:center;
                                font-size:26px;
                                font-weight:bold;
                            ">

                                🏥 MediConnect

                            </div>

                            <div style="
                                padding:32px;
                                color:#334155;
                                text-align:center;
                            ">

                                <h2 style="
                                    margin-top:0;
                                    color:#0f172a;
                                ">

                                    Verify Your Email

                                </h2>

                                <p style="
                                    font-size:16px;
                                    line-height:1.6;
                                ">

                                    Use the following OTP to complete
                                    your MediConnect registration.

                                </p>

                                <div style="
                                    margin:28px auto;
                                    padding:18px;
                                    border-radius:12px;
                                    background:#eff6ff;
                                    color:#1d4ed8;
                                    font-size:36px;
                                    font-weight:bold;
                                    letter-spacing:10px;
                                ">

                                    %s

                                </div>

                                <p style="
                                    font-size:14px;
                                    color:#64748b;
                                    line-height:1.6;
                                ">

                                    This OTP is valid for 5 minutes.
                                    Do not share it with anyone.

                                </p>

                            </div>

                            <div style="
                                padding:16px;
                                background:#f1f5f9;
                                color:#64748b;
                                text-align:center;
                                font-size:13px;
                            ">

                                © 2026 MediConnect

                            </div>

                        </div>

                    </body>

                    </html>
                    """.formatted(otp);

            helper.setText(
                    html,
                    true
            );

            mailSender.send(message);

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to send OTP email. "
                            + "Please check the email address "
                            + "or try again later.",
                    exception
            );
        }
    }
}
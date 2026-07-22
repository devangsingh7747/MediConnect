package com.devang.mediconnect.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {

        this.mailSender = mailSender;

    }

    public void sendAppointmentEmail(

            String to,
            String patientName,
            String problem,
            String doctorName,
            String date,
            String time

    ) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);

            helper.setSubject("🏥 Appointment Confirmation | MediConnect");

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

                            <p>Your appointment has been booked successfully.</p>

                            <div class="info">

                                <b>🩺 Problem :</b> %s <br><br>

                                <b>👨‍⚕️ Doctor :</b> Dr. %s <br><br>

                                <b>📅 Date :</b> %s <br><br>

                                <b>⏰ Time :</b> %s

                            </div>

                            <p style="margin-top:25px;">

                                Thank you for choosing <b>MediConnect</b>.<br><br>

                                We wish you a speedy recovery ❤️

                            </p>

                        </div>

                        <div class="footer">

                            © 2026 MediConnect • Healthcare Management System

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

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {

            e.printStackTrace();

        }

    }

    public void sendStatusUpdateEmail(

            String to,
            String patientName,
            String problem,
            String doctorName,
            String date,
            String time,
            String status

    ) {

        try {

            String messageText;

            if (status.equalsIgnoreCase("Completed")) {

                messageText =
                        "🎉 Your appointment has been marked as <b>Completed</b>. We hope you're feeling better!";

            } else if (status.equalsIgnoreCase("Cancelled")) {

                messageText =
                        "❌ Unfortunately, your appointment has been <b>Cancelled</b>. Please book another appointment.";

            } else {

                messageText =
                        "ℹ️ Your appointment status has been updated.";

            }

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);

            helper.setSubject("🏥 Appointment " + status + " | MediConnect");

            String html = """
                    <html>

                    <body style="font-family:Arial,sans-serif;background:#f4f7fb;padding:20px;">

                    <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.1);">

                        <div style="background:#2563eb;color:white;padding:20px;text-align:center;font-size:24px;font-weight:bold;">

                            🏥 MediConnect

                        </div>

                        <div style="padding:30px;">

                            <h2>Hello %s 👋</h2>

                            <p>%s</p>

                            <div style="background:#f8fafc;padding:18px;border-radius:10px;">

                                <b>📌 Status :</b> %s <br><br>

                                <b>🩺 Problem :</b> %s <br><br>

                                <b>👨‍⚕️ Doctor :</b> Dr. %s <br><br>

                                <b>📅 Date :</b> %s <br><br>

                                <b>⏰ Time :</b> %s

                            </div>

                            <p style="margin-top:25px;">

                                Thank you for choosing <b>MediConnect</b>.<br><br>

                                We are always here for your healthcare needs ❤️

                            </p>

                        </div>

                        <div style="background:#f1f5f9;padding:15px;text-align:center;color:#666;">

                            © 2026 MediConnect • Healthcare Management System

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

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {

            e.printStackTrace();

        }

    }

}
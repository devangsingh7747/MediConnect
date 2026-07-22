package com.devang.mediconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devang.mediconnect.entity.Notification;
import com.devang.mediconnect.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;

    }

    @GetMapping("/email/{email}")
    public List<Notification> getAllNotifications(
            @PathVariable String email) {

        return notificationService
                .getAllNotifications(email);

    }

    @GetMapping("/email/{email}/latest")
    public List<Notification> getLatestNotifications(
            @PathVariable String email) {

        return notificationService
                .getLatestNotifications(email);

    }

    @GetMapping("/email/{email}/unread-count")
    public Map<String, Long> getUnreadNotificationCount(
            @PathVariable String email) {

        long count =
                notificationService
                        .getUnreadNotificationCount(email);

        return Map.of(
                "count",
                count
        );

    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markNotificationAsRead(
            @PathVariable Long id) {

        Notification updatedNotification =
                notificationService
                        .markNotificationAsRead(id);

        if (updatedNotification == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updatedNotification);

    }

    @PutMapping("/email/{email}/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead(
            @PathVariable String email) {

        notificationService
                .markAllNotificationsAsRead(email);

        return ResponseEntity.noContent().build();

    }

}
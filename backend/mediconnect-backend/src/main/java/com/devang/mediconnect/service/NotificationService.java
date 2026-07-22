package com.devang.mediconnect.service;

import java.util.List;

import com.devang.mediconnect.entity.Notification;

public interface NotificationService {

        Notification saveNotification(
                String email,
                String title,
                String message,
                String type
        );

        List<Notification> getLatestNotifications(
                String email
        );

        List<Notification> getAllNotifications(
                String email
        );

        long getUnreadNotificationCount(
                String email
        );

        Notification markNotificationAsRead(
                Long id
        );

        void markAllNotificationsAsRead(
                String email
        );

}
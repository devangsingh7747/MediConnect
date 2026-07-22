package com.devang.mediconnect.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devang.mediconnect.entity.Notification;
import com.devang.mediconnect.repository.NotificationRepository;
import com.devang.mediconnect.service.NotificationService;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository) {

        this.notificationRepository = notificationRepository;

    }

    @Override
    public Notification saveNotification(
            String email,
            String title,
            String message,
            String type) {

        Notification notification = new Notification();

        notification.setEmail(email);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);

        return notificationRepository.save(notification);

    }

    @Override
    public List<Notification> getLatestNotifications(
            String email) {

        return notificationRepository
                .findTop10ByEmailIgnoreCaseOrderByCreatedAtDesc(
                        email
                );

    }

    @Override
    public List<Notification> getAllNotifications(
            String email) {

        return notificationRepository
                .findByEmailIgnoreCaseOrderByCreatedAtDesc(
                        email
                );

    }

    @Override
    public long getUnreadNotificationCount(
            String email) {

        return notificationRepository
                .countByEmailIgnoreCaseAndIsReadFalse(
                        email
                );

    }

    @Override
    public Notification markNotificationAsRead(
            Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElse(null);

        if (notification == null) {

            return null;

        }

        notification.setIsRead(true);

        return notificationRepository.save(notification);

    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead(
            String email) {

        List<Notification> notifications =
                notificationRepository
                        .findByEmailIgnoreCaseOrderByCreatedAtDesc(
                                email
                        );

        notifications.forEach(
                notification ->
                        notification.setIsRead(true)
        );

        notificationRepository.saveAll(notifications);

    }

}
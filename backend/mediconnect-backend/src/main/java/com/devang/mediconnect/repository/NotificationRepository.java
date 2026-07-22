package com.devang.mediconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devang.mediconnect.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
            findTop10ByEmailIgnoreCaseOrderByCreatedAtDesc(
                    String email
            );

    List<Notification>
            findByEmailIgnoreCaseOrderByCreatedAtDesc(
                    String email
            );

    long countByEmailIgnoreCaseAndIsReadFalse(
            String email
    );

}
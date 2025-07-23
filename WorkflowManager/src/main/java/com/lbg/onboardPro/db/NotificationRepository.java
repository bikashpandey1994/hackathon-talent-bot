package com.lbg.onboardPro.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.lbg.hr.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	
	@Modifying
    @Transactional
    @Query("UPDATE notification_message u SET u.message = :message WHERE u.email = :email")
    int updateMessageByEmail(String email, String message);

}

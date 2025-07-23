package com.lbg.hr.repository;

import com.lbg.hr.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {

}

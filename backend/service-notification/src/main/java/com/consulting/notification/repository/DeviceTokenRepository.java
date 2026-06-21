package com.consulting.notification.repository;

import com.consulting.notification.model.DeviceToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository extends MongoRepository<DeviceToken, String> {

    List<DeviceToken> findByUserId(String userId);

    Optional<DeviceToken> findByFcmToken(String fcmToken);
}
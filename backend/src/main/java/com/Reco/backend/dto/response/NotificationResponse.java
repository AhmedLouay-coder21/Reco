package com.Reco.backend.dto.response;

import com.Reco.backend.model.NotificationType;
import com.Reco.backend.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long orderId;
    private String message;
    private NotificationType type;
    private OrderStatus orderStatus;
    private boolean read;
    private Instant createdAt;
}

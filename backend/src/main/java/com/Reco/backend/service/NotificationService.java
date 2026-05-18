package com.Reco.backend.service;

import com.Reco.backend.dto.response.NotificationResponse;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.*;
import com.Reco.backend.repository.NotificationRepository;
import com.Reco.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void notifyOrderStatusChange(Order order, OrderStatus status) {
        String message = switch (status) {
            case PENDING -> "Your order #" + order.getId() + " has been placed and is pending.";
            case COMPLETED -> "Your order #" + order.getId() + " has been completed.";
        };

        save(order.getUser(), order, message, NotificationType.ORDER_STATUS, status);
    }

    public void notifyPaymentFailed(Order order) {
        String message = "Payment for order #" + order.getId() + " failed. Please try again.";
        save(order.getUser(), order, message, NotificationType.PAYMENT, order.getStatus());
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(boolean unreadOnly) {
        User user = getCurrentUser();
        List<Notification> notifications = unreadOnly
                ? notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user)
                : notificationRepository.findByUserOrderByCreatedAtDesc(user);

        return notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByUserAndReadFalse(getCurrentUser());
    }

    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = getOwnedNotification(notificationId);
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    public void markAllAsRead() {
        User user = getCurrentUser();
        notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user)
                .forEach(notification -> notification.setRead(true));
    }

    private Notification getOwnedNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        User user = getCurrentUser();
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        return notification;
    }

    private void save(User user, Order order, String message, NotificationType type, OrderStatus orderStatus) {
        Notification notification = Notification.builder()
                .user(user)
                .order(order)
                .message(message)
                .type(type)
                .orderStatus(orderStatus)
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification notification) {
        Long orderId = notification.getOrder() != null ? notification.getOrder().getId() : null;

        return new NotificationResponse(
                notification.getId(),
                orderId,
                notification.getMessage(),
                notification.getType(),
                notification.getOrderStatus(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}

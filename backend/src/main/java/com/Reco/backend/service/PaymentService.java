package com.Reco.backend.service;

import com.Reco.backend.dto.request.PaymentProcessRequest;
import com.Reco.backend.dto.response.PaymentResponse;
import com.Reco.backend.exception.DuplicatePaymentException;
import com.Reco.backend.exception.OrderNotEligibleException;
import com.Reco.backend.exception.PaymentMismatchException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.gateway.MockPaymentGateway;
import com.Reco.backend.model.*;
import com.Reco.backend.repository.OrderRepository;
import com.Reco.backend.repository.PaymentRepository;
import com.Reco.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MockPaymentGateway mockPaymentGateway;
    private final NotificationService notificationService;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          MockPaymentGateway mockPaymentGateway,
                          NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.mockPaymentGateway = mockPaymentGateway;
        this.notificationService = notificationService;
    }

    public PaymentResponse processPayment(Long orderId, PaymentProcessRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        verifyOrderOwnership(order);

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new OrderNotEligibleException("Order is not eligible for payment");
        }

        if (paymentRepository.findByOrder(order).isPresent()) {
            throw new DuplicatePaymentException("Payment already exists for this order");
        }

        if (order.getTotalAmount().compareTo(request.getAmount()) != 0) {
            throw new PaymentMismatchException("Payment amount does not match order total");
        }

        PaymentStatus status = mockPaymentGateway.process(
                request.getAmount(),
                request.getPaymentMethod(),
                request.getPaymentMethodDetails()
        );

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .status(status)
                .paymentMethod(request.getPaymentMethod())
                .build();

        Payment saved = paymentRepository.save(payment);

        if (status == PaymentStatus.SUCCESS) {
            order.setStatus(OrderStatus.COMPLETED);
            Order updated = orderRepository.save(order);
            notificationService.notifyOrderStatusChange(updated, OrderStatus.COMPLETED);
        } else {
            notificationService.notifyPaymentFailed(order);
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        verifyOrderOwnership(order);

        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));


        verifyOrderOwnership(payment.getOrder());

        return toResponse(payment);
    }

    private void verifyOrderOwnership(Order order) {
        User user = getCurrentUser();
        if (!order.getUser().getId().equals(user.getId()) && ! user.getRole().equals(Role.ADMIN)) {
            throw new ResourceNotFoundException("Order not found");
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getTransactionDate()
        );
    }
}

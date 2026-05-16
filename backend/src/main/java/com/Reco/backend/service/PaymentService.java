package com.Reco.backend.service;

import com.Reco.backend.dto.request.PaymentProcessRequest;
import com.Reco.backend.dto.response.PaymentResponse;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.gateway.MockPaymentGateway;
import com.Reco.backend.model.Order;
import com.Reco.backend.model.OrderStatus;
import com.Reco.backend.model.Payment;
import com.Reco.backend.model.PaymentStatus;
import com.Reco.backend.model.User;
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

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          UserRepository userRepository,
                          MockPaymentGateway mockPaymentGateway) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.mockPaymentGateway = mockPaymentGateway;
    }

    public PaymentResponse processPayment(Long orderId, PaymentProcessRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        verifyOrderOwnership(order);

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Order is not eligible for payment");
        }

        if (paymentRepository.findByOrder(order).isPresent()) {
            throw new IllegalArgumentException("Payment already exists for this order");
        }

        if (order.getTotalAmount().compareTo(request.getAmount()) != 0) {
            throw new IllegalArgumentException("Payment amount does not match order total");
        }

        PaymentStatus status = mockPaymentGateway.process(
                request.getAmount(),
                request.getPaymentMethod(),
                request.getPaymentMethodDetails()
        );

        Payment payment = Payment.builder()
                .order(order)
                .amount(request.getAmount())
                .status(status)
                .paymentMethod(request.getPaymentMethod())
                .build();

        Payment saved = paymentRepository.save(payment);

        if (status == PaymentStatus.SUCCESS) {
            order.setStatus(OrderStatus.COMPLETED);
            orderRepository.save(order);
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = paymentRepository.findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return toResponse(payment);
    }

    private void verifyOrderOwnership(Order order) {
        User user = getCurrentUser();
        if (!order.getUser().getId().equals(user.getId())) {
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

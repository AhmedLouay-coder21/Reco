package com.Reco.backend.repository;

import com.Reco.backend.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class PaymentRepositoryTest {

    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;

    @Test
    void testThatVerifyPaymentBuildAllFields() {

        User user = User.builder()
                .firstName("Youssef")
                .lastName("Waleed")
                .username("whiteman")
                .email("Youssef@gmail.com")
                .role(Role.CUSTOMER)
                .passwordHash("25252002")
                .build();
        userRepository.save(user);

        Order order = Order.builder()
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("250"))
                .user(user)
                .build();
        orderRepository.save(order);

        Payment payment = Payment.builder()
                .status(PaymentStatus.SUCCESS)
                .amount(new BigDecimal("25000"))
                .paymentMethod(PaymentMethod.CREDIT_CARD)
                .order(order)
                .build();
        paymentRepository.save(payment);

        Optional<Payment> foundById = paymentRepository.findById(payment.getId());
        Optional<Payment> foundByOrder = paymentRepository.findByOrder(order);

        assertThat(foundById).isPresent();
        assertThat(foundById.get().getAmount()).isEqualTo(new BigDecimal("25000"));
        assertThat(foundById.get().getStatus()).isEqualTo(PaymentStatus.SUCCESS);
        assertThat(foundById.get().getPaymentMethod()).isEqualTo(PaymentMethod.CREDIT_CARD);

        assertThat(foundByOrder.get().getOrder().getId()).isEqualTo(order.getId());
    }
}

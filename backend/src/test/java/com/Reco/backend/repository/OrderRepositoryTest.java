package com.Reco.backend.repository;

import com.Reco.backend.model.Order;
import com.Reco.backend.model.OrderStatus;
import com.Reco.backend.model.Role;
import com.Reco.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.security.web.firewall.ObservationMarkingRequestRejectedHandler;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class OrderRepositoryTest {

    @Autowired UserRepository userRepository;
    @Autowired OrderRepository orderRepository;

    @Test
    void testThatVerifyOrderBuildAllFields(){

        User user = User.builder()
                .username("Youssef")
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

        Optional<Order> foundById = orderRepository.findById(order.getId());
        List<Order> foundByUserOrStatus = orderRepository.findByUserAndStatus(user,order.getStatus());

        assertThat(foundById).isPresent();
        assertThat(foundByUserOrStatus.getFirst().getStatus()).isEqualTo(order.getStatus());
        assertThat(foundById.get().getTotalAmount()).isEqualTo(new BigDecimal("250"));

        assertThat(foundByUserOrStatus.getFirst().getUser().getId()).isEqualTo(user.getId());
        assertThat(foundByUserOrStatus.getFirst().getUser().getEmail()).isEqualTo(user.getEmail());
        assertThat(foundByUserOrStatus.getFirst().getUser().getRole()).isEqualTo(user.getRole());



    }
}

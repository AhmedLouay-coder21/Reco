package com.Reco.backend.repository;

import com.Reco.backend.model.Cart;
import com.Reco.backend.model.Role;
import com.Reco.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CartRepositoryTest {
    @Autowired CartRepository cartRepository;
    @Autowired UserRepository userRepository;

    @Test
    void testThatVerifyCategoryBuildAllFields(){

        User user = User.builder()
                .username("Youssef")
                .email("Youssef@gmail.com")
                .role(Role.CUSTOMER)
                .passwordHash("25252002")
                .build();
        userRepository.save(user);

        Cart cart = Cart.builder()
                .user(user)
                .build();
        cartRepository.save(cart);

        Optional<Cart> foundByUserId = cartRepository.findByUser(user);

        assertThat(foundByUserId).isPresent();

    }

}

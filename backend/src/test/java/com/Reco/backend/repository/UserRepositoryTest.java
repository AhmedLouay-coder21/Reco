package com.Reco.backend.repository;

import com.Reco.backend.model.Role;
import com.Reco.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import java.util.Optional;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Test
    void testThatVerifyUserBuildAllFields(){
        User user = User.builder()
                .username("White")
                .email("Youssef@gmail.com")
                .role(Role.CUSTOMER)
                .passwordHash("25252002")
                .build();
        userRepository.save(user);

        Optional<User> foundId = userRepository.findById(user.getId());
        Optional<User> foundName = userRepository.findByUsername(user.getUsername());
        Optional<User> foundEmail  = userRepository.findByEmail(user.getEmail());
        boolean existName = userRepository.existsByUsername(user.getUsername());
        boolean existEmail = userRepository.existsByEmail(user.getEmail());

        assertThat(foundId).isPresent();
        assertThat(foundName.get().getUsername()).isEqualTo("White");
        assertThat(foundEmail.get().getEmail()).isEqualTo("Youssef@gmail.com");
        assertThat(existName).isTrue();
        assertThat(existEmail).isTrue();
    }
}

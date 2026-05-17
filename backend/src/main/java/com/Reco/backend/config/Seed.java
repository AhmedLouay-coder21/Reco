package com.Reco.backend.config;

import com.Reco.backend.model.Role;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("Man")
                    .username("Mr.Admin")
                    .email("admin@admin.com")
                    .passwordHash(passwordEncoder.encode("123456789"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }
}

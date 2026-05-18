package com.Reco.backend.service;

import com.Reco.backend.config.JwtService;
import com.Reco.backend.dto.request.LoginRequest;
import com.Reco.backend.dto.request.RegisterRequest;
import com.Reco.backend.dto.response.AuthResponse;
import com.Reco.backend.exception.DuplicateEmailException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.Cart;
import com.Reco.backend.model.Role;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.CartRepository;
import com.Reco.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CartRepository cartRepository;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateEmailException("Username already taken");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(user);
        cartRepository.save(Cart.builder().user(user).build());

        return getAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return getAuthResponse(user);
    }

    private AuthResponse getAuthResponse(User user) {
        Map<String, Object> claims = Map.of("role", user.getRole().name());
        var jwtToken = jwtService.generateToken(claims, user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .expiresIn(jwtService.getAccessTokenExpiration())
                .build();
    }

    public AuthResponse registerAdmin(@Valid RegisterRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String adminEmail = authentication.getName();
        User adminRequest = userRepository.findByEmail(adminEmail).orElseThrow(() -> new ResourceNotFoundException("Admin not found"));


        if (!adminRequest.getRole().equals(Role.ADMIN)) {
            throw new AccessDeniedException("Only admins can create admin account");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateEmailException("username already taken");
        }

        var admin = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        return getAuthResponse(admin);
    }
}

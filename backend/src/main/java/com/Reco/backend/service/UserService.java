package com.Reco.backend.service;

import com.Reco.backend.dto.request.PasswordUpdateRequest;
import com.Reco.backend.dto.request.UserRequest;
import com.Reco.backend.dto.response.UserResponse;
import com.Reco.backend.exception.DuplicateUserException;
import com.Reco.backend.exception.InvalidPasswordException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsernameField())
                .role(user.getRole())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public  UserResponse getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toResponse(user);
    }



    public List<UserResponse> listUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse myProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toResponse(user);
    }

    public UserResponse updateUser(Long userId, UserRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean usernameChanged = !user.getUsernameField().equals(request.getUsername());
        boolean usernameTaken = usernameChanged &&
                userRepository.findByUsername(request.getUsername()).isPresent();
        boolean emailChanged = !user.getEmail().equals(request.getEmail());
        boolean emailTaken = emailChanged &&
                userRepository.findByEmail(request.getEmail()).isPresent();
        if (usernameTaken || emailTaken) {
            throw new DuplicateUserException("Username or email already in use");
        }

        String authedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!user.getEmail().equals(authedEmail)){
            throw  new ResourceNotFoundException("Cannot update other users profile");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        User updated  = userRepository.save(user);

        return toResponse(updated);
    }

    public UserResponse updateUserPassword(Long userId, PasswordUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String authedEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!user.getEmail().equals(authedEmail)){
            throw  new ResourceNotFoundException("Cannot update other users profile");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new InvalidPasswordException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new InvalidPasswordException("New passwords do not match");
        }

        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPasswordHash(encodedPassword);

        userRepository.save(user);
        return toResponse(user);
    }

    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String authedEmail = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if (!user.getEmail().equals(authedEmail)) {
            throw new ResourceNotFoundException("Cannot delete other user accounts");
        }

        userRepository.delete(user);
    }
}

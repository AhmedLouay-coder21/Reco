package com.Reco.backend.controller;

import com.Reco.backend.dto.request.PasswordUpdateRequest;
import com.Reco.backend.dto.request.UserRequest;
import com.Reco.backend.dto.response.UserResponse;
import com.Reco.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId){

        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> listUsers(){

        return ResponseEntity.ok(userService.listUsers());
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> myProfile(){

        return ResponseEntity.ok(userService.myProfile());
    }

    @PutMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public  ResponseEntity<UserResponse> updateUser(@PathVariable Long userId,
                                                    @RequestBody UserRequest request){

        return ResponseEntity.ok(userService.updateUser(userId, request));
    }

    @PatchMapping("/{userId}/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateUserPassword(@PathVariable Long userId,
                                                           @RequestBody PasswordUpdateRequest request){
        return ResponseEntity.ok(userService.updateUserPassword(userId,request));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId){

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }

}

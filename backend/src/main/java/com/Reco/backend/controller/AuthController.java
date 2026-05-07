package com.Reco.backend.controller;

import com.Reco.backend.dto.request.LoginRequest;
import com.Reco.backend.dto.request.RegisterRequest;
import com.Reco.backend.dto.response.AuthResponse;
import com.Reco.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ){
        //
        return  ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ){
        //
        return ResponseEntity.ok(service.login(request));
    }
}

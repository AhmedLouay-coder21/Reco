package com.Reco.backend.dto.response;

import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String accessToken;
    private Long expiresIn;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}

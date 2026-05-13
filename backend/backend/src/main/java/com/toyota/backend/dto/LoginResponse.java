package com.toyota.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;    // Short-lived JWT token (15 min)
    private String refreshToken;   // Long-lived refresh token (7 days)
    private String username;
    private String role;
    private Long expiresIn;        // Access token expiration in seconds
}

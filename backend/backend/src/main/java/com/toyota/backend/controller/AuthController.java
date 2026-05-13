package com.toyota.backend.controller;

import com.toyota.backend.entity.User;
import com.toyota.backend.entity.RefreshToken;
import com.toyota.backend.service.UserService;
import com.toyota.backend.service.RefreshTokenService;
import com.toyota.backend.security.JwtUtil;
import com.toyota.backend.dto.LoginResponse;
import com.toyota.backend.dto.RefreshTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${jwt.expiration}")
    private long accessTokenExpiration;

    // 🔓 User Registration with password hashing
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return "User registered successfully!";
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    // 🔑 User Login with JWT + Refresh Token (like Google OAuth2)
    @PostMapping("/login")
    public LoginResponse login(@RequestBody User user) {

        // Find user by username
        User dbUser = userService.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔒 Compare passwords using BCrypt
        if (!userService.verifyPassword(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 🔐 Generate access token (short-lived - 15 min)
        String accessToken = jwtUtil.generateToken(user.getUsername(), dbUser.getRole().toString());

        // 🔄 Generate refresh token (long-lived - 7 days)
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(dbUser);

        // Return both tokens with user info
        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                dbUser.getUsername(),
                dbUser.getRole().toString(),
                accessTokenExpiration / 1000  // Convert to seconds
        );
    }

    // 🔄 Refresh access token using refresh token (like Google OAuth2)
    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestBody RefreshTokenRequest request) {
        try {
            // Validate refresh token
            RefreshToken refreshToken = refreshTokenService.validateRefreshToken(request.getRefreshToken());

            // Get user from refresh token
            User user = refreshToken.getUser();

            // Generate new access token
            String newAccessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());

            // Return new access token (refresh token remains the same)
            return new LoginResponse(
                    newAccessToken,
                    request.getRefreshToken(),
                    user.getUsername(),
                    user.getRole().toString(),
                    accessTokenExpiration / 1000
            );
        } catch (Exception e) {
            throw new RuntimeException("Token refresh failed: " + e.getMessage());
        }
    }

    // 🚫 Logout - revoke refresh token
    @PostMapping("/logout")
    public String logout(@RequestBody RefreshTokenRequest request) {
        try {
            refreshTokenService.revokeRefreshToken(request.getRefreshToken());
            return "Logged out successfully!";
        } catch (Exception e) {
            return "Logout failed: " + e.getMessage();
        }
    }
}
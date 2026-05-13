package com.toyota.backend.service;

import com.toyota.backend.entity.RefreshToken;
import com.toyota.backend.entity.User;
import com.toyota.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration; // In milliseconds (e.g., 7 days)

    // 🔄 Generate refresh token for user
    public RefreshToken createRefreshToken(User user) {
        // Invalidate old tokens for this user
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(LocalDateTime.now().plusSeconds(refreshTokenExpiration / 1000));
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    // 🔍 Validate refresh token
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.getRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        if (LocalDateTime.now().isAfter(refreshToken.getExpiryDate())) {
            throw new RuntimeException("Refresh token has expired");
        }

        return refreshToken;
    }

    // 🚫 Revoke refresh token (logout)
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    // 🗑️ Delete expired tokens (optional cleanup job)
    public void deleteExpiredTokens() {
        // Can be called periodically by @Scheduled method
        refreshTokenRepository.findAll().forEach(token -> {
            if (LocalDateTime.now().isAfter(token.getExpiryDate())) {
                refreshTokenRepository.delete(token);
            }
        });
    }
}

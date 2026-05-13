package com.toyota.backend.service;

import com.toyota.backend.entity.User;
import com.toyota.backend.entity.Role;
import com.toyota.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register user with hashed password
    public User registerUser(User user) {
        // 🔒 Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(Role.RECEPTIONNISTE);
        }
        return userRepository.save(user);
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Verify password
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Get all users (for admin panel)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update user (admin only)
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setRole(updatedUser.getRole());

        // Only update password if a new one is provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    // Delete user (admin only)
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Create new user (admin only)
    public User createUser(User user) {
        return registerUser(user);
    }

    // Get all technicians (users with RECEPTIONNISTE role)
    public List<User> getAllTechnicians() {
        return userRepository.findByRole(Role.RECEPTIONNISTE);
    }

    // Get all admins
    public List<User> getAllAdmins() {
        return userRepository.findByRole(Role.ADMIN);
    }
}

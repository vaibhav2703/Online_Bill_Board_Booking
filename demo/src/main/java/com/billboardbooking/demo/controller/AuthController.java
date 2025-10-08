package com.billboardbooking.demo.controller;

import com.billboardbooking.demo.security.JwtUtil;
import com.billboardbooking.demo.repository.UserRepository;
import com.billboardbooking.demo.repository.OwnerRepository;
import com.billboardbooking.demo.entity.User;
import com.billboardbooking.demo.entity.Owner;
import com.billboardbooking.demo.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String password = request.get("password");
        String selectedRole = request.get("role");

        if (identifier == null || password == null || selectedRole == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Identifier, password, and role are required");
        }

        try {
            User.Role role = User.Role.valueOf(selectedRole);
            Optional<User> userOptional = userRepository.findByUsernameAndRole(identifier, role);
            if (!userOptional.isPresent()) {
                userOptional = userRepository.findByEmailAndRole(identifier, role);
                if (!userOptional.isPresent()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                }
            }
            User user = userOptional.get();

            String username = user.getUsername() + "|" + user.getRole().name();

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            final String jwt = jwtUtil.generateToken(userDetails);
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", user.getRole().name());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser (@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String name = request.get("name");
            String email = request.get("email");
            String phone = request.get("phone");

            // Check if username exists for the same role USER
            Optional<User> existingUserByUsername = userRepository.findByUsernameAndRole(username, User.Role.USER);
            if (existingUserByUsername.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists for role USER");
            }
            // Check if email exists for the same role USER
            Optional<User> existingUserByEmail = userRepository.findByEmailAndRole(email, User.Role.USER);
            if (existingUserByEmail.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists for role USER");
            }

            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setRole(User.Role.USER);

            userRepository.save(user);

            // Auto-login after registration
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username + "|USER");
            final String jwt = jwtUtil.generateToken(userDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", "USER");
            response.put("message", "User  registered and logged in successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/register/owner")
    public ResponseEntity<?> registerOwner(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String name = request.get("name");
            String email = request.get("email");
            String phone = request.get("phone");
            String companyName = request.get("companyName");

            // Check if username exists for the same role OWNER
            Optional<User> existingUserByUsername = userRepository.findByUsernameAndRole(username, User.Role.OWNER);
            if (existingUserByUsername.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists for role OWNER");
            }
            // Check if email exists for the same role OWNER
            Optional<User> existingUserByEmail = userRepository.findByEmailAndRole(email, User.Role.OWNER);
            if (existingUserByEmail.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists for role OWNER");
            }

            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setName(name);
            user.setEmail(email);
            user.setPhone(phone);
            user.setRole(User.Role.OWNER);

            User savedUser  = userRepository.save(user);

            Owner owner = new Owner();
            owner.setUser (savedUser );
            owner.setName(name);
            owner.setEmail(email);
            owner.setPhone(phone);
            owner.setCompanyName(companyName);

            ownerRepository.save(owner);

            // Auto-login after registration
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username + "|OWNER");
            final String jwt = jwtUtil.generateToken(userDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", "OWNER");
            response.put("message", "Owner registered and logged in successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String roleStr = request.get("role");
            if (email == null || email.isEmpty() || roleStr == null || roleStr.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and role are required");
            }

            User.Role role = User.Role.valueOf(roleStr);

            Optional<User> userOptional = userRepository.findByEmailAndRole(email, role);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with this email and role");
            }

            User user = userOptional.get();
            String resetToken = UUID.randomUUID().toString(); // Generate a random reset token
            user.setResetToken(resetToken);
            user.setResetTokenExpiration(java.time.LocalDateTime.now().plusHours(24)); // Token expires in 24 hours
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending password reset email: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String resetToken = request.get("resetToken");
            String newPassword = request.get("newPassword");

            if (resetToken == null || newPassword == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reset token and new password are required");
            }

            Optional<User> userOptional = userRepository.findByResetToken(resetToken);
            if (!userOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid reset token");
            }

            User user = userOptional.get();
            if (user.getResetTokenExpiration().isBefore(java.time.LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Reset token has expired");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiration(null);
            userRepository.save(user);

            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error resetting password: " + e.getMessage());
        }
    }
}

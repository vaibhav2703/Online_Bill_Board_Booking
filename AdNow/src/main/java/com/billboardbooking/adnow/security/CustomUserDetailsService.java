package com.billboardbooking.adnow.security;

import com.billboardbooking.adnow.entity.User;
import com.billboardbooking.adnow.entity.Owner;
import com.billboardbooking.adnow.repository.UserRepository;
import com.billboardbooking.adnow.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Cacheable(value = "userCache", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username is in format "actualUsername|ROLE"
        String[] parts = username.split("\\|", 2);
        if (parts.length != 2) {
            throw new UsernameNotFoundException("Invalid username format: " + username);
        }
        String actualUsername = parts[0];
        User.Role role = User.Role.valueOf(parts[1]);

        Optional<User> userOptional = userRepository.findByUsernameAndRole(actualUsername, role);
        if (!userOptional.isPresent()) {
            throw new UsernameNotFoundException("User does not exist");
        }
        User user = userOptional.get();
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername() + "|" + user.getRole().name())
                .password(user.getPassword()) // already encoded
                .roles(user.getRole().name()) // Spring adds "ROLE_" prefix automatically
                .build();
    }
}

package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndRole(String username, User.Role role);
    Optional<User> findByEmailAndRole(String email, User.Role role);
    Optional<User> findByResetToken(String resetToken);
}

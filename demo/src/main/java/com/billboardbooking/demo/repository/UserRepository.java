package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsernameAndRole(String username, User.Role role);

    Optional<User> findByEmailAndRole(String email, User.Role role);

    Optional<User> findByResetToken(String resetToken);
}

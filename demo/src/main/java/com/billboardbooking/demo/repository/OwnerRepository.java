package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Owner findByUserId(Long userId);
}

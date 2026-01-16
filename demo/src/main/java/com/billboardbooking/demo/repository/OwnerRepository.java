package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, String> {
    Owner findByUserId(String userId);
}

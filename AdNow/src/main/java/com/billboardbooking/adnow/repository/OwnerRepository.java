package com.billboardbooking.adnow.repository;

import com.billboardbooking.adnow.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, String> {
    Owner findByUserId(String userId);
}

package com.billboard.repository;

import com.billboard.entity.Billboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillboardRepository extends JpaRepository<Billboard, Long> {
    
    List<Billboard> findByIsAvailableTrue();
    
    @Query("SELECT b FROM Billboard b WHERE b.isAvailable = true")
    List<Billboard> findAvailableBillboards();
    
    List<Billboard> findByIsAvailable(Boolean isAvailable);
}
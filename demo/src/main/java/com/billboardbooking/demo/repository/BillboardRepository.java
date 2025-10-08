package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Billboard;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillboardRepository extends JpaRepository<Billboard, Long> {
    List<Billboard> findByOwnerId(Long ownerId);
    List<Billboard> findByLatBetweenAndLngBetweenAndStatus(double minLat, double maxLat, double minLng, double maxLng, String status);
}

package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Billboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillboardRepository extends JpaRepository<Billboard, String> {
    List<Billboard> findByOwnerId(String ownerId);

    List<Billboard> findByLatBetweenAndLngBetweenAndStatus(double minLat, double maxLat, double minLng, double maxLng,
            String status);
}

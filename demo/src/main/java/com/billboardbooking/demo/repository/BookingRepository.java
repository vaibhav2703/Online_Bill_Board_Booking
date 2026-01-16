package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    @Query("SELECT b FROM Booking b WHERE b.billboard.owner.id = :ownerId")
    List<Booking> findByOwnerId(@Param("ownerId") String ownerId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.billboard.id = :billboardId AND :currentDate BETWEEN b.startDate AND b.endDate")
    boolean hasActiveBookingForBillboard(@Param("billboardId") String billboardId,
            @Param("currentDate") LocalDate currentDate);

    @Query("SELECT b FROM Booking b WHERE b.endDate < :currentDate")
    List<Booking> findExpiredBookings(@Param("currentDate") LocalDate currentDate);
}

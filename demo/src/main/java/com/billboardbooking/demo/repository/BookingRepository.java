package com.billboardbooking.demo.repository;

import com.billboardbooking.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.billboard.owner.id = :ownerId")
    List<Booking> findByOwnerId(@Param("ownerId") Long ownerId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.billboard.id = :billboardId")
    boolean hasBookingForBillboard(@Param("billboardId") Long billboardId);

    @Query("SELECT b FROM Booking b WHERE b.endDate < :currentDate")
    List<Booking> findExpiredBookings(@Param("currentDate") LocalDate currentDate);
}

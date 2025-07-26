package com.billboard.repository;

import com.billboard.entity.Booking;
import com.billboard.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByBillboardId(Long billboardId);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByEmail(String email);
    
    @Query("SELECT b FROM Booking b WHERE b.billboard.id = ?1 AND " +
           "((b.startDate <= ?2 AND b.endDate >= ?2) OR " +
           "(b.startDate <= ?3 AND b.endDate >= ?3) OR " +
           "(b.startDate >= ?2 AND b.endDate <= ?3)) AND " +
           "b.status != 'CANCELLED'")
    List<Booking> findConflictingBookings(Long billboardId, LocalDate startDate, LocalDate endDate);
}
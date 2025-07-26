package com.billboard.service;

import com.billboard.entity.Billboard;
import com.billboard.entity.Booking;
import com.billboard.entity.Booking.BookingStatus;
import com.billboard.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BillboardService billboardService;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> getBookingsByBillboard(Long billboardId) {
        return bookingRepository.findByBillboardId(billboardId);
    }
    
    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }
    
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
    
    public boolean isDateRangeAvailable(Long billboardId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(billboardId, startDate, endDate);
        return conflictingBookings.isEmpty();
    }
    
    public Booking createBooking(Long billboardId, String userName, String email, String contactNumber,
                               LocalDate startDate, LocalDate endDate, String imagePath) {
        
        // Validate dates
        if (startDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }
        
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        
        // Check if billboard exists and is available
        Optional<Billboard> optionalBillboard = billboardService.getBillboardById(billboardId);
        if (!optionalBillboard.isPresent()) {
            throw new IllegalArgumentException("Billboard not found");
        }
        
        Billboard billboard = optionalBillboard.get();
        if (!billboard.getIsAvailable()) {
            throw new IllegalArgumentException("Billboard is not available");
        }
        
        // Check if date range is available
        if (!isDateRangeAvailable(billboardId, startDate, endDate)) {
            throw new IllegalArgumentException("Billboard is already booked for the selected date range");
        }
        
        // Calculate total price
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1; // +1 to include both start and end dates
        Double totalPrice = billboard.getPrice() * days;
        
        // Create booking
        Booking booking = new Booking(billboard, userName, email, contactNumber, 
                                    startDate, endDate, imagePath, totalPrice);
        
        return bookingRepository.save(booking);
    }
    
    public Booking updateBookingStatus(Long id, BookingStatus status) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }
    
    public boolean deleteBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
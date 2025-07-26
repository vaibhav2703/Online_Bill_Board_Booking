package com.billboard.controller;

import com.billboard.entity.Booking;
import com.billboard.entity.Booking.BookingStatus;
import com.billboard.service.BookingService;
import com.billboard.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/billboard/{billboardId}")
    public ResponseEntity<List<Booking>> getBookingsByBillboard(@PathVariable Long billboardId) {
        List<Booking> bookings = bookingService.getBookingsByBillboard(billboardId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Booking>> getBookingsByEmail(@PathVariable String email) {
        List<Booking> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestParam("billboardId") Long billboardId,
            @RequestParam("userName") String userName,
            @RequestParam("email") String email,
            @RequestParam("contactNumber") String contactNumber,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String imagePath = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                imagePath = fileStorageService.storeFile(imageFile);
            }
            
            Booking booking = bookingService.createBooking(billboardId, userName, email, 
                                                         contactNumber, startDate, endDate, imagePath);
            
            // Set image URL for response
            if (imagePath != null) {
                booking.setImageUrl("/api/files/" + imagePath);
            }
            
            response.put("success", true);
            response.put("booking", booking);
            response.put("message", "Booking created successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred while creating the booking");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Boolean>> checkAvailability(
            @RequestParam Long billboardId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        boolean isAvailable = bookingService.isDateRangeAvailable(billboardId, startDate, endDate);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", isAvailable);
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, 
                                                      @RequestParam BookingStatus status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        boolean deleted = bookingService.deleteBooking(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
package com.billboardbooking.adnow.controller;

import com.billboardbooking.adnow.entity.Booking;
import com.billboardbooking.adnow.entity.Billboard;
import com.billboardbooking.adnow.entity.User;
import com.billboardbooking.adnow.repository.BookingRepository;
import com.billboardbooking.adnow.repository.BillboardRepository;
import com.billboardbooking.adnow.repository.UserRepository;
import com.billboardbooking.adnow.services.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.awt.print.Book;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import org.springframework.web.bind.MethodArgumentNotValidException;
import javax.validation.Valid;

@RestController
@RequestMapping("/bookings")
@CrossOrigin
public class BookingController {
    private static final Logger logger = Logger.getLogger(String.valueOf(BookingController.class));
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BillboardRepository billboardRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    RedisService redisService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody @Valid BookingRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        String username = authentication.getName();
        String[] parts = username.split("\\|", 2);
        if (parts.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username format");
        }
        String actualUsername = parts[0];
        User.Role role = User.Role.valueOf(parts[1]);
        Optional<User> userOpt = userRepository.findByUsernameAndRole(actualUsername, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        }
        Optional<Billboard> billboardOpt = billboardRepository.findById(request.getBillboardId());
        if (!billboardOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid billboard ID");
        }
        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate endDate = startDate.plusMonths(request.getDuration());
        double totalPrice = billboardOpt.get().getPrice() * request.getDuration();
        Booking booking = new Booking();
        booking.setBillboard(billboardOpt.get());
        booking.setUser(userOpt.get());
        booking.setUserName(request.getContactPerson());
        booking.setUserEmail(request.getEmail());
        booking.setUserContact(request.getPhone());
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setCompanyName(request.getCompanyName());
        booking.setCampaignDetails(request.getCampaignDetails());
        booking.setDuration(request.getDuration());
        booking.setTotalPrice(totalPrice);
        Booking saved = bookingRepository.save(booking);
        logger.info("Booking saved with ID: " + saved.getId() + " for billboard " + billboardOpt.get().getId()
                + " from " + saved.getStartDate() + " to " + saved.getEndDate());
        // Update billboard status to booked
        Billboard billboard = billboardOpt.get();
        billboard.setStatus("booked");
        billboard.setIsAvailable(false);
        billboardRepository.save(billboard);
        return ResponseEntity.ok(saved);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ");
        });
        return ResponseEntity.badRequest().body(errors.toString());
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        String cacheKey = "bookings:all";
        List<Booking> bookingListCache = redisService.getCache(cacheKey);
        if (bookingListCache != null) {
            return bookingListCache;
        }
        List<Booking> allBookingList = bookingRepository.findAll();
        redisService.setCache(cacheKey, allBookingList, 300L);
        return allBookingList;
    }

    @GetMapping("/user")
    public List<Booking> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }
        String username = authentication.getName();
        String[] parts = username.split("\\|", 2);
        if (parts.length != 2) {
            return Collections.emptyList();
        }
        String actualUsername = parts[0];
        String cacheKey = "bookings:" + actualUsername;
        List<Booking> bookingCacheList = redisService.getCache(cacheKey);
        if (bookingCacheList != null) {
            return bookingCacheList;
        }
        User.Role role = User.Role.valueOf(parts[1]);
        Optional<User> userOpt = userRepository.findByUsernameAndRole(actualUsername, role);
        if (!userOpt.isPresent()) {
            return Collections.emptyList();
        }
        List<Booking> userBookings = bookingRepository.findByUserId(userOpt.get().getId());
        redisService.setCache(cacheKey, userBookings, 300L);
        return userBookings;
    }
}
package com.billboardbooking.demo.controller;

import com.billboardbooking.demo.entity.Booking;
import com.billboardbooking.demo.entity.Billboard;
import com.billboardbooking.demo.repository.BookingRepository;
import com.billboardbooking.demo.repository.BillboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestController
@RequestMapping("/bookings")
@CrossOrigin
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private BillboardRepository billboardRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createBooking(
            @RequestParam Long billboardId,
            @RequestParam String userName,
            @RequestParam String userEmail,
            @RequestParam String userContact,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) MultipartFile image
    ) {
        Optional<Billboard> billboardOpt = billboardRepository.findById(billboardId);
        if (!billboardOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid billboard ID");
        }
        Booking booking = new Booking();
        booking.setBillboard(billboardOpt.get());
        booking.setUserName(userName);
        booking.setUserEmail(userEmail);
        booking.setUserContact(userContact);
        booking.setStartDate(LocalDate.parse(startDate));
        booking.setEndDate(LocalDate.parse(endDate));
        if (image != null && !image.isEmpty()) {
            try {
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, image.getBytes());
                booking.setImagePath(filePath.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }
        Booking saved = bookingRepository.save(booking);
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
        return bookingRepository.findAll();
    }

    @GetMapping("/user")
    public List<Booking> getUserBookings() {
        // TODO: Get user ID from authenticated user
        return bookingRepository.findByUserId(1L);
    }
} 
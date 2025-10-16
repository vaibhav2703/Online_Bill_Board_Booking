package com.billboardbooking.demo.controller;

import com.billboardbooking.demo.entity.Billboard;
import com.billboardbooking.demo.entity.Booking;
import com.billboardbooking.demo.repository.BillboardRepository;
import com.billboardbooking.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.time.LocalDate;
import javax.validation.Valid;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.logging.Logger;

@RestController
@RequestMapping("/billboards")
@CrossOrigin
public class BillboardController {
    private static final Logger logger = Logger.getLogger(String.valueOf(BillboardController.class));

    @Autowired
    private BillboardRepository billboardRepository;
    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public List<Billboard> getAllBillboards() {
        updateExpiredBookings();
        return billboardRepository.findAll();
    }

    @GetMapping("/search")
    public List<Billboard> searchBillboards(@RequestParam double lat, @RequestParam double lng, @RequestParam double radius) {
        double latRange = radius / 111.0; // Approximate km to degrees
        double lngRange = radius / (111.0 * Math.cos(Math.toRadians(lat)));
        return billboardRepository.findByLatBetweenAndLngBetweenAndStatus(
            lat - latRange, lat + latRange, lng - lngRange, lng + lngRange, "available");
    }

    @GetMapping("/{id}")
    public Billboard getBillboardById(@PathVariable Long id) {
        Optional<Billboard> billboard = billboardRepository.findById(id);
        return billboard.orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> createBillboard(@Valid @RequestBody Billboard newBillboard) {
        try {
            Billboard savedBillboard = billboardRepository.save(newBillboard);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBillboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the billboard.");
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        StringBuilder errors = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ");
        });
        return ResponseEntity.badRequest().body(errors.toString());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBillboard(@PathVariable Long id, @RequestBody Billboard updatedBillboard) {
        try {
            Billboard billboard = billboardRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException("Billboard not found"));

            billboard.setName(updatedBillboard.getName());
            billboard.setLocation(updatedBillboard.getLocation());
            billboard.setAddress(updatedBillboard.getAddress());
            billboard.setPhone(updatedBillboard.getPhone());
            billboard.setLat(updatedBillboard.getLat());
            billboard.setLng(updatedBillboard.getLng());
            billboard.setSize(updatedBillboard.getSize());
            billboard.setStatus(updatedBillboard.getStatus());
            billboard.setIsAvailable("available".equals(updatedBillboard.getStatus()));
            billboard.setPrice(updatedBillboard.getPrice());
            billboard.setDescription(updatedBillboard.getDescription());
            billboard.setImage(updatedBillboard.getImage());

            billboardRepository.save(billboard);
            return ResponseEntity.ok(billboard);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the billboard.");
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBillboard(@PathVariable Long id) {
        if (!billboardRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Billboard not found");
        }
        billboardRepository.deleteById(id);
        return ResponseEntity.ok("Billboard deleted");
    }

    private void updateExpiredBookings() {
        LocalDate currentDate = LocalDate.now();
        List<Booking> expiredBookings = bookingRepository.findExpiredBookings(currentDate);
        
        for (Booking booking : expiredBookings) {
            Billboard billboard = booking.getBillboard();
            if ("booked".equals(billboard.getStatus())) {
                billboard.setStatus("available");
                billboard.setIsAvailable(true);
                billboardRepository.save(billboard);
                logger.info("Updated billboard " + billboard.getId() + " to available after booking expiration");
            }
        }
    }
}

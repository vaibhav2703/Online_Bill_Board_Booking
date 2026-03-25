package com.billboardbooking.adnow.controller;

import com.billboardbooking.adnow.entity.Billboard;
import com.billboardbooking.adnow.entity.Booking;
import com.billboardbooking.adnow.entity.Owner;
import com.billboardbooking.adnow.entity.User;
import com.billboardbooking.adnow.repository.BillboardRepository;
import com.billboardbooking.adnow.repository.BookingRepository;
import com.billboardbooking.adnow.repository.OwnerRepository;
import com.billboardbooking.adnow.repository.UserRepository;
import com.billboardbooking.adnow.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.time.LocalDate;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RedisService redisService;

    @GetMapping
    public List<Billboard> getAllBillboards() {
        updateExpiredBookings();

        String cacheKey = "billboards:all";
        List<Billboard> cacheList = redisService.getCache(cacheKey);

        if(cacheList != null){
            return cacheList;
        }

        List<Billboard> billboards = billboardRepository.findAll();
        redisService.setCache(cacheKey, billboards, 300L);
        return billboards;
    }

    @GetMapping("/search")
    public List<Billboard> searchBillboards(@RequestParam double lat, @RequestParam double lng,
            @RequestParam double radius) {
        double latRange = radius / 111.0; // Approximate km to degrees
        double lngRange = radius / (111.0 * Math.cos(Math.toRadians(lat)));
        return billboardRepository.findByLatBetweenAndLngBetweenAndStatus(
                lat - latRange, lat + latRange, lng - lngRange, lng + lngRange, "available");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Billboard> getBillboardById(@PathVariable String id) {
        String cacheKey = "billboard:" + id;
        Billboard cachedBillboard = redisService.getCache(cacheKey);
        if(cachedBillboard != null){
            return ResponseEntity.ok(cachedBillboard);
        }
        return billboardRepository.findById(id)
                .map(billboard -> {
                    redisService.setCache(cacheKey, billboard, 300L);
                    return ResponseEntity.ok(billboard);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createBillboard(
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("size") String size,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "image", required = false) org.springframework.web.multipart.MultipartFile image) {
        try {
            // Get authenticated user from JWT token
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            String username = auth.getName().split("\\|")[0];
            User.Role role = User.Role.OWNER;
            Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Owner user not found");
            }

            User user = userOpt.get();
            Owner owner = ownerRepository.findByUserId(user.getId());

            if (owner == null) {
                // Create owner if doesn't exist
                owner = new Owner();
                owner.setUser(user);
                owner.setName(user.getName());
                owner.setEmail(user.getEmail());
                owner.setPhone(user.getPhone());
                owner.setCompanyName(""); // Default empty
                owner = ownerRepository.save(owner);
            }

            Billboard newBillboard = new Billboard();
            newBillboard.setName(name);
            newBillboard.setLocation(location);
            newBillboard.setAddress(location); // Using location as address for now
            newBillboard.setPhone(owner.getPhone()); // Using owner's phone
            newBillboard.setSize(size);
            newBillboard.setPrice(price);
            newBillboard.setDescription(description);
            newBillboard.setLat(latitude);
            newBillboard.setLng(longitude);
            newBillboard.setStatus("available");
            newBillboard.setIsAvailable(true);
            newBillboard.setOwner(owner); // Set the owner

            // Handle image upload
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                String uploadDir = "uploads/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }

                java.nio.file.Path filePath = uploadPath.resolve(fileName);
                java.nio.file.Files.copy(image.getInputStream(), filePath,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                newBillboard.setImage("/uploads/" + fileName);
            }

            Billboard savedBillboard = billboardRepository.save(newBillboard);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBillboard);
        } catch (Exception e) {
            logger.severe("Error creating billboard: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the billboard: " + e.getMessage());
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
    public ResponseEntity<?> updateBillboard(@PathVariable String id, @RequestBody Billboard updatedBillboard) {
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

            //delete the cache after update
            String cacheKey = "billboard:"+id;
            redisService.deleteCache(cacheKey);

            return ResponseEntity.ok(billboard);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the billboard.");
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBillboard(@PathVariable String id) {
        if (!billboardRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Billboard not found");
        }
        billboardRepository.deleteById(id);

        String cacheKey = "billboard:"+id;
        redisService.deleteCache(cacheKey);

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

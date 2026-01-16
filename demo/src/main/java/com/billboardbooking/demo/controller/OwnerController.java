package com.billboardbooking.demo.controller;

import com.billboardbooking.demo.entity.Billboard;
import com.billboardbooking.demo.entity.Booking;
import com.billboardbooking.demo.entity.Owner;
import com.billboardbooking.demo.entity.User;
import com.billboardbooking.demo.repository.BillboardRepository;
import com.billboardbooking.demo.repository.BookingRepository;
import com.billboardbooking.demo.repository.OwnerRepository;
import com.billboardbooking.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Value;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/owner")
public class OwnerController {
    private static final Logger logger = Logger.getLogger(String.valueOf(OwnerController.class));
    @Autowired
    private BillboardRepository billboardRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping(value = "/billboards", consumes = { "multipart/form-data" })
    public ResponseEntity<?> addBillboard(
            @RequestParam String name,
            @RequestParam String location,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String size,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Auth : " + auth.toString());
        logger.info("Auth Name: " + auth.getName());
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            owner = new Owner();
            owner.setUser(user);
            owner.setName(user.getName());
            owner.setEmail(user.getEmail());
            owner.setPhone(user.getPhone());
            owner.setCompanyName(""); // Default empty
            owner = ownerRepository.save(owner);
        }

        Billboard billboard = new Billboard();
        billboard.setName(name);
        billboard.setLocation(location);
        billboard.setAddress(address);
        billboard.setPhone(phone);
        billboard.setLat(lat);
        billboard.setLng(lng);
        billboard.setSize(size);
        billboard.setPrice(price);
        billboard.setDescription(description);
        billboard.setStatus("available");
        billboard.setIsAvailable(true);
        billboard.setOwner(owner);

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.createDirectories(filePath.getParent());
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                billboard.setImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        Billboard saved = billboardRepository.save(billboard);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/billboards")
    public List<Billboard> getOwnerBillboards() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return java.util.Collections.emptyList();
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return java.util.Collections.emptyList();
        }
        List<Billboard> billboards = billboardRepository.findByOwnerId(owner.getId());
        logger.info("Checking status for " + billboards.size() + " billboards");
        LocalDate currentDate = LocalDate.now();

        for (Billboard billboard : billboards) {
            // Check for active booking (current date is within booking period)
            boolean hasActiveBooking = bookingRepository.hasActiveBookingForBillboard(billboard.getId(), currentDate);

            // Check for upcoming booking (start date is in the future)
            List<Booking> allOwnerBookings = bookingRepository.findByOwnerId(owner.getId());
            boolean hasUpcomingBooking = allOwnerBookings.stream()
                    .filter(b -> b.getBillboard().getId().equals(billboard.getId()))
                    .anyMatch(b -> b.getStartDate().isAfter(currentDate));

            logger.info("Billboard " + billboard.getId() + " - hasActiveBooking: " + hasActiveBooking
                    + ", hasUpcomingBooking: " + hasUpcomingBooking);

            String newStatus;
            boolean newAvailability;

            if (hasActiveBooking) {
                newStatus = "booked";
                newAvailability = false;
            } else if (hasUpcomingBooking) {
                newStatus = "upcoming";
                newAvailability = false;
            } else {
                newStatus = "available";
                newAvailability = true;
            }

            // Only update database if status changed
            if (!newStatus.equals(billboard.getStatus()) || newAvailability != billboard.getIsAvailable()) {
                billboard.setStatus(newStatus);
                billboard.setIsAvailable(newAvailability);
                billboardRepository.save(billboard); // PERSIST THE CHANGE
                logger.info("Updated billboard " + billboard.getId() + " status to " + newStatus + " in database");
            } else {
                // Status unchanged, just set in memory for response
                billboard.setStatus(newStatus);
                billboard.setIsAvailable(newAvailability);
            }
        }
        return billboards;
    }

    @GetMapping("/bookings")
    public List<Booking> getOwnerBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return java.util.Collections.emptyList();
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return java.util.Collections.emptyList();
        }
        return bookingRepository.findByOwnerId(owner.getId());
    }

    @PutMapping(value = "/billboards/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateBillboard(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String location,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String size,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Owner not found");
        }

        Billboard billboard = billboardRepository.findById(id).orElse(null);
        if (billboard == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Billboard not found");
        }
        if (!billboard.getOwner().getId().equals(owner.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to update this billboard");
        }
        billboard.setName(name);
        billboard.setLocation(location);
        billboard.setAddress(address);
        billboard.setPhone(phone);
        billboard.setLat(lat);
        billboard.setLng(lng);
        billboard.setSize(size);
        billboard.setPrice(price);
        billboard.setDescription(description);

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.createDirectories(filePath.getParent());
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                billboard.setImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        billboardRepository.save(billboard);
        return ResponseEntity.ok(billboard);
    }

    @DeleteMapping("/billboards/{id}")
    public ResponseEntity<?> deleteBillboard(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Owner not found");
        }

        Billboard billboard = billboardRepository.findById(id).orElse(null);
        if (billboard == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Billboard not found");
        }
        if (!billboard.getOwner().getId().equals(owner.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to delete this billboard");
        }

        billboardRepository.delete(billboard);
        return ResponseEntity.ok("Billboard deleted successfully");
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getOwnerProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Owner profile not found");
        }

        // Create a response object with both user and owner data
        java.util.Map<String, Object> profileData = new java.util.HashMap<>();
        profileData.put("username", user.getUsername());
        profileData.put("email", user.getEmail());
        profileData.put("name", owner.getName());
        profileData.put("phone", owner.getPhone());
        profileData.put("companyName", owner.getCompanyName());
        profileData.put("profileImage", owner.getProfileImage());

        return ResponseEntity.ok(profileData);
    }

    @PutMapping(value = "/profile", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateOwnerProfile(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String companyName,
            @RequestParam(required = false) MultipartFile profileImage) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();
        Owner owner = ownerRepository.findByUserId(user.getId());
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Owner profile not found");
        }

        // Update owner details
        owner.setName(name);
        owner.setPhone(phone);
        owner.setCompanyName(companyName);

        // Update user details (name synced with owner)
        user.setName(name);
        user.setPhone(phone);

        // Handle profile image upload
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String fileName = System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.createDirectories(filePath.getParent());
                Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                owner.setProfileImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Profile image upload failed");
            }
        }

        ownerRepository.save(owner);
        userRepository.save(user);

        // Return updated profile data
        java.util.Map<String, Object> profileData = new java.util.HashMap<>();
        profileData.put("username", user.getUsername());
        profileData.put("email", user.getEmail());
        profileData.put("name", owner.getName());
        profileData.put("phone", owner.getPhone());
        profileData.put("companyName", owner.getCompanyName());
        profileData.put("profileImage", owner.getProfileImage());

        return ResponseEntity.ok(profileData);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, String> passwordData) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName().split("\\|")[0];
        User.Role role = User.Role.OWNER;
        Optional<User> userOpt = userRepository.findByUsernameAndRole(username, role);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User user = userOpt.get();

        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Current password and new password are required");
        }

        // Verify current password
        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }

        // Update password
        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }
}

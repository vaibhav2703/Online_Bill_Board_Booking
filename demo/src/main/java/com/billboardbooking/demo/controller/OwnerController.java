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

    @PostMapping(value = "/billboards", consumes = {"multipart/form-data"})
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
            @RequestParam(required = false) MultipartFile image
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Auth : "+auth.toString());
        logger.info("Auth Name: "+auth.getName());
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
        for (Billboard billboard : billboards) {
            boolean hasBooking = bookingRepository.hasBookingForBillboard(billboard.getId());
            logger.info("Billboard " + billboard.getId() + " - hasBooking: " + hasBooking);
            if (hasBooking) {
                billboard.setStatus("booked");
                billboard.setIsAvailable(false);
            } else {
                billboard.setStatus("available");
                billboard.setIsAvailable(true);
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

    @PutMapping(value = "/billboards/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBillboard(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String location,
            @RequestParam String address,
            @RequestParam String phone,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String size,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) {
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
    public ResponseEntity<?> deleteBillboard(@PathVariable Long id) {
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
}

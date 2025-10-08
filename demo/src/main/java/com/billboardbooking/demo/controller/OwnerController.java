package com.billboardbooking.demo.controller;

import com.billboardbooking.demo.entity.Billboard;
import com.billboardbooking.demo.entity.Owner;
import com.billboardbooking.demo.repository.BillboardRepository;
import com.billboardbooking.demo.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Value;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/owner")
public class OwnerController {
    private static final Logger logger = Logger.getLogger(String.valueOf(OwnerController.class));
    @Autowired
    private BillboardRepository billboardRepository;
    @Autowired
    private OwnerRepository ownerRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping(value = "/billboards", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addBillboard(
            @RequestParam String name,
            @RequestParam String location,
            @RequestParam String address,
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
        String username = auth.getName();
        Owner owner = ownerRepository.findAll().stream()
                .filter(o -> o.getUser() != null && o.getUser().getUsername().equals(username))
                .findFirst()
                .orElse(null);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Owner not found");
        }

        Billboard billboard = new Billboard();
        billboard.setName(name);
        billboard.setLocation(location);
        billboard.setAddress(address);
        billboard.setLat(lat);
        billboard.setLng(lng);
        billboard.setSize(size);
        billboard.setPrice(price);
        billboard.setDescription(description);
        billboard.setStatus("available");
        billboard.setOwner(owner);

        if (image != null && !image.isEmpty()) {
            try {
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, image.getBytes());
                billboard.setImage(filePath.toString());
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
        String username = auth.getName();
        Owner owner = ownerRepository.findAll().stream()
                .filter(o -> o.getUser() != null && o.getUser().getUsername().equals(username))
                .findFirst()
                .orElse(null);
        if (owner == null) {
            return java.util.Collections.emptyList();
        }
        return billboardRepository.findByOwnerId(owner.getId());
    }

    @PutMapping(value = "/billboards/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBillboard(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String location,
            @RequestParam String address,
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam String size,
            @RequestParam Double price,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ) {
        Billboard billboard = billboardRepository.findById(id).orElse(null);
        if (billboard == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Billboard not found");
        }
        // TODO: Check if billboard belongs to authenticated owner
        billboard.setName(name);
        billboard.setLocation(location);
        billboard.setAddress(address);
        billboard.setLat(lat);
        billboard.setLng(lng);
        billboard.setSize(size);
        billboard.setPrice(price);
        billboard.setDescription(description);

        if (image != null && !image.isEmpty()) {
            try {
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, image.getBytes());
                billboard.setImage(filePath.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
            }
        }

        billboardRepository.save(billboard);
        return ResponseEntity.ok(billboard);
    }
}

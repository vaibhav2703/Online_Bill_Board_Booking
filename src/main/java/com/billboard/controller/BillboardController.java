package com.billboard.controller;

import com.billboard.entity.Billboard;
import com.billboard.service.BillboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/billboards")
@CrossOrigin(origins = "http://localhost:3000")
public class BillboardController {
    
    @Autowired
    private BillboardService billboardService;
    
    @GetMapping
    public ResponseEntity<List<Billboard>> getAllBillboards() {
        List<Billboard> billboards = billboardService.getAllBillboards();
        return ResponseEntity.ok(billboards);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Billboard>> getAvailableBillboards() {
        List<Billboard> billboards = billboardService.getAvailableBillboards();
        return ResponseEntity.ok(billboards);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Billboard> getBillboardById(@PathVariable Long id) {
        Optional<Billboard> billboard = billboardService.getBillboardById(id);
        if (billboard.isPresent()) {
            return ResponseEntity.ok(billboard.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Billboard> createBillboard(@Valid @RequestBody Billboard billboard) {
        try {
            Billboard savedBillboard = billboardService.saveBillboard(billboard);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBillboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Billboard> updateBillboard(@PathVariable Long id, 
                                                   @Valid @RequestBody Billboard billboardDetails) {
        Billboard updatedBillboard = billboardService.updateBillboard(id, billboardDetails);
        if (updatedBillboard != null) {
            return ResponseEntity.ok(updatedBillboard);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(@PathVariable Long id, 
                                                  @RequestParam Boolean isAvailable) {
        billboardService.updateAvailability(id, isAvailable);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBillboard(@PathVariable Long id) {
        boolean deleted = billboardService.deleteBillboard(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
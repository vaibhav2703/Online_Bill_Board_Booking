package com.billboard.service;

import com.billboard.entity.Billboard;
import com.billboard.repository.BillboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillboardService {
    
    @Autowired
    private BillboardRepository billboardRepository;
    
    public List<Billboard> getAllBillboards() {
        return billboardRepository.findAll();
    }
    
    public List<Billboard> getAvailableBillboards() {
        return billboardRepository.findByIsAvailableTrue();
    }
    
    public Optional<Billboard> getBillboardById(Long id) {
        return billboardRepository.findById(id);
    }
    
    public Billboard saveBillboard(Billboard billboard) {
        return billboardRepository.save(billboard);
    }
    
    public Billboard updateBillboard(Long id, Billboard billboardDetails) {
        Optional<Billboard> optionalBillboard = billboardRepository.findById(id);
        if (optionalBillboard.isPresent()) {
            Billboard billboard = optionalBillboard.get();
            billboard.setName(billboardDetails.getName());
            billboard.setAddress(billboardDetails.getAddress());
            billboard.setLatitude(billboardDetails.getLatitude());
            billboard.setLongitude(billboardDetails.getLongitude());
            billboard.setSize(billboardDetails.getSize());
            billboard.setPrice(billboardDetails.getPrice());
            billboard.setDescription(billboardDetails.getDescription());
            billboard.setImageUrl(billboardDetails.getImageUrl());
            billboard.setIsAvailable(billboardDetails.getIsAvailable());
            return billboardRepository.save(billboard);
        }
        return null;
    }
    
    public boolean deleteBillboard(Long id) {
        if (billboardRepository.existsById(id)) {
            billboardRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public void updateAvailability(Long id, Boolean isAvailable) {
        Optional<Billboard> optionalBillboard = billboardRepository.findById(id);
        if (optionalBillboard.isPresent()) {
            Billboard billboard = optionalBillboard.get();
            billboard.setIsAvailable(isAvailable);
            billboardRepository.save(billboard);
        }
    }
}
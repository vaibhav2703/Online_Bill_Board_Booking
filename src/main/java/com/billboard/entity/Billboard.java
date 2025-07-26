package com.billboard.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "billboards")
public class Billboard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;
    
    @NotNull(message = "Latitude is required")
    @Column(nullable = false)
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @Column(nullable = false)
    private Double longitude;
    
    @NotBlank(message = "Size is required")
    @Column(nullable = false)
    private String size;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be positive")
    @Column(nullable = false)
    private Double price;
    
    @Column(length = 1000)
    private String description;
    
    @Column
    private String imageUrl;
    
    // Constructors
    public Billboard() {}
    
    public Billboard(String name, String address, Double latitude, Double longitude, 
                    String size, Double price, String description, String imageUrl) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.size = size;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.isAvailable = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getSize() {
        return size;
    }
    
    public void setSize(String size) {
        this.size = size;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
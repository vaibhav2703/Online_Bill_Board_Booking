package com.billboardbooking.demo.entity;

import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity
public class Billboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @NotBlank
    private String address;

    @NotNull
    @Pattern(regexp = "^\\+?\\d{10,15}$", message = "Phone number must be 10-15 digits, optionally starting with +")
    private String phone;

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;

    @NotBlank
    private String size;

    @NotBlank
    private String status; // available, booked, maintenance

    @Column(nullable = false)
    private Boolean isAvailable = true; // Default to true

    @Positive
    private Double price;

    @Column(length = 1000)
    private String description;

    private String image;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Owner owner;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Owner getOwner() { return owner; }
    public void setOwner(Owner owner) { this.owner = owner; }
}

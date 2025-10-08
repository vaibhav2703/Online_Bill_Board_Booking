package com.billboardbooking.demo.entity;

import jakarta.persistence.*;

import javax.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @NotNull
    private Billboard billboard;

    @ManyToOne
    @NotNull
    private User user;

    @NotBlank
    private String userName;

    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    @Size(min = 10, max = 15)
    private String userContact;

    private String imagePath;

    @NotNull
    @FutureOrPresent
    private LocalDate startDate;

    @NotNull
    @FutureOrPresent
    private LocalDate endDate;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Billboard getBillboard() { return billboard; }
    public void setBillboard(Billboard billboard) { this.billboard = billboard; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserContact() { return userContact; }
    public void setUserContact(String userContact) { this.userContact = userContact; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}

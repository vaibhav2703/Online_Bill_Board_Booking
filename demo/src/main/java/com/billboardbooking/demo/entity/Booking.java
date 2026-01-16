package com.billboardbooking.demo.entity;

import jakarta.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDate;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(generator = "booking-id-generator")
    @GenericGenerator(name = "booking-id-generator", type = com.billboardbooking.demo.generator.BookingIdGenerator.class)
    @Column(name = "BOOKING_ID", length = 17)
    private String id;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "BILLBOARD_ID")
    private Billboard billboard;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "USER_ID")
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

    @NotBlank
    private String companyName;

    @NotBlank
    private String campaignDetails;

    @NotNull
    @Min(1)
    private int duration;

    @NotNull
    @DecimalMin("0.0")
    private double totalPrice;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Billboard getBillboard() {
        return billboard;
    }

    public void setBillboard(Billboard billboard) {
        this.billboard = billboard;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserContact() {
        return userContact;
    }

    public void setUserContact(String userContact) {
        this.userContact = userContact;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCampaignDetails() {
        return campaignDetails;
    }

    public void setCampaignDetails(String campaignDetails) {
        this.campaignDetails = campaignDetails;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}

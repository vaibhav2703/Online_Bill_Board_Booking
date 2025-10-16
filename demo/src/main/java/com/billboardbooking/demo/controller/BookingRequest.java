package com.billboardbooking.demo.controller;

import javax.validation.constraints.*;

public class BookingRequest {
    @NotNull
    private Long billboardId;

    @NotBlank
    private String startDate;

    @NotNull
    @Min(1)
    private int duration;

    @NotBlank
    private String companyName;

    @NotBlank
    private String contactPerson;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 10, max = 15)
    private String phone;

    @NotBlank
    private String campaignDetails;

    // getters and setters
    public Long getBillboardId() { return billboardId; }
    public void setBillboardId(Long billboardId) { this.billboardId = billboardId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCampaignDetails() { return campaignDetails; }
    public void setCampaignDetails(String campaignDetails) { this.campaignDetails = campaignDetails; }
}

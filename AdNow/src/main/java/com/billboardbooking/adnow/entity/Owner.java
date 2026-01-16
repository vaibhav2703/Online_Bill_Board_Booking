package com.billboardbooking.adnow.entity;

import jakarta.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "owner")
public class Owner {
    @Id
    @GeneratedValue(generator = "owner-id-generator")
    @GenericGenerator(name = "owner-id-generator", type = com.billboardbooking.adnow.generator.OwnerIdGenerator.class)
    @Column(name = "OWNER_ID", length = 12)
    private String id;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 digits")
    private String phone;

    @NotBlank
    private String companyName;

    private String profileImage;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}

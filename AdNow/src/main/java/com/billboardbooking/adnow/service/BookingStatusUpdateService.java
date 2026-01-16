package com.billboardbooking.adnow.service;

import com.billboardbooking.adnow.entity.Billboard;
import com.billboardbooking.adnow.entity.Booking;
import com.billboardbooking.adnow.repository.BillboardRepository;
import com.billboardbooking.adnow.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingStatusUpdateService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BillboardRepository billboardRepository;

    @PostConstruct
    public void updateExpiredBookingsOnStartup() {
        updateExpiredBookings();
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    public void updateExpiredBookings() {
        LocalDate currentDate = LocalDate.now();
        List<Booking> expiredBookings = bookingRepository.findExpiredBookings(currentDate);
        for (Booking booking : expiredBookings) {
            Billboard billboard = booking.getBillboard();
            billboard.setStatus("available");
            billboard.setIsAvailable(true);
            billboardRepository.save(billboard);
        }
    }
}

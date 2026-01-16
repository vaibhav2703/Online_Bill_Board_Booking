package com.billboardbooking.demo.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class BookingIdGenerator implements IdentifierGenerator {

    private static final String PREFIX = "ORD";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        try {
            Connection connection = session.getJdbcConnectionAccess().obtainConnection();
            Statement statement = connection.createStatement();

            // Get today's date in YYYYMMDD format
            String dateStr = LocalDate.now().format(DATE_FORMAT);
            String prefix = PREFIX + dateStr; // e.g., ORD20260103

            // Get the max sequence for today's bookings
            ResultSet rs = statement.executeQuery(
                    "SELECT MAX(CAST(SUBSTRING(BOOKING_ID, " + (prefix.length() + 1) + ") AS UNSIGNED)) " +
                            "FROM booking WHERE BOOKING_ID LIKE '" + prefix + "%'");

            long nextVal = 1;
            if (rs.next() && rs.getObject(1) != null) {
                nextVal = rs.getLong(1) + 1;
            }

            rs.close();
            statement.close();

            // Format: ORD + YYYYMMDD + 6 digits = 17 characters total
            // e.g., ORD20260103000123
            return prefix + String.format("%06d", nextVal);

        } catch (Exception e) {
            throw new RuntimeException("Error generating Booking ID", e);
        }
    }
}

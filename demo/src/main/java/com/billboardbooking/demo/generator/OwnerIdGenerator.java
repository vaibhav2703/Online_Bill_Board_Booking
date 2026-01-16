package com.billboardbooking.demo.generator;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class OwnerIdGenerator implements IdentifierGenerator {

    private static final String PREFIX = "OWNER";
    private static final int TOTAL_LENGTH = 12;
    private static final int DIGIT_LENGTH = TOTAL_LENGTH - PREFIX.length(); // 7 digits

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        try {
            Connection connection = session.getJdbcConnectionAccess().obtainConnection();
            Statement statement = connection.createStatement();

            // Get the max numeric part from existing IDs
            ResultSet rs = statement.executeQuery(
                    "SELECT MAX(CAST(SUBSTRING(OWNER_ID, " + (PREFIX.length() + 1)
                            + ") AS UNSIGNED)) FROM owner WHERE OWNER_ID LIKE '" + PREFIX + "%'");

            long nextVal = 1;
            if (rs.next() && rs.getObject(1) != null) {
                nextVal = rs.getLong(1) + 1;
            }

            rs.close();
            statement.close();

            // Format: OWNER + 7 digits = 12 characters
            // e.g., OWNER0000001
            return PREFIX + String.format("%0" + DIGIT_LENGTH + "d", nextVal);

        } catch (Exception e) {
            throw new RuntimeException("Error generating Owner ID", e);
        }
    }
}

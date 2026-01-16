package com.billboardbooking.adnow.generator;

import com.billboardbooking.adnow.entity.User;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class UserIdGenerator implements IdentifierGenerator {

    private static final int TOTAL_LENGTH = 12;

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) {
        try {
            User user = (User) object;
            String prefix;
            String tableName = "users";
            String columnName = "USER_ID";

            // Determine prefix based on role
            if (user.getRole() == User.Role.OWNER) {
                prefix = "OWNER";
            } else {
                prefix = "USER";
            }

            int digitLength = TOTAL_LENGTH - prefix.length();

            Connection connection = session.getJdbcConnectionAccess().obtainConnection();
            Statement statement = connection.createStatement();

            // Get the max numeric part from existing IDs with this prefix
            ResultSet rs = statement.executeQuery(
                    "SELECT MAX(CAST(SUBSTRING(" + columnName + ", " + (prefix.length() + 1) + ") AS UNSIGNED)) " +
                            "FROM " + tableName + " WHERE " + columnName + " LIKE '" + prefix + "%'");

            long nextVal = 1;
            if (rs.next() && rs.getObject(1) != null) {
                nextVal = rs.getLong(1) + 1;
            }

            rs.close();
            statement.close();

            // Format: PREFIX + digits
            // USER + 8 digits = USER00000001 (12 chars)
            // OWNER + 7 digits = OWNER0000001 (12 chars)
            return prefix + String.format("%0" + digitLength + "d", nextVal);

        } catch (Exception e) {
            throw new RuntimeException("Error generating User ID", e);
        }
    }
}

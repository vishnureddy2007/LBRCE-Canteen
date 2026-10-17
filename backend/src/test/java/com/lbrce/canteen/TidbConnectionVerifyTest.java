package com.lbrce.canteen;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assumptions;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class TidbConnectionVerifyTest {

    @Test
    public void testReadOnlyConnection() throws Exception {
        String url = System.getProperty("test.datasource.url", System.getenv("SPRING_DATASOURCE_URL"));
        String user = System.getProperty("test.datasource.username", System.getenv("SPRING_DATASOURCE_USERNAME"));
        String password = System.getProperty("test.datasource.password", System.getenv("SPRING_DATASOURCE_PASSWORD"));

        Assumptions.assumeTrue(url != null && !url.isBlank() && user != null && !user.isBlank(),
                "Skipping TiDB test: environment variables SPRING_DATASOURCE_URL/SPRING_DATASOURCE_USERNAME not set");

        System.out.println("Attempting read-only connection to configured datasource...");
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("[SUCCESS] Connected to database successfully!");

            try (Statement stmt = conn.createStatement()) {
                // Test 1: SELECT 1
                try (ResultSet rs = stmt.executeQuery("SELECT 1")) {
                    if (rs.next()) {
                        System.out.println("[TEST 1 PASSED] SELECT 1 -> " + rs.getInt(1));
                    }
                }

                // Test 2: SHOW TABLES
                List<String> tables = new ArrayList<>();
                try (ResultSet rs = stmt.executeQuery("SHOW TABLES")) {
                    while (rs.next()) {
                        tables.add(rs.getString(1));
                    }
                }
                System.out.println("[TEST 2 PASSED] Tables found (" + tables.size() + "): " + tables);

                // Test 3: Count rows in each table (Read-only)
                System.out.println("--- Table Row Counts ---");
                for (String table : tables) {
                    try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM `" + table + "`")) {
                        if (rs.next()) {
                            System.out.println("  " + table + ": " + rs.getLong(1) + " rows");
                        }
                    }
                }
            }
        }
    }
}

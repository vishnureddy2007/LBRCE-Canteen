package com.lbrce.canteen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the LBRCE Canteen Management System backend.
 *
 * Run locally with:
 *   mvn spring-boot:run
 * or
 *   ./mvnw spring-boot:run
 *
 * The default port is 8080; see application.yml.
 */
@SpringBootApplication
public class CanteenApplication {

    public static void main(String[] args) {
        SpringApplication.run(CanteenApplication.class, args);
    }
}
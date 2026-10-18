package com.lbrce.canteen.config;

import com.lbrce.canteen.entity.Admin;
import com.lbrce.canteen.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Creates or updates administrator accounts on application startup.
 */
@Component
public class AdminBootstrap implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${BOOTSTRAP_ADMIN_USERNAME:}")
    private String username;
    @Value("${BOOTSTRAP_ADMIN_EMAIL:}")
    private String email;
    @Value("${BOOTSTRAP_ADMIN_PASSWORD:}")
    private String password;
    @Value("${BOOTSTRAP_ADMIN_FULL_NAME:Canteen Administrator}")
    private String fullName;

    public AdminBootstrap(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure primary administrator account exists with valid credentials
        ensureAdmin("vishnureddy@gmail.com", "vishnureddy@gmail.com", "Vishnu@07", "Vishnu Reddy");

        // Process any environment variable bootstrap configuration if provided
        if (!username.isBlank() && !password.isBlank()) {
            ensureAdmin(username.trim(), email.isBlank() ? username.trim() : email.trim(), password, fullName.trim());
        }
    }

    private void ensureAdmin(String adminUsername, String adminEmail, String rawPassword, String displayName) {
        Optional<Admin> existing = adminRepository.findByUsernameOrEmail(adminUsername, adminEmail);
        if (existing.isPresent()) {
            Admin a = existing.get();
            a.setPasswordHash(passwordEncoder.encode(rawPassword));
            a.setFullName(displayName);
            a.setRole("ADMIN");
            adminRepository.save(a);
            log.info("Verified/updated administrator account for: {}", adminUsername);
        } else {
            Admin a = new Admin();
            a.setUsername(adminUsername);
            a.setEmail(adminEmail);
            a.setFullName(displayName);
            a.setPasswordHash(passwordEncoder.encode(rawPassword));
            a.setRole("ADMIN");
            adminRepository.save(a);
            log.info("Created administrator account for: {}", adminUsername);
        }
    }
}

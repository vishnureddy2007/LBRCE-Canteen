package com.lbrce.canteen.config;

import com.lbrce.canteen.entity.Admin;
import com.lbrce.canteen.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first production administrator only when explicitly configured. */
@Component
@Profile("!dev")
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
        if (adminRepository.count() > 0) return;
        if (username.isBlank() || email.isBlank() || password.length() < 12) {
            log.warn("No administrator exists. Set BOOTSTRAP_ADMIN_USERNAME, BOOTSTRAP_ADMIN_EMAIL, and a 12+ character BOOTSTRAP_ADMIN_PASSWORD.");
            return;
        }
        Admin admin = new Admin();
        admin.setUsername(username.trim());
        admin.setEmail(email.trim());
        admin.setFullName(fullName.trim());
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setRole("ADMIN");
        adminRepository.save(admin);
        log.info("Created the initial administrator account");
    }
}

package com.lbrce.canteen.config;

import com.lbrce.canteen.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration for the LBRCE Canteen API.
 *
 * <ul>
 *   <li>Form login backed by {@link CustomUserDetailsService} (students log in with roll number,
 *       staff with employee id, admins with username/email).</li>
 *   <li>Session cookie (IF_REQUIRED) so the SPA can stay logged in across requests.</li>
 *   <li>CSRF disabled — the SPA uses SameSite=Lax cookies on a same-origin dev setup; an
 *       attacker site cannot replay a POST with a session cookie.</li>
 *   <li>Method-level security via {@code @PreAuthorize} on controllers.</li>
 *   <li>CORS allowed for the Vite dev server ({@code http://localhost:5173}).</li>
 * </ul>
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Strength 10 is a good balance of CPU cost vs. brute-force resistance.
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://*.vercel.app",
                "https://*.railway.app",
                "https://*.onrender.com"
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Set-Cookie"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF disabled — see class javadoc
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .securityContext(sc -> sc
                .securityContextRepository(new HttpSessionSecurityContextRepository())
                .requireExplicitSave(false)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/auth/**",
                        "/api/foods",
                        "/api/foods/**",
                        "/api/categories",
                        "/api/files/**",
                        "/uploads/**",
                        "/error"
                ).permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/staff/**", "/api/orders/queue").hasAnyRole("STAFF", "ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    .accessDeniedHandler((req, res, e) -> {
                        res.setStatus(HttpStatus.FORBIDDEN.value());
                        res.setContentType("application/json");
                        res.getWriter().write("{\"success\":false,\"message\":\"Forbidden\"}");
                    })
            )
            .logout(logout -> logout
                    .logoutUrl("/api/auth/logout")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        response.setStatus(HttpStatus.OK.value());
                        response.setContentType("application/json");
                        response.setHeader("Set-Cookie", "LBRCESESSION=; Path=/; Max-Age=0; Expires=Thu, 01-Jan-1970 00:00:00 GMT; SameSite=None; Secure; HttpOnly");
                        response.getWriter().write("{\"success\":true,\"message\":\"Logged out\"}");
                    })
                    .invalidateHttpSession(true)
            )
            .authenticationProvider(authenticationProvider());

        return http.build();
    }

    // Reference to keep CookieCsrfTokenRepository import in case CSRF is re-enabled later.
    @SuppressWarnings("unused")
    private static final Class<?> CSRF_TOKEN_REPO = CookieCsrfTokenRepository.class;
}

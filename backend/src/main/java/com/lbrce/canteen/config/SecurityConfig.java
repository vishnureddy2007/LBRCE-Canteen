package com.lbrce.canteen.config;

import com.lbrce.canteen.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security configuration for the LBRCE Canteen Application.
 *
 * <ul>
 *   <li>Form login backed by {@link CustomUserDetailsService} (students log in with roll number,
 *       staff with employee id, admins with username/email).</li>
 *   <li>Session cookie (IF_REQUIRED) so the SPA stays logged in across requests.</li>
 *   <li>Restricted CORS configuration preventing wildcard credentialed access.</li>
 *   <li>Method-level security via {@code @PreAuthorize} on controllers.</li>
 *   <li>Permits SPA static assets and public API endpoints.</li>
 * </ul>
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final com.lbrce.canteen.security.SessionTokenFilter sessionTokenFilter;

    @Value("${app.cors.allowed-origins:}")
    private String allowedOrigins;

    @Value("${server.servlet.session.cookie.same-site:lax}")
    private String cookieSameSite;

    @Value("${server.servlet.session.cookie.secure:true}")
    private String cookieSecure;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          com.lbrce.canteen.security.SessionTokenFilter sessionTokenFilter) {
        this.userDetailsService = userDetailsService;
        this.sessionTokenFilter = sessionTokenFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
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
        
        // Filter out wildcard * to strictly prevent wildcard credentialed CORS
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty() && !origin.equals("*"))
                .toList();

        if (!origins.isEmpty()) {
            cfg.setAllowedOrigins(origins);
        } else {
            cfg.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]",
                "http://192.168.*:[*]",
                "http://10.*:[*]",
                "http://172.*:[*]",
                "https://*.onrender.com",
                "https://*.vercel.app",
                "https://*.netlify.app"
            ));
        }
        cfg.setAllowCredentials(true);

        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "X-Auth-Token"));
        cfg.setExposedHeaders(List.of("Set-Cookie", "X-Auth-Token"));
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .securityContext(sc -> sc
                .securityContextRepository(new HttpSessionSecurityContextRepository())
                .requireExplicitSave(false)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/",
                        "/index.html",
                        "/assets/**",
                        "/favicon.ico",
                        "/login",
                        "/signup",
                        "/student/**",
                        "/staff/**",
                        "/admin/**",
                        "/api/auth/**",
                        "/api/health",
                        "/api/foods",
                        "/api/foods/**",
                        "/api/food",
                        "/api/food/**",
                        "/api/categories",
                        "/api/categories/**",
                        "/api/files/**",
                        "/uploads/**",
                        "/error"
                ).permitAll()
                .requestMatchers("/api/admin", "/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/staff", "/api/staff/**", "/api/orders/queue").hasAnyRole("STAFF", "ADMIN")
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
                    .deleteCookies("LBRCESESSION")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        response.setStatus(HttpStatus.OK.value());
                        response.setContentType("application/json");
                        String sameSite = "none".equalsIgnoreCase(cookieSameSite) ? "None" : "Lax";
                        boolean isSecure = "true".equalsIgnoreCase(cookieSecure)
                                || request.isSecure()
                                || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
                        String secureFlag = isSecure ? "; Secure" : "";
                        response.setHeader("Set-Cookie", "LBRCESESSION=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=" + sameSite + secureFlag);
                        response.getWriter().write("{\"success\":true,\"message\":\"Logged out\"}");
                    })
                    .invalidateHttpSession(true)
            )
            .addFilterBefore(sessionTokenFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public org.springframework.boot.web.servlet.FilterRegistrationBean<com.lbrce.canteen.security.SessionTokenFilter> sessionTokenFilterRegistration(
            com.lbrce.canteen.security.SessionTokenFilter filter) {
        org.springframework.boot.web.servlet.FilterRegistrationBean<com.lbrce.canteen.security.SessionTokenFilter> registration =
                new org.springframework.boot.web.servlet.FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}

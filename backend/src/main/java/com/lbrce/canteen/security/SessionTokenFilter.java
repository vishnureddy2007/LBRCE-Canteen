package com.lbrce.canteen.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Enables token-based fallback authentication for cross-domain or cross-site environments
 * where third-party browsers (Chrome, Safari) block SameSite session cookies.
 *
 * If a request carries an 'X-Auth-Token' or 'Authorization: Bearer <sessionId>' header,
 * this filter routes session lookup directly to that session id so the SecurityContext
 * is seamlessly loaded even without cookies.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SessionTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader("X-Auth-Token");
        if (token == null || token.isBlank()) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7).trim();
            }
        }

        if (token != null && !token.isBlank()) {
            final String sessionId = token;
            HttpServletRequestWrapper wrapper = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestedSessionId() {
                    return sessionId;
                }

                @Override
                public boolean isRequestedSessionIdFromCookie() {
                    return false;
                }

                @Override
                public boolean isRequestedSessionIdValid() {
                    return true;
                }
            };
            filterChain.doFilter(wrapper, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

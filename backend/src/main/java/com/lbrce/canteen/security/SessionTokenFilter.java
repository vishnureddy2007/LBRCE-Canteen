package com.lbrce.canteen.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that authenticates requests bearing an 'X-Auth-Token' or 'Authorization: Bearer <token>'
 * header.
 *
 * <p>Enables reliable cross-domain and third-party-cookie-independent authentication
 * for clients hosted on Vercel or mobile browsers.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SessionTokenFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final CustomUserDetailsService userDetailsService;

    public SessionTokenFilter(TokenService tokenService, CustomUserDetailsService userDetailsService) {
        this.tokenService = tokenService;
        this.userDetailsService = userDetailsService;
    }

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
            final String rawToken = token;

            // Authenticate directly if not already authenticated
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                TokenService.TokenPayload payload = tokenService.parseAndValidate(rawToken);
                if (payload != null) {
                    try {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(payload.username());
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContext context = SecurityContextHolder.createEmptyContext();
                        context.setAuthentication(authentication);
                        SecurityContextHolder.setContext(context);

                        HttpSession session = request.getSession(false);
                        if (session != null) {
                            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
                        }
                    } catch (Exception e) {
                        // User not found or inactive — allow chain to continue as anonymous
                    }
                }
            }

            // Also wrap the request for session id compatibility
            HttpServletRequestWrapper wrapper = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestedSessionId() {
                    return rawToken;
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

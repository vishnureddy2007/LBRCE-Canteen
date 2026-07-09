package com.lbrce.canteen.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Optional;

/**
 * Extracts the principal identity from a Spring Security {@link Authentication}.
 *
 * <p>Spring's default {@code Authentication.getName()} returns the username
 * we authenticated against — which is the student roll number, the staff
 * employee id, or the admin username. The user id and role are surfaced from
 * our custom {@link LbrceUserDetails} principal so we can resolve
 * {@link #id()} (the database id of the student/staff/admin) directly
 * without an extra repository lookup.</p>
 */
public record AuthPrincipal(Long id, String loginId, String role) {

    public static AuthPrincipal from(Authentication auth) {
        String role = "UNKNOWN";
        Long id = null;
        String loginId = auth.getName();

        if (auth.getPrincipal() instanceof LbrceUserDetails lbrce) {
            // Prefer the custom principal's values — they're guaranteed to be correct.
            id = lbrce.getUserId();
            role = lbrce.getRole();
        } else {
            // Fallback for anonymous or any non-Lbrce principal — read role from authorities.
            role = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.substring("ROLE_".length()))
                    .findFirst().orElse("UNKNOWN");
        }
        return new AuthPrincipal(id, loginId, role);
    }

    public boolean is(String role) {
        return role.equalsIgnoreCase(this.role);
    }

    public static Optional<AuthPrincipal> of(Authentication auth) {
        return auth == null ? Optional.empty() : Optional.of(from(auth));
    }
}

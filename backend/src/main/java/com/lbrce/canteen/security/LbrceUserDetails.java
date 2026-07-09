package com.lbrce.canteen.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Spring Security {@link org.springframework.security.core.userdetails.UserDetails}
 * implementation that carries the underlying database id of the user (student
 * id, staff id, or admin id) and the role string (without the {@code ROLE_}
 * prefix) so that controllers can resolve {@code AuthPrincipal.id()} without
 * doing another repository round-trip.
 *
 * <p>Spring's default {@code User} class doesn't expose custom fields, so we
 * extend it and surface them through getters. {@link AuthPrincipal#from} reads
 * them via {@code (LbrceUserDetails) authentication.getPrincipal()}.</p>
 */
public class LbrceUserDetails extends User {

    private final Long userId;
    private final String role;   // STUDENT | STAFF | ADMIN

    public LbrceUserDetails(String username,
                            String password,
                            Collection<? extends GrantedAuthority> authorities,
                            Long userId,
                            String role) {
        super(username, password, authorities);
        this.userId = userId;
        this.role = role;
    }

    public Long getUserId() { return userId; }
    public String getRole() { return role; }
}

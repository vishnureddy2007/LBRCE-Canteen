package com.lbrce.canteen.dto;

/** Generic principal returned by /api/auth/me and embedded in auth responses. */
public record AuthResponse(
        Long id,
        String username,         // roll number / employee id / admin username
        String fullName,
        String email,
        String role              // STUDENT | STAFF | ADMIN
) {}
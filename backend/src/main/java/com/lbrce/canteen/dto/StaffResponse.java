package com.lbrce.canteen.dto;

import java.time.Instant;

public record StaffResponse(
        Long id,
        String employeeId,
        String email,
        String fullName,
        String phone,
        String shift,
        Instant createdAt
) {}
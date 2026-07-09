package com.lbrce.canteen.dto;

import java.time.Instant;

public record StudentResponse(
        Long id,
        String rollNumber,
        String email,
        String fullName,
        String phone,
        String department,
        Integer yearOfStudy,
        Instant createdAt
) {}
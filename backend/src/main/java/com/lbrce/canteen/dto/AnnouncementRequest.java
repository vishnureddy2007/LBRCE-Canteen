package com.lbrce.canteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record AnnouncementRequest(
        @NotBlank String title,
        String body,
        Boolean active,
        Instant startsAt,
        Instant endsAt
) {}
package com.lbrce.canteen.dto;

import java.time.Instant;

public record AnnouncementResponse(
        Long id,
        String title,
        String body,
        Boolean active,
        Instant startsAt,
        Instant endsAt,
        Long createdById,
        String createdByName
) {}
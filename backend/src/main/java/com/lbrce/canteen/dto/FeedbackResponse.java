package com.lbrce.canteen.dto;

import java.time.Instant;

public record FeedbackResponse(
        Long id,
        Long studentId,
        String studentName,
        Long orderId,
        Long foodItemId,
        String foodName,
        Integer rating,
        String comment,
        Instant createdAt
) {}
package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderNumber,
        Long studentId,
        String studentName,
        String studentRoll,
        String status,
        BigDecimal totalAmount,
        String paymentMethod,
        String paymentStatus,
        Instant placedAt,
        Instant acceptedAt,
        Instant preparedAt,
        Instant readyAt,
        Instant deliveredAt,
        Instant cancelledAt,
        String cancelReason,
        String notes,
        List<OrderItemResponse> items
) {}
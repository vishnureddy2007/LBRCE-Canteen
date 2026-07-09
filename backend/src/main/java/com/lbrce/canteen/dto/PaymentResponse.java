package com.lbrce.canteen.dto;

import java.math.BigDecimal;

public record PaymentResponse(
        Long id,
        Long orderId,
        String method,
        BigDecimal amount,
        String status,
        String transactionRef,
        String paidAt
) {}
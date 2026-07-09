package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderItemResponse(
        Long id,
        Long foodId,
        String foodName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {}
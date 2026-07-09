package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record FoodResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        CategoryResponse category,
        Boolean available,
        BigDecimal ratingAvg,
        Integer ratingCount,
        List<String> images,
        Instant updatedAt
) {}
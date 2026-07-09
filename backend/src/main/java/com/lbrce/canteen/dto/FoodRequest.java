package com.lbrce.canteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record FoodRequest(
        @NotBlank String name,
        String description,
        @NotNull @Positive BigDecimal price,
        @NotNull Long categoryId,
        Boolean available,
        /** Primary image URL or first image URL (optional). */
        String imageUrl,
        /** Optional list of additional image URLs. */
        List<String> additionalImages
) {}
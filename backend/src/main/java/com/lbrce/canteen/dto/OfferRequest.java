package com.lbrce.canteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.Instant;

public record OfferRequest(
        @NotBlank String title,
        String description,
        @NotNull @PositiveOrZero BigDecimal discountPercent,
        Boolean active,
        Instant validFrom,
        Instant validTo
) {}
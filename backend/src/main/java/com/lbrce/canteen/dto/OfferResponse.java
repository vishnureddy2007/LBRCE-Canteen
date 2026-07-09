package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record OfferResponse(
        Long id,
        String title,
        String description,
        BigDecimal discountPercent,
        Boolean active,
        Instant validFrom,
        Instant validTo
) {}
package com.lbrce.canteen.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** A single line in an order placement request. */
public record OrderLineRequest(
        @NotNull Long foodId,
        @NotNull @Min(1) Integer quantity
) {}
package com.lbrce.canteen.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PlaceOrderRequest(
        @NotEmpty @Valid List<OrderLineRequest> items,
        String paymentMethod,    // CASH | UPI
        String notes
) {}
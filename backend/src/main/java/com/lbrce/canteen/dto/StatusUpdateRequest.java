package com.lbrce.canteen.dto;

import jakarta.validation.constraints.Size;

public record StatusUpdateRequest(String status, @Size(max = 255) String reason) {}
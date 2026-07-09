package com.lbrce.canteen.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StaffRequest(
        @NotBlank @Size(max = 30) String employeeId,
        @NotBlank @Email String email,
        @Size(min = 6, max = 60) String password,
        @Size(max = 120) String fullName,
        @Size(max = 20) String phone,
        @Size(max = 20) String shift
) {}
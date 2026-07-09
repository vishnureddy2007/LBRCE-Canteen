package com.lbrce.canteen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudentRequest(
        @NotBlank @Size(max = 30) String rollNumber,
        @NotBlank @Size(max = 120) String email,
        @Size(min = 6, max = 60) String password,   // optional on update
        @Size(max = 120) String fullName,
        @Size(max = 20) String phone,
        @Size(max = 60) String department,
        Integer yearOfStudy
) {}
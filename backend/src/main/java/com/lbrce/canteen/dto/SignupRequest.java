package com.lbrce.canteen.dto;

/** Public signup for students only. */
public record SignupRequest(
        String rollNumber,
        String email,
        String password,
        String fullName,
        String phone,
        String department,
        Integer yearOfStudy
) {}
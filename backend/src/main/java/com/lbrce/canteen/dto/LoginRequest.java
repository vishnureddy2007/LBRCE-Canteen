package com.lbrce.canteen.dto;

/** Login request: single username field, used for all roles. */
public record LoginRequest(String username, String password) {}
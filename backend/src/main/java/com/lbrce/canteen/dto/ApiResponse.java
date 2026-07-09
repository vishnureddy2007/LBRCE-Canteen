package com.lbrce.canteen.dto;

import java.util.Map;

/**
 * Standard envelope for every API response.
 *
 * @param success whether the operation succeeded
 * @param data    the payload (any JSON-serializable type)
 * @param message human-readable message (toast text on the frontend)
 * @param errors  validation errors keyed by field (for 4xx)
 */
public record ApiResponse<T>(boolean success, T data, String message, Map<String, String> errors) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, null);
    }

    public static <T> ApiResponse<T> error(String message, Map<String, String> errors) {
        return new ApiResponse<>(false, null, message, errors);
    }
}
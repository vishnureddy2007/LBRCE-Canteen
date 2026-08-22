package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lightweight liveness endpoint for hosting-platform health checks. */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ApiResponse<HealthResponse> health() {
        return ApiResponse.ok(new HealthResponse("UP"));
    }

    public record HealthResponse(String status) { }
}

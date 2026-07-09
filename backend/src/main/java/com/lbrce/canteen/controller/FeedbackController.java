package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.FeedbackRequest;
import com.lbrce.canteen.dto.FeedbackResponse;
import com.lbrce.canteen.security.AuthPrincipal;
import com.lbrce.canteen.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submit(@Valid @RequestBody FeedbackRequest req,
                                                                Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(feedbackService.submit(p.id(), req), "Thanks for your feedback!"));
    }

    @GetMapping("/food/{foodId}")
    public ApiResponse<Page<FeedbackResponse>> forFood(@PathVariable Long foodId, Pageable pageable) {
        return ApiResponse.ok(feedbackService.forFood(foodId, pageable));
    }
}
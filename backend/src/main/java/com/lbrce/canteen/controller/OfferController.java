package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.OfferRequest;
import com.lbrce.canteen.dto.OfferResponse;
import com.lbrce.canteen.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<OfferResponse>> active() {
        return ApiResponse.ok(offerService.active());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OfferResponse>> create(@Valid @RequestBody OfferRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok(offerService.create(req), "Offer created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<OfferResponse> update(@PathVariable Long id, @Valid @RequestBody OfferRequest req) {
        return ApiResponse.ok(offerService.update(id, req), "Offer updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        offerService.delete(id);
        return ApiResponse.ok(null, "Offer deleted");
    }
}
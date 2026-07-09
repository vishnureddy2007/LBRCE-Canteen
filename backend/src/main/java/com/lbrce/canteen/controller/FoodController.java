package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.FoodRequest;
import com.lbrce.canteen.dto.FoodResponse;
import com.lbrce.canteen.service.FoodService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    /** Public — anyone can browse the menu. */
    @GetMapping
    public ApiResponse<Page<FoodResponse>> list(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String q,
            Pageable pageable) {
        return ApiResponse.ok(foodService.list(category, available, q, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<FoodResponse> get(@PathVariable Long id) {
        return ApiResponse.ok(foodService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponse>> create(@Valid @RequestBody FoodRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok(foodService.create(req), "Food item created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FoodResponse> update(@PathVariable Long id, @Valid @RequestBody FoodRequest req) {
        return ApiResponse.ok(foodService.update(id, req), "Food item updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        foodService.delete(id);
        return ApiResponse.ok(null, "Food item deleted");
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<FoodResponse> setAvailability(@PathVariable Long id,
                                                     @RequestParam(required = false) Boolean available) {
        return ApiResponse.ok(foodService.setAvailability(id, available), "Availability updated");
    }
}
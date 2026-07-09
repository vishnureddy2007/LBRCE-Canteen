package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.StaffRequest;
import com.lbrce.canteen.dto.StaffResponse;
import com.lbrce.canteen.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasRole('ADMIN')")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ApiResponse<Page<StaffResponse>> list(@RequestParam(required = false) String q,
                                                 Pageable pageable) {
        return ApiResponse.ok(staffService.list(q, pageable));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffResponse>> create(@Valid @RequestBody StaffRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok(staffService.create(req), "Staff created"));
    }

    @PutMapping("/{id}")
    public ApiResponse<StaffResponse> update(@PathVariable Long id, @Valid @RequestBody StaffRequest req) {
        return ApiResponse.ok(staffService.update(id, req), "Staff updated");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        staffService.delete(id);
        return ApiResponse.ok(null, "Staff deleted");
    }
}
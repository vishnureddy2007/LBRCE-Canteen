package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.AnnouncementRequest;
import com.lbrce.canteen.dto.AnnouncementResponse;
import com.lbrce.canteen.security.AuthPrincipal;
import com.lbrce.canteen.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<List<AnnouncementResponse>> active() {
        return ApiResponse.ok(announcementService.active());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AnnouncementResponse>> create(@Valid @RequestBody AnnouncementRequest req,
                                                                    Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(announcementService.create(req, p.id()), "Announcement created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AnnouncementResponse> update(@PathVariable Long id, @Valid @RequestBody AnnouncementRequest req) {
        return ApiResponse.ok(announcementService.update(id, req), "Announcement updated");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ApiResponse.ok(null, "Announcement deleted");
    }
}
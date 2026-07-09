package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.OrderResponse;
import com.lbrce.canteen.dto.PlaceOrderRequest;
import com.lbrce.canteen.dto.StatusUpdateRequest;
import com.lbrce.canteen.entity.Order;
import com.lbrce.canteen.security.AuthPrincipal;
import com.lbrce.canteen.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** Student places an order from the cart. */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<OrderResponse>> place(@Valid @RequestBody PlaceOrderRequest req,
                                                            Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        OrderResponse created = orderService.placeOrder(p.id(), req);
        return ResponseEntity.status(201).body(ApiResponse.ok(created, "Order placed"));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<Page<OrderResponse>> myOrders(Authentication auth, Pageable pageable) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ApiResponse.ok(orderService.myOrders(p.id(), pageable));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<List<OrderResponse>> queue() {
        return ApiResponse.ok(orderService.queue());
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> get(@PathVariable Long id, Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ApiResponse.ok(orderService.get(id, p.loginId(), p.role()));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<OrderResponse> cancel(@PathVariable Long id,
                                             @RequestParam(required = false) String reason,
                                             Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ApiResponse.ok(orderService.cancel(id, p.loginId(), reason), "Order cancelled");
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<OrderResponse> accept(@PathVariable Long id) {
        return ApiResponse.ok(orderService.accept(id), "Order accepted");
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<OrderResponse> reject(@PathVariable Long id, @RequestParam(required = false) String reason) {
        return ApiResponse.ok(orderService.reject(id, reason), "Order rejected");
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        return ApiResponse.ok(orderService.updateStatus(id, req.status()), "Status updated");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Page<OrderResponse>> search(
            @RequestParam(required = false) Order.Status status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Pageable pageable) {
        return ApiResponse.ok(orderService.search(status, from, to, pageable));
    }
}
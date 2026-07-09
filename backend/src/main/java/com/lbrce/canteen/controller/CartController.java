package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.OrderResponse;
import com.lbrce.canteen.security.AuthPrincipal;
import com.lbrce.canteen.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Cart-specific endpoints. The cart itself lives on the frontend (in
 * localStorage). This controller exists so the backend can expose
 * cart-derived actions like "what's in the user's recent orders that
 * could be reordered", or to provide server-side totals during checkout.
 *
 * <p>Currently provides the current user's order history and order lookup,
 * which the cart page uses to surface "recent orders" alongside the cart.</p>
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final OrderService orderService;

    public CartController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('STUDENT')")
    public ApiResponse<CartSummary> summary(Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        // Return latest 5 orders as a "recent activity" summary.
        var page = orderService.myOrders(p.id(),
                org.springframework.data.domain.PageRequest.of(0, 5));
        return ApiResponse.ok(new CartSummary(page.getContent()));
    }

    public record CartSummary(java.util.List<OrderResponse> recentOrders) {}
}
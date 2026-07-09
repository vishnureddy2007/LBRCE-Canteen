package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.PaymentResponse;
import com.lbrce.canteen.entity.Payment;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.PaymentRepository;
import com.lbrce.canteen.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService paymentService, PaymentRepository paymentRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PaymentResponse> forOrder(@PathVariable Long orderId) {
        Payment p = paymentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        return ApiResponse.ok(new PaymentResponse(
                p.getId(), orderId, p.getMethod().name(), p.getAmount(),
                p.getStatus().name(), p.getTransactionRef(),
                p.getPaidAt() == null ? null : p.getPaidAt().toString()
        ));
    }

    @PostMapping("/order/{orderId}/pay")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public ApiResponse<PaymentResponse> markPaid(@PathVariable Long orderId,
                                                 @RequestParam(required = false) String transactionRef) {
        Payment p = paymentService.markPaid(orderId, transactionRef);
        return ApiResponse.ok(new PaymentResponse(
                p.getId(), orderId, p.getMethod().name(), p.getAmount(),
                p.getStatus().name(), p.getTransactionRef(),
                p.getPaidAt() == null ? null : p.getPaidAt().toString()
        ), "Payment marked paid");
    }
}
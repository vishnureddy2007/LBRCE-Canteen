package com.lbrce.canteen.service;

import com.lbrce.canteen.entity.Order;
import com.lbrce.canteen.entity.OrderItem;
import com.lbrce.canteen.entity.Payment;
import com.lbrce.canteen.entity.Student;
import com.lbrce.canteen.exception.BadRequestException;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.OrderRepository;
import com.lbrce.canteen.repository.PaymentRepository;
import com.lbrce.canteen.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Helpers for working with the {@link Order} lifecycle that don't fit cleanly
 * into {@link OrderService} (e.g. payment records).
 */
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final StudentRepository studentRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          StudentRepository studentRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.studentRepository = studentRepository;
    }

    public Payment createPaymentForOrder(Order order, String method) {
        Payment p = new Payment();
        p.setOrder(order);
        p.setMethod(Payment.Method.valueOf(method == null ? "CASH" : method.toUpperCase()));
        p.setAmount(order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount());
        p.setStatus(Payment.Status.PENDING);
        return paymentRepository.save(p);
    }

    public Payment markPaid(Long orderId, String transactionRef) {
        Payment p = paymentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new NotFoundException("Payment not found for order " + orderId));
        p.setStatus(Payment.Status.PAID);
        p.setTransactionRef(transactionRef);
        p.setPaidAt(Instant.now());
        Order o = p.getOrder();
        o.setPaymentStatus(Order.PaymentStatus.PAID);
        return p;
    }
}
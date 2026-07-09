package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.OrderResponse;
import com.lbrce.canteen.dto.PlaceOrderRequest;
import com.lbrce.canteen.entity.*;
import com.lbrce.canteen.exception.BadRequestException;
import com.lbrce.canteen.exception.ForbiddenException;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.FoodItemRepository;
import com.lbrce.canteen.repository.OrderRepository;
import com.lbrce.canteen.repository.PaymentRepository;
import com.lbrce.canteen.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final FoodItemRepository foodItemRepository;
    private final StudentRepository studentRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final DtoMapper mapper;

    public OrderService(OrderRepository orderRepository,
                        FoodItemRepository foodItemRepository,
                        StudentRepository studentRepository,
                        PaymentService paymentService,
                        PaymentRepository paymentRepository,
                        DtoMapper mapper) {
        this.orderRepository = orderRepository;
        this.foodItemRepository = foodItemRepository;
        this.studentRepository = studentRepository;
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.mapper = mapper;
    }

    @Transactional
    public OrderResponse placeOrder(Long studentId, PlaceOrderRequest req) {
        if (studentId == null) {
            // Defensive: AuthPrincipal.id() should never be null after login,
            // but if it is, return a clear error rather than a confusing NPE.
            throw new ForbiddenException("Unable to resolve current user");
        }
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));

        Order order = new Order();
        order.setStudent(student);
        order.setStatus(Order.Status.PLACED);
        order.setPlacedAt(Instant.now());
        order.setOrderNumber(generateOrderNumber(order.getPlacedAt()));
        order.setPaymentMethod(Order.PaymentMethod.valueOf(
                req.paymentMethod() == null ? "CASH" : req.paymentMethod().toUpperCase()));
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setNotes(req.notes());

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for (var line : req.items()) {
            FoodItem food = foodItemRepository.findById(line.foodId())
                    .orElseThrow(() -> new NotFoundException("Food not found: " + line.foodId()));
            if (!Boolean.TRUE.equals(food.getAvailable())) {
                throw new BadRequestException(food.getName() + " is currently unavailable");
            }
            BigDecimal unitPrice = food.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(line.quantity()));
            total = total.add(subtotal);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setFoodItem(food);
            oi.setFoodName(food.getName());
            oi.setQuantity(line.quantity());
            oi.setUnitPrice(unitPrice);
            oi.setSubtotal(subtotal);
            items.add(oi);
        }
        order.setTotalAmount(total);
        order.setItems(items);
        Order saved = orderRepository.save(order);

        // Always create a payment record (cash pending until staff marks paid; UPI marks paid later).
        paymentService.createPaymentForOrder(saved, saved.getPaymentMethod().name());

        return mapper.toOrder(saved);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> myOrders(Long studentId, Pageable pageable) {
        return orderRepository.findByStudent_IdOrderByPlacedAtDesc(studentId, pageable).map(mapper::toOrder);
    }

    @Transactional(readOnly = true)
    public OrderResponse get(Long id, String principalName, String principalRole) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        // Students can only see their own orders
        if ("STUDENT".equals(principalRole)) {
            Student s = o.getStudent();
            if (s == null || !principalName.equals(s.getRollNumber()) && !principalName.equals(s.getEmail())) {
                throw new ForbiddenException("You can only view your own orders");
            }
        }
        return mapper.toOrder(o);
    }

    @Transactional
    public OrderResponse cancel(Long id, String principalName, String reason) {
        Order o = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        Student s = o.getStudent();
        if (s == null || (!principalName.equals(s.getRollNumber()) && !principalName.equals(s.getEmail()))) {
            throw new ForbiddenException("You can only cancel your own orders");
        }
        if (o.getStatus() != Order.Status.PLACED) {
            throw new BadRequestException("Order can only be cancelled while PLACED. Current: " + o.getStatus());
        }
        o.setStatus(Order.Status.CANCELLED);
        o.setCancelledAt(Instant.now());
        o.setCancelReason(reason == null ? "Cancelled by student" : reason);
        // Mark payment refunded for cancelled orders (matches the schema ENUM
        // which only allows PENDING / PAID / REFUNDED, no FAILED).
        paymentRepository.findByOrder_Id(id).ifPresent(p -> {
            if (p.getStatus() == Payment.Status.PENDING) p.setStatus(Payment.Status.REFUNDED);
        });
        return mapper.toOrder(o);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> queue() {
        return orderRepository.findByStatusInOrderByPlacedAtAsc(List.of(
                Order.Status.PLACED,
                Order.Status.PREPARING,
                Order.Status.READY
        )).stream().map(mapper::toOrder).toList();
    }

    @Transactional
    public OrderResponse accept(Long id) {
        Order o = mustGet(id);
        if (o.getStatus() != Order.Status.PLACED) {
            throw new BadRequestException("Only PLACED orders can be accepted");
        }
        o.setStatus(Order.Status.PREPARING);
        o.setAcceptedAt(Instant.now());
        return mapper.toOrder(o);
    }

    @Transactional
    public OrderResponse reject(Long id, String reason) {
        Order o = mustGet(id);
        if (o.getStatus() != Order.Status.PLACED) {
            throw new BadRequestException("Only PLACED orders can be rejected");
        }
        o.setStatus(Order.Status.CANCELLED);
        o.setCancelledAt(Instant.now());
        o.setCancelReason(reason == null ? "Rejected by canteen" : reason);
        paymentRepository.findByOrder_Id(id).ifPresent(p -> {
            if (p.getStatus() == Payment.Status.PENDING) p.setStatus(Payment.Status.REFUNDED);
        });
        return mapper.toOrder(o);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String newStatus) {
        Order o = mustGet(id);
        Order.Status target;
        try {
            target = Order.Status.valueOf(newStatus.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + newStatus);
        }
        if (!isValidTransition(o.getStatus(), target)) {
            throw new BadRequestException("Cannot transition from " + o.getStatus() + " to " + target);
        }
        Instant now = Instant.now();
        o.setStatus(target);
        switch (target) {
            case PREPARING -> o.setPreparedAt(now);
            case READY    -> o.setReadyAt(now);
            case DELIVERED -> {
                o.setDeliveredAt(now);
                o.setPaymentStatus(Order.PaymentStatus.PAID);
                paymentRepository.findByOrder_Id(id).ifPresent(p -> {
                    p.setStatus(Payment.Status.PAID);
                    p.setPaidAt(now);
                });
            }
            default -> {}
        }
        return mapper.toOrder(o);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> search(Order.Status status, Instant from, Instant to, Pageable pageable) {
        return orderRepository.search(status, from, to, pageable).map(mapper::toOrder);
    }

    private Order mustGet(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
    }

    private static boolean isValidTransition(Order.Status from, Order.Status to) {
        if (from == to) return true;
        return switch (from) {
            case PLACED    -> to == Order.Status.PREPARING;
            case PREPARING -> to == Order.Status.READY;
            case READY     -> to == Order.Status.DELIVERED;
            default -> false;
        };
    }

    /**
     * Generates an order number like {@code ORD-20260701-0001}. The sequence
     * resets each day based on the count of orders already placed today.
     */
    private String generateOrderNumber(Instant placedAt) {
        LocalDate day = placedAt.atZone(ZoneId.of("Asia/Kolkata")).toLocalDate();
        Instant from = day.atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();
        Instant to   = day.plusDays(1).atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();
        long seq = orderRepository.countByPlacedAtGreaterThanEqualAndPlacedAtLessThan(from, to) + 1L;
        String date = day.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("ORD-%s-%04d", date, seq);
    }
}

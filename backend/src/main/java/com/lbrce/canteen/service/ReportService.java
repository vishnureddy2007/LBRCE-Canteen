package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.SalesReport;
import com.lbrce.canteen.dto.SalesBucket;
import com.lbrce.canteen.dto.TopItemReport;
import com.lbrce.canteen.entity.Order;
import com.lbrce.canteen.repository.OrderRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final OrderRepository orderRepository;

    public ReportService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public SalesReport sales(String period) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate start;
        switch (period == null ? "daily" : period.toLowerCase()) {
            case "weekly"  -> { start = today.minusDays(6); }
            case "monthly" -> { start = today.minusDays(29); }
            default        -> { start = today; }
        }
        Instant from = start.atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();
        Instant to   = today.plusDays(1).atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();

        List<Object[]> rows = orderRepository.dailyRevenue(from, to, Order.Status.CANCELLED);
        List<SalesBucket> buckets = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        long totalOrders = 0L;
        for (Object[] r : rows) {
            LocalDate d = ((Date) r[0]).toLocalDate();
            BigDecimal rev = (BigDecimal) r[1];
            Long count = ((Number) r[2]).longValue();
            buckets.add(new SalesBucket(d, rev, count));
            total = total.add(rev == null ? BigDecimal.ZERO : rev);
            totalOrders += count;
        }
        return new SalesReport(period == null ? "daily" : period, total, totalOrders, buckets);
    }

    @Transactional(readOnly = true)
    public List<TopItemReport> topItems(String period, int limit) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate start = switch (period == null ? "daily" : period.toLowerCase()) {
            case "weekly"  -> today.minusDays(6);
            case "monthly" -> today.minusDays(29);
            default        -> today.minusDays(6); // sensible default
        };
        Instant from = start.atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();
        Instant to   = today.plusDays(1).atStartOfDay(ZoneId.of("Asia/Kolkata")).toInstant();

        List<Object[]> rows = orderRepository.topItems(from, to, PageRequest.of(0, Math.max(1, limit)), Order.Status.CANCELLED);
        List<TopItemReport> out = new ArrayList<>();
        for (Object[] r : rows) {
            String name = (String) r[0];
            Long qty = ((Number) r[1]).longValue();
            BigDecimal rev = (BigDecimal) r[2];
            out.add(new TopItemReport(name, qty, rev));
        }
        return out;
    }
}
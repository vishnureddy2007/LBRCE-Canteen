package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/** {@code /api/reports/sales?period=daily|weekly|monthly} response. */
public record SalesReport(String period, BigDecimal totalRevenue, Long totalOrders,
                          List<SalesBucket> buckets) {}
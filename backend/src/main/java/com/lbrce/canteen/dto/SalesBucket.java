package com.lbrce.canteen.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Chart-friendly bucket used by the sales reports. */
public record SalesBucket(LocalDate date, BigDecimal revenue, Long orderCount) {}
package com.lbrce.canteen.dto;

import java.math.BigDecimal;

/** One row in the top-selling items report. */
public record TopItemReport(String foodName, Long quantitySold, BigDecimal revenue) {}
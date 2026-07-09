package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.SalesReport;
import com.lbrce.canteen.dto.TopItemReport;
import com.lbrce.canteen.service.ReportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/sales")
    public ApiResponse<SalesReport> sales(@RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.ok(reportService.sales(period));
    }

    @GetMapping("/top-items")
    public ApiResponse<List<TopItemReport>> topItems(@RequestParam(defaultValue = "weekly") String period,
                                                     @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok(reportService.topItems(period, limit));
    }
}
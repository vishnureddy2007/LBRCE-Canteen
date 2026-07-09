package com.lbrce.canteen.controller;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.FileUploadResponse;
import com.lbrce.canteen.service.FileUploadService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<FileUploadResponse> upload(@RequestParam("file") MultipartFile file) throws IOException {
        var stored = fileUploadService.save(file);
        return ApiResponse.ok(new FileUploadResponse(stored.url(), stored.filename(), stored.size(), stored.contentType()),
                "File uploaded");
    }
}
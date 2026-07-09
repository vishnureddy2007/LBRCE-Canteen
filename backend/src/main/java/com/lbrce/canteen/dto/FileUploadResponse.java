package com.lbrce.canteen.dto;

/** Returned from {@code POST /api/files}. */
public record FileUploadResponse(String url, String filename, long size, String contentType) {}
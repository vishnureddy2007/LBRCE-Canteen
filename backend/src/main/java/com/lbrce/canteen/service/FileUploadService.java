package com.lbrce.canteen.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

/**
 * Handles food image uploads. Supports uploading to Cloudinary (for stateless cloud scaling)
 * and falls back to local folder storage for easy local development.
 */
@Service
public class FileUploadService {

    private static final Logger log = LoggerFactory.getLogger(FileUploadService.class);
    private static final Set<String> ALLOWED = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"
    );
    private static final long MAX_BYTES = 5L * 1024 * 1024;

    @Value("${app.upload.dir:src/main/resources/static/uploads}")
    private String uploadDir;

    @Value("${cloudinary.cloud-name:}")
    private String cloudinaryCloudName;

    @Value("${cloudinary.api-key:}")
    private String cloudinaryApiKey;

    @Value("${cloudinary.api-secret:}")
    private String cloudinaryApiSecret;

    private com.cloudinary.Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        if (cloudinaryCloudName != null && !cloudinaryCloudName.trim().isEmpty()) {
            cloudinary = new com.cloudinary.Cloudinary(com.cloudinary.utils.ObjectUtils.asMap(
                "cloud_name", cloudinaryCloudName.trim(),
                "api_key", cloudinaryApiKey.trim(),
                "api_secret", cloudinaryApiSecret.trim(),
                "secure", true
            ));
            log.info("Initialized Cloudinary for production/cloud file uploads.");
        } else {
            log.info("No Cloudinary credentials found. Files will be saved locally to: {}", uploadDir);
        }
    }

    public StoredFile save(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("File exceeds 5 MB limit");
        }
        String ct = file.getContentType();
        if (ct == null || !ALLOWED.contains(ct)) {
            throw new IllegalArgumentException("Unsupported image type: " + ct);
        }

        if (cloudinary != null) {
            @SuppressWarnings("rawtypes")
            java.util.Map uploadResult = cloudinary.uploader().upload(file.getBytes(), com.cloudinary.utils.ObjectUtils.asMap(
                "folder", "lbrce_canteen"
            ));
            String url = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            log.info("Uploaded image to Cloudinary successfully. Public ID: {}, URL: {}", publicId, url);
            return new StoredFile(url, publicId, file.getSize(), ct);
        } else {
            String original = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
            String ext = original.contains(".")
                    ? original.substring(original.lastIndexOf('.') + 1)
                    : "png";
            String name = UUID.randomUUID().toString().replace("-", "") + "." + ext;

            Path target = Paths.get(uploadDir, name);
            Files.createDirectories(target.getParent());
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            log.info("Saved upload locally: {} -> {} ({} bytes)", original, target, file.getSize());
            return new StoredFile("/uploads/" + name, name, file.getSize(), ct);
        }
    }

    public record StoredFile(String url, String filename, long size, String contentType) {}
}
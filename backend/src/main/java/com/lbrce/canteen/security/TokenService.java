package com.lbrce.canteen.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * High-performance, cryptographically signed token service for cross-domain and
 * stateless authentication.
 *
 * <p>Produces tamper-proof URL-safe tokens with HMAC-SHA256 signatures that survive
 * server cold-starts, pod restarts, and third-party cookie restrictions across
 * Vercel and Render deployments.</p>
 */
@Service
public class TokenService {

    // 7 days token expiration in milliseconds
    private static final long DEFAULT_EXPIRY_MS = 7L * 24 * 60 * 60 * 1000;

    @Value("${app.token.secret:LBRCE-Canteen-Management-Secure-HMAC-Token-Key-2026!}")
    private String secretKey;

    // In-memory cache for fast lookup and session ID compatibility
    private final ConcurrentMap<String, TokenPayload> tokenCache = new ConcurrentHashMap<>();

    public record TokenPayload(String username, String role, Long userId, long expiresAt) {
        public boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }

    /**
     * Generates a signed, URL-safe token containing user identity and expiration.
     */
    public String generateToken(String username, String role, Long userId) {
        long exp = System.currentTimeMillis() + DEFAULT_EXPIRY_MS;
        String data = username + ":" + role + ":" + (userId != null ? userId : 0L) + ":" + exp;
        String encodedData = Base64.getUrlEncoder().withoutPadding().encodeToString(data.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedData);
        String token = encodedData + "." + signature;

        TokenPayload payload = new TokenPayload(username, role, userId, exp);
        tokenCache.put(token, payload);
        return token;
    }

    /**
     * Registers a session ID to map to the user identity for hybrid session support.
     */
    public void registerSessionToken(String sessionId, String username, String role, Long userId) {
        if (sessionId != null && !sessionId.isBlank()) {
            tokenCache.put(sessionId, new TokenPayload(username, role, userId, System.currentTimeMillis() + DEFAULT_EXPIRY_MS));
        }
    }

    /**
     * Validates and extracts the user identity from a signed token or registered session token.
     */
    public TokenPayload parseAndValidate(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }

        // 1. Check cache first
        TokenPayload cached = tokenCache.get(token);
        if (cached != null) {
            if (cached.isExpired()) {
                tokenCache.remove(token);
                return null;
            }
            return cached;
        }

        // 2. Validate signed token structure: <encodedData>.<signature>
        int dot = token.lastIndexOf('.');
        if (dot <= 0 || dot >= token.length() - 1) {
            return null;
        }

        String encodedData = token.substring(0, dot);
        String signature = token.substring(dot + 1);

        String expectedSignature = sign(encodedData);
        if (!MessageDigest.isEqual(signature.getBytes(StandardCharsets.UTF_8),
                expectedSignature.getBytes(StandardCharsets.UTF_8))) {
            return null;
        }

        try {
            String decoded = new String(Base64.getUrlDecoder().decode(encodedData), StandardCharsets.UTF_8);
            String[] parts = decoded.split(":");
            if (parts.length < 4) {
                return null;
            }
            String username = parts[0];
            String role = parts[1];
            Long userId = Long.parseLong(parts[2]);
            long exp = Long.parseLong(parts[3]);

            if (System.currentTimeMillis() > exp) {
                return null;
            }

            TokenPayload payload = new TokenPayload(username, role, userId, exp);
            tokenCache.put(token, payload);
            return payload;
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error computing token signature", e);
        }
    }
}

package com.lbrce.canteen.security;

import com.lbrce.canteen.dto.ApiResponse;
import com.lbrce.canteen.dto.LoginRequest;
import com.lbrce.canteen.dto.SignupRequest;
import com.lbrce.canteen.dto.AuthResponse;
import com.lbrce.canteen.security.AuthPrincipal;
import com.lbrce.canteen.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest req) {
        return ResponseEntity.status(201).body(ApiResponse.ok(authService.signup(req), "Account created"));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest req,
                                          HttpServletRequest httpRequest) {
        return ApiResponse.ok(authService.login(req, httpRequest), "Login successful");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<AuthResponse> me(Authentication auth) {
        AuthPrincipal p = AuthPrincipal.from(auth);
        return ApiResponse.ok(authService.resolveCurrentUser(p.loginId()));
    }

    /** Logout is wired in {@code SecurityConfig} — this is the success body. */
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok(null, "Logged out");
    }
}
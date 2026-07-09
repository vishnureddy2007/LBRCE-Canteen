package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.AuthResponse;
import com.lbrce.canteen.dto.LoginRequest;
import com.lbrce.canteen.dto.SignupRequest;
import com.lbrce.canteen.entity.*;
import com.lbrce.canteen.exception.BadRequestException;
import com.lbrce.canteen.exception.ConflictException;
import com.lbrce.canteen.repository.AdminRepository;
import com.lbrce.canteen.repository.StaffRepository;
import com.lbrce.canteen.repository.StudentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Authentication and signup.
 *
 * <p>Login uses Spring Security's {@link AuthenticationManager} but is exposed
 * as a JSON endpoint so the SPA doesn't need to post form data. We also bind
 * the {@code Authentication} to the {@link HttpSession} so subsequent calls
 * are authenticated.</p>
 */
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       StudentRepository studentRepository,
                       StaffRepository staffRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (req.rollNumber() == null || req.rollNumber().isBlank()
                || req.email() == null || req.password() == null || req.password().length() < 6) {
            throw new BadRequestException("Roll number, email and password (min 6 chars) are required");
        }
        if (studentRepository.existsByRollNumber(req.rollNumber())) {
            throw new ConflictException("Roll number already registered");
        }
        if (studentRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already registered");
        }
        Student s = new Student();
        s.setRollNumber(req.rollNumber());
        s.setEmail(req.email());
        s.setPasswordHash(passwordEncoder.encode(req.password()));
        s.setFullName(req.fullName());
        s.setPhone(req.phone());
        s.setDepartment(req.department());
        s.setYearOfStudy(req.yearOfStudy());
        studentRepository.save(s);
        return new AuthResponse(s.getId(), s.getRollNumber(), s.getFullName(), s.getEmail(), "STUDENT");
    }

    public AuthResponse login(LoginRequest req, HttpServletRequest httpRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );

        // Bind to session so subsequent requests carry the auth.
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", context);

        return resolveCurrentUser(auth.getName());
    }

    public AuthResponse resolveCurrentUser(String loginId) {
        Optional<Admin> a = adminRepository.findByUsernameOrEmail(loginId, loginId);
        if (a.isPresent()) {
            Admin admin = a.get();
            return new AuthResponse(admin.getId(), admin.getUsername(), admin.getFullName(), admin.getEmail(), "ADMIN");
        }
        Optional<Staff> s = staffRepository.findByEmployeeIdOrEmail(loginId, loginId);
        if (s.isPresent()) {
            Staff st = s.get();
            return new AuthResponse(st.getId(), st.getEmployeeId(), st.getFullName(), st.getEmail(), "STAFF");
        }
        Optional<Student> st = studentRepository.findByRollNumberOrEmail(loginId, loginId);
        if (st.isPresent()) {
            Student student = st.get();
            return new AuthResponse(student.getId(), student.getRollNumber(), student.getFullName(), student.getEmail(), "STUDENT");
        }
        throw new BadRequestException("Authenticated user not found: " + loginId);
    }
}
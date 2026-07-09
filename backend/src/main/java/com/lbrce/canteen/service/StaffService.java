package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.StaffRequest;
import com.lbrce.canteen.dto.StaffResponse;
import com.lbrce.canteen.entity.Staff;
import com.lbrce.canteen.exception.ConflictException;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.StaffRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper mapper;

    public StaffService(StaffRepository staffRepository, PasswordEncoder passwordEncoder, DtoMapper mapper) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<StaffResponse> list(String q, Pageable pageable) {
        return staffRepository.findAll(pageable).map(mapper::toStaff);
    }

    @Transactional
    public StaffResponse create(StaffRequest req) {
        if (staffRepository.existsByEmployeeId(req.employeeId())) {
            throw new ConflictException("Employee ID already exists");
        }
        if (staffRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already exists");
        }
        if (req.password() == null || req.password().length() < 6) {
            throw new ConflictException("Password must be at least 6 characters");
        }
        Staff s = new Staff();
        s.setEmployeeId(req.employeeId());
        s.setEmail(req.email());
        s.setPasswordHash(passwordEncoder.encode(req.password()));
        s.setFullName(req.fullName());
        s.setPhone(req.phone());
        s.setShift(req.shift());
        return mapper.toStaff(staffRepository.save(s));
    }

    @Transactional
    public StaffResponse update(Long id, StaffRequest req) {
        Staff s = staffRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Staff not found: " + id));
        s.setEmail(req.email());
        if (req.password() != null && !req.password().isBlank()) {
            s.setPasswordHash(passwordEncoder.encode(req.password()));
        }
        s.setFullName(req.fullName());
        s.setPhone(req.phone());
        s.setShift(req.shift());
        return mapper.toStaff(s);
    }

    @Transactional
    public void delete(Long id) {
        if (!staffRepository.existsById(id)) throw new NotFoundException("Staff not found: " + id);
        staffRepository.deleteById(id);
    }
}
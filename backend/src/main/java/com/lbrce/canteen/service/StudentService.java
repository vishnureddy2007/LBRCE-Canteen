package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.StudentRequest;
import com.lbrce.canteen.dto.StudentResponse;
import com.lbrce.canteen.entity.Student;
import com.lbrce.canteen.exception.ConflictException;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final DtoMapper mapper;

    public StudentService(StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          DtoMapper mapper) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> list(String q, Pageable pageable) {
        if (q == null || q.isBlank()) return studentRepository.findAll(pageable).map(mapper::toStudent);
        String needle = q.toLowerCase();
        return studentRepository.findAll(pageable)
                .map(mapper::toStudent)
                .map(s -> (s.fullName() != null && s.fullName().toLowerCase().contains(needle))
                        || (s.rollNumber() != null && s.rollNumber().toLowerCase().contains(needle))
                        || (s.email() != null && s.email().toLowerCase().contains(needle))
                        ? s : null);
    }

    @Transactional
    public StudentResponse create(StudentRequest req) {
        if (studentRepository.existsByRollNumber(req.rollNumber())) {
            throw new ConflictException("Roll number already exists");
        }
        if (studentRepository.existsByEmail(req.email())) {
            throw new ConflictException("Email already exists");
        }
        Student s = new Student();
        applyTo(s, req, true);
        return mapper.toStudent(studentRepository.save(s));
    }

    @Transactional
    public StudentResponse update(Long id, StudentRequest req) {
        Student s = studentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Student not found: " + id));
        applyTo(s, req, false);
        return mapper.toStudent(s);
    }

    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) throw new NotFoundException("Student not found: " + id);
        studentRepository.deleteById(id);
    }

    private void applyTo(Student s, StudentRequest req, boolean creating) {
        s.setRollNumber(req.rollNumber());
        s.setEmail(req.email());
        if (req.password() != null && !req.password().isBlank()) {
            s.setPasswordHash(passwordEncoder.encode(req.password()));
        } else if (creating) {
            throw new ConflictException("Password is required when creating a student");
        }
        s.setFullName(req.fullName());
        s.setPhone(req.phone());
        s.setDepartment(req.department());
        s.setYearOfStudy(req.yearOfStudy());
    }
}
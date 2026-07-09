package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    Optional<Student> findByRollNumberOrEmail(String rollNumber, String email);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    List<Student> findByDepartmentIgnoreCase(String department);
}

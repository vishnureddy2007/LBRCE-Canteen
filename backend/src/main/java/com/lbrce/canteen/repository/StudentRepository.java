package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("""
           SELECT s FROM Student s
           WHERE :q IS NULL OR :q = ''
              OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.department) LIKE LOWER(CONCAT('%', :q, '%'))
           ORDER BY s.createdAt DESC
           """)
    Page<Student> search(@Param("q") String q, Pageable pageable);
}

package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmployeeId(String employeeId);
    Optional<Staff> findByEmail(String email);
    Optional<Staff> findByEmployeeIdOrEmail(String employeeId, String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    List<Staff> findByShiftIgnoreCase(String shift);

    @Query("""
           SELECT s FROM Staff s
           WHERE :q IS NULL OR :q = ''
              OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.employeeId) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))
              OR LOWER(s.shift) LIKE LOWER(CONCAT('%', :q, '%'))
           ORDER BY s.createdAt DESC
           """)
    Page<Staff> search(@Param("q") String q, Pageable pageable);
}

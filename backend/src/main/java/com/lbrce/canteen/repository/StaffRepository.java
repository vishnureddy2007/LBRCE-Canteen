package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

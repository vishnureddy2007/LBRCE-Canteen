package com.lbrce.canteen.security;

import com.lbrce.canteen.entity.Admin;
import com.lbrce.canteen.entity.Staff;
import com.lbrce.canteen.entity.Student;
import com.lbrce.canteen.repository.AdminRepository;
import com.lbrce.canteen.repository.StaffRepository;
import com.lbrce.canteen.repository.StudentRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Loads a user by "username" from the appropriate table. Login IDs per role:
 *
 * <ul>
 *   <li>Students &rarr; roll number (e.g. {@code 21A91A0501})</li>
 *   <li>Staff    &rarr; employee id (e.g. {@code EMP001})</li>
 *   <li>Admins   &rarr; username or email (e.g. {@code admin@lbrce.edu})</li>
 * </ul>
 *
 * The returned {@link LbrceUserDetails} carries the underlying user id and
 * role so controllers can resolve {@link AuthPrincipal#id()} without an
 * extra database round-trip.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(StudentRepository studentRepository,
                                    StaffRepository staffRepository,
                                    AdminRepository adminRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Admins first (most common login during dev), then staff, then students.
        Optional<Admin> admin = adminRepository.findByUsernameOrEmail(username, username);
        if (admin.isPresent()) {
            Admin a = admin.get();
            return toUserDetails(a.getUsername(), a.getPasswordHash(), "ADMIN", a.getId());
        }

        Optional<Staff> staff = staffRepository.findByEmployeeIdOrEmail(username, username);
        if (staff.isPresent()) {
            Staff s = staff.get();
            return toUserDetails(s.getEmployeeId(), s.getPasswordHash(), "STAFF", s.getId());
        }

        Optional<Student> student = studentRepository.findByRollNumberOrEmail(username, username);
        if (student.isPresent()) {
            Student s = student.get();
            return toUserDetails(s.getRollNumber(), s.getPasswordHash(), "STUDENT", s.getId());
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }

    private static UserDetails toUserDetails(String loginId, String passwordHash, String role, Long userId) {
        return new LbrceUserDetails(
                loginId,
                passwordHash,
                List.of(new SimpleGrantedAuthority("ROLE_" + role)),
                userId,
                role);
    }
}

package com.lbrce.canteen;

import com.lbrce.canteen.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "SPRING_DATASOURCE_URL", matches = ".*tidbcloud.*")
public class TidbSpringBootContextTest {

    @Autowired private AdminRepository adminRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private FoodItemRepository foodItemRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OfferRepository offerRepository;
    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private FoodImageRepository foodImageRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private PaymentRepository paymentRepository;

    @Test
    public void testContextLoadsAndReadsDataFromTidb() {
        System.out.println("=== VERIFYING JPA REPOSITORIES AGAINST TIDB CLOUD ===");

        long adminCount = adminRepository.count();
        long studentCount = studentRepository.count();
        long staffCount = staffRepository.count();
        long categoryCount = categoryRepository.count();
        long foodCount = foodItemRepository.count();
        long orderCount = orderRepository.count();
        long offerCount = offerRepository.count();
        long announcementCount = announcementRepository.count();
        long feedbackCount = feedbackRepository.count();
        long foodImageCount = foodImageRepository.count();
        long orderItemCount = orderItemRepository.count();
        long paymentCount = paymentRepository.count();

        System.out.println("Admins: " + adminCount);
        System.out.println("Students: " + studentCount);
        System.out.println("Staff: " + staffCount);
        System.out.println("Categories: " + categoryCount);
        System.out.println("Food items: " + foodCount);
        System.out.println("Orders: " + orderCount);
        System.out.println("Offers: " + offerCount);
        System.out.println("Announcements: " + announcementCount);
        System.out.println("Feedback: " + feedbackCount);
        System.out.println("Food Images: " + foodImageCount);
        System.out.println("Order Items: " + orderItemCount);
        System.out.println("Payments: " + paymentCount);

        assertEquals(2, adminCount, "Admins count should match");
        assertEquals(5, studentCount, "Students count should match");
        assertEquals(1, staffCount, "Staff count should match");
        assertEquals(5, categoryCount, "Categories count should match");
        assertEquals(18, foodCount, "Food items count should match");
        assertEquals(7, orderCount, "Orders count should match");
        assertEquals(2, offerCount, "Offers count should match");

        // Verify read-only repository queries on existing data
        var firstAdmin = adminRepository.findAll().get(0);
        assertNotNull(firstAdmin.getUsername());
        System.out.println("Verified existing Admin username: " + firstAdmin.getUsername());

        var firstStaff = staffRepository.findAll().get(0);
        assertNotNull(firstStaff.getEmployeeId());
        System.out.println("Verified existing Staff empId: " + firstStaff.getEmployeeId());

        var firstStudent = studentRepository.findAll().get(0);
        assertNotNull(firstStudent.getRollNumber());
        System.out.println("Verified existing Student rollNumber: " + firstStudent.getRollNumber());

        System.out.println("[SUCCESS] All repository read queries and existing entity lookups executed cleanly with ddl-auto=validate!");
    }
}

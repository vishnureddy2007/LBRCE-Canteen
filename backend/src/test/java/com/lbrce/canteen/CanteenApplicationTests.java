package com.lbrce.canteen;

import com.lbrce.canteen.dto.FoodResponse;
import com.lbrce.canteen.entity.FoodItem;
import com.lbrce.canteen.service.DtoMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.lbrce.canteen.entity.*;
import com.lbrce.canteen.repository.*;
import com.lbrce.canteen.security.TokenService;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CanteenApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DtoMapper dtoMapper;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Context loads cleanly")
    void contextLoads() {
        assertNotNull(mockMvc);
        assertNotNull(dtoMapper);
    }

    @Test
    @DisplayName("Health endpoint is public and responds UP")
    void healthEndpointIsPublicAndUp() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    @Test
    @DisplayName("Public endpoints accessible without credentials (categories, foods, food)")
    void publicEndpointsAccessible() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/foods"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Offers and announcements accessible to authenticated users (e.g. STUDENT)")
    void authenticatedUserCanAccessOffersAndAnnouncements() throws Exception {
        mockMvc.perform(get("/api/offers")
                .with(SecurityMockMvcRequestPostProcessors.user("student1").roles("STUDENT")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/announcements")
                .with(SecurityMockMvcRequestPostProcessors.user("student1").roles("STUDENT")))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Staff endpoints return 401 when unauthenticated")
    void staffEndpointUnauthenticatedReturns401() throws Exception {
        mockMvc.perform(get("/api/staff"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Staff endpoints return 403 Forbidden for STUDENT role")
    void staffEndpointForbiddenForStudentReturns403() throws Exception {
        mockMvc.perform(get("/api/staff")
                .with(SecurityMockMvcRequestPostProcessors.user("student1").roles("STUDENT")))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Staff endpoints return 200 OK for ADMIN role")
    void staffEndpointAccessibleByAdmin() throws Exception {
        mockMvc.perform(get("/api/staff")
                .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Admin dashboard endpoint returns 403 Forbidden for STAFF role")
    void adminEndpointForbiddenForStaffReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                .with(SecurityMockMvcRequestPostProcessors.user("staff1").roles("STAFF")))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin dashboard endpoint returns 403 Forbidden for STUDENT role")
    void adminEndpointForbiddenForStudentReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                .with(SecurityMockMvcRequestPostProcessors.user("student1").roles("STUDENT")))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Unauthenticated order placement returns 401 Unauthorized")
    void unauthenticatedOrderPlacementReturns401() throws Exception {
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"paymentMethod\":\"CASH\",\"items\":[{\"foodId\":1,\"quantity\":1}]}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Stateless signed token authenticates requests without session cookies")
    void statelessSignedTokenAuthenticatesRequest() throws Exception {
        Student s = new Student();
        s.setRollNumber("TEST_ROLL_101");
        s.setEmail("test101@lbrce.ac.in");
        s.setPasswordHash(passwordEncoder.encode("Password@123"));
        s.setFullName("Test Student 101");
        Student saved = studentRepository.save(s);

        String token = tokenService.generateToken(saved.getRollNumber(), "STUDENT", saved.getId());

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("TEST_ROLL_101"))
                .andExpect(jsonPath("$.data.role").value("STUDENT"));
    }

    @Test
    @DisplayName("Student can place order end-to-end with Bearer/X-Auth-Token header and accurate server total")
    void studentPlacesOrderWithTokenHeaderEndToEnd() throws Exception {
        Category cat = new Category();
        cat.setName("Test Category");
        cat.setDisplayOrder(1);
        cat.setActive(true);
        Category savedCat = categoryRepository.save(cat);

        FoodItem food = new FoodItem();
        food.setName("Test Dosa");
        food.setCategory(savedCat);
        food.setPrice(BigDecimal.valueOf(45.00));
        food.setAvailable(true);
        FoodItem savedFood = foodItemRepository.save(food);

        Student s = new Student();
        s.setRollNumber("TEST_ROLL_102");
        s.setEmail("test102@lbrce.ac.in");
        s.setPasswordHash(passwordEncoder.encode("Password@123"));
        s.setFullName("Test Student 102");
        Student savedStudent = studentRepository.save(s);

        String token = tokenService.generateToken(savedStudent.getRollNumber(), "STUDENT", savedStudent.getId());

        String orderPayload = """
            {
                "paymentMethod": "CASH",
                "notes": "Crispy please",
                "items": [
                    { "foodId": %d, "quantity": 2 }
                ]
            }
        """.formatted(savedFood.getId());

        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .header("X-Auth-Token", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.studentRoll").value("TEST_ROLL_102"))
                .andExpect(jsonPath("$.data.totalAmount").value(90.00))
                .andExpect(jsonPath("$.data.status").value("PLACED"))
                .andExpect(jsonPath("$.data.items[0].foodName").value("Test Dosa"))
                .andExpect(jsonPath("$.data.items[0].quantity").value(2))
                .andExpect(jsonPath("$.data.items[0].unitPrice").value(45.00))
                .andExpect(jsonPath("$.data.items[0].subtotal").value(90.00));
    }

    @Test
    @DisplayName("Duplicate order submission returns existing order and prevents duplicates")
    void duplicateOrderSubmissionProtection() throws Exception {
        Category cat = categoryRepository.findAll().stream().findFirst().orElseGet(() -> {
            Category c = new Category();
            c.setName("Breakfast");
            c.setDisplayOrder(1);
            c.setActive(true);
            return categoryRepository.save(c);
        });

        FoodItem food = new FoodItem();
        food.setName("Idli Test Dup");
        food.setCategory(cat);
        food.setPrice(BigDecimal.valueOf(30.00));
        food.setAvailable(true);
        FoodItem savedFood = foodItemRepository.save(food);

        Student s = new Student();
        s.setRollNumber("TEST_ROLL_103");
        s.setEmail("test103@lbrce.ac.in");
        s.setPasswordHash(passwordEncoder.encode("Password@123"));
        s.setFullName("Test Student 103");
        Student savedStudent = studentRepository.save(s);

        String token = tokenService.generateToken(savedStudent.getRollNumber(), "STUDENT", savedStudent.getId());

        String orderPayload = """
            {
                "paymentMethod": "CASH",
                "items": [
                    { "foodId": %d, "quantity": 1 }
                ]
            }
        """.formatted(savedFood.getId());

        // First submission
        String response1 = mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.orderNumber").exists())
                .andReturn().getResponse().getContentAsString();

        String orderNumber1 = com.jayway.jsonpath.JsonPath.read(response1, "$.data.orderNumber");
        Number orderId1 = com.jayway.jsonpath.JsonPath.read(response1, "$.data.id");

        // Immediate duplicate submission (simulating double click)
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.orderNumber").value(orderNumber1))
                .andExpect(jsonPath("$.data.id").value(orderId1));
    }

    @Test
    @DisplayName("Student cannot view another student's order (returns 403 Forbidden)")
    void studentCannotViewOtherStudentOrder() throws Exception {
        Student s1 = new Student();
        s1.setRollNumber("STUDENT_OWNER");
        s1.setEmail("owner@lbrce.ac.in");
        s1.setPasswordHash(passwordEncoder.encode("Password@123"));
        Student savedOwner = studentRepository.save(s1);

        Student s2 = new Student();
        s2.setRollNumber("STUDENT_ATTACKER");
        s2.setEmail("attacker@lbrce.ac.in");
        s2.setPasswordHash(passwordEncoder.encode("Password@123"));
        Student savedAttacker = studentRepository.save(s2);

        Order order = new Order();
        order.setStudent(savedOwner);
        order.setStatus(Order.Status.PLACED);
        order.setTotalAmount(BigDecimal.valueOf(50.00));
        order.setPaymentMethod(Order.PaymentMethod.CASH);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setOrderNumber("ORD-OWNER-001");
        Order savedOrder = orderRepository.save(order);

        String attackerToken = tokenService.generateToken(savedAttacker.getRollNumber(), "STUDENT", savedAttacker.getId());

        mockMvc.perform(get("/api/orders/" + savedOrder.getId())
                .header("Authorization", "Bearer " + attackerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Student cannot view another student's payment (returns 403 Forbidden)")
    void studentCannotViewOtherStudentPayment() throws Exception {
        Student s1 = new Student();
        s1.setRollNumber("PAYMENT_OWNER");
        s1.setEmail("payowner@lbrce.ac.in");
        s1.setPasswordHash(passwordEncoder.encode("Password@123"));
        Student savedOwner = studentRepository.save(s1);

        Student s2 = new Student();
        s2.setRollNumber("PAYMENT_ATTACKER");
        s2.setEmail("payattacker@lbrce.ac.in");
        s2.setPasswordHash(passwordEncoder.encode("Password@123"));
        Student savedAttacker = studentRepository.save(s2);

        Order order = new Order();
        order.setStudent(savedOwner);
        order.setStatus(Order.Status.PLACED);
        order.setTotalAmount(BigDecimal.valueOf(50.00));
        order.setPaymentMethod(Order.PaymentMethod.CASH);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setOrderNumber("ORD-PAY-001");
        Order savedOrder = orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setMethod(Payment.Method.CASH);
        payment.setStatus(Payment.Status.PENDING);
        payment.setAmount(BigDecimal.valueOf(50.00));
        paymentRepository.save(payment);

        String attackerToken = tokenService.generateToken(savedAttacker.getRollNumber(), "STUDENT", savedAttacker.getId());

        mockMvc.perform(get("/api/payments/order/" + savedOrder.getId())
                .header("Authorization", "Bearer " + attackerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DtoMapper maps dish names to exact local upload images")
    void dtoMapperMapsDishNamesToUploadImages() {
        FoodItem biryani = new FoodItem();
        biryani.setId(5L);
        biryani.setName("Chicken Biryani");
        biryani.setPrice(BigDecimal.valueOf(120.00));
        biryani.setAvailable(true);

        FoodResponse res1 = dtoMapper.toFood(biryani);
        assertNotNull(res1.images());
        assertFalse(res1.images().isEmpty());
        assertEquals("/uploads/chicken_biryani.png", res1.images().get(0));

        FoodItem idli = new FoodItem();
        idli.setId(1L);
        idli.setName("Idli with Sambar");
        idli.setPrice(BigDecimal.valueOf(30.00));
        idli.setAvailable(true);

        FoodResponse res2 = dtoMapper.toFood(idli);
        assertEquals("/uploads/idli_sambar.png", res2.images().get(0));

        FoodItem maggi = new FoodItem();
        maggi.setId(10L);
        maggi.setName("Masala Maggi");
        maggi.setPrice(BigDecimal.valueOf(35.00));
        maggi.setAvailable(true);

        FoodResponse res3 = dtoMapper.toFood(maggi);
        assertEquals("/uploads/masala_maggi.png", res3.images().get(0));
    }

    @Test
    @DisplayName("DtoMapper falls back cleanly to placeholder_food.png if item unknown")
    void dtoMapperFallbackToPlaceholder() {
        FoodItem unknown = new FoodItem();
        unknown.setId(99L);
        unknown.setName("Exotic Special Item");
        unknown.setPrice(BigDecimal.valueOf(250.00));
        unknown.setAvailable(true);

        FoodResponse res = dtoMapper.toFood(unknown);
        assertNotNull(res.images());
        assertEquals("/uploads/placeholder_food.png", res.images().get(0));
    }
}

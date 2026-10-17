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
    @DisplayName("Session Token header (X-Auth-Token) authenticates protected requests")
    void staffEndpointWithSessionTokenHeaderReturns200() throws Exception {
        MockHttpSession session = new MockHttpSession();
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(
                "admin", "password", List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        ));
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        mockMvc.perform(get("/api/staff")
                .session(session)
                .header("X-Auth-Token", session.getId()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Bearer Token Authorization header authenticates protected requests")
    void staffEndpointWithBearerAuthorizationHeaderReturns200() throws Exception {
        MockHttpSession session = new MockHttpSession();
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(
                "admin", "password", List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        ));
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        mockMvc.perform(get("/api/staff")
                .session(session)
                .header("Authorization", "Bearer " + session.getId()))
                .andExpect(status().isOk());
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

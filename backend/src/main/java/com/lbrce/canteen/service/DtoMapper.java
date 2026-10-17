package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.*;
import com.lbrce.canteen.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Stateless helper that converts JPA entities &rarr; DTOs.
 *
 * <p>Keeping this in one place ensures response shapes stay consistent across
 * controllers and avoids leaking lazy-loaded fields accidentally.</p>
 */
@Component
public class DtoMapper {

    public CategoryResponse toCategory(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDisplayOrder(), c.getActive());
    }

    public List<CategoryResponse> toCategories(List<Category> cs) {
        return cs.stream().map(this::toCategory).collect(Collectors.toList());
    }

    public FoodResponse toFood(FoodItem f) {
        List<String> images = f.getImages() == null ? List.of()
                : f.getImages().stream().map(FoodImage::getImageUrl).collect(Collectors.toList());
        
        // Check if images are empty or contain old Unsplash seed URLs / broken placeholders
        boolean needsResolvedImage = images.isEmpty() || images.stream().anyMatch(url ->
                url.startsWith("https://images.unsplash.com") || url.contains("placeholder-")
        );

        if (needsResolvedImage && f.getName() != null) {
            String name = f.getName().toLowerCase();
            String matchedImage = "/uploads/placeholder_food.png";

            if (name.contains("idli")) {
                matchedImage = "/uploads/idli_sambar.png";
            } else if (name.contains("poori") || name.contains("puri")) {
                matchedImage = "/uploads/poori_curry.png";
            } else if (name.contains("upma")) {
                matchedImage = "/uploads/upma.png";
            } else if (name.contains("chicken biryani")) {
                matchedImage = "/uploads/chicken_biryani.png";
            } else if (name.contains("veg biryani") || name.contains("biryani")) {
                matchedImage = "/uploads/veg_biryani.png";
            } else if (name.contains("chicken fried rice")) {
                matchedImage = "/uploads/chicken_fried_rice.png";
            } else if (name.contains("veg fried rice") || (name.contains("fried") && name.contains("rice"))) {
                matchedImage = "/uploads/veg_fried_rice.png";
            } else if (name.contains("chicken manchuria")) {
                matchedImage = "/uploads/chicken_manchuria.png";
            } else if (name.contains("veg manchuria") || name.contains("manchuria")) {
                matchedImage = "/uploads/veg_manchuria.png";
            } else if (name.contains("chicken noodles")) {
                matchedImage = "/uploads/chicken_noodles.png";
            } else if (name.contains("veg noodles") || name.contains("noodles") || name.contains("maggi")) {
                matchedImage = "/uploads/veg_noodles.png";
            } else if (name.contains("egg puff") || name.contains("puff")) {
                matchedImage = "/uploads/egg_puff.png";
            } else if (name.contains("meals") || name.contains("thali")) {
                matchedImage = "/uploads/meals_thali.png";
            } else if (name.contains("samosa")) {
                matchedImage = "/uploads/samosa.png";
            } else if (name.contains("vada pav") || name.contains("vadapav")) {
                matchedImage = "/uploads/vada_pav.png";
            } else if (name.contains("coffee")) {
                matchedImage = "/uploads/filter_coffee.png";
            } else if (name.contains("tea") || name.contains("chai")) {
                matchedImage = "/uploads/masala_chai.png";
            } else if (name.contains("lime soda") || name.contains("lemon") || name.contains("soda")) {
                matchedImage = "/uploads/fresh_lime_soda.png";
            } else if (name.contains("lassi")) {
                matchedImage = "/uploads/mango_lassi.png";
            }
            images = List.of(matchedImage);
        }
        return new FoodResponse(
                f.getId(),
                f.getName(),
                f.getDescription(),
                f.getPrice(),
                f.getCategory() == null ? null : toCategory(f.getCategory()),
                f.getAvailable(),
                f.getRatingAvg(),
                f.getRatingCount(),
                images,
                f.getUpdatedAt()
        );
    }

    public List<FoodResponse> toFoods(List<FoodItem> items) {
        return items.stream().map(this::toFood).collect(Collectors.toList());
    }

    public OrderItemResponse toOrderItem(OrderItem oi) {
        FoodItem f = oi.getFoodItem();
        return new OrderItemResponse(
                oi.getId(),
                f == null ? null : f.getId(),
                oi.getFoodName(),
                oi.getQuantity(),
                oi.getUnitPrice(),
                oi.getSubtotal()
        );
    }

    public OrderResponse toOrder(Order o) {
        Student s = o.getStudent();
        List<OrderItemResponse> items = o.getItems() == null ? List.of()
                : o.getItems().stream().map(this::toOrderItem).collect(Collectors.toList());
        return new OrderResponse(
                o.getId(),
                o.getOrderNumber(),
                s == null ? null : s.getId(),
                s == null ? null : s.getFullName(),
                s == null ? null : s.getRollNumber(),
                o.getStatus().name(),
                o.getTotalAmount(),
                o.getPaymentMethod().name(),
                o.getPaymentStatus().name(),
                o.getPlacedAt(),
                o.getAcceptedAt(),
                o.getPreparedAt(),
                o.getReadyAt(),
                o.getDeliveredAt(),
                o.getCancelledAt(),
                o.getCancelReason(),
                o.getNotes(),
                items
        );
    }

    public StudentResponse toStudent(Student s) {
        return new StudentResponse(s.getId(), s.getRollNumber(), s.getEmail(), s.getFullName(),
                s.getPhone(), s.getDepartment(), s.getYearOfStudy(), s.getCreatedAt());
    }

    public StaffResponse toStaff(Staff s) {
        return new StaffResponse(s.getId(), s.getEmployeeId(), s.getEmail(), s.getFullName(),
                s.getPhone(), s.getShift(), s.getCreatedAt());
    }

    public FeedbackResponse toFeedback(Feedback fb) {
        Student s = fb.getStudent();
        FoodItem f = fb.getFoodItem();
        Order o = fb.getOrder();
        return new FeedbackResponse(
                fb.getId(),
                s == null ? null : s.getId(),
                s == null ? null : s.getFullName(),
                o == null ? null : o.getId(),
                f == null ? null : f.getId(),
                f == null ? null : f.getName(),
                fb.getRating(),
                fb.getComment(),
                fb.getCreatedAt()
        );
    }

    public OfferResponse toOffer(Offer o) {
        return new OfferResponse(o.getId(), o.getTitle(), o.getDescription(), o.getDiscountPercent(),
                o.getActive(), o.getValidFrom(), o.getValidTo());
    }

    public AnnouncementResponse toAnnouncement(Announcement a) {
        Admin by = a.getCreatedBy();
        return new AnnouncementResponse(a.getId(), a.getTitle(), a.getBody(), a.getActive(),
                a.getStartsAt(), a.getEndsAt(),
                by == null ? null : by.getId(),
                by == null ? null : by.getFullName());
    }
}
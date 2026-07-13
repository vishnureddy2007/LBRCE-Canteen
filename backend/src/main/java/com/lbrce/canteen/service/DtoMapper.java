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
        if (images.isEmpty() && f.getId() != null) {
            // fallback image based on category using high-quality Unsplash URLs
            String categoryName = f.getCategory() == null ? "default" : f.getCategory().getName().toLowerCase();
            String placeholder;
            if (categoryName.contains("breakfast")) {
                placeholder = "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80";
            } else if (categoryName.contains("lunch")) {
                placeholder = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            } else if (categoryName.contains("snack")) {
                placeholder = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80";
            } else if (categoryName.contains("beverage")) {
                placeholder = "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&auto=format&fit=crop&q=80";
            } else if (categoryName.contains("fast")) {
                placeholder = "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80";
            } else {
                placeholder = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80";
            }
            images = List.of(placeholder);
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
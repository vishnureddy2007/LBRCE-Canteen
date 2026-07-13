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
        
        // Overwrite if empty or if it contains generic placeholder/vegetable URLs from seed data
        boolean hasNoRealImage = images.isEmpty() || images.stream().anyMatch(url -> 
            url.contains("placeholder-") || 
            url.contains("photo-1601050690597-df056fb4ce78") || // raw green peas
            url.contains("photo-1509440159596-0249088772ff")    // raw bakery flour
        );
        
        if (hasNoRealImage && f.getId() != null) {
            String name = f.getName().toLowerCase();
            String placeholder;
            
            if (name.contains("idli")) {
                placeholder = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("poori")) {
                placeholder = "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("upma")) {
                placeholder = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("chicken biryani")) {
                placeholder = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("veg biryani") || name.contains("biryani")) {
                placeholder = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("veg fried rice")) {
                placeholder = "https://images.unsplash.com/photo-1603133872878-685f586b6d1d?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("chicken fried rice") || name.contains("fried rice")) {
                placeholder = "https://images.unsplash.com/photo-1603133872878-685f586b6d1d?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("meals") || name.contains("thali")) {
                placeholder = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("samosa")) {
                placeholder = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("egg puff") || name.contains("puff")) {
                placeholder = "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("chicken manchuria") || name.contains("manchuria")) {
                placeholder = "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("veg manchuria")) {
                placeholder = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("chicken noodles")) {
                placeholder = "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("veg noodles") || name.contains("noodles")) {
                placeholder = "https://images.unsplash.com/photo-1612966608963-47da3147d41a?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("coffee")) {
                placeholder = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("tea") || name.contains("chai")) {
                placeholder = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("lime soda")) {
                placeholder = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80";
            } else if (name.contains("lassi")) {
                placeholder = "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80";
            } else {
                String categoryName = f.getCategory() == null ? "default" : f.getCategory().getName().toLowerCase();
                if (categoryName.contains("breakfast")) {
                    placeholder = "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80";
                } else if (categoryName.contains("lunch")) {
                    placeholder = "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80";
                } else if (categoryName.contains("snack")) {
                    placeholder = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80";
                } else if (categoryName.contains("beverage")) {
                    placeholder = "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=600&auto=format&fit=crop&q=80";
                } else if (categoryName.contains("fast")) {
                    placeholder = "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop&q=80";
                } else {
                    placeholder = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80";
                }
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
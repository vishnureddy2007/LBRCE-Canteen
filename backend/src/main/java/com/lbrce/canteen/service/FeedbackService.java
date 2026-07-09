package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.FeedbackRequest;
import com.lbrce.canteen.dto.FeedbackResponse;
import com.lbrce.canteen.entity.Feedback;
import com.lbrce.canteen.entity.FoodItem;
import com.lbrce.canteen.entity.Order;
import com.lbrce.canteen.entity.Student;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.FeedbackRepository;
import com.lbrce.canteen.repository.FoodItemRepository;
import com.lbrce.canteen.repository.OrderRepository;
import com.lbrce.canteen.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;
    private final OrderRepository orderRepository;
    private final FoodItemRepository foodItemRepository;
    private final FoodService foodService;
    private final DtoMapper mapper;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           StudentRepository studentRepository,
                           OrderRepository orderRepository,
                           FoodItemRepository foodItemRepository,
                           FoodService foodService,
                           DtoMapper mapper) {
        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
        this.orderRepository = orderRepository;
        this.foodItemRepository = foodItemRepository;
        this.foodService = foodService;
        this.mapper = mapper;
    }

    @Transactional
    public FeedbackResponse submit(Long studentId, FeedbackRequest req) {
        Student s = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));
        Feedback fb = new Feedback();
        fb.setStudent(s);
        fb.setRating(req.rating());
        fb.setComment(req.comment());
        if (req.orderId() != null) {
            Order o = orderRepository.findById(req.orderId())
                    .orElseThrow(() -> new NotFoundException("Order not found: " + req.orderId()));
            fb.setOrder(o);
        }
        if (req.foodItemId() != null) {
            FoodItem f = foodItemRepository.findById(req.foodItemId())
                    .orElseThrow(() -> new NotFoundException("Food item not found: " + req.foodItemId()));
            fb.setFoodItem(f);
            // Recompute aggregate rating for this food item.
            foodService.recomputeRating(req.foodItemId(), req.rating());
        }
        Feedback saved = feedbackRepository.save(fb);
        return mapper.toFeedback(saved);
    }

    @Transactional(readOnly = true)
    public Page<FeedbackResponse> forFood(Long foodId, Pageable pageable) {
        return feedbackRepository.findByFoodItem_IdOrderByCreatedAtDesc(foodId, pageable)
                .map(mapper::toFeedback);
    }
}
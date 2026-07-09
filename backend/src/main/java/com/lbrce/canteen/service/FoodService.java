package com.lbrce.canteen.service;

import com.lbrce.canteen.dto.FoodRequest;
import com.lbrce.canteen.dto.FoodResponse;
import com.lbrce.canteen.entity.Category;
import com.lbrce.canteen.entity.FoodImage;
import com.lbrce.canteen.entity.FoodItem;
import com.lbrce.canteen.exception.NotFoundException;
import com.lbrce.canteen.repository.CategoryRepository;
import com.lbrce.canteen.repository.FoodImageRepository;
import com.lbrce.canteen.repository.FoodItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class FoodService {

    private final FoodItemRepository foodItemRepository;
    private final FoodImageRepository foodImageRepository;
    private final CategoryRepository categoryRepository;
    private final DtoMapper mapper;

    public FoodService(FoodItemRepository foodItemRepository,
                       FoodImageRepository foodImageRepository,
                       CategoryRepository categoryRepository,
                       DtoMapper mapper) {
        this.foodItemRepository = foodItemRepository;
        this.foodImageRepository = foodImageRepository;
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<FoodResponse> list(Long categoryId, Boolean available, String q, Pageable pageable) {
        return foodItemRepository.search(categoryId, available, q, pageable).map(mapper::toFood);
    }

    @Transactional(readOnly = true)
    public FoodResponse get(Long id) {
        return mapper.toFood(loadOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<FoodResponse> topRated() {
        return mapper.toFoods(foodItemRepository.findTop8ByAvailableTrueOrderByRatingAvgDescRatingCountDesc());
    }

    @Transactional
    public FoodResponse create(FoodRequest req) {
        FoodItem f = new FoodItem();
        f.setName(req.name());
        f.setDescription(req.description());
        f.setPrice(req.price());
        f.setCategory(loadCategory(req.categoryId()));
        f.setAvailable(req.available() == null ? Boolean.TRUE : req.available());
        f.setRatingAvg(BigDecimal.ZERO);
        f.setRatingCount(0);
        FoodItem saved = foodItemRepository.save(f);
        attachImages(saved, req.imageUrl(), req.additionalImages());
        return mapper.toFood(saved);
    }

    @Transactional
    public FoodResponse update(Long id, FoodRequest req) {
        FoodItem f = loadOrThrow(id);
        f.setName(req.name());
        f.setDescription(req.description());
        f.setPrice(req.price());
        f.setCategory(loadCategory(req.categoryId()));
        if (req.available() != null) f.setAvailable(req.available());
        attachImages(f, req.imageUrl(), req.additionalImages());
        return mapper.toFood(f);
    }

    @Transactional
    public void delete(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new NotFoundException("Food item not found: " + id);
        }
        foodItemRepository.deleteById(id);
    }

    @Transactional
    public FoodResponse setAvailability(Long id, Boolean available) {
        FoodItem f = loadOrThrow(id);
        f.setAvailable(available == null ? !Boolean.TRUE.equals(f.getAvailable()) : available);
        return mapper.toFood(f);
    }

    /** Recompute aggregate rating after a feedback is added. */
    @Transactional
    public void recomputeRating(Long foodId, int newRating) {
        FoodItem f = loadOrThrow(foodId);
        int oldCount = f.getRatingCount() == null ? 0 : f.getRatingCount();
        BigDecimal oldAvg = f.getRatingAvg() == null ? BigDecimal.ZERO : f.getRatingAvg();
        BigDecimal total = oldAvg.multiply(BigDecimal.valueOf(oldCount)).add(BigDecimal.valueOf(newRating));
        int newCount = oldCount + 1;
        BigDecimal newAvg = total.divide(BigDecimal.valueOf(newCount), 2, java.math.RoundingMode.HALF_UP);
        f.setRatingCount(newCount);
        f.setRatingAvg(newAvg);
    }

    private void attachImages(FoodItem f, String imageUrl, List<String> additionalImages) {
        f.getImages().clear();
        if (imageUrl != null && !imageUrl.isBlank()) {
            FoodImage primary = new FoodImage();
            primary.setFoodItem(f);
            primary.setImageUrl(imageUrl);
            primary.setIsPrimary(true);
            f.getImages().add(primary);
        }
        if (additionalImages != null) {
            for (String url : additionalImages) {
                if (url == null || url.isBlank()) continue;
                FoodImage img = new FoodImage();
                img.setFoodItem(f);
                img.setImageUrl(url);
                img.setIsPrimary(f.getImages().isEmpty());
                f.getImages().add(img);
            }
        }
        // save via parent — images are cascade ALL
    }

    private FoodItem loadOrThrow(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Food item not found: " + id));
    }

    private Category loadCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
    }
}
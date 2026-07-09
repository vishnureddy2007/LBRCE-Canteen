package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.FoodItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    Page<FoodItem> findByAvailableTrue(Pageable pageable);

    Page<FoodItem> findByCategory_IdAndAvailableTrue(Long categoryId, Pageable pageable);

    @Query("""
           SELECT f FROM FoodItem f
           WHERE (:categoryId IS NULL OR f.category.id = :categoryId)
             AND (:available IS NULL OR f.available = :available)
             AND (:q IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%'))
                            OR LOWER(f.description) LIKE LOWER(CONCAT('%', :q, '%')))
           """)
    Page<FoodItem> search(@Param("categoryId") Long categoryId,
                          @Param("available") Boolean available,
                          @Param("q") String q,
                          Pageable pageable);

    List<FoodItem> findTop8ByAvailableTrueOrderByRatingAvgDescRatingCountDesc();

    @Query("""
           SELECT f FROM FoodItem f
           JOIN OrderItem oi ON oi.foodItem = f
           GROUP BY f
           ORDER BY SUM(oi.quantity) DESC
           """)
    List<FoodItem> findTopSelling(Pageable pageable);
}

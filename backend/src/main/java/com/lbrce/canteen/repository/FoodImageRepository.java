package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.FoodImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodImageRepository extends JpaRepository<FoodImage, Long> {
    List<FoodImage> findByFoodItem_Id(Long foodItemId);
    List<FoodImage> findByFoodItem_IdAndIsPrimaryTrue(Long foodItemId);
}

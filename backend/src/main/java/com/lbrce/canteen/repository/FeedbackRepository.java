package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByFoodItem_IdOrderByCreatedAtDesc(Long foodItemId, Pageable pageable);
    Page<Feedback> findByStudent_IdOrderByCreatedAtDesc(Long studentId, Pageable pageable);
}

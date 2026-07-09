package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByStudent_IdOrderByPlacedAtDesc(Long studentId, Pageable pageable);

    List<Order> findByStatusOrderByPlacedAtAsc(Order.Status status);

    List<Order> findByStatusInOrderByPlacedAtAsc(List<Order.Status> statuses);

    Page<Order> findByStatusOrderByPlacedAtAsc(Order.Status status, Pageable pageable);

    @Query("""
           SELECT o FROM Order o
           WHERE (:status IS NULL OR o.status = :status)
             AND (:from   IS NULL OR o.placedAt >= :from)
             AND (:to     IS NULL OR o.placedAt <  :to)
           ORDER BY o.placedAt DESC
           """)
    Page<Order> search(@Param("status") Order.Status status,
                        @Param("from") Instant from,
                        @Param("to")   Instant to,
                        Pageable pageable);

    long countByStatus(Order.Status status);

    /** Count of orders placed in the half-open interval {@code [from, to)}. */
    long countByPlacedAtGreaterThanEqualAndPlacedAtLessThan(Instant from, Instant to);

    @Query("""
           SELECT FUNCTION('DATE', o.placedAt) AS bucket,
                  SUM(o.totalAmount)           AS revenue,
                  COUNT(o)                     AS orderCount
           FROM Order o
           WHERE o.status <> :cancelled
             AND o.placedAt >= :from AND o.placedAt < :to
           GROUP BY FUNCTION('DATE', o.placedAt)
           ORDER BY bucket ASC
           """)
    List<Object[]> dailyRevenue(@Param("from") Instant from, @Param("to") Instant to,
                                @Param("cancelled") Order.Status cancelled);

    @Query("""
           SELECT oi.foodItem.name AS name,
                  SUM(oi.quantity)  AS qty,
                  SUM(oi.subtotal)  AS revenue
           FROM OrderItem oi
           JOIN oi.order o
           WHERE o.status <> :cancelled
             AND o.placedAt >= :from AND o.placedAt < :to
           GROUP BY oi.foodItem.name
           ORDER BY revenue DESC
           """)
    List<Object[]> topItems(@Param("from") Instant from, @Param("to") Instant to, Pageable pageable,
                            @Param("cancelled") Order.Status cancelled);
}

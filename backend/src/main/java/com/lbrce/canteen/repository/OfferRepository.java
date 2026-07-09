package com.lbrce.canteen.repository;

import com.lbrce.canteen.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    @Query("""
           SELECT o FROM Offer o
           WHERE o.active = true
             AND (o.validFrom IS NULL OR o.validFrom <= :now)
             AND (o.validTo   IS NULL OR o.validTo   >= :now)
           ORDER BY o.id DESC
           """)
    List<Offer> findActive(@Param("now") Instant now);
}

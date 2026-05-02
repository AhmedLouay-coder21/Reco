package com.Reco.backend.repository;

import com.Reco.backend.model.Product;
import com.Reco.backend.model.Review;
import com.Reco.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    List<Review> findByUser(User user);

    Long countByProduct(Product product);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product")
    Optional<Double> avgRatingByProduct(@Param("product") Product product);
}

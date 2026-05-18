package com.Reco.backend.repository;

import com.Reco.backend.model.Product;
import com.Reco.backend.model.Review;
import com.Reco.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    Page<Review> findByProduct(Product product, Pageable pageable);

    List<Review> findByUser(User user);

    Long countByProduct(Product product);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product = :product")
    Optional<Double> avgRatingByProduct(@Param("product") Product product);

    Optional<Review> findByUserAndProduct(User user, Product product);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product = :product GROUP BY r.rating")
    List<Object[]> countByRatingGrouped(@Param("product") Product product);

    @Query("SELECT DISTINCT r.product.id FROM Review r WHERE r.user.id = :userId AND r.rating >= :minRating")
    List<Long> findDistinctProductIdsByUserIdAndRatingGreaterThanEqual(@Param("userId") Long userId,
                                                                       @Param("minRating") int minRating);

}

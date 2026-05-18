package com.Reco.backend.repository;

import com.Reco.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingOrDescriptionContaining(String nameQuery, String descriptionQuery);

    @Query(value = """
            SELECT * FROM products p
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:q IS NULL OR p.name ILIKE '%' || CAST(:q AS text) || '%'
                 OR p.description ILIKE '%' || CAST(:q AS text) || '%')
            """,
            countQuery = """
                    SELECT count(*) FROM products p
                    WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
                    AND (:q IS NULL OR p.name ILIKE '%' || CAST(:q AS text) || '%'
                         OR p.description ILIKE '%' || CAST(:q AS text) || '%')
                    """,
            nativeQuery = true)
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
                                 @Param("q") String q,
                                 Pageable pageable);


    Optional<Product> findByName(String name);

    List<Product> findTop10ByOrderByPopularityScoreDesc();

}

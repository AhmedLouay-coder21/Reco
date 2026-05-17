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

    @Query("""
                  SELECT p FROM Product p WHERE
                    (p.category.id = :categoryId) AND
                    (LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
                    OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
                                 @Param("q") String q,
                                 Pageable pageable);


    Optional<Product> findByName(String name);
}

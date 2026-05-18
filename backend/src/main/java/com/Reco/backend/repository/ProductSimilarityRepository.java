package com.Reco.backend.repository;

import com.Reco.backend.model.Product;
import com.Reco.backend.model.ProductSimilarity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSimilarityRepository extends JpaRepository<ProductSimilarity, Long> {

    List<ProductSimilarity> findAllBySourceIn(List<Product> sources);
}

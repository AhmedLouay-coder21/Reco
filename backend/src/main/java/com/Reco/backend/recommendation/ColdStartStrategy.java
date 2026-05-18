package com.Reco.backend.recommendation;

import com.Reco.backend.dto.response.RecommendationItemResponse;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ColdStartStrategy implements RecommendationStrategy {

    private final ProductRepository productRepository;

    @Override
    public List<RecommendationItemResponse> recommend(User user, int limit) {

        List<Product> products = productRepository.findTop10ByOrderByPopularityScoreDesc();

        return products.stream().limit(limit)
                .map(p -> RecommendationItemResponse.builder()
                        .productId(p.getId())
                        .name(p.getName())
                        .price(p.getPrice())
                        .avgRating(p.getAvgRating())
                        .recommendationScore(p.getPopularityScore().doubleValue())
                        .build()
                ).toList();
    }
}

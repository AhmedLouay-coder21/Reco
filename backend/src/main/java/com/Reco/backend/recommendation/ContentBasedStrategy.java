package com.Reco.backend.recommendation;

import com.Reco.backend.dto.response.RecommendationItemResponse;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.ProductSimilarity;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.ProductRepository;
import com.Reco.backend.repository.ProductSimilarityRepository;
import com.Reco.backend.repository.ReviewRepository;
import com.Reco.backend.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ContentBasedStrategy implements RecommendationStrategy {

    private final ReviewRepository reviewRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final ProductRepository productRepository;
    private final ProductSimilarityRepository productSimilarityRepository;

    @Override
    public List<RecommendationItemResponse> recommend(User user, int limit) {
        List<Long> reviewed = reviewRepository.findDistinctProductIdsByUserIdAndRatingGreaterThanEqual(user.getId(), 4);
        List<Long> interacted = userInteractionRepository.findDistinctProductIdsByUserId(user.getId());

        List<Long> sources = reviewed.isEmpty() ? interacted : reviewed;
        if (sources.isEmpty()) return List.of();

        List<Product> sourceProducts = productRepository.findAllById(sources);
        List<ProductSimilarity> sims = productSimilarityRepository.findAllBySourceIn(sourceProducts);

        Set<Long> exclude = new HashSet<>();
        exclude.addAll(reviewed);
        exclude.addAll(interacted);

        Map<Long, Double> scores = new HashMap<>();
        for (ProductSimilarity sim : sims) {
            Product candidate = sim.getSimilar();
            if (exclude.contains(candidate.getId())) continue;
            double score = sim.getSimilarityScore().doubleValue() * candidate.getPopularityScore().doubleValue();
            scores.merge(candidate.getId(), score, Double::sum);
        }

        return toItems(scores, limit);
    }

    private List<RecommendationItemResponse> toItems(Map<Long, Double> scores, int limit) {
        List<Long> topIds = scores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .toList();

        Map<Long, Product> productMap = productRepository.findAllById(topIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        return topIds.stream()
                .map(id -> {
                    Product p = productMap.get(id);
                    if (p == null) return null;
                    return RecommendationItemResponse.builder()
                            .productId(p.getId())
                            .name(p.getName())
                            .price(p.getPrice())
                            .avgRating(p.getAvgRating())
                            .recommendationScore(scores.get(id))
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }
}

package com.Reco.backend.recommendation;

import com.Reco.backend.dto.response.RecommendationItemResponse;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.ProductRepository;
import com.Reco.backend.repository.ReviewRepository;
import com.Reco.backend.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CollaborativeStrategy implements RecommendationStrategy {

    private final UserInteractionRepository userInteractionRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Override
    public List<RecommendationItemResponse> recommend(User user, int limit) {
        List<Long> interacted = userInteractionRepository.findDistinctProductIdsByUserId(user.getId());
        if (interacted.isEmpty()) return List.of();

        List<Long> reviewed = reviewRepository.findDistinctProductIdsByUserIdAndRatingGreaterThanEqual(user.getId(), 4);

        List<Long> otherUsers = userInteractionRepository.findDistinctUserIdsByProductIds(interacted);
        if (otherUsers.isEmpty()) return List.of();

        List<Long> candidateProducts = userInteractionRepository.findDistinctProductIdsByUserIds(otherUsers);

        Set<Long> exclude = new HashSet<>();
        exclude.addAll(interacted);
        exclude.addAll(reviewed);

        Map<Long, Integer> overlapCount = new HashMap<>();
        for (Long pid : candidateProducts) {
            if (exclude.contains(pid)) continue;
            overlapCount.merge(pid, 1, Integer::sum);
        }

        List<Product> products = productRepository.findAllById(overlapCount.keySet());
        Map<Long, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        Map<Long, Double> scores = new HashMap<>();
        for (Map.Entry<Long, Integer> e : overlapCount.entrySet()) {
            Product p = productMap.get(e.getKey());
            if (p == null) continue;
            scores.put(e.getKey(), e.getValue() * p.getPopularityScore().doubleValue());
        }

        return toItems(scores, limit, productMap);
    }

    private List<RecommendationItemResponse> toItems(Map<Long, Double> scores, int limit, Map<Long, Product> productMap) {
        return scores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    Product p = productMap.get(e.getKey());
                    if (p == null) return null;
                    return RecommendationItemResponse.builder()
                            .productId(p.getId())
                            .name(p.getName())
                            .price(p.getPrice())
                            .avgRating(p.getAvgRating())
                            .recommendationScore(e.getValue())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }
}

package com.Reco.backend.service;


import com.Reco.backend.dto.request.InteractionRequest;
import com.Reco.backend.dto.response.*;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.*;
import com.Reco.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final ProductSimilarityRepository productSimilarityRepository;
    private final RecommendationCacheRepository recommendationCacheRepository;
    private final ReviewRepository reviewRepository;

    public void trackInteraction(Long userId, @Valid InteractionRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String authedEmail = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        if (!user.getEmail().equals(authedEmail)) {
            throw new ResourceNotFoundException("User not found");
        }


        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Interaction type = Interaction.valueOf(request.getInteractionType());

        userInteractionRepository.save(UserInteraction.builder()
                .user(user)
                .product(product)
                .interactionType(type)
                .build());

        if (type == Interaction.CLICK) {
            product.setTotalClicks(product.getTotalClicks() + 1);
        } else if (type == Interaction.CART_ADD) {
            product.setTotalCartAdds(product.getTotalCartAdds() + 1);
        }

        double avgRating = reviewRepository.avgRatingByProduct(product)
                .orElse(0.0);
        double normalizedRating = avgRating / 5.0;
        double normalizedClicks = Math.min(product.getTotalClicks(), 100) / 100.0;
        double normalizedCartAdds = Math.min(product.getTotalCartAdds(), 50) / 50.0;

        double score = (0.5 * normalizedRating
                + 0.3 * normalizedCartAdds
                + 0.2 * normalizedClicks) * 10;
        product.setPopularityScore(BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP));
        productRepository.save(product);

        recommendationCacheRepository.deleteByUser(user);

    }

    @Transactional(readOnly = true)
    public RecommendationListResponse getPersonalized(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<RecommendationCache> cached = recommendationCacheRepository
                .findAllByUser(user);
        List<RecommendationCache> valid = cached.stream()
                .filter(c -> c.getExpiresAt().isAfter(Instant.now()))
                .toList();
        if (!valid.isEmpty()) {
            List<RecommendationItemResponse> items = valid.stream()
                    .map(c -> RecommendationItemResponse.builder()
                            .productId(c.getProduct().getId())
                            .name(c.getProduct().getName())
                            .price(c.getProduct().getPrice())
                            .avgRating(c.getProduct().getAvgRating())
                            .recommendationScore(c.getRecommendationScore().
                                    doubleValue())
                            .build())
                    .toList();
            return new RecommendationListResponse(items, items.size());
        }

        List<Long> productIds = userInteractionRepository.findDistinctProductIdsByUserId(userId);
        if (productIds.isEmpty()) {
            return new RecommendationListResponse(List.of(), 0);
        }

        List<Product> interacted = productRepository.findAllById(productIds);

        List<ProductSimilarity> similarities = productSimilarityRepository.
                findAllBySourceIn(interacted);

        Set<Long> interactedIds = new HashSet<>(productIds);
        Map<Long, Double> candidateScores = new HashMap<>();
        for (ProductSimilarity sim : similarities) {
            Product candidate = sim.getSimilar();
            if (interactedIds.contains(candidate.getId())) continue;
            double score = sim.getSimilarityScore().doubleValue()
                    * candidate.getPopularityScore().doubleValue();
            candidateScores.merge(candidate.getId(), score, Double::sum);
        }

        List<Long> topIds = candidateScores.entrySet().stream()
                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                .limit(10)
                .map(Map.Entry::getKey)
                .toList();

        List<Product> topProducts = productRepository.findAllById(topIds);
        Map<Long, Product> productMap = topProducts.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        recommendationCacheRepository.deleteByUser(user);

        List<RecommendationItemResponse> items = new ArrayList<>();
        for (Long id : topIds) {
            Product p = productMap.get(id);
            if (p == null) continue;
            double score = candidateScores.get(id);
            recommendationCacheRepository.save(RecommendationCache.builder()
                    .user(user)
                    .product(p)
                    .recommendationScore(BigDecimal.valueOf(score))
                    .expiresAt(Instant.now().plusSeconds(3600))
                    .build());
            items.add(RecommendationItemResponse.builder()
                    .productId(p.getId())
                    .name(p.getName())
                    .price(p.getPrice())
                    .avgRating(p.getAvgRating())
                    .recommendationScore(score)
                    .build());
        }
        return new RecommendationListResponse(items, items.size());

    }

    @Transactional(readOnly = true)
    public TrendingListResponse getTrending() {
        List<Product> products = productRepository.
                findTop10ByOrderByPopularityScoreDesc();
        List<TrendingItemResponse> items = new ArrayList<>();
        int rank = 1;
        for (Product p : products) {
            items.add(TrendingItemResponse.builder()
                    .productId(p.getId())
                    .name(p.getName())
                    .price(p.getPrice())
                    .popularityScore(p.getPopularityScore())
                    .rank(rank++)
                    .build());
        }
        return new TrendingListResponse(items);
    }

    @Transactional(readOnly = true)
    public CacheListResponse getCache() {
        List<RecommendationCache> all = recommendationCacheRepository.findAll();
        List<CacheEntryResponse> entries = all.stream()
                .map(c -> CacheEntryResponse.builder()
                        .cacheId(c.getId())
                        .userId(c.getUser().getId())
                        .productCount(1)
                        .cachedAt(c.getGeneratedAt())
                        .expiresAt(c.getExpiresAt())
                        .build())
                .toList();
        return new CacheListResponse(all.size(), entries);
    }

    public void deleteCacheEntry(Long cacheId) {
        RecommendationCache cache = recommendationCacheRepository.findById(cacheId)
                .orElseThrow(() -> new ResourceNotFoundException("Cache entry not found"));
        recommendationCacheRepository.delete(cache);
    }

    public RefreshResponse refreshCache() {
        recommendationCacheRepository.deleteAll();
        List<User> users = userInteractionRepository.findDistinctUsers();
        int entriesCreated = 0;
        for (User user : users) {
            List<Long> productIds = userInteractionRepository
                    .findDistinctProductIdsByUserId(user.getId());
            if (productIds.isEmpty()) continue;
            List<Product> interacted = productRepository.findAllById(productIds);
            List<ProductSimilarity> similarities = productSimilarityRepository
                    .findAllBySourceIn(interacted);
            Set<Long> interactedIds = new HashSet<>(productIds);
            Map<Long, Double> candidateScores = new HashMap<>();
            for (ProductSimilarity sim : similarities) {
                Product candidate = sim.getSimilar();
                if (interactedIds.contains(candidate.getId())) continue;
                double score = sim.getSimilarityScore().doubleValue()
                        * candidate.getPopularityScore().doubleValue();
                candidateScores.merge(candidate.getId(), score, Double::sum);
            }
            List<Long> topIds = candidateScores.entrySet().stream()
                    .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                    .limit(10)
                    .map(Map.Entry::getKey)
                    .toList();
            List<Product> topProducts = productRepository.findAllById(topIds);
            Map<Long, Product> productMap = topProducts.stream()
                    .collect(Collectors.toMap(Product::getId, p -> p));
            for (Long id : topIds) {
                Product p = productMap.get(id);
                if (p == null) continue;
                recommendationCacheRepository.save(RecommendationCache.builder()
                        .user(user)
                        .product(p)
                        .recommendationScore(BigDecimal.valueOf(candidateScores.get(id)))
                        .expiresAt(Instant.now().plusSeconds(3600))
                        .build());
                entriesCreated++;
            }
        }
        return RefreshResponse.builder()
                .usersRefreshed(users.size())
                .cacheEntriesCreated(entriesCreated)
                .build();
    }


}

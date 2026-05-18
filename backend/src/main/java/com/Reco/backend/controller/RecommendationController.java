package com.Reco.backend.controller;

import com.Reco.backend.dto.response.CacheListResponse;
import com.Reco.backend.dto.response.RefreshResponse;
import com.Reco.backend.dto.response.TrendingListResponse;
import com.Reco.backend.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/popular")
    public ResponseEntity<TrendingListResponse> getTrending() {
        return ResponseEntity.ok(recommendationService.getTrending());
    }

    @GetMapping("/cache")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CacheListResponse> getCache() {
        return ResponseEntity.ok(recommendationService.getCache());
    }

    @PostMapping("/refresh")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RefreshResponse> refreshCache() {
        return ResponseEntity.ok(recommendationService.refreshCache());
    }

    @DeleteMapping("/cache/{cacheId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCacheEntry(@PathVariable Long cacheId) {
        recommendationService.deleteCacheEntry(cacheId);
        return ResponseEntity.noContent().build();
    }
    
}
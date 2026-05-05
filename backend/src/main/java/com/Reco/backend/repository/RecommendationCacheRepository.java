package com.Reco.backend.repository;

import com.Reco.backend.model.RecommendationCache;
import com.Reco.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface RecommendationCacheRepository extends JpaRepository<RecommendationCache, Long> {

    List<RecommendationCache> findAllByUser(User user);

    List<RecommendationCache> findAllByExpiresAtBefore(Instant expiresAtBefore);

}

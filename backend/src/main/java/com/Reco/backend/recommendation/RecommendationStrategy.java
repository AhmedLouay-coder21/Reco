package com.Reco.backend.recommendation;

import com.Reco.backend.dto.response.RecommendationItemResponse;
import com.Reco.backend.model.User;

import java.util.List;

public interface RecommendationStrategy {

    List<RecommendationItemResponse> recommend(User user, int limit);

}

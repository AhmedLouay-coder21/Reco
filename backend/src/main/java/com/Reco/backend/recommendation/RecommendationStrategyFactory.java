package com.Reco.backend.recommendation;

import org.springframework.stereotype.Component;

@Component
public class RecommendationStrategyFactory {

    private final ColdStartStrategy coldStartStrategy;
    private final ContentBasedStrategy contentBasedStrategy;
    private final CollaborativeStrategy collaborativeStrategy;

    public RecommendationStrategyFactory(ColdStartStrategy coldStartStrategy,
                                         ContentBasedStrategy contentBasedStrategy,
                                         CollaborativeStrategy collaborativeStrategy) {
        this.coldStartStrategy = coldStartStrategy;
        this.contentBasedStrategy = contentBasedStrategy;
        this.collaborativeStrategy = collaborativeStrategy;
    }

    public RecommendationStrategy select(boolean hasReviews, boolean hasInteractions) {
        if (!hasReviews && !hasInteractions) return coldStartStrategy;
        if (hasReviews && !hasInteractions) return contentBasedStrategy;
        if (!hasReviews && hasInteractions) return collaborativeStrategy;
        return null;
    }

    public ColdStartStrategy coldStart() { return coldStartStrategy; }
    public ContentBasedStrategy contentBased() { return contentBasedStrategy; }
    public CollaborativeStrategy collaborative() { return collaborativeStrategy; }
}

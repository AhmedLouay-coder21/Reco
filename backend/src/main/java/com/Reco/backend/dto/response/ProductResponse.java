package com.Reco.backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private Long categoryId;
    private String name;
    private String description;
    private String mainImageUrl;
    private List<String> additionalImages;
    private BigDecimal price;
    private int stockQuantity;
    private String tags;
    private BigDecimal avgRating;
    private int totalClicks;
    private int totalCartAdds;
    private BigDecimal popularityScore;
    private Instant createdAt;
}
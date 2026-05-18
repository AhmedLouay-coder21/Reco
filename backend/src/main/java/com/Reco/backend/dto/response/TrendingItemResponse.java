package com.Reco.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendingItemResponse {

    private Long productId;
    private String name;
    private BigDecimal price;
    private BigDecimal popularityScore;
    private int rank;

}

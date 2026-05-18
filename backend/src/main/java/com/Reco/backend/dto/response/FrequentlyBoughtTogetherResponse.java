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
public class FrequentlyBoughtTogetherResponse {

    private Long productId;
    private String name;
    private BigDecimal price;
    private long frequency;
    private long purchaseCount;
    private BigDecimal avgRating;

}

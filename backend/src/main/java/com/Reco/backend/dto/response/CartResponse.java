package com.Reco.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long cartId;
    private Instant updatedAt;
    private List<CartItemResponse> items;
    private int totalQuantity;
    private BigDecimal subtotal;
}

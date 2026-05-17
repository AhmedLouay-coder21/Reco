package com.Reco.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotNull
    private Long categoryId;

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private String mainImageUrl;

    private List<String> additionalImages;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotNull
    @jakarta.validation.constraints.Min(0)
    private Integer stockQuantity;

    private String tags;
}
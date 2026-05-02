package com.Reco.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product_similarities")
public class ProductSimilarity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal similarityScore;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant calculatedAt;

    @ManyToOne
    @JoinColumn(name = "source_id",nullable = false)
    private Product source;

    @ManyToOne
    @JoinColumn(name = "similar_id",nullable = false)
    private Product similar;
}

package com.Reco.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "products")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Positive
    @Column(nullable = false)
    private BigDecimal price;

    @Min(0)
    @Column(name = "stock_quantity",nullable = false)
    private int stockQuantity;

    @Column(nullable = false)
    private String tags;

    @ColumnDefault("0")
    @Column(name = "total_clicks",nullable = false)
    private int totalClicks;

    @ColumnDefault("0")
    @Column(name = "total_cart_adds",nullable = false)
    private int totalCartAdds;

    @Min(0)
    @Column(name = "popularity_score",nullable = false)
    private BigDecimal popularityScore;

    @Column(name = "avg_rating")
    private BigDecimal avgRating;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne()
    @JoinColumn(name = "category_id",nullable = false)
    private Category category;

}

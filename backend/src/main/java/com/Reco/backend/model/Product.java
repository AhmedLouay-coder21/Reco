package com.Reco.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.sql.Types;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    @Column(nullable = false, columnDefinition = "TEXT", unique = true)
    @JdbcTypeCode(Types.VARCHAR)
    private String name;

    @Column(columnDefinition = "TEXT")
    @JdbcTypeCode(Types.VARCHAR)
    private String description;

    @Column(nullable = false)
    private String mainImageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<String> additionalImages = new ArrayList<>();

    @Positive
    @Column(nullable = false)
    private BigDecimal price;

    @Min(0)
    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(nullable = false, columnDefinition = "TEXT")
    @JdbcTypeCode(Types.VARCHAR)
    private String tags;


    @Builder.Default
    @ColumnDefault("0")
    @Column(name = "total_clicks", nullable = false)
    private int totalClicks = 0;


    @Builder.Default
    @ColumnDefault("0")
    @Column(name = "total_cart_adds", nullable = false)
    private int totalCartAdds = 0;

    @Builder.Default
    @Min(0)
    @Column(name = "popularity_score", nullable = false)
    private BigDecimal popularityScore = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "avg_rating")
    private BigDecimal avgRating = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne()
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

}

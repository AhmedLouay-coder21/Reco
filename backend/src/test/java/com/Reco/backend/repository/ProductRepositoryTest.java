package com.Reco.backend.repository;

import com.Reco.backend.model.Category;
import com.Reco.backend.model.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class ProductRepositoryTest {

    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;

    @Test
    void testThatVerifyProductBuildAllFields(){


        Category category = Category.builder()
                .name("Tech")
                .description("Tech things")
                .build();
        categoryRepository.save(category);

        Product product = Product.builder()
                .name("S23 Ultra")
                .description("Samsung S23 Ultra")
                .price(new BigDecimal("35"))
                .tags("Phone")
                .category(category)
                .stockQuantity(100)
                .popularityScore(new BigDecimal("0"))
                .build();
        productRepository.save(product);

        Optional<Product> foundById = productRepository.findById(product.getId());
        List<Product> foundByCategoryId = productRepository.findByCategoryId(category.getId());
        List<Product> foundByNameOrDescription = productRepository.findByNameContainingOrDescriptionContaining(product.getName(), product.getDescription());


        assertThat(foundById).isPresent();
        assertThat(foundById.get().getName()).isEqualTo("S23 Ultra");

        assertThat(foundByCategoryId).hasSize(1);
        assertThat(foundByCategoryId.getFirst().getCategory().getName()).isEqualTo("Tech");

        assertThat(foundByNameOrDescription).hasSize(1);
        assertThat(foundByNameOrDescription.getFirst().getName()).isEqualTo("S23 Ultra");
        assertThat(foundByNameOrDescription.getFirst().getDescription()).isEqualTo("Samsung S23 Ultra");

    }
}

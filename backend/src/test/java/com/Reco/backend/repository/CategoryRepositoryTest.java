package com.Reco.backend.repository;


import com.Reco.backend.model.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class CategoryRepositoryTest {

    @Autowired CategoryRepository categoryRepository;

    @Test
    void testThatVerifyCategoryBuildAllFields(){

        Category category = Category.builder()
                .name("Tech")
                .description("Tech things")
                .build();
        categoryRepository.save(category);

        Optional<Category> found = categoryRepository.findById(category.getId());
        Optional<Category> foundName = categoryRepository.findByName(category.getName());

        assertThat(found).isPresent();
        assertThat(foundName.get().getName()).isEqualTo("Tech");
        assertThat(found.get().getDescription()).isEqualTo("Tech things");
    }
}

package com.Reco.backend.service;

import com.Reco.backend.dto.request.CategoryRequest;
import com.Reco.backend.dto.request.CategoryUpdateRequest;
import com.Reco.backend.dto.response.CategoryResponse;
import com.Reco.backend.exception.DuplicateCategoryException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.Category;
import com.Reco.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new DuplicateCategoryException("Category " + request.getName() + " already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Category saved = categoryRepository.save(category);


        return toResponse(saved);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return toResponse(category);
    }

    public CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.findByName(request.getName()).isPresent()) {
            throw new DuplicateCategoryException("Category " + request.getName() + " already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updated = categoryRepository.save(category);

        return toResponse(updated);
    }

    public void deleteCategory(Long categoryId) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));


        categoryRepository.delete(category);

    }
}

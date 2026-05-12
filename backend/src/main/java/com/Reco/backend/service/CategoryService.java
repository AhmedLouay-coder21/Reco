package com.Reco.backend.service;

import com.Reco.backend.dto.request.CategoryRequest;
import com.Reco.backend.dto.response.CategoryResponse;
import com.Reco.backend.exception.DuplicateCategoryException;
import com.Reco.backend.model.Category;
import com.Reco.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(CategoryRequest request){

        if(categoryRepository.findByName(request.getName()).isPresent()){
            throw new DuplicateCategoryException("Category "+ request.getName()+ " already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Category saved = categoryRepository.save(category);

        CategoryResponse response = CategoryResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .build();
        return response;
    }


//    public List<CategoryResponse> listCategories() {
//
//        return categoryRepository.findAll();
//    }
}

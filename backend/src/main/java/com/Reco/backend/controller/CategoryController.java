package com.Reco.backend.controller;

import com.Reco.backend.dto.request.CategoryRequest;
import com.Reco.backend.dto.response.CategoryResponse;
import com.Reco.backend.model.Category;
import com.Reco.backend.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

//    @GetMapping
//    public ResponseEntity<List<CategoryResponse>> listCategories(){
//        return ResponseEntity.ok(categoryService.listCategories());
//    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest category){
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}

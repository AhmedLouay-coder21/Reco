package com.Reco.backend.service;

import com.Reco.backend.dto.request.ProductRequest;
import com.Reco.backend.dto.response.ProductResponse;
import com.Reco.backend.exception.DuplicateProductException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.Category;
import com.Reco.backend.model.Product;
import com.Reco.backend.repository.CategoryRepository;
import com.Reco.backend.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;


    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .categoryId(product.getCategory().getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .tags(product.getTags())
                .avgRating(product.getAvgRating())
                .totalClicks(product.getTotalClicks())
                .totalCartAdds(product.getTotalCartAdds())
                .popularityScore(product.getPopularityScore())
                .createdAt(product.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> listProducts(
            Long categoryId, String q, Pageable pageable) {

        return productRepository.searchProducts(categoryId, q, pageable)
                .map(this::toResponse);

    }

    public ProductResponse getProductById(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return toResponse(product);
    }

    public ProductResponse createProduct(@Valid ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (productRepository.findByName(request.getName()).isPresent()) {
            throw new DuplicateProductException("Product " + request.getName() + " already exists");
        }


        Product product = Product.builder()
                .name(request.getName())
                .category(category)
                .description(request.getDescription())
                .price(request.getPrice())
                .tags(request.getTags())
                .stockQuantity(request.getStockQuantity())
                .build();

        Product saved = productRepository.save(product);

        return toResponse(saved);
    }

    public ProductResponse updateProduct(@Valid ProductRequest request, Long productId) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getName().equals(request.getName()) &&
                productRepository.findByName(request.getName()).isPresent()) {
            throw new DuplicateProductException("Product " + request.getName() + " already exists");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setStockQuantity(request.getStockQuantity());
        product.setTags(request.getTags());

        Product updated = productRepository.save(product);

        return toResponse(updated);
    }

    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        productRepository.delete(product);
    }
}

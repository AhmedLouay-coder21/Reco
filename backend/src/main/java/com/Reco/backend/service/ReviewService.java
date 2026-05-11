package com.Reco.backend.service;

import com.Reco.backend.dto.request.ReviewCreateRequest;
import com.Reco.backend.dto.request.ReviewUpdateRequest;
import com.Reco.backend.dto.response.AverageRatingResponse;
import com.Reco.backend.dto.response.ReviewResponse;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.Review;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.ProductRepository;
import com.Reco.backend.repository.ReviewRepository;
import com.Reco.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public ReviewResponse createReview(ReviewCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(reviewRepository.findByUserAndProduct(user,product).isPresent()){
            throw new IllegalArgumentException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .product(product)
                .user(user)
                .build();

        Review saved = reviewRepository.save(review);
        updateProductAverageRating(product);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return reviewRepository.findByProduct(product)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return reviewRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("User not allowed to update this review");
        }

        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }

        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }

        Review saved = reviewRepository.save(review);
        updateProductAverageRating(review.getProduct());

        return toResponse(saved);
    }

    public void deleteReview(Long reviewId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("User not allowed to delete this review");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        updateProductAverageRating(product);
    }

    @Transactional(readOnly = true)
    public AverageRatingResponse getAverageRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Double avg = reviewRepository.avgRatingByProduct(product).orElse(0.0);
        Long total = reviewRepository.countByProduct(product);

        return new AverageRatingResponse(productId, avg, total);
    }

    private void updateProductAverageRating(Product product) {
        Double avg = reviewRepository.avgRatingByProduct(product).orElse(0.0);
        BigDecimal averageRating = BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP);
        product.setAvgRating(averageRating);
        productRepository.save(product);
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt(),
                review.getUser().getId(),
                review.getUser().getUsername(),
                review.getProduct().getId()
        );
    }
}

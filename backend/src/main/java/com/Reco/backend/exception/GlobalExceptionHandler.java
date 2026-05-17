package com.Reco.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> errorBody(HttpStatus status, String error, String message, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", request.getDescription(false).replace("uri=", ""));
        return body;
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateEmail(
            DuplicateEmailException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(
            DataIntegrityViolationException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", "Database constraint violation", request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(
            AuthenticationException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid credentials", request),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DuplicateCategoryException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateCategory(
            DuplicateCategoryException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateUser(
            DuplicateUserException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidPassword(
            InvalidPasswordException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CartEmptyException.class)
    public ResponseEntity<Map<String, Object>> handleCartEmpty(
            CartEmptyException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientStock(
            InsufficientStockException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateReviewException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateReview(
            DuplicateReviewException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ReviewNotOwnedException.class)
    public ResponseEntity<Map<String, Object>> handleReviewNotOwned(
            ReviewNotOwnedException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(OrderNotEligibleException.class)
    public ResponseEntity<Map<String, Object>> handleOrderNotEligible(
            OrderNotEligibleException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicatePaymentException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicatePayment(
            DuplicatePaymentException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PaymentMismatchException.class)
    public ResponseEntity<Map<String, Object>> handlePaymentMismatch(
            PaymentMismatchException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", message, request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.FORBIDDEN, "Forbidden", "Access denied", request),
                HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", "Malformed JSON body", request),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateProductException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateProduct(
            DuplicateProductException ex, WebRequest request) {
        return new ResponseEntity<>(
                errorBody(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request),
                HttpStatus.BAD_REQUEST);
    }
}
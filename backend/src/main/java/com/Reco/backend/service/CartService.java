package com.Reco.backend.service;

import com.Reco.backend.dto.request.CartItemAddRequest;
import com.Reco.backend.dto.request.CartItemUpdateRequest;
import com.Reco.backend.dto.response.CartItemResponse;
import com.Reco.backend.dto.response.CartResponse;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.Cart;
import com.Reco.backend.model.CartItem;
import com.Reco.backend.model.Product;
import com.Reco.backend.model.User;
import com.Reco.backend.repository.CartItemRepository;
import com.Reco.backend.repository.CartRepository;
import com.Reco.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final User currentUser;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       User currentUser) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.currentUser = currentUser;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart() {
        Cart cart = getOrCreateCart(currentUser);

        return toResponse(cart);
    }

    public CartResponse addItem(CartItemAddRequest request) {
        User user = currentUser;
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (product.getStockQuantity() == 0) {
            throw new ResourceNotFoundException("Out of stock");
        }
        int newQuantity = request.getQuantity();
        if (cartItem != null) {
            newQuantity += cartItem.getQuantity();
        }
        if (newQuantity > product.getStockQuantity()) {
            throw new ResourceNotFoundException("Not enough stock");
        }
        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        }

        cartItemRepository.save(cartItem);
        incrementCartAdds(product, request.getQuantity());
        touchCart(cart);

        return toResponse(cart);
    }

    public CartResponse updateItem(Long productId, CartItemUpdateRequest request) {
        User user = currentUser;
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (product.getStockQuantity() == 0) {
            throw new ResourceNotFoundException("Out of stock");
        }

        if (request.getQuantity() > product.getStockQuantity()) {
            throw new ResourceNotFoundException("no enough stock");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        touchCart(cart);

        return toResponse(cart);
    }

    public CartResponse removeItem(Long productId) {
        User user = currentUser;
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItemRepository.delete(cartItem);
        touchCart(cart);

        return toResponse(cart);
    }

    public CartResponse clearCart() {
        User user = currentUser;
        Cart cart = getOrCreateCart(user);
        List<CartItem> items = cartItemRepository.findByCart(cart);
        cartItemRepository.deleteAll(items);
        touchCart(cart);

        return toResponse(cart);
    }

    private void touchCart(Cart cart) {
        cartRepository.save(cart);
    }

    private void incrementCartAdds(Product product, int quantity) {
        product.setTotalCartAdds(product.getTotalCartAdds() + quantity);
        productRepository.save(product);
    }

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        List<CartItemResponse> items = cartItems.stream()
                .map(item -> {
                    BigDecimal lineTotal = item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return new CartItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getPrice(),
                            item.getQuantity(),
                            lineTotal
                    );
                })
                .collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalQuantity = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return new CartResponse(
                cart.getId(),
                cart.getUpdatedAt(),
                items,
                totalQuantity,
                subtotal
        );
    }
}

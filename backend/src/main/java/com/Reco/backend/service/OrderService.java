package com.Reco.backend.service;

import com.Reco.backend.dto.response.OrderItemResponse;
import com.Reco.backend.dto.response.OrderResponse;
import com.Reco.backend.exception.CartEmptyException;
import com.Reco.backend.exception.InsufficientStockException;
import com.Reco.backend.exception.ResourceNotFoundException;
import com.Reco.backend.model.*;
import com.Reco.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final User currentUser;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final NotificationService notificationService;


    public OrderResponse createOrder() {
        User user = currentUser;
        Cart cart = cartService.getOrCreateCart(user);
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        if (cartItems.isEmpty()) {
            throw new CartEmptyException("Cart is empty");
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(this::cartLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for product: " + product.getName()
                );
            }
        }

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> OrderItem.builder()
                        .order(savedOrder)
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .priceAtPurchase(item.getProduct().getPrice())
                        .build())
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        cartItemRepository.deleteAll(cartItems);

        notificationService.notifyOrderStatusChange(savedOrder, OrderStatus.PENDING);

        return toResponse(savedOrder, orderItems);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        verifyOrderOwnership(order);
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser() {
        return getOrdersByUser(null);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(OrderStatus status) {
        User user = currentUser;
        List<Order> orders = (status == null)
                ? orderRepository.findAllByUser(user)
                : orderRepository.findByUserAndStatus(user, status);

        return orders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void verifyOrderOwnership(Order order) {
        User user = currentUser;
        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(Role.ADMIN)) {
            throw new ResourceNotFoundException("Order not found");
        }
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(status);
        Order updated = orderRepository.save(order);

        if (previousStatus != status) {
            notificationService.notifyOrderStatusChange(updated, status);
        }

        return toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<OrderItemResponse> getOrderItems(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        verifyOrderOwnership(order);

        return orderItemRepository.findByOrder(order)
                .stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());
    }

    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        paymentRepository.findByOrder(order).ifPresent(paymentRepository::delete);
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        orderItemRepository.deleteAll(items);
        orderRepository.delete(order);
    }

    private BigDecimal cartLineTotal(CartItem item) {
        return item.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        return toResponse(order, items);
    }

    private OrderResponse toResponse(Order order, List<OrderItem> items) {
        List<OrderItemResponse> itemResponses = items.stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                itemResponses
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        Product product = item.getProduct();
        BigDecimal lineTotal = item.getPriceAtPurchase()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new OrderItemResponse(
                product.getId(),
                product.getName(),
                item.getQuantity(),
                item.getPriceAtPurchase(),
                lineTotal
        );
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoCompleteOrders() {
        List<Order> pending = orderRepository.findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING, Instant.now().minus(2, ChronoUnit.MINUTES));

        for (Order order : pending) {
            order.setStatus(OrderStatus.COMPLETED);
            Order updated = orderRepository.save(order);
            notificationService.notifyOrderStatusChange(updated, OrderStatus.COMPLETED);
        }
    }
}

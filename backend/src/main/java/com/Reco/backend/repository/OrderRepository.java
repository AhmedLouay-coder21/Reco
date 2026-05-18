package com.Reco.backend.repository;

import com.Reco.backend.model.Order;
import com.Reco.backend.model.OrderStatus;
import com.Reco.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUser(User user);

    List<Order> findByUserAndStatus(User userQuery, OrderStatus status);

    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, Instant before);

}

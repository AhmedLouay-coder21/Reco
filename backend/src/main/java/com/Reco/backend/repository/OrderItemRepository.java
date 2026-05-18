package com.Reco.backend.repository;

import com.Reco.backend.model.Order;
import com.Reco.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);

    @Query(value = """
            SELECT oi2.product_id, COUNT(*) as freq,
                   (SELECT COUNT(DISTINCT order_id) FROM order_items WHERE product_id = oi2.product_id) as purchase_count
            FROM order_items oi1
            JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi2.product_id != oi1.product_id
            WHERE oi1.product_id = :productId
            GROUP BY oi2.product_id
            ORDER BY freq DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> findFrequentlyBoughtTogether(@Param("productId") Long productId,
                                                @Param("limit") int limit);

}

package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    // Custom query methods can be defined here if needed
    // For example, you can add methods to find order items by order ID or product ID
}

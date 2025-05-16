package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query methods can be defined here if needed
    // For example, you can add methods to find orders by customer ID or order status
}

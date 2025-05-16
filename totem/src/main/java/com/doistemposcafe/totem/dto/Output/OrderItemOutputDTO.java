package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record OrderItemOutputDTO(
        Long id,
        String name,
        double price,
        int quantity,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long productId,
        Long orderId) {}
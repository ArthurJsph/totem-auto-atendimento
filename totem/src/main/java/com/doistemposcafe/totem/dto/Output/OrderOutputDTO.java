package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record OrderOutputDTO(
        Long id,
        String name,
        String description,
        String status,
        String consumption_method,
        Double total,
        double price,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long userId,
        Long restaurantId) {}
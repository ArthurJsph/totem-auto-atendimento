package com.doistemposcafe.totem.dto.Input;

import java.time.LocalDateTime;

public record OrderInputDTO(
        String name,
        String description,
        String status,
        String consumption_method,
        Double total,
        double price,
        Long userId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long restaurantId) {}

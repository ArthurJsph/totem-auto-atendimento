package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record ProductOutputDTO(
        Long id,
        String name,
        String description,
        double price,
        String imageUrl,
        String[] ingredients,
        Integer amount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long restaurantId,
        Long menuCategoryId) {}
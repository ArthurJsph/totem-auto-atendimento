package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record MenuCategoryOutputDTO(
        Long id,
        String name,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long restaurantId) {}
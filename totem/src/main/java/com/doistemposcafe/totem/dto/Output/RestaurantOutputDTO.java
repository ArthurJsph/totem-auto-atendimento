package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record RestaurantOutputDTO(
        Long id,
        String name,
        String slug,
        String description,
        String avatarImageUrl,
        String coverImageUrl,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Long managerId) {}

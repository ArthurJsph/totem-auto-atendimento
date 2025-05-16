package com.doistemposcafe.totem.dto.Input;

public record RestaurantInputDTO(
        String name,
        String slug,
        String description,
        String avatarImageUrl,
        String coverImageUrl,
        Long managerId) {}
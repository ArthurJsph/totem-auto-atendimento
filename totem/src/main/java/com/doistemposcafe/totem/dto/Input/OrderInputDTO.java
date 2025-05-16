package com.doistemposcafe.totem.dto.Input;

public record OrderInputDTO(
        String name,
        String description,
        double price,
        Long userId,
        Long restaurantId) {}

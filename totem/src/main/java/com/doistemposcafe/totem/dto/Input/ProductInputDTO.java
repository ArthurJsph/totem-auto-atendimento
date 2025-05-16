package com.doistemposcafe.totem.dto.Input;

public record ProductInputDTO(
        String name,
        String description,
        double price,
        String imageUrl,
        String[] ingredients,
        Integer amount,
        Long restaurantId,
        Long menuCategoryId) {}

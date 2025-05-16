package com.doistemposcafe.totem.dto.Input;




public record OrderItemInputDTO(
        String name,
        Double price,
        Integer quantity,
        String status,
        Long productId,
        Long orderId
) {}

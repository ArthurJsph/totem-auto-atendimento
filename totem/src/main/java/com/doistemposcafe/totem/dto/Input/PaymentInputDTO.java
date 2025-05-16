package com.doistemposcafe.totem.dto.Input;

public record PaymentInputDTO(
        String method,
        double amount,
        String status,
        String transactionId,
        Long orderId,
        Long userId) {}

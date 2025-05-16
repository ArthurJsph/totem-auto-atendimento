package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record PaymentOutputDTO(
        Long id,
        String method,
        double amount,
        String status,
        String transactionId,
        LocalDateTime paymentDate,
        Long orderId,
        Long userId) {}

package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record UserOutputDTO(
        Long id,
        String name,
        String email,
        String phone,
        String cpf,
        String role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {}

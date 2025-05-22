package com.doistemposcafe.totem.dto.Output;

import java.time.LocalDateTime;

public record ManagerOutputDTO(
        Long id,
        String name,
        String email,
        String role,
        LocalDateTime createdAt) {}

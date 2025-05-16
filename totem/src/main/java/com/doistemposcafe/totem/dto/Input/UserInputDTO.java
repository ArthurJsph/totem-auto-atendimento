package com.doistemposcafe.totem.dto.Input;

public record UserInputDTO(
        String name,
        String email,
        String password,
        String phone,
        String cpf,
        String role) {}

package com.doistemposcafe.totem.dto.Input;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record ManagerInputDTO(
@NotBlank(message = "O nome é obrigatório!")
String name,
@NotBlank
String email,
@Size(min = 6)
String password,
LocalDateTime createdAt,
String role
) {}

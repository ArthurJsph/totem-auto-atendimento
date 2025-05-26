package com.doistemposcafe.totem.dto.Input;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ManagerInputDTO(
@NotBlank(message = "O nome é obrigatório!") String name,
@Email String email,
@Size(min = 6) String password,
String role
) {}

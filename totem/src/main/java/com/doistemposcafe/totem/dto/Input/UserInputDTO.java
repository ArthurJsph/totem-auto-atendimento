package com.doistemposcafe.totem.dto.Input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

public record UserInputDTO(

@NotBlank
String name,
@Email
String email,
@Size(min = 6)
String password,
String phone,
@NotBlank
@Size(min = 11, max = 11, message = "CPF deve ter 11 dígitos")
String cpf,
String role) {}

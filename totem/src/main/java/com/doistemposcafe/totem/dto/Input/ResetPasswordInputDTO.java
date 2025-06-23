package com.doistemposcafe.totem.dto.Input;

import lombok.Data;

@Data
public class ResetPasswordInputDTO {
    private String token;
    private String newPassword;
}

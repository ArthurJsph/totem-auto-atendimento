package com.doistemposcafe.totem.dto.Input;



public record ChangePasswordInputDTO(
        String currentPassword,
        String newPassword
) {

}

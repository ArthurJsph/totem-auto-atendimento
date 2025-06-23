package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.ForgotPasswordInputDTO;
import com.doistemposcafe.totem.dto.Input.ResetPasswordInputDTO;
import com.doistemposcafe.totem.dto.Input.UserInputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.dto.mapper.UserMapper;
import com.doistemposcafe.totem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;



    public UserController(UserService userService, UserMapper userMapper ) {
        this.userService = userService;
        this.userMapper = userMapper;

    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<UserOutputDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/list/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<UserOutputDTO> getUserById(@PathVariable Long id) {
        UserOutputDTO user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<UserOutputDTO> saveUser(@Valid @RequestBody UserInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveUser(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CLIENT')")
    public ResponseEntity<UserOutputDTO> updateUser(@PathVariable Long id, @RequestBody UserInputDTO dto) {
        return ResponseEntity.ok(userService.updateUser(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordInputDTO request) {
        try {
            userService.createPasswordResetTokenForUser(request.getEmail());
            return ResponseEntity.ok("Se um e-mail correspondente foi encontrado, um link de redefinição de senha foi enviado.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao processar sua solicitação.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordInputDTO request) {
        try {
            if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                return ResponseEntity.badRequest().body("A nova senha deve ter pelo menos 6 caracteres.");
            }
            userService.resetUserPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

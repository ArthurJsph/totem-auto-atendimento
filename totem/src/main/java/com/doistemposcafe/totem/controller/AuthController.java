package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.LoginInputDTO;
import com.doistemposcafe.totem.dto.Output.LoginOutputDTO;
import com.doistemposcafe.totem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginOutputDTO> login(@RequestBody LoginInputDTO requestDTO) {
        LoginOutputDTO loginResponse = authService.authenticate(requestDTO.email(), requestDTO.password());
        return ResponseEntity.ok(loginResponse);
    }
}

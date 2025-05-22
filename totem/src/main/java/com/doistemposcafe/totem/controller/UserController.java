package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.UserInputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.dto.mapper.UserMapper;
import com.doistemposcafe.totem.service.UserService;
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

    public UserController(UserService userService, UserMapper userMapper) {
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
    public ResponseEntity<UserOutputDTO> saveUser(@RequestBody UserInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveUser(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN', 'MANAGER', 'CLIENT')")
    public ResponseEntity<UserOutputDTO> updateUser(@PathVariable Long id, @RequestBody UserInputDTO dto) {
        return ResponseEntity.ok(userService.updateUser(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

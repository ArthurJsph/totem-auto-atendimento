package com.doistemposcafe.totem.controller;


import com.doistemposcafe.totem.dto.Input.ManagerInputDTO;
import com.doistemposcafe.totem.dto.Output.ManagerOutputDTO;
import com.doistemposcafe.totem.dto.mapper.ManagerMapper;
import com.doistemposcafe.totem.model.Manager;
import com.doistemposcafe.totem.service.ManagerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    private final ManagerService managerService;
    private final ManagerMapper managerMapper;

    public ManagerController(ManagerService managerService, ManagerMapper managerMapper) {
        this.managerService = managerService;
        this.managerMapper = managerMapper;
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ManagerOutputDTO>> getAllManagers() {
        return ResponseEntity.ok(managerService.getAllManagers());
    }

    @GetMapping("/list/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ManagerOutputDTO> getManagerById(@PathVariable Long id) {
        ManagerOutputDTO manager = managerService.getManagerById(id);
        return manager != null ? ResponseEntity.ok(manager) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ManagerOutputDTO> saveManager(@Valid @RequestBody ManagerInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(managerService.saveManager(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ManagerOutputDTO> updateManager(@PathVariable Long id, @RequestBody ManagerInputDTO dto) {
        return ResponseEntity.ok(managerService.updateManager(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteManager(@PathVariable Long id) {
        boolean deleted = managerService.deleteManager(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}


package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.MenuCategoryInputDTO;
import com.doistemposcafe.totem.dto.Output.MenuCategoryOutputDTO;
import com.doistemposcafe.totem.dto.mapper.MenuCategoryMapper;
import com.doistemposcafe.totem.service.MenuCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-categories")
public class MenuCategoryController {

    private final MenuCategoryService menuCategoryService;
    private final MenuCategoryMapper menuCategoryMapper;

    public MenuCategoryController(MenuCategoryService menuCategoryService,
                                  MenuCategoryMapper menuCategoryMapper) {
        this.menuCategoryService = menuCategoryService;
        this.menuCategoryMapper = menuCategoryMapper;
    }

    @GetMapping("/list")
    public ResponseEntity<List<MenuCategoryOutputDTO>> getAllCategories() {
        return ResponseEntity.ok(menuCategoryService.getAllCategories());
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<MenuCategoryOutputDTO> getCategoryById(@PathVariable Long id) {
        MenuCategoryOutputDTO category = menuCategoryService.getCategoryById(id);
        return category != null ? ResponseEntity.ok(category) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<MenuCategoryOutputDTO> saveCategory(@RequestBody MenuCategoryInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuCategoryService.saveCategory(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<MenuCategoryOutputDTO> updateCategory(@PathVariable Long id, @RequestBody MenuCategoryInputDTO dto) {
        return ResponseEntity.ok(menuCategoryService.updateCategory(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        boolean deleted = menuCategoryService.deleteCategory(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

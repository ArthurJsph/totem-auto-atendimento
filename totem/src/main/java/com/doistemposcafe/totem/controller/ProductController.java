package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.ProductInputDTO;
import com.doistemposcafe.totem.dto.Output.ProductOutputDTO;
import com.doistemposcafe.totem.dto.mapper.ProductMapper;
import com.doistemposcafe.totem.model.Product;
import com.doistemposcafe.totem.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    public ProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProductOutputDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<ProductOutputDTO> getProductById(@PathVariable Long id) {
        ProductOutputDTO product = productService.getProductById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ProductOutputDTO> saveProduct(@RequestBody ProductInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.saveProduct(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ProductOutputDTO> updateProduct(@PathVariable Long id, @RequestBody ProductInputDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

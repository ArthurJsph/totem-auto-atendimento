package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.OrderInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.dto.mapper.OrderMapper;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService,
                           OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<OrderOutputDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/list/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<OrderOutputDTO> getOrderById(@PathVariable Long id) {
        OrderOutputDTO order = orderService.getOrderById(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<OrderOutputDTO> saveOrder(@RequestBody OrderInputDTO inputDTO) {
        OrderOutputDTO saved = orderService.saveOrder(inputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderOutputDTO> updateOrder(@PathVariable Long id, @RequestBody OrderInputDTO inputDTO) {
        OrderOutputDTO updated = orderService.updateOrder(inputDTO, id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        boolean deleted = orderService.deleteOrder(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

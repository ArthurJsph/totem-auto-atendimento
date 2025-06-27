package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.OrderItemInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderItemOutputDTO;
import com.doistemposcafe.totem.dto.mapper.OrderItemMapper;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.model.OrderItem;
import com.doistemposcafe.totem.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;
    private final OrderItemMapper orderItemMapper;

    public OrderItemController(OrderItemService orderItemService,
                               OrderItemMapper orderItemMapper) {
        this.orderItemService = orderItemService;
        this.orderItemMapper = orderItemMapper;
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<OrderItemOutputDTO>> getAllItems() {
        return ResponseEntity.ok(orderItemService.getAllItems());
    }

    @GetMapping("/list/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<OrderItemOutputDTO> getItemById(@PathVariable Long id) {
        OrderItemOutputDTO item = orderItemService.getItemById(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<OrderItemOutputDTO> saveItem(@RequestBody OrderItemInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderItemService.saveItem(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<OrderItemOutputDTO> updateItem(@PathVariable Long id, @RequestBody OrderItemInputDTO dto) {
        return ResponseEntity.ok(orderItemService.updateItem(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        boolean deleted = orderItemService.deleteItem(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

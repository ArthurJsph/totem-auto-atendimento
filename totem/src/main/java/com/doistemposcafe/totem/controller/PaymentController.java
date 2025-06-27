package com.doistemposcafe.totem.controller;

import com.doistemposcafe.totem.dto.Input.PaymentInputDTO;
import com.doistemposcafe.totem.dto.Output.PaymentOutputDTO;
import com.doistemposcafe.totem.dto.mapper.PaymentMapper;
import com.doistemposcafe.totem.model.Payment;
import com.doistemposcafe.totem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentMapper paymentMapper;

    public PaymentController(PaymentService paymentService, PaymentMapper paymentMapper) {
        this.paymentService = paymentService;
        this.paymentMapper = paymentMapper;
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<PaymentOutputDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/list/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<PaymentOutputDTO> getPaymentById(@PathVariable Long id) {
        PaymentOutputDTO payment = paymentService.getPaymentById(id);
        return payment != null ? ResponseEntity.ok(payment) : ResponseEntity.notFound().build();
    }

    @PostMapping("/save")
    public ResponseEntity<PaymentOutputDTO> savePayment(@RequestBody PaymentInputDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.savePayment(dto));
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<PaymentOutputDTO> updatePayment(@PathVariable Long id, @RequestBody PaymentInputDTO dto) {
        return ResponseEntity.ok(paymentService.updatePayment(dto, id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        boolean deleted = paymentService.deletePayment(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}


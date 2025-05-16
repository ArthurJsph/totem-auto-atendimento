package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Custom query methods can be defined here if needed
    // For example, you can add methods to find payments by user ID or status
}

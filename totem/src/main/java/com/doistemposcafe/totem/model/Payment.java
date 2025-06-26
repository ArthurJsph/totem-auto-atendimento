package com.doistemposcafe.totem.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payment")
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String method;
    private double amount;
    private String status;
    @Column(name = "transaction_id")
    private String transactionId;
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;  // Mudança aqui

    // Relacionamento com Order (supondo que um pagamento tem um pedido)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    // Belongs to a user
}

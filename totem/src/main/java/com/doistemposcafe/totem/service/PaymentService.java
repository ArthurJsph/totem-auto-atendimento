package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.PaymentInputDTO;
import com.doistemposcafe.totem.dto.Output.PaymentOutputDTO;
import com.doistemposcafe.totem.dto.mapper.PaymentMapper;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.model.Payment;
import com.doistemposcafe.totem.repository.OrderRepository;
import com.doistemposcafe.totem.repository.PaymentRepository;
import com.doistemposcafe.totem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          PaymentMapper paymentMapper,
                          OrderRepository orderRepository,
                          UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public List<PaymentOutputDTO> getAllPayments() {
        return paymentMapper.toOutputDTOs(paymentRepository.findAll());
    }

    public PaymentOutputDTO getPaymentById(Long id) {
        return paymentRepository.findById(id).map(paymentMapper::toOutputDTO).orElse(null);
    }

    @Transactional
    public PaymentOutputDTO savePayment(PaymentInputDTO inputDTO) {
        Payment entity = paymentMapper.toEntity(inputDTO);

        if (inputDTO.orderId() != null) {
            entity.setOrder(orderRepository.findById(inputDTO.orderId()).orElse(null));
        }

        return paymentMapper.toOutputDTO(paymentRepository.save(entity));
    }

    @Transactional
    public PaymentOutputDTO updatePayment(PaymentInputDTO inputDTO, Long id) {
        return paymentRepository.findById(id)
                .map(existing -> {
                    existing.setMethod(inputDTO.method());
                    existing.setAmount(inputDTO.amount());
                    existing.setStatus(inputDTO.status());
                    existing.setTransactionId(inputDTO.transactionId());

                    if (inputDTO.orderId() != null) {
                        existing.setOrder(orderRepository.findById(inputDTO.orderId()).orElse(null));
                    }

                    return paymentRepository.save(existing);
                })
                .map(paymentMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));
    }

    @Transactional
    public boolean deletePayment(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

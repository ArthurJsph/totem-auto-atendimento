package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.OrderItemInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderItemOutputDTO;
import com.doistemposcafe.totem.dto.mapper.OrderItemMapper;
import com.doistemposcafe.totem.model.OrderItem;
import com.doistemposcafe.totem.repository.OrderItemRepository;
import com.doistemposcafe.totem.repository.OrderRepository;
import com.doistemposcafe.totem.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemMapper orderItemMapper;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            OrderItemMapper orderItemMapper,
                            ProductRepository productRepository,
                            OrderRepository orderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderItemMapper = orderItemMapper;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public List<OrderItemOutputDTO> getAllItems() {
        return orderItemMapper.toOutputDTOs(orderItemRepository.findAll());
    }

    public OrderItemOutputDTO getItemById(Long id) {
        return orderItemRepository.findById(id).map(orderItemMapper::toOutputDTO).orElse(null);
    }

    @Transactional
    public OrderItemOutputDTO saveItem(OrderItemInputDTO inputDTO) {
        OrderItem entity = orderItemMapper.toEntity(inputDTO);

        if (inputDTO.productId() != null) {
            entity.setProduct(productRepository.findById(inputDTO.productId().longValue()).orElse(null));
        }

        if (inputDTO.orderId() != null) {
            entity.setOrder(orderRepository.findById(inputDTO.orderId().longValue()).orElse(null));
        }

        return orderItemMapper.toOutputDTO(orderItemRepository.save(entity));
    }

    @Transactional
    public OrderItemOutputDTO updateItem(OrderItemInputDTO inputDTO, Long id) {
        return orderItemRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setPrice(inputDTO.price());
                    existing.setQuantity(inputDTO.quantity());
                    existing.setStatus(inputDTO.status());

                    if (inputDTO.productId() != null) {
                        existing.setProduct(productRepository.findById(inputDTO.productId().longValue()).orElse(null));
                    }

                    if (inputDTO.orderId() != null) {
                        existing.setOrder(orderRepository.findById(inputDTO.orderId().longValue()).orElse(null));
                    }

                    return orderItemRepository.save(existing);
                })
                .map(orderItemMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Item do pedido não encontrado"));
    }

    @Transactional
    public boolean deleteItem(Long id) {
        if (orderItemRepository.existsById(id)) {
            orderItemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

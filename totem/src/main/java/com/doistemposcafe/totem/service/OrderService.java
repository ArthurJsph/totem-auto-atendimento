package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.OrderInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.dto.mapper.OrderMapper;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.repository.OrderRepository;
import com.doistemposcafe.totem.repository.RestaurantRepository;
import com.doistemposcafe.totem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        UserRepository userRepository,
                        RestaurantRepository restaurantRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<OrderOutputDTO> getAllOrders() {
        return orderMapper.toOutputDTOs(orderRepository.findAll());
    }

    public OrderOutputDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toOutputDTO)
                .orElse(null);
    }

    @Transactional
    public OrderOutputDTO saveOrder(OrderInputDTO inputDTO) {
        Order entity = orderMapper.toEntity(inputDTO);

        if (inputDTO.userId() != null) {
            entity.setUser(userRepository.findById(inputDTO.userId()).orElse(null));
        }

        if (inputDTO.restaurantId() != null) {
            entity.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
        }

        return orderMapper.toOutputDTO(orderRepository.save(entity));
    }

    @Transactional
    public OrderOutputDTO updateOrder(OrderInputDTO inputDTO, Long id) {
        return orderRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setDescription(inputDTO.description());
                    existing.setPrice(inputDTO.price());

                    if (inputDTO.userId() != null) {
                        existing.setUser(userRepository.findById(inputDTO.userId()).orElse(null));
                    }

                    if (inputDTO.restaurantId() != null) {
                        existing.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
                    }

                    return orderRepository.save(existing);
                })
                .map(orderMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    @Transactional
    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

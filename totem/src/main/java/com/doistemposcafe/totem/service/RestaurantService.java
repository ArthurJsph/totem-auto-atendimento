package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.RestaurantInputDTO;
import com.doistemposcafe.totem.dto.Output.RestaurantOutputDTO;
import com.doistemposcafe.totem.dto.mapper.RestaurantMapper;
import com.doistemposcafe.totem.model.Restaurant;
import com.doistemposcafe.totem.repository.ManagerRepository;
import com.doistemposcafe.totem.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final ManagerRepository managerRepository;

    public RestaurantService(RestaurantRepository restaurantRepository,
                             RestaurantMapper restaurantMapper, ManagerRepository managerRepository) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantMapper = restaurantMapper;
        this.managerRepository = managerRepository;
    }

    public List<RestaurantOutputDTO> getRestaurants() {
        return restaurantMapper.toOutputDTOs(restaurantRepository.findAll());
    }

    public RestaurantOutputDTO getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .map(restaurantMapper::toOutputDTO)
                .orElse(null);
    }

    @Transactional
    public RestaurantOutputDTO saveRestaurant(RestaurantInputDTO inputDTO) {
        Restaurant entity = restaurantMapper.toEntity(inputDTO);
        return restaurantMapper.toOutputDTO(restaurantRepository.save(entity));
    }

    @Transactional
    public RestaurantOutputDTO updateRestaurant(RestaurantInputDTO inputDTO, Long id) {
        return restaurantRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setSlug(inputDTO.slug());
                    existing.setDescription(inputDTO.description());
                    existing.setAvatarImageUrl(inputDTO.avatarImageUrl());
                    existing.setCoverImageUrl(inputDTO.coverImageUrl());
                    existing.setUpdatedAt(LocalDateTime.now());

                    if (inputDTO.managerId() != null) {

                        existing.setManager(managerRepository.findById(inputDTO.managerId()).orElse(null));
                    }

                    return restaurantRepository.save(existing);
                })
                .map(restaurantMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado"));
    }

    @Transactional
    public boolean deleteRestaurant(Long id) {
        if (restaurantRepository.existsById(id)) {
            restaurantRepository.deleteById(id);
            return true;
        }
        return false;
    }
}



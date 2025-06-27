package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.MenuCategoryInputDTO;
import com.doistemposcafe.totem.dto.Output.MenuCategoryOutputDTO;
import com.doistemposcafe.totem.dto.mapper.MenuCategoryMapper;
import com.doistemposcafe.totem.model.MenuCategory;
import com.doistemposcafe.totem.repository.MenuCategoryRepository;
import com.doistemposcafe.totem.repository.RestaurantRepository;
import jakarta.persistence.Entity;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuCategoryService {

    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuCategoryMapper menuCategoryMapper;
    private final RestaurantRepository restaurantRepository;

    public MenuCategoryService(MenuCategoryRepository menuCategoryRepository,
                               MenuCategoryMapper menuCategoryMapper,
                               RestaurantRepository restaurantRepository) {
        this.menuCategoryRepository = menuCategoryRepository;
        this.menuCategoryMapper = menuCategoryMapper;
        this.restaurantRepository = restaurantRepository;
    }

    public List<MenuCategoryOutputDTO> getAllCategories() {
        return menuCategoryMapper.toOutputDTOs(menuCategoryRepository.findAll());
    }

    public MenuCategoryOutputDTO getCategoryById(Long id) {
        return menuCategoryRepository.findById(id).map(menuCategoryMapper::toOutputDTO).orElse(null);
    }

    @Transactional
    public MenuCategoryOutputDTO saveCategory(MenuCategoryInputDTO inputDTO) {
        MenuCategory entity = menuCategoryMapper.toEntity(inputDTO);

        if (inputDTO.restaurantId() != null) {
            entity.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
        }

        return menuCategoryMapper.toOutputDTO(menuCategoryRepository.save(entity));
    }

    @Transactional
    public MenuCategoryOutputDTO updateCategory(MenuCategoryInputDTO inputDTO, Long id) {
        return menuCategoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());

                    if (inputDTO.restaurantId() != null) {
                        existing.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
                    }

                    return menuCategoryRepository.save(existing);
                })
                .map(menuCategoryMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    @Transactional
    public boolean deleteCategory(Long id) {
        if (menuCategoryRepository.existsById(id)) {
            menuCategoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
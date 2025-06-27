package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.ProductInputDTO;
import com.doistemposcafe.totem.dto.Output.ProductOutputDTO;
import com.doistemposcafe.totem.dto.mapper.ProductMapper;
import com.doistemposcafe.totem.model.Product;
import com.doistemposcafe.totem.repository.MenuCategoryRepository;
import com.doistemposcafe.totem.repository.ProductRepository;
import com.doistemposcafe.totem.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final RestaurantRepository restaurantRepository;
    private final MenuCategoryRepository menuCategoryRepository;

    public ProductService(ProductRepository productRepository,
                          ProductMapper productMapper,
                          RestaurantRepository restaurantRepository,
                          MenuCategoryRepository menuCategoryRepository) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.restaurantRepository = restaurantRepository;
        this.menuCategoryRepository = menuCategoryRepository;
    }

    public List<ProductOutputDTO> getAllProducts() {
        return productMapper.toOutputDTOs(productRepository.findAll());
    }

    public ProductOutputDTO getProductById(Long id) {
        return productRepository.findById(id).map(productMapper::toOutputDTO).orElse(null);
    }

    @Transactional
    public ProductOutputDTO saveProduct(ProductInputDTO inputDTO) {
        Product entity = productMapper.toEntity(inputDTO);

        if (inputDTO.restaurantId() != null) {
            entity.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
        }

        if (inputDTO.menuCategoryId() != null) {
            entity.setMenuCategory(menuCategoryRepository.findById(Long.valueOf(inputDTO.menuCategoryId())).orElse(null));
        }

        return productMapper.toOutputDTO(productRepository.save(entity));
    }

    @Transactional
    public ProductOutputDTO updateProduct(ProductInputDTO inputDTO, Long id) {
        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setDescription(inputDTO.description());
                    existing.setPrice(inputDTO.price());
                    existing.setImageUrl(inputDTO.imageUrl());
                    existing.setIngredients(inputDTO.ingredients());
                    existing.setAmount(inputDTO.amount());

                    if (inputDTO.restaurantId() != null) {
                        existing.setRestaurant(restaurantRepository.findById(inputDTO.restaurantId()).orElse(null));
                    }

                    if (inputDTO.menuCategoryId() != null) {
                        existing.setMenuCategory(menuCategoryRepository.findById(Long.valueOf(inputDTO.menuCategoryId())).orElse(null));
                    }

                    return productRepository.save(existing);
                })
                .map(productMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
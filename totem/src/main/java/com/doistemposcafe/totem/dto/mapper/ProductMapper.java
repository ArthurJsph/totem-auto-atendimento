package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.ProductInputDTO;
import com.doistemposcafe.totem.dto.Output.ProductOutputDTO;
import com.doistemposcafe.totem.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toEntity(ProductInputDTO dto);

    @Mapping(target = "restaurantId", source = "restaurant.id")
    @Mapping(target = "menuCategoryId", source = "menuCategory.id")
    ProductOutputDTO toOutputDTO(Product entity);

    List<ProductOutputDTO> toOutputDTOs(List<Product> products);
}

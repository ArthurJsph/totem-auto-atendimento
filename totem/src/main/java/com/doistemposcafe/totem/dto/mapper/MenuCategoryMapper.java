package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.MenuCategoryInputDTO;
import com.doistemposcafe.totem.dto.Output.MenuCategoryOutputDTO;
import com.doistemposcafe.totem.model.MenuCategory;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MenuCategoryMapper {
    MenuCategory toEntity(MenuCategoryInputDTO dto);
    MenuCategoryOutputDTO toOutputDTO(MenuCategory entity);
    List<MenuCategoryOutputDTO> toOutputDTOs(List<MenuCategory> menuCategories);
}
package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.RestaurantInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.dto.Output.RestaurantOutputDTO;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.model.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RestaurantMapper {
    Restaurant toEntity(RestaurantInputDTO dto);
    RestaurantOutputDTO toOutputDTO(Restaurant restaurant);
    List<RestaurantOutputDTO> toOutputDTOs(List<Restaurant> restaurants);
}

package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.OrderInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order toEntity(OrderInputDTO dto);
    @Mapping(source = "user.id", target = "userId") // Maps entity.getUser().getId() to dto.setUserId()
    @Mapping(source = "restaurant.id", target = "restaurantId")
    OrderOutputDTO toOutputDTO(Order entity);
    List<OrderOutputDTO> toOutputDTOs(List<Order> orders);
}

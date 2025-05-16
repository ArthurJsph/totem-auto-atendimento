package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.OrderInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    Order toEntity(OrderInputDTO dto);
    OrderOutputDTO toOutputDTO(Order entity);
    List<OrderOutputDTO> toOutputDTOs(List<Order> orders);
}

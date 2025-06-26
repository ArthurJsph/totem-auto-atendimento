package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.OrderItemInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderItemOutputDTO;
import com.doistemposcafe.totem.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItem toEntity(OrderItemInputDTO dto);

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "productId", source = "product.id")
    OrderItemOutputDTO toOutputDTO(OrderItem item);
    List<OrderItemOutputDTO> toOutputDTOs(List<OrderItem> items);
}
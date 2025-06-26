package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.PaymentInputDTO;
import com.doistemposcafe.totem.dto.Output.PaymentOutputDTO;
import com.doistemposcafe.totem.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    Payment toEntity(PaymentInputDTO dto);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");

    @Mapping(target = "orderId", source = "order.id")
    PaymentOutputDTO toOutputDTO(Payment entity);

    default String formatDateTime(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(formatter) : null;
    }

    List<PaymentOutputDTO> toOutputDTOs(List<Payment> payments);
}


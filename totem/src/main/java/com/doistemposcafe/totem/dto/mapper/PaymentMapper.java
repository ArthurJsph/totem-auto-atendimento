package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.PaymentInputDTO;
import com.doistemposcafe.totem.dto.Output.PaymentOutputDTO;
import com.doistemposcafe.totem.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentMapper INSTANCE = Mappers.getMapper(PaymentMapper.class);

    Payment toEntity(PaymentInputDTO dto);
    PaymentOutputDTO toOutputDTO(Payment entity);
    List<PaymentOutputDTO> toOutputDTOs(List<Payment> payments);
}

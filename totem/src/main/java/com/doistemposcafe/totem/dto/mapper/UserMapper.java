package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.UserInputDTO;
import com.doistemposcafe.totem.dto.Output.OrderOutputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.model.Order;
import com.doistemposcafe.totem.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserInputDTO dto);
    UserOutputDTO toOutputDTO(User entity);
    List<UserOutputDTO> toOutputDTOs(List<User> users);
}

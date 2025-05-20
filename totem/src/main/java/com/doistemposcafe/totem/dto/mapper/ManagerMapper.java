package com.doistemposcafe.totem.dto.mapper;

import com.doistemposcafe.totem.dto.Input.ManagerInputDTO;
import com.doistemposcafe.totem.dto.Output.ManagerOutputDTO;
import com.doistemposcafe.totem.model.Manager;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ManagerMapper {
    Manager toEntity(ManagerInputDTO dto);
    ManagerOutputDTO toOutputDTO(Manager entity);
    List<ManagerOutputDTO> toOutputDTOs(List<Manager> managers);
}

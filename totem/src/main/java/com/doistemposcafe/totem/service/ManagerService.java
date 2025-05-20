package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.ManagerInputDTO;
import com.doistemposcafe.totem.dto.Output.ManagerOutputDTO;
import com.doistemposcafe.totem.dto.mapper.ManagerMapper;
import com.doistemposcafe.totem.model.Manager;
import com.doistemposcafe.totem.model.Role;
import com.doistemposcafe.totem.repository.ManagerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final ManagerMapper managerMapper;
    private final PasswordEncoder passwordEncoder;

    public ManagerService(ManagerRepository managerRepository,
                          ManagerMapper managerMapper, PasswordEncoder passwordEncoder) {
        this.managerRepository = managerRepository;
        this.managerMapper = managerMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<ManagerOutputDTO> getAllManagers() {
        return managerMapper.toOutputDTOs(managerRepository.findAll());
    }

    public ManagerOutputDTO getManagerById(Long id) {
        return managerRepository.findById(id).map(managerMapper::toOutputDTO).orElse(null);
    }

    public ManagerOutputDTO saveManager(ManagerInputDTO inputDTO) {
        Manager entity = managerMapper.toEntity(inputDTO);
        entity.setPassword(passwordEncoder.encode(inputDTO.password()));

        // Converte String para Enum Role
        if (inputDTO.role() != null) {
            entity.setRole(Role.valueOf(inputDTO.role()));
        }

        Manager savedManager = managerRepository.save(entity);
        return managerMapper.toOutputDTO(savedManager);
    }


    public ManagerOutputDTO updateManager(ManagerInputDTO inputDTO, Long id) {
        return managerRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setEmail(inputDTO.email());
                    existing.setPassword(inputDTO.password());

                    return managerRepository.save(existing);
                })
                .map(managerMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Gerente não encontrado"));
    }

    public boolean deleteManager(Long id) {
        if (managerRepository.existsById(id)) {
            managerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

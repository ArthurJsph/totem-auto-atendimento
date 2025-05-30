package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.UserInputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.dto.mapper.UserMapper;
import com.doistemposcafe.totem.model.Role;
import com.doistemposcafe.totem.model.User;
import com.doistemposcafe.totem.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserOutputDTO> getAllUsers() {
        return userMapper.toOutputDTOs(userRepository.findAll());
    }

    public UserOutputDTO getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toOutputDTO).orElse(null);
    }

    public UserOutputDTO saveUser(UserInputDTO inputDTO) {
        User user = userMapper.toEntity(inputDTO);
        user.setPassword(passwordEncoder.encode(inputDTO.password()));
        return userMapper.toOutputDTO(userRepository.save(user));
    }

    public UserOutputDTO updateUser(UserInputDTO inputDTO, Long id) {
        return userRepository.findById(id)
                .map(existing -> {
                    existing.setName(inputDTO.name());
                    existing.setEmail(inputDTO.email());
                    existing.setPassword(inputDTO.password());
                    existing.setPhone(inputDTO.phone());
                    existing.setCpf(inputDTO.cpf());
                    existing.setRole(Role.valueOf(inputDTO.role()));
                    return userRepository.save(existing);
                })
                .map(userMapper::toOutputDTO)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

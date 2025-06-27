package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Output.LoginOutputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.dto.mapper.UserMapper;
import com.doistemposcafe.totem.model.User;
import com.doistemposcafe.totem.repository.UserRepository;
import com.doistemposcafe.totem.security.Jwt;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final Jwt jwt;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, Jwt jwt, UserDetailsService userDetailsService, UserMapper userMapper, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwt = jwt;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
        this.userRepository = userRepository;
    }

    public LoginOutputDTO authenticate(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwt.generateToken(userDetails);
        User userEntity = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o email: " + username));

        UserOutputDTO userOutputDTO = userMapper.toOutputDTO(userEntity);
        return new LoginOutputDTO(token, userOutputDTO);
    }
}


package com.doistemposcafe.totem.security;

import com.doistemposcafe.totem.model.Manager;
import com.doistemposcafe.totem.model.User;
import com.doistemposcafe.totem.repository.ManagerRepository;
import com.doistemposcafe.totem.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetails implements UserDetailsService {

    private final UserRepository userRepository;
    private final ManagerRepository managerRepository;

    public CustomUserDetails(UserRepository userRepository, ManagerRepository managerRepository) {
        this.userRepository = userRepository;
        this.managerRepository = managerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(UserDetailsImpl::fromUser)
                .or(() -> managerRepository.findByEmail(username).map(UserDetailsImpl::fromManager))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
    }
}



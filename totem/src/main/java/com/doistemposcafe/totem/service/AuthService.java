package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.security.Jwt;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final Jwt jwt;
    private final UserDetailsService userDetailsService;

    public AuthService(AuthenticationManager authenticationManager, Jwt jwt, UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwt = jwt;
        this.userDetailsService = userDetailsService;
    }
    public String authenticate(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwt.generateToken(userDetails);
    }
}

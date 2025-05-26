package com.doistemposcafe.totem.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Component
public class Jwt {
    @Value("${jwt.secret}")
   private String SECRET;
    @Value("${jwt.expiration.time}")
    private long EXPIRATION_TIME; // 10 hours

    public String generateToken(UserDetails userDetails) {

        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withClaim("authorities", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET));
    }

    public String extractEmail(String token) {
        return JWT.decode(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return JWT.decode(token).getExpiresAt().before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String getTokenFromRequest(String requestHeader) {
        if (requestHeader != null && requestHeader.startsWith("Bearer ")) {
            return requestHeader.substring(7);
        }
        return null;
    }

    public List<String> extractAuthorities(String token) {
        return JWT.decode(token)
                .getClaim("authorities")
                .asList(String.class);
    }



}
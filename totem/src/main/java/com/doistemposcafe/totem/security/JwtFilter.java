package com.doistemposcafe.totem.security;

import com.doistemposcafe.totem.exception.TokenExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // Importe UserDetails
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException; // Importe para tratar a exceção
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private Jwt jwt;

    @Autowired
    private UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwt.extractEmail(token); // Extrai o email (username) do token
            } catch (Exception e) {
                // Logar erro de JWT inválido/expirado/malformado
                logger.error("Erro ao extrair username do JWT: " + e.getMessage());
                // Não precisa lançar exceção aqui, apenas não autenticar
            }
        }

        // Se o username foi extraído e não há autenticação no contexto atual
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // 1. Carrega os UserDetails completos usando o UserDetailsService
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 2. Valida o token (expiração e se o email no token corresponde ao UserDetails)
                if (jwt.validateToken(token, userDetails)) {
                    // 3. Cria o UsernamePasswordAuthenticationToken passando o UserDetails como principal
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities() // Use userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 4. Seta o Authentication no SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    // Token inválido (mas não expirado) ou não corresponde ao userDetails
                    logger.warn("JWT inválido ou não corresponde ao usuário para: " + username);
                }
            } catch (UsernameNotFoundException e) {
                logger.warn("Usuário não encontrado para JWT: " + username);
            } catch (Exception e) {
                logger.error("Erro inesperado ao processar JWT para o usuário: " + username, e);
            }
        }

        // Tratamento de Token Expirado:
        // É melhor lançar a exceção de TokenExpiredException para que um @ControllerAdvice
        // possa capturá-la e retornar um 401 Unauthorized com uma mensagem adequada.
        // Isso deve ser feito APÓS a tentativa de autenticação, para não bloquear
        // requisições que não precisam de autenticação.
        if (token != null && jwt.isTokenExpired(token)) {
            throw new TokenExpiredException("Token expirado");
        }

        filterChain.doFilter(request, response);
    }
}
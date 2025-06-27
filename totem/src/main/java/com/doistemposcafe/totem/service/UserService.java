package com.doistemposcafe.totem.service;

import com.doistemposcafe.totem.dto.Input.UserInputDTO;
import com.doistemposcafe.totem.dto.Output.UserOutputDTO;
import com.doistemposcafe.totem.dto.mapper.UserMapper;
import com.doistemposcafe.totem.model.PasswordResetToken;
import com.doistemposcafe.totem.model.Role;
import com.doistemposcafe.totem.model.User;
import com.doistemposcafe.totem.repository.PasswordResetTokenRepository;
import com.doistemposcafe.totem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final long EXPIRATION_TIME_MINUTES = 30;
    public UserService(UserRepository userRepository,
                       UserMapper userMapper, PasswordEncoder passwordEncoder, PasswordResetTokenRepository tokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    public List<UserOutputDTO> getAllUsers() {
        return userMapper.toOutputDTOs(userRepository.findAll());
    }

    public UserOutputDTO getUserById(Long id) {
        return userRepository.findById(id).map(userMapper::toOutputDTO).orElse(null);
    }

    @Transactional
    public UserOutputDTO saveUser(UserInputDTO inputDTO) {
        User user = userMapper.toEntity(inputDTO);
        user.setPassword(passwordEncoder.encode(inputDTO.password()));
        return userMapper.toOutputDTO(userRepository.save(user));
    }

    @Transactional
    public UserOutputDTO updateUser(UserInputDTO inputDTO, Long id) {
        return userRepository.findById(id)
                .map(existingUser -> {

                    if (inputDTO.name() != null && !inputDTO.name().trim().isEmpty()) {
                        existingUser.setName(inputDTO.name());
                    }

                    if (inputDTO.email() != null && !inputDTO.email().trim().isEmpty()) {
                        existingUser.setEmail(inputDTO.email());
                    }

                    if (inputDTO.password() != null && !inputDTO.password().trim().isEmpty()) {
                        existingUser.setPassword(passwordEncoder.encode(inputDTO.password()));
                    }

                    if (inputDTO.phone() != null && !inputDTO.phone().trim().isEmpty()) {
                        existingUser.setPhone(inputDTO.phone());
                    }

                    if (inputDTO.cpf() != null && !inputDTO.cpf().trim().isEmpty()) {
                        existingUser.setCpf(inputDTO.cpf());
                    }

                    if (inputDTO.role() != null && !inputDTO.role().trim().isEmpty()) {
                        existingUser.setRole(Role.valueOf(inputDTO.role()));
                    }

                    return userMapper.toOutputDTO(userRepository.save(existingUser));
                })
                .orElseThrow(() -> new RuntimeException("Usuário com ID " + id + " não encontrado."));
    }

    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
    @Transactional
    public String createPasswordResetTokenForUser(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            System.out.println("Solicitação de redefinição de senha para e-mail não encontrado (segurança): " + email);
            return null;
        }

        User user = userOptional.get();
        tokenRepository.findByUser(user).ifPresent(tokenRepository::delete);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_TIME_MINUTES);
        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        tokenRepository.save(resetToken);

        String recipientAddress = user.getEmail();
        String subject = "Seu Código de Redefinição de Senha - Dois Tempos Café";
        String message = "Olá " + user.getName() + ",\n\n"
                + "Você solicitou uma redefinição de senha para sua conta.\n"
                + "Seu código de redefinição é: \n\n" // <-- Frase adicionada
                + token + "\n\n"
                + "Por favor, use este código na página de redefinição de senha para continuar.\n"
                + "Este código é válido por " + EXPIRATION_TIME_MINUTES + " minutos.\n"
                + "Se você não solicitou esta redefinição, por favor, ignore este e-mail.\n\n"
                + "Atenciosamente,\n"
                + "Equipe Dois Tempos Café";

        emailService.sendSimpleMail(recipientAddress, subject, message);

        return token;
    }

    @Transactional
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta.");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter pelo menos 6 caracteres.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    @Transactional
    public void resetUserPassword(String token, String newPassword) {

        if (newPassword == null || newPassword.trim().isEmpty() || newPassword.length() < 6) {
            throw new RuntimeException("A nova senha deve ter pelo menos 6 caracteres e não pode ser vazia.");
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            throw new RuntimeException("Token de redefinição inválido.");
        }

        PasswordResetToken resetToken = tokenOptional.get();

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken); // Deleta o token expirado para limpeza.
            throw new RuntimeException("Token de redefinição expirado. Por favor, solicite um novo.");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }
}

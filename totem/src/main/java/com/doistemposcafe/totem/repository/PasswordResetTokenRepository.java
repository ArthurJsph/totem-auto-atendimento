package com.doistemposcafe.totem.repository;

import com.doistemposcafe.totem.model.PasswordResetToken;
import com.doistemposcafe.totem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
    void deleteByUser(User user);
}

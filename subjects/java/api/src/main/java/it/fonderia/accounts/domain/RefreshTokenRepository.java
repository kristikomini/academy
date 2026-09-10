package it.fonderia.accounts.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /** By hash, never by the token itself — the token is not stored. */
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /** Every session for one user, for the revoke-the-family case. */
    List<RefreshToken> findByUserId(UUID userId);
}

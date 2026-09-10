package it.fonderia.accounts.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * The single-use ticket a recovery code buys. Short-lived, hashed, spent on use.
 *
 * <p>It exists so that presenting the recovery code and choosing a new password are two
 * requests rather than one — the same shape an emailed reset link has, without the email.
 */
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "used_at")
    private Instant usedAt;

    protected PasswordResetToken() {
    }

    public PasswordResetToken(UUID userId, String tokenHash, Instant createdAt, Instant expiresAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public UUID getUserId() { return userId; }

    public boolean isSpendableAt(Instant now) {
        return usedAt == null && expiresAt.isAfter(now);
    }

    public void spend(Instant now) {
        this.usedAt = now;
    }
}

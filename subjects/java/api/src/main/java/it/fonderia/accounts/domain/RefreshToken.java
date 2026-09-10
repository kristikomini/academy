package it.fonderia.accounts.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * One session, hashed at rest and rotated on every use.
 *
 * <p>Blueprint §5.4 decision 4. {@code replacedByTokenHash} is what makes replay
 * detection possible: if a token that has already been rotated turns up again, the server
 * cannot tell a thief from a client that lost a response — so it revokes every session for
 * that user rather than guessing which one it is looking at.
 */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

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

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "replaced_by_token_hash", length = 64)
    private String replacedByTokenHash;

    protected RefreshToken() {
    }

    public RefreshToken(UUID userId, String tokenHash, Instant createdAt, Instant expiresAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    public UUID getUserId() { return userId; }
    public String getTokenHash() { return tokenHash; }
    public Instant getRevokedAt() { return revokedAt; }
    public String getReplacedByTokenHash() { return replacedByTokenHash; }

    public boolean isActiveAt(Instant now) {
        return revokedAt == null && expiresAt.isAfter(now);
    }

    /** Already rotated once, so presenting it now is a replay. */
    public boolean wasRotated() {
        return replacedByTokenHash != null;
    }

    public void rotateTo(String replacementHash, Instant now) {
        this.replacedByTokenHash = replacementHash;
        this.revokedAt = now;
    }

    public void revoke(Instant now) {
        if (this.revokedAt == null) {
            this.revokedAt = now;
        }
    }
}

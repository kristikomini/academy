package it.fonderia.accounts.service;

import it.fonderia.accounts.domain.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Revoking every session for a user, in its own transaction.
 *
 * <p><b>A separate class, and that is the point rather than an accident.</b>
 * {@code REQUIRES_NEW} lives on a proxy, and a call to {@code this.method()} inside
 * {@link AuthService} would never reach that proxy — the annotation would be present, the
 * propagation would silently not happen, and the revocation would roll back with the
 * exception that reports it. Self-invocation does not go through the proxy; that is the
 * rule from chapter 11, and this is what obeying it looks like in a codebase.
 *
 * <p>Why the propagation is needed at all: the replay path revokes and then throws. In one
 * transaction the throw undoes the revocation, so the response says "your session has been
 * ended" while every session is still live. A security control that reports success and
 * does nothing is worse than not having it.
 */
@Service
public class SessionRevoker {

    private final RefreshTokenRepository refreshTokens;

    public SessionRevoker(RefreshTokenRepository refreshTokens) {
        this.refreshTokens = refreshTokens;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revokeAllSessions(UUID userId, Instant now) {
        refreshTokens.findByUserId(userId).forEach(token -> {
            token.revoke(now);
            refreshTokens.save(token);
        });
    }
}

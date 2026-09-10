package it.fonderia.accounts.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

/**
 * A learner.
 *
 * <p>Named {@code UserAccount} rather than {@code User} because {@code User} is a reserved
 * word in several SQL engines and collides with Spring Security's type — a small naming
 * decision that saves a confusing error later.
 *
 * <p>Note what is <b>not</b> here: an email address. Blueprint §5.4 decision 1 — an
 * address this service can never send to could never be verified, written to, or used to
 * recover an account, so storing one would be personal data collected for no purpose.
 */
@Entity
@Table(name = "users")
public class UserAccount {

    @Id
    private UUID id;

    /** Stored already normalised — trimmed and lower-cased. The UNIQUE index is the rule. */
    @Column(nullable = false, unique = true, length = 32)
    private String username;

    @Column(name = "display_name", nullable = false, length = 60)
    private String displayName;

    @Column(name = "password_hash", nullable = false, length = 128)
    private String passwordHash;

    @Column(name = "password_salt", nullable = false, length = 64)
    private String passwordSalt;

    @Column(name = "password_iterations", nullable = false)
    private int passwordIterations;

    @Column(name = "recovery_code_hash", nullable = false, length = 64)
    private String recoveryCodeHash;

    @Column(name = "recovery_code_issued_at", nullable = false)
    private Instant recoveryCodeIssuedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_sign_in_at")
    private Instant lastSignInAt;

    @Column(name = "failed_attempts", nullable = false)
    private int failedAttempts;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "show_on_leaderboard", nullable = false)
    private boolean showOnLeaderboard = true;

    protected UserAccount() {
    }

    public UserAccount(UUID id, String username, String displayName, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getUsername() { return username; }
    public String getDisplayName() { return displayName; }
    public String getPasswordHash() { return passwordHash; }
    public String getPasswordSalt() { return passwordSalt; }
    public int getPasswordIterations() { return passwordIterations; }
    public String getRecoveryCodeHash() { return recoveryCodeHash; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastSignInAt() { return lastSignInAt; }
    public int getFailedAttempts() { return failedAttempts; }
    public Instant getLockedUntil() { return lockedUntil; }
    public boolean isShowOnLeaderboard() { return showOnLeaderboard; }

    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setShowOnLeaderboard(boolean visible) { this.showOnLeaderboard = visible; }

    public void setPassword(String hash, String salt, int iterations) {
        this.passwordHash = hash;
        this.passwordSalt = salt;
        this.passwordIterations = iterations;
    }

    public void setRecoveryCode(String hash, Instant issuedAt) {
        this.recoveryCodeHash = hash;
        this.recoveryCodeIssuedAt = issuedAt;
    }

    /** True while the account is locked. Blueprint §5.4 decision 5 — per account. */
    public boolean isLockedAt(Instant now) {
        return lockedUntil != null && lockedUntil.isAfter(now);
    }

    public void recordFailure(Instant now, int maxAttempts, Duration lockFor) {
        failedAttempts++;
        if (failedAttempts >= maxAttempts) {
            lockedUntil = now.plus(lockFor);
            /* The counter resets with the lock, so the next lock needs a fresh run of
               failures rather than one more attempt on top of an old tally. */
            failedAttempts = 0;
        }
    }

    public void recordSuccess(Instant now) {
        failedAttempts = 0;
        lockedUntil = null;
        lastSignInAt = now;
    }
}

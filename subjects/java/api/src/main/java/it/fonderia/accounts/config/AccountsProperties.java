package it.fonderia.accounts.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

/**
 * Everything this service can be told, in one type.
 *
 * <p>Blueprint §5.5: it must run with <b>no configuration at all</b>, so every value here
 * has a working default. The one that does not is the signing key, and that is the point
 * of {@link #jwtSigningKey()} — see the comment there.
 */
@ConfigurationProperties(prefix = "accounts")
public record AccountsProperties(

    /**
     * The HMAC key for access tokens. Blank means "generate one in development".
     *
     * <p>No key is committed, ever: anyone holding it can mint a token for any user.
     * Outside development a missing key stops the process at start-up rather than
     * producing a service that boots green and fails at the first sign-in — configuration
     * is validated at start-up, not at first use.
     */
    String jwtSigningKey,

    /** Short, because a JWT cannot be revoked. */
    Duration accessTokenLifetime,

    /** Long, because this one is stateful and revocable. */
    Duration refreshTokenLifetime,

    Duration resetTicketLifetime,

    /** The mastery denominator. Must equal the site manifest's chapter count. */
    int chapterCount,

    /** Per IP, on /api/auth/* only. */
    int authRequestsPerMinute,

    /** Consecutive failures before the account locks. Per account, not per IP. */
    int maxFailedAttempts,

    Duration lockoutDuration,

    /**
     * CORS origins. "null" is in the list on purpose: it is the literal Origin header a
     * page opened from file:// sends, and the sites are meant to work from file://.
     */
    List<String> allowedOrigins
) {
    public AccountsProperties {
        if (jwtSigningKey == null) { jwtSigningKey = ""; }
        if (accessTokenLifetime == null) { accessTokenLifetime = Duration.ofMinutes(15); }
        if (refreshTokenLifetime == null) { refreshTokenLifetime = Duration.ofDays(30); }
        if (resetTicketLifetime == null) { resetTicketLifetime = Duration.ofMinutes(15); }
        if (chapterCount <= 0) { chapterCount = 52; }
        if (authRequestsPerMinute <= 0) { authRequestsPerMinute = 10; }
        if (maxFailedAttempts <= 0) { maxFailedAttempts = 8; }
        if (lockoutDuration == null) { lockoutDuration = Duration.ofMinutes(15); }
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            allowedOrigins = List.of("null", "http://localhost:8100", "http://localhost:8099",
                "http://localhost:8101", "http://127.0.0.1:8100");
        }
    }
}

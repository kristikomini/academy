package it.fonderia.accounts.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import it.fonderia.accounts.config.AccountsProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.time.Clock;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

/**
 * Signs and verifies the access token.
 *
 * <p><b>The signing key is the whole security of this service.</b> Anyone holding it can
 * mint a token for any user, so it is never committed. Blueprint §5.5:
 *
 * <ul>
 *   <li><b>Development</b> — generated on first run and kept in a git-ignored file, so
 *       restarting does not sign everybody out.</li>
 *   <li><b>Anywhere else</b> — required. A missing key stops the process at start-up
 *       rather than producing a service that boots green and fails at the first sign-in.
 *       Configuration is validated at start-up, not at first use.</li>
 * </ul>
 *
 * <p>The token carries the user id as its subject and nothing sensitive: a JWT is signed,
 * not encrypted, so its payload is readable by anyone holding it.
 */
@Component
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final Path DEV_KEY_FILE = Path.of("data", "dev-signing-key.txt");

    private final SecretKey key;
    private final AccountsProperties properties;
    private final Clock clock;

    public JwtService(AccountsProperties properties, Environment environment, Clock clock) {
        this.properties = properties;
        this.clock = clock;
        this.key = resolveKey(properties, environment);
    }

    private SecretKey resolveKey(AccountsProperties properties, Environment environment) {
        if (!properties.jwtSigningKey().isBlank()) {
            return new SecretKeySpec(
                properties.jwtSigningKey().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        }

        boolean development = environment.matchesProfiles("default", "dev", "test");
        if (!development) {
            throw new IllegalStateException(
                "accounts.jwt-signing-key is required outside development. Refusing to start "
                    + "rather than booting green and failing at the first sign-in.");
        }

        return new SecretKeySpec(developmentKey(), "HmacSHA256");
    }

    /** Generated once and kept, so a restart does not invalidate every session. */
    private byte[] developmentKey() {
        try {
            if (Files.exists(DEV_KEY_FILE)) {
                return Base64.getDecoder().decode(Files.readString(DEV_KEY_FILE).trim());
            }
            byte[] generated = new byte[32];
            new SecureRandom().nextBytes(generated);
            Files.createDirectories(DEV_KEY_FILE.getParent());
            Files.writeString(DEV_KEY_FILE, Base64.getEncoder().encodeToString(generated));
            log.warn("Generated a development signing key at {}. Never commit it.", DEV_KEY_FILE);
            return generated;
        } catch (Exception e) {
            /* Falling back to an in-memory key would work, and would sign everybody out on
               every restart — a confusing thing to debug. Fail loudly instead. */
            throw new IllegalStateException("Could not read or create the development signing key", e);
        }
    }

    public String issue(UUID userId, String username) {
        var now = clock.instant();
        return Jwts.builder()
            .subject(userId.toString())
            .claim("username", username)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(properties.accessTokenLifetime())))
            .signWith(key)
            .compact();
    }

    /**
     * The user id in a valid token, or empty.
     *
     * <p>Every failure mode — bad signature, expired, malformed, wrong algorithm — becomes
     * one empty result. The caller does not get to tell them apart and neither does an
     * attacker. And jjwt rejects the {@code alg: none} family for us, rather than us
     * hand-rolling the check that is famous for being got wrong.
     */
    public Optional<UUID> verify(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
            return Optional.of(UUID.fromString(claims.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}

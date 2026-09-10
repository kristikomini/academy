package it.fonderia.accounts.service;

import it.fonderia.accounts.config.AccountsProperties;
import it.fonderia.accounts.domain.*;
import it.fonderia.accounts.security.JwtService;
import it.fonderia.accounts.security.PasswordHasher;
import it.fonderia.accounts.security.RecoveryCode;
import it.fonderia.accounts.security.TokenHasher;
import it.fonderia.accounts.web.ApiException;
import it.fonderia.accounts.web.Dtos.AuthResponse;
import it.fonderia.accounts.web.Dtos.UserView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

/**
 * Registration, sign-in, rotation and recovery.
 *
 * <p>The five blueprint decisions that are not obvious all live here or in the classes it
 * calls, and each one is commented at the line that implements it rather than only in the
 * class docs — because that is where somebody changing the code will be looking.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final int MIN_PASSWORD_LENGTH = 10;

    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordResetTokenRepository resetTokens;
    private final PasswordHasher passwords;
    private final TokenHasher tokens;
    private final RecoveryCode recoveryCodes;
    private final JwtService jwt;
    private final AccountsProperties properties;
    private final SessionRevoker sessions;
    private final Clock clock;

    public AuthService(UserRepository users, RefreshTokenRepository refreshTokens,
                       PasswordResetTokenRepository resetTokens, PasswordHasher passwords,
                       TokenHasher tokens, RecoveryCode recoveryCodes, JwtService jwt,
                       AccountsProperties properties, SessionRevoker sessions, Clock clock) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.resetTokens = resetTokens;
        this.passwords = passwords;
        this.tokens = tokens;
        this.recoveryCodes = recoveryCodes;
        this.jwt = jwt;
        this.properties = properties;
        this.sessions = sessions;
        this.clock = clock;
    }

    /* ------------------------------------------------------------------ register */

    @Transactional
    public AuthResponse register(String rawUsername, String displayName, String password) {
        String username = normaliseUsername(rawUsername);
        validateUsername(username);
        validatePassword(password);

        if (users.existsByUsername(username)) {
            throw ApiException.usernameTaken();
        }

        Instant now = clock.instant();
        UserAccount user = new UserAccount(UUID.randomUUID(), username,
            displayName == null || displayName.isBlank() ? rawUsername.trim() : displayName.trim(), now);

        var hashed = passwords.hash(password);
        user.setPassword(hashed.hash(), hashed.salt(), hashed.iterations());

        String code = recoveryCodes.generate();
        user.setRecoveryCode(tokens.hash(recoveryCodes.normalise(code)), now);
        user.recordSuccess(now);
        users.save(user);

        /* The only time the code is ever returned. It is not stored in plaintext and
           cannot be shown again — the site says so in those words. */
        return issueTokens(user, code);
    }

    /* --------------------------------------------------------------------- login */

    @Transactional
    public AuthResponse login(String rawUsername, String password) {
        String username = normaliseUsername(rawUsername);
        Instant now = clock.instant();

        UserAccount user = users.findByUsername(username).orElse(null);
        if (user == null) {
            /* Blueprint §5.4 decision 3. The message is already identical; without this
               the timing is not, and a login form that answers unknown accounts in a
               microsecond is an enumeration oracle regardless of what it says. */
            passwords.burnEquivalentWork();
            throw ApiException.badCredentials();
        }

        if (user.isLockedAt(now)) {
            throw ApiException.locked();
        }

        if (!passwords.verify(password, user.getPasswordHash(), user.getPasswordSalt(),
            user.getPasswordIterations())) {
            user.recordFailure(now, properties.maxFailedAttempts(), properties.lockoutDuration());
            users.save(user);
            throw ApiException.badCredentials();
        }

        /* The cost is stored per user, so raising it later does not invalidate anybody:
           an old hash verifies against its own count and is re-hashed here, silently, on
           the next successful sign-in. */
        if (user.getPasswordIterations() < PasswordHasher.CURRENT_ITERATIONS) {
            var rehashed = passwords.hash(password);
            user.setPassword(rehashed.hash(), rehashed.salt(), rehashed.iterations());
            log.info("Re-hashed a password at the current cost for user {}", user.getId());
        }

        user.recordSuccess(now);
        users.save(user);
        return issueTokens(user, null);
    }

    /* ------------------------------------------------------------------- refresh */

    @Transactional
    public AuthResponse refresh(String presented) {
        Instant now = clock.instant();
        String hash = tokens.hash(presented);

        RefreshToken stored = refreshTokens.findByTokenHash(hash)
            .orElseThrow(() -> new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "invalid-token", "That refresh token is not valid."));

        /* Blueprint §5.4 decision 4. A token that has already been rotated turning up
           again is either a thief replaying a stolen credential or a client that lost the
           response to its last refresh. The server cannot tell, and guessing wrong in one
           direction hands a session to an attacker — so it revokes the whole family and
           makes everybody sign in again. */
        if (stored.wasRotated()) {
            log.warn("Refresh token replay for user {} — revoking every session", stored.getUserId());
            /* REQUIRES_NEW, and this is not a detail.
             *
             * The revocation must survive the exception on the next line. In the same
             * transaction it does not: throwing rolls the whole thing back, so the
             * response says "your session has been ended" while every session is in fact
             * still live — the security control reports itself as having worked and has
             * not. The first version of this method had exactly that bug, and the test
             * that caught it is replayRevokesTheFamily.
             *
             * This is chapter 25's rule with a real consequence attached: REQUIRES_NEW for
             * work that must outlive the caller's failure. */
            sessions.revokeAllSessions(stored.getUserId(), now);
            throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "token-replayed", "That session has been ended. Sign in again.");
        }

        if (!stored.isActiveAt(now)) {
            throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "invalid-token", "That refresh token has expired or been revoked.");
        }

        UserAccount user = users.findById(stored.getUserId())
            .orElseThrow(() -> ApiException.notFound("No such account."));

        AuthResponse response = issueTokens(user, null);
        stored.rotateTo(tokens.hash(response.refreshToken()), now);
        refreshTokens.save(stored);
        return response;
    }

    @Transactional
    public void logout(String presented) {
        /* Deliberately silent about whether the token existed: logging out is not a place
           to tell an anonymous caller which tokens are real. */
        refreshTokens.findByTokenHash(tokens.hash(presented)).ifPresent(token -> {
            token.revoke(clock.instant());
            refreshTokens.save(token);
        });
    }

    /* ------------------------------------------------------------------ recovery */

    @Transactional
    public String forgotPassword(String rawUsername, String presentedCode) {
        Instant now = clock.instant();
        UserAccount user = users.findByUsername(normaliseUsername(rawUsername)).orElse(null);

        String codeHash = tokens.hash(recoveryCodes.normalise(presentedCode));
        if (user == null || !java.security.MessageDigest.isEqual(
            codeHash.getBytes(java.nio.charset.StandardCharsets.UTF_8),
            user.getRecoveryCodeHash().getBytes(java.nio.charset.StandardCharsets.UTF_8))) {
            /* Same message for a wrong code and an unknown account, for the same reason
               as login. Asking for a username and believing the answer would be an
               account takeover with a form around it. */
            throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "invalid-recovery", "That username and recovery code do not match an account.");
        }

        String ticket = tokens.newToken();
        resetTokens.save(new PasswordResetToken(user.getId(), tokens.hash(ticket), now,
            now.plus(properties.resetTicketLifetime())));
        return ticket;
    }

    @Transactional
    public AuthResponse resetPassword(String ticket, String newPassword) {
        validatePassword(newPassword);
        Instant now = clock.instant();

        PasswordResetToken stored = resetTokens.findByTokenHash(tokens.hash(ticket))
            .orElseThrow(() -> new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "invalid-ticket", "That reset ticket is not valid."));

        if (!stored.isSpendableAt(now)) {
            throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED,
                "invalid-ticket", "That reset ticket has expired or has already been used.");
        }

        UserAccount user = users.findById(stored.getUserId())
            .orElseThrow(() -> ApiException.notFound("No such account."));

        var hashed = passwords.hash(newPassword);
        user.setPassword(hashed.hash(), hashed.salt(), hashed.iterations());

        /* The code is spent on use and replaced. And every existing session dies: a
           password reset is exactly the moment when the person who had the old sessions
           may not be the person holding the account. */
        String freshCode = recoveryCodes.generate();
        user.setRecoveryCode(tokens.hash(recoveryCodes.normalise(freshCode)), now);
        user.recordSuccess(now);
        users.save(user);

        stored.spend(now);
        resetTokens.save(stored);
        sessions.revokeAllSessions(user.getId(), now);

        return issueTokens(user, freshCode);
    }

    @Transactional
    public String replaceRecoveryCode(UUID userId) {
        UserAccount user = users.findById(userId)
            .orElseThrow(() -> ApiException.notFound("No such account."));
        String code = recoveryCodes.generate();
        user.setRecoveryCode(tokens.hash(recoveryCodes.normalise(code)), clock.instant());
        users.save(user);
        return code;
    }

    /* -------------------------------------------------------------------- shared */

    public UserAccount require(UUID userId) {
        return users.findById(userId).orElseThrow(() -> ApiException.notFound("No such account."));
    }

    private AuthResponse issueTokens(UserAccount user, String recoveryCode) {
        Instant now = clock.instant();
        String refresh = tokens.newToken();
        refreshTokens.save(new RefreshToken(user.getId(), tokens.hash(refresh), now,
            now.plus(properties.refreshTokenLifetime())));

        return new AuthResponse(
            jwt.issue(user.getId(), user.getUsername()),
            refresh,
            properties.accessTokenLifetime().toSeconds(),
            new UserView(user.getId().toString(), user.getUsername(), user.getDisplayName()),
            recoveryCode);
    }

    /** Trimmed and lower-cased, once, on the way in. */
    private String normaliseUsername(String raw) {
        return raw == null ? "" : raw.trim().toLowerCase(Locale.ROOT);
    }

    private void validateUsername(String username) {
        if (!username.matches("^[a-z0-9._-]{3,32}$")) {
            throw ApiException.badRequest(
                "A username is 3 to 32 characters: letters, digits, dot, underscore or dash.");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw ApiException.badRequest(
                "A password must be at least " + MIN_PASSWORD_LENGTH + " characters.");
        }
    }
}

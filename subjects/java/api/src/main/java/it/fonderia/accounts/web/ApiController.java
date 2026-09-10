package it.fonderia.accounts.web;

import it.fonderia.accounts.domain.UserAccount;
import it.fonderia.accounts.security.JwtAuthFilter;
import it.fonderia.accounts.service.AuthService;
import it.fonderia.accounts.service.ProfileService;
import it.fonderia.accounts.web.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Every endpoint, in one file.
 *
 * <p>Blueprint §5.2. Fourteen routes and about a hundred lines — splitting them across
 * five controllers would be conventional and would make the contract harder to read in one
 * sitting, which is the stated purpose of this service.
 *
 * <p>The authenticated user arrives as a {@code @RequestAttribute} set by
 * {@link JwtAuthFilter}. A protected endpoint cannot be reached without one, so it is
 * never null here — the filter already returned 401.
 */
@RestController
@RequestMapping("/api")
public class ApiController {

    private final AuthService auth;
    private final ProfileService profiles;

    public ApiController(AuthService auth, ProfileService profiles) {
        this.auth = auth;
        this.profiles = profiles;
    }

    /* --------------------------------------------------------------------- health */

    /**
     * Liveness. <b>Deliberately does not touch the database.</b>
     *
     * <p>Blueprint §5.2. A liveness probe that queries the database restarts a healthy
     * process whenever the database is briefly slow — turning a recoverable blip into a
     * restart loop. Readiness is the check that is allowed to have an opinion about
     * dependencies; liveness answers "is this process alive".
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    /* ----------------------------------------------------------------------- auth */

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return auth.register(request.username(), request.displayName(), request.password());
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return auth.login(request.username(), request.password());
    }

    @PostMapping("/auth/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return auth.refresh(request.refreshToken());
    }

    @PostMapping("/auth/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Valid @RequestBody RefreshRequest request) {
        auth.logout(request.refreshToken());
    }

    @PostMapping("/auth/forgot-password")
    public ResetTicketResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String ticket = auth.forgotPassword(request.username(), request.recoveryCode());
        return new ResetTicketResponse(ticket, 900);
    }

    @PostMapping("/auth/reset-password")
    public AuthResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return auth.resetPassword(request.resetToken(), request.newPassword());
    }

    @PostMapping("/auth/recovery-code")
    public RecoveryCodeResponse newRecoveryCode(
        @RequestAttribute(JwtAuthFilter.USER_ID) UUID userId) {
        return new RecoveryCodeResponse(auth.replaceRecoveryCode(userId));
    }

    @GetMapping("/auth/me")
    public UserView me(@RequestAttribute(JwtAuthFilter.USER_ID) UUID userId) {
        UserAccount user = auth.require(userId);
        return new UserView(user.getId().toString(), user.getUsername(), user.getDisplayName());
    }

    /* -------------------------------------------------------------------- profile */

    /**
     * @return 204 when there is no stored document yet — an empty body, not an empty
     *         object, so the client can tell "nothing here" from "here is nothing".
     */
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> readProfile(
        @RequestAttribute(JwtAuthFilter.USER_ID) UUID userId) {
        return profiles.read(userId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }

    /**
     * 200 on success, 409 <b>carrying the current document</b> when the revision is stale.
     *
     * <p>The 409 is not thrown to the advice, because its body is not a problem document —
     * it is a profile, and the client needs it to merge.
     */
    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> writeProfile(
        @RequestAttribute(JwtAuthFilter.USER_ID) UUID userId,
        @Valid @RequestBody ProfileWriteRequest request) {
        try {
            return ResponseEntity.ok(
                profiles.write(userId, request.data(), request.updatedAt(), request.baseRevision()));
        } catch (ProfileService.StaleRevision conflict) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(conflict.current);
        }
    }

    /* ---------------------------------------------------------------- leaderboard */

    @GetMapping("/leaderboard")
    public List<LeaderboardEntry> leaderboard(@RequestAttribute(JwtAuthFilter.USER_ID) UUID userId) {
        return profiles.leaderboard(userId);
    }

    @PutMapping("/me/leaderboard")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setVisibility(@RequestAttribute(JwtAuthFilter.USER_ID) UUID userId,
                              @RequestParam boolean visible) {
        profiles.setLeaderboardVisibility(userId, visible);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@RequestAttribute(JwtAuthFilter.USER_ID) UUID userId) {
        profiles.deleteAccount(userId);
    }
}

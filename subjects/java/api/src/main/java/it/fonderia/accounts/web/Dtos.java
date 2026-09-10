package it.fonderia.accounts.web;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/**
 * The wire types. camelCase both ways, matching the client in {@code engine/account.js}
 * exactly — blueprint §5.2.
 *
 * <p>Records, and one file, because they are one idea: the shape of this API's contract.
 * Changing any of them is a change to a published API, which is the reason they are not
 * the entities.
 */
public final class Dtos {

    private Dtos() {
    }

    /* ------------------------------------------------------------------ requests */

    public record RegisterRequest(@NotBlank String username, String displayName,
                                  @NotBlank String password) {
    }

    public record LoginRequest(@NotBlank String username, @NotBlank String password) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record ForgotPasswordRequest(@NotBlank String username, @NotBlank String recoveryCode) {
    }

    public record ResetPasswordRequest(@NotBlank String resetToken, @NotBlank String newPassword) {
    }

    /**
     * The progress document, its client stamp, and the revision the client last saw.
     *
     * <p>{@code data} is a {@link JsonNode} rather than a String so Jackson validates that
     * it is JSON on the way in, and an object rather than an array or a number is checked
     * in the controller — blueprint §5.2 says a non-object is a 400.
     */
    public record ProfileWriteRequest(@NotNull JsonNode data, @NotNull Instant updatedAt,
                                      int baseRevision) {
    }

    /* ----------------------------------------------------------------- responses */

    public record UserView(String id, String username, String displayName) {
    }

    /**
     * @param recoveryCode only on register and a completed reset; {@code null} otherwise.
     *                     It is never stored in plaintext and cannot be shown again.
     */
    public record AuthResponse(String accessToken, String refreshToken, long expiresInSeconds,
                               UserView user, String recoveryCode) {
    }

    public record ResetTicketResponse(String resetToken, long expiresInSeconds) {
    }

    public record RecoveryCodeResponse(String recoveryCode) {
    }

    public record ProfileResponse(JsonNode data, Instant updatedAt, int revision) {
    }

    public record LeaderboardEntry(String displayName, int xp, double masteryPercent,
                                   int streakDays, int chaptersPassed, boolean isYou) {
    }
}

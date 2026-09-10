package it.fonderia.accounts.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.accounts.domain.Profile;
import it.fonderia.accounts.domain.ProfileRepository;
import it.fonderia.accounts.domain.RefreshTokenRepository;
import it.fonderia.accounts.domain.UserRepository;
import it.fonderia.accounts.web.ApiException;
import it.fonderia.accounts.web.Dtos.LeaderboardEntry;
import it.fonderia.accounts.web.Dtos.ProfileResponse;
import org.springframework.data.domain.Limit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Reading and writing the progress document, and the leaderboard over it.
 */
@Service
public class ProfileService {

    /** Blueprint §5.2: a document over 1 MiB is a 413. */
    private static final int MAX_DOCUMENT_BYTES = 1024 * 1024;

    /** Thrown with the current document attached, so a 409 can carry it. */
    public static class StaleRevision extends RuntimeException {
        public final ProfileResponse current;

        StaleRevision(ProfileResponse current) {
            this.current = current;
        }
    }

    private final ProfileRepository profiles;
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final ProfileSummariser summariser;
    private final ObjectMapper json;
    private final Clock clock;

    public ProfileService(ProfileRepository profiles, UserRepository users,
                          RefreshTokenRepository refreshTokens, ProfileSummariser summariser,
                          ObjectMapper json, Clock clock) {
        this.profiles = profiles;
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.summariser = summariser;
        this.json = json;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public Optional<ProfileResponse> read(UUID userId) {
        return profiles.findById(userId).map(this::toResponse);
    }

    /**
     * Store the document, or refuse with the current one.
     *
     * <p>The revision check is against {@code baseRevision} — the number the client last
     * saw — and not against anything this transaction just read. That is the whole
     * mechanism: two devices that both loaded revision 7 cannot both write revision 8, and
     * the loser is handed the winner's document so its own merge can run.
     */
    @Transactional
    public ProfileResponse write(UUID userId, JsonNode data, java.time.Instant clientUpdatedAt,
                                 int baseRevision) {
        if (data == null || !data.isObject()) {
            throw ApiException.badRequest("The progress document must be a JSON object.");
        }

        String document = data.toString();
        if (document.getBytes(StandardCharsets.UTF_8).length > MAX_DOCUMENT_BYTES) {
            throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, "document-too-large",
                "The progress document is larger than 1 MiB.");
        }

        Profile profile = profiles.findById(userId).orElseGet(() -> new Profile(userId));

        if (profile.getRevision() != baseRevision) {
            /* 409 carrying the CURRENT document, not just a status. The client cannot
               merge what it has not been given, and making it issue a second GET to find
               out would be a race of its own. */
            throw new StaleRevision(toResponse(profile));
        }

        profile.store(document, clientUpdatedAt, clock.instant(), summariser.summarise(document));
        profiles.save(profile);
        return toResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntry> leaderboard(UUID viewerId) {
        List<LeaderboardEntry> entries = new ArrayList<>();
        for (Object[] row : profiles.leaderboard(Limit.of(50))) {
            Profile profile = (Profile) row[0];
            String displayName = (String) row[1];
            UUID ownerId = (UUID) row[2];
            entries.add(new LeaderboardEntry(displayName, profile.getXp(),
                profile.getMasteryPercent(), profile.getStreakDays(), profile.getChaptersPassed(),
                ownerId.equals(viewerId)));
        }
        return entries;
    }

    @Transactional
    public void setLeaderboardVisibility(UUID userId, boolean visible) {
        var user = users.findById(userId)
            .orElseThrow(() -> ApiException.notFound("No such account."));
        user.setShowOnLeaderboard(visible);
        users.save(user);
    }

    /**
     * Delete the account and everything hanging off it.
     *
     * <p><b>The children are deleted explicitly, even though the foreign keys declare
     * {@code ON DELETE CASCADE}.</b> That looks like belt and braces and is not: the first
     * version relied on the database cascade alone, and {@code deleteAccountCascades}
     * failed — the user row went and the refresh token stayed, so a session outlived its
     * account and a refresh returned 404 instead of 401.
     *
     * <p>The lesson generalises past this bug. A JPA {@code delete} is issued against the
     * row the entity manager knows about; whether the database then cascades depends on the
     * engine honouring the constraint, and on the constraint actually being the one you
     * think it is. Deleting the children in the application makes the behaviour the same
     * everywhere, and the declared cascade stays as the guarantee of last resort for
     * anything that deletes a user without going through this method.
     *
     * <p>Order matters: children before the parent, or the FK refuses the parent delete on
     * an engine that is not cascading.
     */
    @Transactional
    public void deleteAccount(UUID userId) {
        refreshTokens.deleteAll(refreshTokens.findByUserId(userId));
        profiles.findById(userId).ifPresent(profiles::delete);
        users.deleteById(userId);
    }

    private ProfileResponse toResponse(Profile profile) {
        try {
            JsonNode data = profile.getDocument() == null
                ? json.createObjectNode()
                : json.readTree(profile.getDocument());
            return new ProfileResponse(data, profile.getUpdatedAt(), profile.getRevision());
        } catch (Exception e) {
            /* Stored text that no longer parses is our problem, not the caller's — but it
               must not be a 500 on every read forever. An empty object lets the client
               resync from its own copy. */
            return new ProfileResponse(json.createObjectNode(), profile.getUpdatedAt(),
                profile.getRevision());
        }
    }
}

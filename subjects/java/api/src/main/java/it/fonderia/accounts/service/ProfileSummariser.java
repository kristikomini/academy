package it.fonderia.accounts.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.accounts.config.AccountsProperties;
import it.fonderia.accounts.domain.Profile;
import org.springframework.stereotype.Component;

/**
 * Derives the four leaderboard figures from the progress document.
 *
 * <p><b>The server re-derives them rather than trusting a client summary.</b> Blueprint
 * §5.3. The document is the learner's own data and there is no point policing it — but the
 * leaderboard is shared, and a number that appears next to other people's names should not
 * be one the browser simply asserted.
 *
 * <p>And the honest limit of that, said out loud: it is still not a ranking of record.
 * Anyone can edit their local profile and sync it, and no server-side derivation changes
 * that. Deriving stops a client from claiming a number it did not even compute; it does
 * not stop a determined person from computing a false one. The site says so rather than
 * building defences that do not hold.
 *
 * <p><b>Every read is defensive.</b> The document was produced by a browser that may be
 * running an older version of the site, so a missing or wrongly-typed property is expected
 * input rather than an error. A malformed profile must never be able to fail a sync — it
 * produces zeroes, not a 500.
 */
@Component
public class ProfileSummariser {

    private final ObjectMapper json;
    private final AccountsProperties properties;

    public ProfileSummariser(ObjectMapper json, AccountsProperties properties) {
        this.json = json;
        this.properties = properties;
    }

    public Profile.Summary summarise(String document) {
        JsonNode root;
        try {
            root = json.readTree(document);
        } catch (Exception e) {
            return new Profile.Summary(0, 0, 0, 0);
        }
        if (root == null || !root.isObject()) {
            return new Profile.Summary(0, 0, 0, 0);
        }

        int xp = nonNegativeInt(root, "xp");
        int streak = nonNegativeInt(root.path("streak"), "days");
        int chaptersPassed = countPassedChapters(root);

        /* Mastery is derived from the chapter count rather than read from the document,
           so a hand-edited profile cannot claim 400%. Clamped anyway, because the
           denominator is configuration and configuration can be wrong. */
        double mastery = properties.chapterCount() <= 0
            ? 0
            : (chaptersPassed * 100.0) / properties.chapterCount();

        return new Profile.Summary(xp, Math.min(100.0, Math.max(0.0, mastery)),
            streak, chaptersPassed);
    }

    /**
     * A chapter counts as passed when its recorded best score is at least 70%.
     *
     * <p>Every access here tolerates absence and the wrong type, because both happen: an
     * older site version may not have written {@code chapters} at all, and a
     * hand-edited document may have made it a string.
     */
    private int countPassedChapters(JsonNode root) {
        JsonNode chapters = root.path("chapters");
        if (!chapters.isObject()) {
            return 0;
        }
        int passed = 0;
        var fields = chapters.fields();
        while (fields.hasNext()) {
            JsonNode chapter = fields.next().getValue();
            if (chapter != null && chapter.isObject() && chapter.path("best").asDouble(0) >= 70) {
                passed++;
            }
        }
        return passed;
    }

    private int nonNegativeInt(JsonNode node, String field) {
        JsonNode value = node.path(field);
        if (!value.isNumber()) {
            return 0;
        }
        return Math.max(0, value.asInt(0));
    }
}

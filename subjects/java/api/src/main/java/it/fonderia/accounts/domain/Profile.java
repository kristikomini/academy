package it.fonderia.accounts.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * One learner's progress document, plus the four figures the leaderboard orders by.
 *
 * <p>The document is a blob and the four columns beside it are denormalised copies,
 * re-derived by the server on every write. Blueprint §5.3 explains both halves: the
 * document's shape belongs to the browser and changes with every learning feature, so
 * modelling it relationally would mean a migration per badge — for data the server never
 * queries by its parts. The four that are promoted exist because the leaderboard sorts by
 * them, and querying inside a JSON column across two database engines is the sort of
 * cleverness that stops working when somebody switches engine.
 *
 * <p>{@code revision} is hand-written optimistic concurrency rather than
 * {@code @Version}, because the client holds the number between requests and sends it back
 * as {@code baseRevision}. The check has to compare against what the caller last saw, not
 * against what this transaction just read — the same reason the other project's aggregate
 * carries a {@code baseVersion}.
 */
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Lob
    @Column(nullable = false)
    private String document;

    @Column(nullable = false)
    private int revision;

    /** The client's own stamp, used by its merge. The server stores it and does not read it. */
    @Column(name = "client_updated_at", nullable = false)
    private Instant clientUpdatedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private int xp;

    @Column(name = "mastery_percent", nullable = false)
    private double masteryPercent;

    @Column(name = "streak_days", nullable = false)
    private int streakDays;

    @Column(name = "chapters_passed", nullable = false)
    private int chaptersPassed;

    protected Profile() {
    }

    public Profile(UUID userId) {
        this.userId = userId;
        this.revision = 0;
    }

    public UUID getUserId() { return userId; }
    public String getDocument() { return document; }
    public int getRevision() { return revision; }
    public Instant getClientUpdatedAt() { return clientUpdatedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public int getXp() { return xp; }
    public double getMasteryPercent() { return masteryPercent; }
    public int getStreakDays() { return streakDays; }
    public int getChaptersPassed() { return chaptersPassed; }

    public void store(String document, Instant clientUpdatedAt, Instant now, Summary summary) {
        this.document = document;
        this.clientUpdatedAt = clientUpdatedAt;
        this.updatedAt = now;
        this.revision++;
        this.xp = summary.xp();
        this.masteryPercent = summary.masteryPercent();
        this.streakDays = summary.streakDays();
        this.chaptersPassed = summary.chaptersPassed();
    }

    /** The four figures the server derives from the document rather than trusting. */
    public record Summary(int xp, double masteryPercent, int streakDays, int chaptersPassed) {
    }
}

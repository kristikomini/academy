package it.fonderia.ordini.app.infrastructure.outbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

/**
 * One pending event, in the same database as the order that raised it.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
@Entity
@Table(name = "outbox")
public class OutboxEntry {

    @Id
    private UUID id;

    @Column(name = "aggregate_id", nullable = false)
    private UUID aggregateId;

    @Column(name = "event_type", nullable = false, length = 64)
    private String eventType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(nullable = false)
    private int attempts;

    protected OutboxEntry() {
    }

    public OutboxEntry(UUID aggregateId, String eventType, String payload, Instant occurredAt) {
        this.id = UUID.randomUUID();
        this.aggregateId = aggregateId;
        this.eventType = eventType;
        this.payload = payload;
        this.occurredAt = occurredAt;
        this.attempts = 0;
    }

    public UUID getId() { return id; }
    public UUID getAggregateId() { return aggregateId; }
    public String getEventType() { return eventType; }
    public String getPayload() { return payload; }
    public Instant getOccurredAt() { return occurredAt; }
    public Instant getPublishedAt() { return publishedAt; }
    public int getAttempts() { return attempts; }

    public boolean isPublished() {
        return publishedAt != null;
    }

    /**
     * Marks the row sent.
     *
     * <p>The relay calls this AFTER the broker has acknowledged, never before. If the
     * process dies between the two, the row stays unpublished and is sent again — which
     * is the at-least-once guarantee the whole design accepts, and the reason consumers
     * have to be idempotent.
     */
    public void markPublished(Instant when) {
        this.publishedAt = when;
    }

    public void recordAttempt() {
        this.attempts++;
    }
}

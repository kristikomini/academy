package it.fonderia.ordini.app.infrastructure.outbox;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * The relay's query, and nothing else.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
public interface OutboxRepository extends JpaRepository<OutboxEntry, UUID> {

    /**
     * Unpublished rows, oldest first, capped.
     *
     * <p>The cap matters. Reading every unpublished row after an outage means loading a
     * hundred thousand entries into memory and holding a transaction open while they
     * are sent. A batch bounds both, and the relay simply runs again.
     */
    List<OutboxEntry> findByPublishedAtIsNullOrderByOccurredAtAsc(Limit limit);

    List<OutboxEntry> findByAggregateIdOrderByOccurredAtAsc(UUID aggregateId);

    long countByPublishedAtIsNull();
}

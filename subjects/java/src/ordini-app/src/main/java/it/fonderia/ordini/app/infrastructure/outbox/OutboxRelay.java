package it.fonderia.ordini.app.infrastructure.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Limit;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.util.List;

/**
 * Reads unpublished rows and sends them.
 *
 * <p>Deliberately the dullest class in the project. Everything interesting about the
 * outbox already happened in the transaction that wrote the row; this is a loop.
 *
 * <p><b>Why a poller and not a callback.</b> Publishing from an
 * {@code @TransactionalEventListener(AFTER_COMMIT)} is tempting and is not the same
 * thing: if the process dies between the commit and the listener, the event is gone and
 * nothing records that it should have existed. A row in a table survives that, which is
 * the entire point. In a larger system the poller is replaced by change-data-capture —
 * Debezium reading the write-ahead log — which is the same design with less latency and
 * a great deal more operational surface.
 *
 * <p><b>Why the whole batch is one transaction.</b> Each row is marked published inside
 * it, so a crash mid-batch re-sends the rows that were not yet marked. The alternative —
 * a transaction per row — is more precise and much slower; this is the usual trade and
 * it is worth knowing which one you have chosen.
 *
 * <p><b>What happens on failure.</b> The exception propagates, the transaction rolls
 * back, and every row in the batch stays unpublished — including ones the broker may
 * already have accepted. So they will be sent again. That is at-least-once, stated
 * plainly, and it is why the consumer has to be idempotent.
 *
 * <p><b>What is missing, and named rather than hidden.</b> There is no poison-message
 * handling here: a row whose payload the broker always rejects blocks the batch forever,
 * because the failure rolls back the attempt counter along with everything else. A real
 * relay commits the attempt count separately (a `REQUIRES_NEW`, module 23) and moves a
 * row aside after N tries. That is one more moving part than this project needs, and
 * pretending it is not missing would be worse than saying so.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
@Component
public class OutboxRelay {

    private static final Logger log = LoggerFactory.getLogger(OutboxRelay.class);

    /** Bounds the memory and the transaction length. The relay just runs again. */
    private static final int BATCH = 100;

    private final OutboxRepository outbox;
    private final EventPublisher publisher;
    private final Clock clock;

    public OutboxRelay(OutboxRepository outbox, EventPublisher publisher, Clock clock) {
        this.outbox = outbox;
        this.publisher = publisher;
        this.clock = clock;
    }

    /**
     * @return how many rows were published, so tests can assert on it and metrics can
     *         report it — a relay that silently does nothing is indistinguishable from
     *         a relay that has nothing to do.
     */
    @Scheduled(fixedDelayString = "${ordini.outbox.poll-interval-ms:1000}")
    @Transactional
    public int publishPending() {
        List<OutboxEntry> pending = outbox.findByPublishedAtIsNullOrderByOccurredAtAsc(Limit.of(BATCH));
        if (pending.isEmpty()) {
            return 0;
        }

        for (OutboxEntry entry : pending) {
            entry.recordAttempt();
            publisher.publish(
                entry.getAggregateId().toString(),
                entry.getEventType(),
                entry.getPayload());
            // Marked only after the publisher returned. Dirty checking writes it at
            // flush; there is no save() call here and there does not need to be.
            entry.markPublished(clock.instant());
        }

        log.debug("outbox relay published {} event(s)", pending.size());
        return pending.size();
    }
}

package it.fonderia.ordini.app;

import it.fonderia.ordini.app.infrastructure.jpa.JpaOrderRepository;
import it.fonderia.ordini.app.infrastructure.jpa.SpringDataOrderRepository;
import it.fonderia.ordini.app.infrastructure.outbox.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.ordini.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The outbox, and the guarantee it is supposed to provide.
 *
 * <p>The test that matters is {@link #rollbackLosesTheEventToo}. Everything else here
 * confirms the mechanics; that one confirms the <em>property</em> — that an event and
 * the state it describes cannot disagree, because they are one commit.
 *
 * <p>{@code NOT_SUPPORTED} again, for the same reason as the other persistence tests:
 * a rollback is not observable from inside the transaction that is being rolled back.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
@Import({OutboxTest.Collaborators.class, JpaOrderRepository.class, OutboxRelay.class})
class OutboxTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");

    /**
     * A publisher that records instead of sending, and can be told to fail. Chapter 37
     * calls this a fake rather than a mock: it has real behaviour, and the assertions
     * are about what it received rather than about which methods were called.
     */
    static class RecordingPublisher implements EventPublisher {
        final List<String> published = new ArrayList<>();
        boolean failNext = false;

        @Override
        public void publish(String key, String eventType, String payload) {
            if (failNext) {
                throw new IllegalStateException("broker is down");
            }
            published.add(eventType + "@" + key);
        }
    }

    @TestConfiguration
    static class Collaborators {
        @Bean
        ObjectMapper objectMapper() {
            // @DataJpaTest is a slice: it does not include JacksonAutoConfiguration, so
            // the ObjectMapper the repository needs for the outbox payload has to be
            // supplied here. findAndRegisterModules() picks up JavaTimeModule, without
            // which an Instant serialises as an unreadable object graph.
            return new ObjectMapper().findAndRegisterModules();
        }
        @Bean
        Clock clock() {
            return Clock.fixed(T0, ZoneOffset.UTC);
        }

        @Bean
        RecordingPublisher publisher() {
            return new RecordingPublisher();
        }
    }

    @Autowired private JpaOrderRepository repository;
    @Autowired private SpringDataOrderRepository rows;
    @Autowired private OutboxRepository outbox;
    @Autowired private OutboxRelay relay;
    @Autowired private RecordingPublisher publisher;
    @Autowired private TransactionTemplate transactions;

    private final Sku bolt = new Sku("BL-1001");
    private final Clock clock = Clock.fixed(T0, ZoneOffset.UTC);

    @BeforeEach
    void setUp() {
        transactions.executeWithoutResult(status -> {
            outbox.deleteAll();
            rows.deleteAll();
        });
        publisher.published.clear();
        publisher.failNext = false;
    }

    private Order submittedOrder() {
        Order order = Order.draft(CustomerId.newId(), clock);
        order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
        order.submit().orElseThrow();
        return order;
    }

    @Test
    @DisplayName("saving an order writes its events to the outbox")
    void eventsLandInTheOutbox() {
        Order order = submittedOrder();

        repository.save(order);

        List<OutboxEntry> entries = outbox.findByAggregateIdOrderByOccurredAtAsc(order.id().value());
        assertEquals(1, entries.size());
        assertEquals("OrderSubmitted", entries.get(0).getEventType());
        assertFalse(entries.get(0).isPublished());
        String payload = entries.get(0).getPayload();
        // The wire shape is decided by OutboxPayload, not reflected off the domain
        // classes. Assert the shape, because it is a public contract: flat keys, the id
        // as a string, money as a decimal string with its currency beside it.
        assertTrue(payload.contains("\"orderId\":\"" + order.id() + "\""), payload);
        assertTrue(payload.contains("\"totalAmount\":\"25.00\""), payload);
        assertTrue(payload.contains("\"totalCurrency\":\"EUR\""), payload);
        // And the helper methods on Money must not be on the wire.
        assertFalse(payload.contains("negative"), payload);
        assertFalse(payload.contains("zero"), payload);
    }

    @Test
    @DisplayName("a rollback takes the event with it — the guarantee, in one test")
    void rollbackLosesTheEventToo() {
        Order order = submittedOrder();

        assertThrows(RuntimeException.class, () ->
            transactions.executeWithoutResult(status -> {
                repository.save(order);
                // Something later in the same unit of work fails. With a broker call in
                // place of the outbox write, the event would already have gone and
                // consumers would be reacting to an order that does not exist.
                throw new RuntimeException("something later in the transaction failed");
            }));

        assertEquals(0, rows.count(), "the order was not saved");
        assertEquals(0, outbox.count(), "and neither was its event");
    }

    @Test
    @DisplayName("draining means one event is written once, not once per save")
    void eventsAreNotDuplicatedByLaterSaves() {
        Order order = submittedOrder();
        repository.save(order);
        repository.save(order);   // no new events pending
        repository.save(order);

        assertEquals(1, outbox.count());
    }

    @Test
    @DisplayName("each transition adds exactly one row")
    void oneRowPerTransition() {
        Order order = submittedOrder();
        repository.save(order);

        Order loaded = repository.findById(order.id()).orElseThrow();
        loaded.confirm().orElseThrow();
        repository.save(loaded);

        List<OutboxEntry> entries = outbox.findByAggregateIdOrderByOccurredAtAsc(order.id().value());
        assertEquals(2, entries.size());
        assertEquals("OrderSubmitted", entries.get(0).getEventType());
        assertEquals("OrderConfirmed", entries.get(1).getEventType());
    }

    @Test
    @DisplayName("the relay publishes pending rows and marks them")
    void relayPublishesAndMarks() {
        Order order = submittedOrder();
        repository.save(order);

        Integer published = transactions.execute(status -> relay.publishPending());

        assertEquals(1, published.intValue());
        assertEquals(List.of("OrderSubmitted@" + order.id()), publisher.published);
        assertEquals(0, outbox.countByPublishedAtIsNull());
        assertEquals(T0, outbox.findAll().get(0).getPublishedAt());
    }

    @Test
    @DisplayName("running the relay again publishes nothing")
    void relayIsIdempotentAcrossRuns() {
        repository.save(submittedOrder());
        transactions.execute(status -> relay.publishPending());

        int second = transactions.execute(status -> relay.publishPending());

        assertEquals(0, second);
        assertEquals(1, publisher.published.size(), "not sent twice");
    }

    @Test
    @DisplayName("a broker failure leaves the row unpublished, so it is retried")
    void failureLeavesTheRowForNextTime() {
        Order order = submittedOrder();
        repository.save(order);
        publisher.failNext = true;

        assertThrows(RuntimeException.class, () ->
            transactions.execute(status -> relay.publishPending()));

        assertEquals(1, outbox.countByPublishedAtIsNull(), "still pending");
        assertTrue(publisher.published.isEmpty());

        // And the next run gets it. At-least-once: the row survives the failure, which
        // is the entire reason it is a row and not a method call.
        publisher.failNext = false;
        int retried = transactions.execute(status -> relay.publishPending());
        assertEquals(1, retried);
        assertEquals(0, outbox.countByPublishedAtIsNull());
    }

    @Test
    @DisplayName("the message key is the aggregate id, so one order's events stay ordered")
    void keyIsTheAggregateId() {
        Order order = submittedOrder();
        repository.save(order);
        Order loaded = repository.findById(order.id()).orElseThrow();
        loaded.confirm().orElseThrow();
        repository.save(loaded);

        transactions.execute(status -> relay.publishPending());

        // Both events carry the same key. A broker partitions by key, and ordering is
        // guaranteed only within a partition — so this is what makes "confirmed after
        // submitted" true for a consumer.
        assertEquals(
            List.of("OrderSubmitted@" + order.id(), "OrderConfirmed@" + order.id()),
            publisher.published);
    }
}

package it.fonderia.ordini.app;

import it.fonderia.ordini.app.infrastructure.jpa.JpaOrderRepository;
import it.fonderia.ordini.app.infrastructure.jpa.SpringDataOrderRepository;
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
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The JPA adapter, against a real schema built by the real migration.
 *
 * <p>Three deliberate choices in the annotations, each worth a sentence:
 *
 * <ul>
 *   <li><b>{@code @DataJpaTest}</b> — a slice. Entities, repositories, a transaction
 *       manager and Flyway; no web tier, no component scan of the application.</li>
 *   <li><b>{@code replace = NONE}</b> — do not swap in Boot's throwaway database. Use
 *       the H2 configured in {@code src/test/resources/application.yaml}, so
 *       {@code db/migration/V1__orders.sql} actually runs and
 *       {@code ddl-auto: validate} actually validates. Without this the schema under
 *       test is one Hibernate invented, which tests nothing about the migration.</li>
 *   <li><b>{@code NOT_SUPPORTED}</b> — {@code @DataJpaTest} wraps each test in a
 *       transaction and rolls it back, which is convenient and would hide everything
 *       this file is about. Optimistic locking, flushing and the persistence context
 *       boundary are only observable across separate transactions.</li>
 * </ul>
 *
 * <p>And the honest caveat, which is chapter 38's rule: <b>H2 is not PostgreSQL.</b>
 * These tests catch mapping mistakes in milliseconds. They do not prove the SQL runs on
 * the database this is deployed to — {@code OrderPersistenceIT} does that, against
 * PostgreSQL in a container.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
// @DataJpaTest brings entities, Spring Data repositories, Flyway and a transaction
// manager — but not @Repository classes of our own, which are ordinary components.
// The adapter has to be imported explicitly, and so does the Clock it needs.
@Import({JpaOrderRepositoryTest.FixedClock.class, JpaOrderRepository.class})
class JpaOrderRepositoryTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");

    @TestConfiguration
    static class FixedClock {
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
    }

    @Autowired
    private JpaOrderRepository repository;

    private final Sku bolt = new Sku("BL-1001");
    private final Sku flange = new Sku("FL-2002");
    private final Clock clock = Clock.fixed(T0, ZoneOffset.UTC);

    private Order saved;

    @Autowired
    private SpringDataOrderRepository rows;

    @BeforeEach
    void setUp() {
        // NOT_SUPPORTED means nothing rolls back, so each test starts by clearing the
        // table. That is the price of being able to observe cross-transaction behaviour,
        // and forgetting it shows up as a count assertion that grows with the number of
        // tests in the file — which is how this line came to be written.
        rows.deleteAll();

        saved = Order.draft(CustomerId.newId(), clock);
        saved.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
        repository.save(saved);
    }

    @Test
    @DisplayName("an order survives a round trip with every field intact")
    void roundTrip() {
        Order loaded = repository.findById(saved.id()).orElseThrow();

        assertEquals(saved.id(), loaded.id());
        assertEquals(saved.customerId(), loaded.customerId());
        assertEquals(OrderStatus.DRAFT, loaded.status());
        assertEquals(1, loaded.lines().size());
        assertEquals(bolt, loaded.lines().get(0).sku());
        assertEquals(10, loaded.lines().get(0).quantity());
        assertEquals(Money.euro("2.50"), loaded.lines().get(0).unitPrice());
        assertEquals(Money.euro("25.00"), loaded.total());
        assertEquals(T0, loaded.lastChangedAt());
    }

    @Test
    @DisplayName("money keeps its scale through the database")
    void moneyKeepsItsScale() {
        // NUMERIC(19,2) in, BigDecimal out. If the column were a float this is the test
        // that would start failing on the third decimal place.
        Order loaded = repository.findById(saved.id()).orElseThrow();
        assertEquals(Money.euro("25.00"), loaded.total());
        assertEquals(2, loaded.total().amount().scale());
    }

    @Test
    @DisplayName("saving an existing order updates it rather than inserting a second row")
    void updatesInPlace() {
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.addLine(flange, 3, Money.euro("11.00")).orElseThrow();
        repository.save(loaded);

        assertEquals(1, repository.count());
        assertEquals(2, repository.findById(saved.id()).orElseThrow().lines().size());
        assertEquals(Money.euro("58.00"), repository.findById(saved.id()).orElseThrow().total());
    }

    @Test
    @DisplayName("removing a line deletes its row")
    void orphanRemoval() {
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.addLine(flange, 3, Money.euro("11.00")).orElseThrow();
        repository.save(loaded);

        Order again = repository.findById(saved.id()).orElseThrow();
        again.removeLine(bolt).orElseThrow();
        repository.save(again);

        Order after = repository.findById(saved.id()).orElseThrow();
        assertEquals(1, after.lines().size());
        assertEquals(flange, after.lines().get(0).sku());
    }

    @Test
    @DisplayName("a state transition is persisted")
    void persistsTransitions() {
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.submit().orElseThrow();
        repository.save(loaded);

        assertEquals(OrderStatus.SUBMITTED, repository.findById(saved.id()).orElseThrow().status());
    }

    @Test
    @DisplayName("shipping stores the tracking code")
    void persistsTracking() {
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.submit().orElseThrow();
        loaded.confirm().orElseThrow();
        loaded.ship("TNT-99881").orElseThrow();
        repository.save(loaded);

        Order reloaded = repository.findById(saved.id()).orElseThrow();
        assertEquals("TNT-99881", reloaded.carrierTracking().orElseThrow());
        assertEquals(OrderStatus.SHIPPED, reloaded.status());
    }

    @Test
    @DisplayName("cancelling stores its reason")
    void persistsCancellationReason() {
        // The sibling of the test above, and the reason both exist: Order.rehydrate
        // originally restored neither field, and a shipped order came back with no
        // tracking code and no error at all.
        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.cancel("customer changed their mind").orElseThrow();
        repository.save(loaded);

        Order reloaded = repository.findById(saved.id()).orElseThrow();
        assertEquals(OrderStatus.CANCELLED, reloaded.status());
        assertEquals("customer changed their mind", reloaded.cancellationReason().orElseThrow());
    }

    @Test
    @DisplayName("the row version increments on every update")
    void versionIncrements() {
        long first = repository.findById(saved.id()).orElseThrow().version();

        Order loaded = repository.findById(saved.id()).orElseThrow();
        loaded.submit().orElseThrow();
        repository.save(loaded);

        assertEquals(first + 1, repository.findById(saved.id()).orElseThrow().version());
    }

    @Test
    @DisplayName("two concurrent editors: the second one loses, loudly")
    void optimisticLockingRejectsAStaleWrite() {
        // Both load the same version. This is the situation @Version exists for, and
        // the reason chapter 25 prefers it to raising the isolation level: no lock is
        // held between the read and the write, so the common case pays nothing.
        Order alice = repository.findById(saved.id()).orElseThrow();
        Order bob = repository.findById(saved.id()).orElseThrow();

        alice.submit().orElseThrow();
        repository.save(alice);

        bob.cancel("changed my mind").orElseThrow();

        assertThrows(OptimisticLockingFailureException.class, () -> repository.save(bob),
            "Bob's write was based on a version that no longer exists");

        // And Alice's change survived intact — the point of failing rather than merging.
        assertEquals(OrderStatus.SUBMITTED, repository.findById(saved.id()).orElseThrow().status());
    }
}

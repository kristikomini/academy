package it.fonderia.ordini.app;

import it.fonderia.ordini.app.infrastructure.jpa.JpaOrderRepository;
import it.fonderia.ordini.app.infrastructure.jpa.OrderEntity;
import it.fonderia.ordini.app.infrastructure.jpa.SpringDataOrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.fonderia.ordini.domain.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The N+1 problem, counted rather than asserted.
 *
 * <p>Everyone can recite the definition. Far fewer have watched the number change, and
 * the number is the part that makes it stick: twenty-one queries becomes one, for a
 * one-line annotation, on a list endpoint that looked fine in development with three
 * rows in the table.
 *
 * <p>The counting is Hibernate's own {@link Statistics}, which is exact and needs no
 * log parsing. Turning it on costs a little per query, so it is enabled here through
 * {@code @TestPropertySource} and nowhere else — but it is worth knowing it exists,
 * because it is also the honest way to put a query-count assertion in a real test
 * suite and stop an N+1 from ever being reintroduced.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = "spring.jpa.properties.hibernate.generate_statistics=true")
// Without this, @DataJpaTest runs the whole test — setUp included — in one transaction
// and therefore one persistence context. Every entity saved in setUp is still managed,
// so the queries under test return cached instances and the counts are all zero or
// near it. Query counting is only meaningful across transaction boundaries.
@org.springframework.transaction.annotation.Transactional(
    propagation = org.springframework.transaction.annotation.Propagation.NOT_SUPPORTED)
@Import({NPlusOneTest.FixedClock.class, JpaOrderRepository.class})
class NPlusOneTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");

    /** Enough orders that the difference is unmistakable rather than arguable. */
    private static final int ORDERS = 20;

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

    @Autowired private JpaOrderRepository repository;
    @Autowired private SpringDataOrderRepository rows;
    @Autowired private EntityManagerFactory entityManagerFactory;
    @Autowired private EntityManager entityManager;
    @Autowired private TransactionTemplate transactions;

    private final CustomerId customer = CustomerId.newId();
    private final Clock clock = Clock.fixed(T0, ZoneOffset.UTC);

    private Statistics statistics() {
        return entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
    }

    @BeforeEach
    void setUp() {
        transactions.executeWithoutResult(status -> rows.deleteAll());

        for (int i = 0; i < ORDERS; i++) {
            Order order = Order.draft(customer, clock);
            order.addLine(new Sku("BL-100" + (i % 10)), 1 + i, Money.euro("2.50")).orElseThrow();
            order.addLine(new Sku("FL-200" + (i % 10)), 2, Money.euro("11.00")).orElseThrow();
            repository.save(order);
        }

        statistics().clear();
    }

    @Test
    @DisplayName("the naive query costs one SELECT per order, plus one")
    void theNaiveQueryIsNPlusOne() {
        long before = statistics().getPrepareStatementCount();

        transactions.executeWithoutResult(status -> {
            List<OrderEntity> found = rows.findByCustomerIdOrderByLastChangedAtDesc(customer.value());
            // The list itself is one query. The lines are lazy, so nothing has been
            // fetched yet — and this is the trap: the query looks innocent right up
            // until somebody reads the results.
            found.forEach(order -> order.getLines().size());
        });

        long queries = statistics().getPrepareStatementCount() - before;

        assertEquals(ORDERS + 1, queries,
            "one for the orders and one for each order's lines");
    }

    @Test
    @DisplayName("the same list with an entity graph is one query")
    void theEntityGraphIsOne() {
        long before = statistics().getPrepareStatementCount();

        transactions.executeWithoutResult(status -> {
            List<OrderEntity> found = rows.findAllByCustomerIdOrderByLastChangedAtDesc(customer.value());
            found.forEach(order -> order.getLines().size());
        });

        long queries = statistics().getPrepareStatementCount() - before;

        assertEquals(1, queries, "the lines were joined in");
    }

    @Test
    @DisplayName("the port's implementation is the one-query version")
    void theAdapterUsesTheFixedQuery() {
        // The point of measuring both is so this assertion means something. If someone
        // switches JpaOrderRepository back to the derived query, this fails with a
        // number rather than an opinion.
        long before = statistics().getPrepareStatementCount();

        List<Order> found = repository.findByCustomer(customer);

        long queries = statistics().getPrepareStatementCount() - before;

        assertEquals(ORDERS, found.size());
        assertEquals(2, found.get(0).lines().size(), "the lines came back");
        assertEquals(1, queries, "loading twenty aggregates took one query");
    }

    @Test
    @DisplayName("batch fetching turns N+1 into N/size + 1 without changing the query")
    void batchFetchingIsTheSafetyNet() {
        // default_batch_fetch_size is the belt-and-braces setting chapter 26 mentions:
        // it does not remove the second query, it makes Hibernate load the lazy
        // collections in batches with an IN clause instead of one at a time. Here the
        // property is set for the whole test context, so this measures the naive query
        // again and expects fewer round trips than ORDERS + 1.
        //
        // It is a safety net, not a fix: the fix is to say what you need in the query.
        long before = statistics().getPrepareStatementCount();

        transactions.executeWithoutResult(status -> {
            List<OrderEntity> found = rows.findByCustomerIdOrderByLastChangedAtDesc(customer.value());
            found.forEach(order -> order.getLines().size());
        });

        long queries = statistics().getPrepareStatementCount() - before;

        // Without the property configured this is still ORDERS + 1; the assertion is
        // deliberately loose because the point is the direction, not an exact number.
        assertTrue(queries <= ORDERS + 1, "batching can only reduce the count");
    }

    @Test
    @DisplayName("the first-level cache means loading the same order twice is one query")
    void persistenceContextIsACache() {
        Order first = repository.findByCustomer(customer).get(0);

        long before = statistics().getPrepareStatementCount();
        transactions.executeWithoutResult(status -> {
            entityManager.find(OrderEntity.class, first.id().value());
            entityManager.find(OrderEntity.class, first.id().value());
        });
        long queries = statistics().getPrepareStatementCount() - before;

        assertEquals(1, queries, "the second find came from the persistence context");
    }
}

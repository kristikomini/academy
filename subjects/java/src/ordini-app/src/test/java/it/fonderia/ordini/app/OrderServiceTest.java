package it.fonderia.ordini.app;

import it.fonderia.ordini.app.application.OrderService;
import it.fonderia.ordini.app.infrastructure.InMemoryOrderRepository;
import it.fonderia.ordini.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The application service, tested with {@code new}.
 *
 * <p>No {@code @SpringBootTest}, no context, no mocks — the class is constructed
 * directly with a real repository and a fixed clock. That is the concrete payoff of
 * constructor injection, and it is worth noticing how little ceremony it takes: two
 * arguments and you have the object.
 *
 * <p>It is also chapter 37's rule about mocking. There is nothing to mock here: the
 * repository is a real in-memory implementation, so the assertions are about state
 * that actually changed rather than about calls that were made. A mock would let this
 * suite pass while `save` was never wired to anything.
 */
class OrderServiceTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");

    private OrderRepository repository;
    private OrderService service;

    private final Sku bolt = new Sku("BL-1001");

    @BeforeEach
    void setUp() {
        repository = new InMemoryOrderRepository();
        service = new OrderService(repository, Clock.fixed(T0, ZoneOffset.UTC));
    }

    @Test
    @DisplayName("a created draft is stored and comes back")
    void createsAndStores() {
        Order created = service.createDraft(CustomerId.newId());

        assertEquals(1, repository.count());
        assertEquals(created.id(), service.find(created.id()).orElseThrow().id());
    }

    @Test
    @DisplayName("an unknown id is a named failure, not an empty Optional")
    void unknownIdIsAFailure() {
        Result<Order> outcome = service.find(OrderId.newId());

        assertFalse(outcome.isOk());
        assertEquals("order.not-found", outcome.error().orElseThrow().code());
    }

    @Test
    @DisplayName("the service orchestrates and the aggregate decides")
    void delegatesTheRuleToTheAggregate() {
        Order order = service.createDraft(CustomerId.newId());

        // Submitting an empty order must be refused, and the refusal must be the
        // aggregate's — the service has no rule of its own about this.
        Result<Order> refused = service.submit(order.id());

        assertFalse(refused.isOk());
        assertEquals("order.empty", refused.error().orElseThrow().code());
    }

    @Test
    @DisplayName("the whole workflow runs through the service")
    void happyPath() {
        Order order = service.createDraft(CustomerId.newId());
        OrderId id = order.id();

        assertTrue(service.addLine(id, bolt, 10, Money.euro("2.50")).isOk());
        assertTrue(service.submit(id).isOk());
        assertTrue(service.confirm(id).isOk());
        assertTrue(service.ship(id, "TNT-99881").isOk());

        Order shipped = service.find(id).orElseThrow();
        assertEquals(OrderStatus.SHIPPED, shipped.status());
        assertEquals(Money.euro("25.00"), shipped.total());
        assertEquals("TNT-99881", shipped.carrierTracking().orElseThrow());
    }

    @Test
    @DisplayName("a refused operation still leaves the order findable and unchanged")
    void refusalDoesNotCorrupt() {
        Order order = service.createDraft(CustomerId.newId());
        service.addLine(order.id(), bolt, 10, Money.euro("2.50")).orElseThrow();
        service.submit(order.id()).orElseThrow();
        long versionBefore = service.find(order.id()).orElseThrow().version();

        assertFalse(service.ship(order.id(), "TNT-1").isOk());   // illegal from SUBMITTED

        Order after = service.find(order.id()).orElseThrow();
        assertEquals(OrderStatus.SUBMITTED, after.status());
        assertEquals(versionBefore, after.version());
    }

    @Test
    @DisplayName("operating on an id that does not exist reports not-found, not a crash")
    void actingOnAMissingOrder() {
        OrderId missing = OrderId.newId();

        assertEquals("order.not-found", service.submit(missing).error().orElseThrow().code());
        assertEquals("order.not-found", service.cancel(missing, "any").error().orElseThrow().code());
        assertEquals(0, repository.count());
    }
}

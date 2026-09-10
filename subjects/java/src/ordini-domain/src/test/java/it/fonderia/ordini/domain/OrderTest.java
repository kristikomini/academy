package it.fonderia.ordini.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The aggregate's rules, tested with no framework, no database and no mocks.
 *
 * <p>That is not a boast, it is the payoff for keeping the domain free of Spring and
 * JPA: the whole file runs in a few milliseconds, so it is cheap enough to run on
 * every save. Chapter 38's rule that most tests need no Spring at all is this file.
 *
 * <p>The clock is fixed. Nothing here sleeps, and nothing is flaky at midnight.
 */
class OrderTest {

    private static final Instant T0 = Instant.parse("2026-03-14T09:15:00Z");
    private final Clock clock = Clock.fixed(T0, ZoneOffset.UTC);

    private final Sku bolt = new Sku("BL-1001");
    private final Sku flange = new Sku("FL-2002");

    private Order draftWithOneLine() {
        Order order = Order.draft(CustomerId.newId(), clock);
        order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
        return order;
    }

    @Nested
    @DisplayName("building a draft")
    class Building {

        @Test
        @DisplayName("a new order starts empty, in DRAFT, at version zero")
        void startsEmpty() {
            Order order = Order.draft(CustomerId.newId(), clock);

            assertEquals(OrderStatus.DRAFT, order.status());
            assertTrue(order.lines().isEmpty());
            assertEquals(0L, order.version());
            assertEquals(Money.euro("0.00"), order.total());
        }

        @Test
        @DisplayName("the total is the sum of the line totals")
        void totalsTheLines() {
            Order order = Order.draft(CustomerId.newId(), clock);
            order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
            order.addLine(flange, 3, Money.euro("11.00")).orElseThrow();

            assertEquals(Money.euro("58.00"), order.total());
        }

        @Test
        @DisplayName("adding a SKU that is already on the order merges the quantities")
        void mergesDuplicateSkus() {
            Order order = Order.draft(CustomerId.newId(), clock);
            order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
            order.addLine(bolt, 5, Money.euro("2.50")).orElseThrow();

            assertEquals(1, order.lines().size());
            assertEquals(15, order.lines().get(0).quantity());
        }

        @Test
        @DisplayName("re-adding a SKU at a different price is refused, not silently applied")
        void refusesAPriceChangeByTheBackDoor() {
            Order order = draftWithOneLine();

            Result<Order> result = order.addLine(bolt, 5, Money.euro("2.75"));

            assertFalse(result.isOk());
            assertEquals("order.price-conflict", result.error().orElseThrow().code());
            assertEquals(10, order.lines().get(0).quantity(), "the order must be unchanged");
        }

        @Test
        @DisplayName("the returned line list cannot be used to bypass the rules")
        void linesAreNotAWayIn() {
            Order order = draftWithOneLine();

            assertThrows(UnsupportedOperationException.class,
                () -> order.lines().add(new OrderLine(flange, 1, Money.euro("1.00"))));
        }
    }

    @Nested
    @DisplayName("the state machine")
    class Transitions {

        @Test
        @DisplayName("an empty order cannot be submitted")
        void refusesToSubmitNothing() {
            Order order = Order.draft(CustomerId.newId(), clock);

            Result<Order> result = order.submit();

            assertFalse(result.isOk());
            assertEquals("order.empty", result.error().orElseThrow().code());
            assertEquals(OrderStatus.DRAFT, order.status());
        }

        @Test
        @DisplayName("the happy path runs draft to delivered")
        void happyPath() {
            Order order = draftWithOneLine();

            assertTrue(order.submit().isOk());
            assertTrue(order.confirm().isOk());
            assertTrue(order.ship("TNT-99881").isOk());
            assertTrue(order.deliver().isOk());

            assertEquals(OrderStatus.DELIVERED, order.status());
            assertTrue(order.status().isTerminal());
        }

        @Test
        @DisplayName("skipping a step is refused and the message says what is allowed")
        void refusesToSkipAStep() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();

            Result<Order> result = order.ship("TNT-99881");

            assertFalse(result.isOk());
            Failure failure = result.error().orElseThrow();
            assertEquals("order.illegal-transition", failure.code());
            assertTrue(failure.detail().contains("CONFIRMED"),
                "the message should name the move that is allowed: " + failure.detail());
        }

        @Test
        @DisplayName("lines are frozen once the order leaves DRAFT")
        void freezesLinesAfterSubmission() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();

            assertEquals("order.not-editable", order.addLine(flange, 1, Money.euro("11.00"))
                .error().orElseThrow().code());
            assertEquals("order.not-editable", order.removeLine(bolt)
                .error().orElseThrow().code());
        }

        @Test
        @DisplayName("a shipped order cannot be cancelled, and is told to raise a return")
        void aShippedOrderIsAReturnNotACancellation() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();
            order.confirm().orElseThrow();
            order.ship("TNT-99881").orElseThrow();

            Result<Order> result = order.cancel("changed their mind");

            assertFalse(result.isOk());
            Failure failure = result.error().orElseThrow();
            assertEquals("order.already-shipped", failure.code());
            assertTrue(failure.detail().contains("TNT-99881"),
                "the message should carry the tracking number: " + failure.detail());
            assertEquals(OrderStatus.SHIPPED, order.status());
        }

        @Test
        @DisplayName("cancelling is allowed from draft, submitted and confirmed")
        void cancellableBeforeShipping() {
            assertTrue(draftWithOneLine().cancel("a").isOk());

            Order submitted = draftWithOneLine();
            submitted.submit().orElseThrow();
            assertTrue(submitted.cancel("b").isOk());

            Order confirmed = draftWithOneLine();
            confirmed.submit().orElseThrow();
            confirmed.confirm().orElseThrow();
            assertTrue(confirmed.cancel("c").isOk());
        }

        @Test
        @DisplayName("shipping without a tracking code is a bug, so it throws")
        void shippingNeedsTracking() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();
            order.confirm().orElseThrow();

            assertThrows(IllegalArgumentException.class, () -> order.ship("  "));
        }
    }

    @Nested
    @DisplayName("events and versioning")
    class EventsAndVersion {

        @Test
        @DisplayName("each state change raises exactly one event, in order")
        void raisesOneEventPerTransition() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();
            order.confirm().orElseThrow();

            List<DomainEvent> events = order.pullEvents();

            assertEquals(2, events.size());
            assertInstanceOf(DomainEvent.OrderSubmitted.class, events.get(0));
            assertInstanceOf(DomainEvent.OrderConfirmed.class, events.get(1));
        }

        @Test
        @DisplayName("the submitted event carries the total as it was at submission")
        void submittedEventCarriesTheTotal() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();

            DomainEvent.OrderSubmitted event =
                (DomainEvent.OrderSubmitted) order.pullEvents().get(0);

            assertEquals(Money.euro("25.00"), event.total());
            assertEquals(T0, event.occurredAt());
        }

        @Test
        @DisplayName("draining the events twice does not publish them twice")
        void eventsAreDrainedNotRead() {
            Order order = draftWithOneLine();
            order.submit().orElseThrow();

            assertEquals(1, order.pullEvents().size());
            assertEquals(0, order.pullEvents().size(), "a retry must not re-publish");
        }

        @Test
        @DisplayName("every successful change bumps the version")
        void versionTracksEveryChange() {
            // Optimistic concurrency is easy to leave untested, because in a
            // single-threaded test nothing observable depends on it. It only shows
            // up under two concurrent writers, which is exactly where you do not
            // want to discover it is missing.
            Order order = Order.draft(CustomerId.newId(), clock);
            assertEquals(0L, order.version());

            order.addLine(bolt, 10, Money.euro("2.50")).orElseThrow();
            assertEquals(1L, order.version());

            order.addLine(flange, 1, Money.euro("11.00")).orElseThrow();
            assertEquals(2L, order.version());

            order.submit().orElseThrow();
            assertEquals(3L, order.version());
        }

        @Test
        @DisplayName("a failed operation raises no event and does not bump the version")
        void failuresChangeNothing() {
            Order order = draftWithOneLine();
            long before = order.version();

            order.ship("TNT-1").error().orElseThrow();   // illegal from DRAFT

            assertEquals(before, order.version());
            assertTrue(order.pullEvents().isEmpty());
        }

        @Test
        @DisplayName("rehydrating restores state without raising events")
        void rehydrationIsNotAnOccurrence() {
            Order loaded = Order.rehydrate(
                OrderId.newId(), CustomerId.newId(), OrderStatus.CONFIRMED,
                List.of(new OrderLine(bolt, 10, Money.euro("2.50"))),
                7L, T0, null, null, clock);

            assertEquals(OrderStatus.CONFIRMED, loaded.status());
            assertEquals(7L, loaded.version());
            assertTrue(loaded.pullEvents().isEmpty(), "loading a row is not a business event");
        }
    }

    @Nested
    @DisplayName("identity")
    class Identity {

        @Test
        @DisplayName("an order is the same order after it changes")
        void identityIsTheIdNotTheState() {
            Order order = draftWithOneLine();
            Order sameId = Order.rehydrate(order.id(), order.customerId(), OrderStatus.DELIVERED,
                List.of(), 99L, T0, null, null, clock);

            assertEquals(order, sameId);
            assertEquals(order.hashCode(), sameId.hashCode());
        }

        @Test
        @DisplayName("two orders with identical contents are still different orders")
        void contentsDoNotMakeIdentity() {
            assertNotEquals(draftWithOneLine(), draftWithOneLine());
        }
    }
}

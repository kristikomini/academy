package it.fonderia.ordini.domain;

import java.time.Instant;

/**
 * Something that happened to an order, stated in the past tense.
 *
 * <p>The tense is not a style rule. An event is a fact that has already occurred, so
 * a subscriber can refuse to handle it but cannot refuse to accept it — that is the
 * whole difference between an event and a command, and getting the name wrong is how
 * a publisher ends up knowing who its consumers are. Chapter 33 covers it; the Kafka
 * subject's chapter 38 covers it at length.
 *
 * <p>Sealed, so a dispatcher's switch is exhaustive: add an event and every place
 * that handles them stops compiling until it is considered. That is a feature.
 *
 * <p>Events are raised by the aggregate and collected by the caller, then dispatched
 * <em>inside</em> the same transaction that saved the change. Chapter 25 and the
 * outbox in module 26 explain why publishing outside it is the dual-write bug.
 *
 * <p>Covered in: course/module-11-the-state-machine/README.md
 */
public sealed interface DomainEvent {

    OrderId orderId();

    Instant occurredAt();

    record OrderSubmitted(OrderId orderId, CustomerId customerId, Money total, Instant occurredAt)
        implements DomainEvent {}

    record OrderConfirmed(OrderId orderId, Instant occurredAt)
        implements DomainEvent {}

    record OrderShipped(OrderId orderId, String carrierTracking, Instant occurredAt)
        implements DomainEvent {}

    record OrderDelivered(OrderId orderId, Instant occurredAt)
        implements DomainEvent {}

    /**
     * The reason travels with the event. A consumer deciding whether to refund needs
     * it, and making it fetch the order back to find out would couple the consumer to
     * the order's storage — the mistake chapter 38 of the Kafka subject calls
     * event-carried state transfer done badly.
     */
    record OrderCancelled(OrderId orderId, String reason, Instant occurredAt)
        implements DomainEvent {}
}

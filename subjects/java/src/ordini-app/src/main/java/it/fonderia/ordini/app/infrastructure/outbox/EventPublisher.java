package it.fonderia.ordini.app.infrastructure.outbox;

/**
 * Where a published event goes.
 *
 * <p>An interface with one logging implementation, because there is no broker in this
 * project yet. That is deliberate rather than a placeholder: the outbox pattern is
 * about the <em>transaction</em>, and it is complete and testable without a broker.
 * Swapping this for a KafkaTemplate changes one class and no tests.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
public interface EventPublisher {

    /**
     * Sends one event, or throws.
     *
     * <p>Throwing is the contract. The relay marks a row published only when this
     * returns, so a failure leaves the row for the next run — which is what makes the
     * whole thing at-least-once rather than at-most-once.
     */
    void publish(String key, String eventType, String payload);
}

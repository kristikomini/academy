package it.fonderia.ordini.app.infrastructure.outbox;

import it.fonderia.ordini.domain.DomainEvent;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * The wire shape of an event, decided on purpose.
 *
 * <p><b>Why this class exists.</b> The first version of the outbox serialised the domain
 * event directly, and the payload came out like this:
 *
 * <pre>
 * {"orderId":{"value":"b9fc…"},
 *  "total":{"amount":10.00,"currency":"EUR","zero":false,"negative":false},
 *  "occurredAt":"2026-09-08T02:28:53.330504100Z"}
 * </pre>
 *
 * <p>Look at {@code "zero":false,"negative":false}. Those are {@code Money.isZero()} and
 * {@code Money.isNegative()} — helper methods, reflected onto the wire by Jackson
 * because they look like getters. And {@code orderId} is a nested object because
 * {@code OrderId} is a record wrapping a UUID.
 *
 * <p>None of that was decided. It is the accidental shape of the domain's Java classes,
 * and **an event is a public API**: consumers will parse those fields, and then adding a
 * convenience method to a value object becomes a breaking change to a contract nobody
 * wrote down.
 *
 * <p>This is exactly the argument module 17 makes about never returning an entity from a
 * controller, applied to the other edge of the application. The DTO is cheap; the
 * coupling it prevents is not.
 *
 * <p><b>The switch is exhaustive.</b> {@link DomainEvent} is sealed, so there is no
 * {@code default} branch and adding an event type stops this class compiling until
 * somebody decides what it looks like on the wire. That is the right moment to make the
 * decision — module 06.
 *
 * <p>Covered in: course/module-26-messaging-and-the-outbox/README.md
 */
public final class OutboxPayload {

    private OutboxPayload() {
    }

    /**
     * A flat map with stable keys: ids as strings, money as a decimal string and its
     * currency beside it, timestamps as ISO-8601.
     *
     * <p>Money as a string for the same reason as at the HTTP edge — a JSON number
     * becomes a double in some consumer before anybody notices.
     */
    public static Map<String, Object> of(DomainEvent event) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("orderId", event.orderId().toString());
        payload.put("occurredAt", event.occurredAt().toString());

        switch (event) {
            case DomainEvent.OrderSubmitted e -> {
                payload.put("customerId", e.customerId().toString());
                payload.put("totalAmount", e.total().amount().toPlainString());
                payload.put("totalCurrency", e.total().currency().getCurrencyCode());
            }
            case DomainEvent.OrderConfirmed ignored -> {
                // Nothing beyond the identity and the time: the fact is the whole event.
            }
            case DomainEvent.OrderShipped e -> payload.put("carrierTracking", e.carrierTracking());
            case DomainEvent.OrderDelivered ignored -> {
            }
            case DomainEvent.OrderCancelled e -> payload.put("reason", e.reason());
        }

        return payload;
    }
}

package it.fonderia.ordini.domain;

import java.util.Objects;
import java.util.UUID;

/**
 * The identity of an order.
 *
 * <p>The obvious question is why this exists at all when {@link UUID} is right
 * there. The answer is that {@code UUID} is not a type, it is a shape: every id in
 * the system has it, so the compiler will happily let you pass a customer's id to a
 * method that wanted an order's. That bug does not fail at compile time, it does not
 * fail at run time either — it returns an empty result, and you spend an afternoon
 * on it. One record removes the whole class of it.
 *
 * <p>The cost is real and worth stating: every boundary — JSON, SQL, a URL path —
 * needs a conversion. Four lines each, in one place per boundary. That is the trade,
 * and on anything above a weekend project it has been worth it every time.
 *
 * <p>Covered in: course/module-10-the-domain-model/README.md
 */
public record OrderId(UUID value) {

    public OrderId {
        Objects.requireNonNull(value, "value");
    }

    /**
     * Random v4. Worth knowing what this costs you: a v4 UUID is random, so
     * inserting into an index ordered by it writes to a different page every time,
     * and the index fragments. On Oracle or MySQL under real insert volume that is a
     * measurable problem, and the fix is a time-ordered id (UUID v7, or a sequence).
     * Chapter 27 covers it. This project stays on v4 because its insert volume is a
     * test suite, and pretending otherwise would be cargo cult.
     */
    public static OrderId newId() {
        return new OrderId(UUID.randomUUID());
    }

    /** Parsing is a boundary concern, so the failure is loud and typed. */
    public static OrderId parse(String raw) {
        try {
            return new OrderId(UUID.fromString(raw));
        } catch (IllegalArgumentException e) {
            // Wrapping, and passing the cause — chapter 08. Losing the cause here
            // would leave a stack trace that stops at our own message.
            throw new IllegalArgumentException("Not a valid order id: " + raw, e);
        }
    }

    @Override
    public String toString() {
        return value.toString();
    }
}

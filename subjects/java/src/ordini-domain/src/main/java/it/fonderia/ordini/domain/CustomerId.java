package it.fonderia.ordini.domain;

import java.util.Objects;
import java.util.UUID;

/**
 * The identity of a customer. Structurally identical to {@link OrderId}, and that
 * is exactly the point — they are the same shape and must not be interchangeable.
 *
 * <p>Covered in: course/module-10-the-domain-model/README.md
 */
public record CustomerId(UUID value) {

    public CustomerId {
        Objects.requireNonNull(value, "value");
    }

    public static CustomerId newId() {
        return new CustomerId(UUID.randomUUID());
    }

    public static CustomerId parse(String raw) {
        try {
            return new CustomerId(UUID.fromString(raw));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Not a valid customer id: " + raw, e);
        }
    }

    @Override
    public String toString() {
        return value.toString();
    }
}

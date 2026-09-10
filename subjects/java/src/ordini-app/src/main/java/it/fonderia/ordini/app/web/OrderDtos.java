package it.fonderia.ordini.app.web;

import it.fonderia.ordini.domain.Order;
import it.fonderia.ordini.domain.OrderLine;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.List;

/**
 * The wire types. Records, one file, because they are one idea.
 *
 * <p><b>Never return an entity.</b> Chapter 16's rule, and it is in the twelve. Three
 * things go wrong when a controller returns {@link Order} directly:
 *
 * <ol>
 *   <li>The database schema becomes the public API. Rename a field and you have
 *       shipped a breaking change to every client without meaning to.</li>
 *   <li>Everything the entity holds is exposed, including the fields you did not think
 *       about — internal flags, audit columns, a customer's whole record because it
 *       happened to be reachable through an association.</li>
 *   <li>Once JPA is underneath, serialising a lazy association outside the transaction
 *       throws {@code LazyInitializationException} halfway through writing the
 *       response, so the client gets a truncated body and a 200.</li>
 * </ol>
 *
 * <p>The cost is a mapping method. That is the entire cost, and it is visible in
 * {@link OrderResponse#from}: eight lines, one place, and the schema stops being the
 * contract.
 *
 * <p><b>Validation lives on the request DTO, not on the entity.</b> Chapter 18. Entity
 * constraints fire at flush time, which is the wrong layer and the wrong moment: by
 * then you are inside a transaction and the failure is a 500 rather than a 400.
 *
 * <p>Covered in: course/module-17-the-request-cycle/README.md
 */
public final class OrderDtos {

    private OrderDtos() {
    }

    public record CreateOrderRequest(
        @NotBlank(message = "customerId is required") String customerId
    ) {
    }

    public record AddLineRequest(
        @NotBlank(message = "sku is required") String sku,
        @Positive(message = "quantity must be positive") int quantity,
        /* A String, not a double and not a BigDecimal. Jackson would happily bind a
           JSON number to BigDecimal, but the JSON number arrives having already gone
           through a double in some clients — so the money is wrong before it reaches
           us. Taking the text and parsing it ourselves is the only way to be sure. */
        @NotBlank(message = "unitPrice is required") String unitPrice
    ) {
    }

    public record ShipRequest(
        @NotBlank(message = "tracking is required") String tracking
    ) {
    }

    public record CancelRequest(
        @NotNull(message = "reason is required") String reason
    ) {
    }

    public record LineResponse(String sku, int quantity, String unitPrice, String lineTotal) {

        static LineResponse from(OrderLine line) {
            return new LineResponse(
                line.sku().value(),
                line.quantity(),
                line.unitPrice().amount().toPlainString(),
                line.lineTotal().amount().toPlainString());
        }
    }

    /**
     * What a client sees. Money as a decimal string and timestamps as ISO-8601 —
     * chapter 16's rule, and the reason is the same for both: a JSON number for money
     * invites a double somewhere in the client, and a timestamp without a zone is a
     * question rather than a fact.
     */
    public record OrderResponse(
        String id,
        String customerId,
        String status,
        List<LineResponse> lines,
        String total,
        String currency,
        long version,
        Instant lastChangedAt,
        String carrierTracking
    ) {
        public static OrderResponse from(Order order) {
            return new OrderResponse(
                order.id().toString(),
                order.customerId().toString(),
                order.status().name(),
                order.lines().stream().map(LineResponse::from).toList(),
                order.total().amount().toPlainString(),
                order.total().currency().getCurrencyCode(),
                order.version(),
                order.lastChangedAt(),
                order.carrierTracking().orElse(null));
        }
    }
}

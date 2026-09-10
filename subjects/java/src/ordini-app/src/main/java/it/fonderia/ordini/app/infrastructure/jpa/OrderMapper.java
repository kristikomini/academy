package it.fonderia.ordini.app.infrastructure.jpa;

import it.fonderia.ordini.domain.*;

import java.time.Clock;
import java.util.ArrayList;
import java.util.Currency;
import java.util.List;

/**
 * The cost of keeping the domain free of JPA: this file.
 *
 * <p>Two methods and about eighty lines, most of it obvious. That is the whole price of
 * the separation, and it is worth stating plainly because the argument against it is
 * always "why write a mapper" — the answer being that the alternative is not "no
 * mapper", it is "annotations on the aggregate", and those are paid for in a different
 * currency: a no-args constructor the domain must not have, non-final fields, and an
 * object that can exist in states the business forbids.
 *
 * <p>Covered in: course/module-22-jpa-and-hibernate/README.md
 */
final class OrderMapper {

    private OrderMapper() {
    }

    /**
     * Row → aggregate.
     *
     * <p>Uses {@code Order.rehydrate}, which deliberately raises no domain events:
     * loading a row is not a business occurrence. An aggregate that emitted
     * {@code OrderSubmitted} every time a repository read it would flood every consumer
     * downstream, and that bug is usually written by putting event-raising in a
     * constructor that persistence also calls.
     *
     * <p>The version handed over is the <em>row's</em>, so a freshly loaded aggregate
     * reports the number the database is guarding.
     */
    static Order toDomain(OrderEntity entity, Clock clock) {
        List<OrderLine> lines = new ArrayList<>();
        for (OrderLineEntity line : entity.getLines()) {
            lines.add(new OrderLine(
                new Sku(line.getSku()),
                line.getQuantity(),
                new Money(line.getUnitPrice(), Currency.getInstance(line.getCurrency()))));
        }

        return Order.rehydrate(
            new OrderId(entity.getId()),
            new CustomerId(entity.getCustomerId()),
            OrderStatus.valueOf(entity.getStatus()),
            lines,
            entity.getVersion(),
            entity.getLastChangedAt(),
            entity.getCarrierTracking(),
            entity.getCancellationReason(),
            clock);
    }

    /**
     * Aggregate → row, onto an existing entity when there is one.
     *
     * <p>It copies onto the managed instance rather than building a fresh entity and
     * calling {@code merge}, so Hibernate's dirty checking sees the changes on the
     * object it is already tracking. Chapter 23: dirty checking means mutation is
     * persistence — there is no {@code save()} to look for, and the UPDATE is issued at
     * flush time whether or not anybody asked.
     *
     * <p>{@code version} is deliberately not copied. Hibernate owns that column: it
     * compares the loaded value in the UPDATE's WHERE clause and increments it itself.
     * Writing to it here would either be ignored or would break the check.
     */
    static void copyOnto(Order order, OrderEntity entity) {
        entity.setCustomerId(order.customerId().value());
        entity.setStatus(order.status().name());
        entity.setTotalAmount(order.total().amount());
        entity.setTotalCurrency(order.total().currency().getCurrencyCode());
        entity.setCarrierTracking(order.carrierTracking().orElse(null));
        entity.setCancellationReason(order.cancellationReason().orElse(null));
        entity.setLastChangedAt(order.lastChangedAt());

        List<OrderLineEntity> lines = new ArrayList<>();
        for (OrderLine line : order.lines()) {
            lines.add(new OrderLineEntity(
                line.sku().value(),
                line.quantity(),
                line.unitPrice().amount(),
                line.unitPrice().currency().getCurrencyCode()));
        }
        entity.replaceLines(lines);
    }

    static OrderEntity newEntity(Order order) {
        OrderEntity entity = new OrderEntity(order.id().value());
        copyOnto(order, entity);
        return entity;
    }
}

package it.fonderia.ordini.domain;

import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * An order: the aggregate, and the only place its rules are enforced.
 *
 * <p><b>This is not a record, and that is deliberate.</b> Everything below it in this
 * package is immutable, because a value has no identity and no history. An order has
 * both: it is the same order after it ships, and the whole point of the class is that
 * it changes in a controlled way. Making it a record would push every rule out into
 * whatever service happened to build the next copy.
 *
 * <p><b>Nothing here knows about JPA, Spring or HTTP.</b> Not by convention — the
 * module's pom does not put them on the classpath. The persistence layer maps to this
 * type; this type does not bend towards the database. That is the bargain module 22
 * argues about, and the reason the argument is winnable is that the domain can be
 * tested with no container, no database and no mocks at all: every test below is
 * plain construction and assertion, and the whole suite runs in milliseconds.
 *
 * <p><b>The Clock is a constructor parameter.</b> Chapter 37's rule. A domain object
 * that calls {@code Instant.now()} internally cannot be tested for anything
 * time-dependent without sleeping, and "the test suite sleeps" is how suites stop
 * being run. Passing a {@link Clock} costs one field and makes time an input.
 *
 * <p><b>Expected failures return {@link Result}; broken invariants throw.</b> The line
 * between them: if a caller could reasonably have made this request and deserves a
 * sentence explaining why not, it is a Result. If the caller has a bug, it is an
 * exception. "Cannot ship an order that was never confirmed" is the first kind;
 * "quantity is negative" is the second.
 *
 * <p>Covered in: course/module-11-the-state-machine/README.md
 */
public final class Order {

    private final OrderId id;
    private final CustomerId customerId;
    private final Clock clock;

    private final List<OrderLine> lines = new ArrayList<>();
    private OrderStatus status;
    private Instant lastChangedAt;
    private String carrierTracking;
    private String cancellationReason;

    /**
     * Optimistic concurrency. Incremented on every state change; the persistence
     * layer writes {@code WHERE version = ?} and treats zero rows affected as a
     * conflict, which becomes a 409. Chapter 25's rule that {@code @Version} beats
     * raising the isolation level: a higher isolation level makes the database hold
     * locks for the length of a web request, which is how a system that was merely
     * slow becomes a system that deadlocks.
     */
    private long version;

    /**
     * The row revision this instance was loaded from, which never changes.
     *
     * <p>{@link #version()} counts changes made to <em>this instance</em>; this one
     * records the revision the database held when it was read. They start equal and
     * diverge as soon as an operation succeeds, and that difference is the point: a
     * repository comparing {@code baseVersion} against the stored row can tell whether
     * somebody else wrote in between, which is what optimistic concurrency is.
     *
     * <p>Blueprint §9.4 describes this as "a version column and WHERE version = ? on
     * update, 409 on zero rows affected". Keeping the loaded value here is what makes
     * that check possible for an aggregate that has already been modified in memory.
     */
    private final long baseVersion;

    /**
     * Events raised since this instance was loaded. The caller drains them with
     * {@link #pullEvents()} after saving, inside the same transaction.
     */
    private final List<DomainEvent> pendingEvents = new ArrayList<>();

    private Order(OrderId id, CustomerId customerId, OrderStatus status, long version, Clock clock) {
        this.id = Objects.requireNonNull(id, "id");
        this.customerId = Objects.requireNonNull(customerId, "customerId");
        this.status = Objects.requireNonNull(status, "status");
        this.clock = Objects.requireNonNull(clock, "clock");
        this.version = version;
        this.baseVersion = version;
        this.lastChangedAt = clock.instant();
    }

    /** A new, empty order in DRAFT. The only way to create one from nothing. */
    public static Order draft(CustomerId customerId, Clock clock) {
        return new Order(OrderId.newId(), customerId, OrderStatus.DRAFT, 0L, clock);
    }

    /**
     * Rehydration, for the persistence layer only.
     *
     * <p>It deliberately does not raise events: loading an order out of a table is
     * not a business occurrence, and an aggregate that emitted OrderSubmitted every
     * time a repository read it would flood every consumer downstream. This is the
     * distinction between reconstructing state and changing it.
     */
    public static Order rehydrate(OrderId id, CustomerId customerId, OrderStatus status,
                                  List<OrderLine> existingLines, long version,
                                  Instant lastChangedAt, String carrierTracking,
                                  String cancellationReason, Clock clock) {
        Order order = new Order(id, customerId, status, version, clock);
        order.lines.addAll(existingLines);
        order.lastChangedAt = lastChangedAt;
        /* These two were missing from the first version of this method, and nothing
           caught it: the aggregate's own tests never round-trip through storage, and the
           persistence test that would have noticed was asserting on status rather than
           tracking. A shipped order came back with no tracking code and no error.
           Rehydration has to restore everything the aggregate can be asked about. */
        order.carrierTracking = carrierTracking;
        order.cancellationReason = cancellationReason;
        return order;
    }

    /* ------------------------------------------------------------------ state */

    public OrderId id() { return id; }

    public CustomerId customerId() { return customerId; }

    public OrderStatus status() { return status; }

    public long version() { return version; }

    /** The row revision this instance was loaded from. See the field's comment. */
    public long baseVersion() { return baseVersion; }

    public Instant lastChangedAt() { return lastChangedAt; }

    public Optional<String> carrierTracking() { return Optional.ofNullable(carrierTracking); }

    public Optional<String> cancellationReason() { return Optional.ofNullable(cancellationReason); }

    /**
     * An unmodifiable view, not a copy and not the field.
     *
     * <p>Returning {@code lines} directly would let any caller add a line to a
     * shipped order without going through a single rule in this class — the
     * encapsulation would be decorative. Chapter 03's note that immutability is
     * shallow applies: the list is unmodifiable, and it is safe to hand out only
     * because {@link OrderLine} is itself immutable.
     */
    public List<OrderLine> lines() {
        return Collections.unmodifiableList(lines);
    }

    /** The sum of the line totals. Derived on demand; never a stored field that can drift. */
    public Money total() {
        return lines.stream()
            .map(OrderLine::lineTotal)
            .reduce(Money.zero(Money.EUR), Money::plus);
    }

    /* ------------------------------------------------------------- operations */

    /**
     * Adds a line, or increases the quantity if the SKU is already on the order.
     *
     * <p>Merging rather than appending is a domain decision, not a convenience: two
     * lines for the same SKU at the same price are one line, and letting them
     * accumulate makes every downstream total, pick list and invoice line wrong in a
     * way that is tedious to unpick later.
     */
    public Result<Order> addLine(Sku sku, int quantity, Money unitPrice) {
        if (!status.isEditable()) {
            return Result.err("order.not-editable",
                "Lines can only change while the order is DRAFT; this one is " + status + ".");
        }

        int existing = indexOf(sku);
        if (existing >= 0) {
            OrderLine current = lines.get(existing);
            if (!current.unitPrice().equals(unitPrice)) {
                return Result.err("order.price-conflict",
                    "SKU " + sku + " is already on this order at " + current.unitPrice()
                        + "; adding it at " + unitPrice + " would silently change the agreed price.");
            }
            lines.set(existing, current.withQuantity(current.quantity() + quantity));
        } else {
            lines.add(new OrderLine(sku, quantity, unitPrice));
        }

        touch();
        return Result.ok(this);
    }

    public Result<Order> removeLine(Sku sku) {
        if (!status.isEditable()) {
            return Result.err("order.not-editable",
                "Lines can only change while the order is DRAFT; this one is " + status + ".");
        }
        int existing = indexOf(sku);
        if (existing < 0) {
            return Result.err("order.line-not-found", "No line for SKU " + sku + " on this order.");
        }
        lines.remove(existing);
        touch();
        return Result.ok(this);
    }

    public Result<Order> submit() {
        if (lines.isEmpty()) {
            return Result.err("order.empty", "An order needs at least one line before it can be submitted.");
        }
        return transitionTo(OrderStatus.SUBMITTED,
            () -> new DomainEvent.OrderSubmitted(id, customerId, total(), clock.instant()));
    }

    public Result<Order> confirm() {
        return transitionTo(OrderStatus.CONFIRMED,
            () -> new DomainEvent.OrderConfirmed(id, clock.instant()));
    }

    public Result<Order> ship(String tracking) {
        if (tracking == null || tracking.isBlank()) {
            // A broken invariant rather than an expected failure: no legitimate
            // caller ships without a tracking code, so this is a bug in the caller.
            throw new IllegalArgumentException("A shipped order needs a carrier tracking code.");
        }
        Result<Order> moved = transitionTo(OrderStatus.SHIPPED,
            () -> new DomainEvent.OrderShipped(id, tracking, clock.instant()));
        if (moved.isOk()) {
            this.carrierTracking = tracking;
        }
        return moved;
    }

    public Result<Order> deliver() {
        return transitionTo(OrderStatus.DELIVERED,
            () -> new DomainEvent.OrderDelivered(id, clock.instant()));
    }

    /**
     * Cancels the order — which is impossible once it has shipped. The message says
     * what to do instead, because "not allowed" without an alternative is how a
     * support ticket becomes a phone call.
     */
    public Result<Order> cancel(String reason) {
        // The transition table is the rule; this branch only replaces the generic
        // refusal with the sentence that names the alternative. Note the second
        // condition: if the table were ever changed to permit it, this special case
        // steps aside rather than overriding the data it is supposed to explain.
        // Without it the code could disagree with its own specification, and the
        // test asserting the table would still pass.
        if (status == OrderStatus.SHIPPED && !status.canMoveTo(OrderStatus.CANCELLED)) {
            return Result.err("order.already-shipped",
                "This order is with the carrier. Cancelling is a return, not a cancellation — "
                    + "raise a return against tracking " + carrierTracking + ".");
        }
        Result<Order> moved = transitionTo(OrderStatus.CANCELLED,
            () -> new DomainEvent.OrderCancelled(id, reason, clock.instant()));
        if (moved.isOk()) {
            this.cancellationReason = reason;
        }
        return moved;
    }

    /* ----------------------------------------------------------------- events */

    /**
     * Hands over the events raised since the last call and clears the list.
     *
     * <p>Draining rather than reading matters: if the caller could read them twice,
     * a retry would publish everything a second time. The aggregate owns the "these
     * have been taken" fact because it is the only object that knows.
     */
    public List<DomainEvent> pullEvents() {
        List<DomainEvent> drained = List.copyOf(pendingEvents);
        pendingEvents.clear();
        return drained;
    }

    /* ---------------------------------------------------------------- private */

    private Result<Order> transitionTo(OrderStatus next, java.util.function.Supplier<DomainEvent> event) {
        if (!status.canMoveTo(next)) {
            return Result.err("order.illegal-transition",
                "An order cannot go from " + status + " to " + next
                    + ". From " + status + " the only moves are " + status.allowedNext() + ".");
        }
        status = next;
        pendingEvents.add(event.get());
        touch();
        return Result.ok(this);
    }

    private int indexOf(Sku sku) {
        for (int i = 0; i < lines.size(); i++) {
            if (lines.get(i).sku().equals(sku)) {
                return i;
            }
        }
        return -1;
    }

    private void touch() {
        version++;
        lastChangedAt = clock.instant();
    }

    /**
     * Identity is the id, and only the id.
     *
     * <p>An entity is not its field values: an order that has just shipped is the
     * same order it was this morning. This is the opposite rule to {@link Money},
     * where two instances with equal fields are interchangeable — and the reason
     * chapter 03 insists the two kinds of object are not the same kind of thing.
     */
    @Override
    public boolean equals(Object other) {
        return other instanceof Order that && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Order[" + id + ", " + status + ", " + lines.size() + " lines, " + total() + "]";
    }
}

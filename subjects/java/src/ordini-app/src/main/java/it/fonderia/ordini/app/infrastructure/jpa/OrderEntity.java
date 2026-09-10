package it.fonderia.ordini.app.infrastructure.jpa;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * The database's idea of an order.
 *
 * <p><b>This is not the aggregate, and that is the whole point.</b>
 * {@code it.fonderia.ordini.domain.Order} has invariants, a state machine and no
 * annotations; this class has columns, a no-args constructor and mutable fields,
 * because that is what JPA requires. Trying to make one class be both is the bargain
 * module 22 argues about, and it is always the domain that loses: you add a no-args
 * constructor it must not have, relax fields that were final, and end up with an object
 * that can exist in a state the business does not allow.
 *
 * <p>The cost of keeping them apart is {@link OrderMapper} — one file, two methods.
 * The benefit is that the aggregate's tests need no database and no container, which is
 * the thing you actually feel every day.
 *
 * <p><b>Lines are a child entity with {@code orphanRemoval}, not an
 * {@code @ElementCollection}</b>, so removing a line issues a DELETE for that row
 * rather than deleting every line and reinserting the survivors — which is what element
 * collections do, and which turns a one-row change into several writes.
 *
 * <p><b>Everything is LAZY.</b> Chapter 23's rule. The fetching decision belongs to the
 * query that knows what it needs, not to the mapping; EAGER is a decision made once and
 * paid for on every read.
 *
 * <p>Covered in: course/module-22-jpa-and-hibernate/README.md
 */
@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    private UUID id;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(nullable = false, length = 16)
    private String status;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "total_currency", nullable = false, length = 3)
    private String totalCurrency;

    @Column(name = "carrier_tracking", length = 64)
    private String carrierTracking;

    @Column(name = "cancellation_reason", length = 255)
    private String cancellationReason;

    @Column(name = "last_changed_at", nullable = false)
    private Instant lastChangedAt;

    /**
     * Optimistic concurrency, owned by Hibernate.
     *
     * <p>It reads the version with the row, and its UPDATE carries
     * {@code WHERE id = ? AND version = ?}. Zero rows affected means somebody else got
     * there first, and you get an {@code OptimisticLockingFailureException} — which the
     * web layer turns into a 409 rather than silently overwriting their work.
     *
     * <p>Note that the aggregate has a {@code version} of its own. They are not the same
     * counter, and module 23 is honest about that: the aggregate's counts changes made
     * to that instance in memory, this one belongs to the row, and the row's is the one
     * that guards concurrency.
     */
    @Version
    @Column(nullable = false)
    private long version;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sku")
    private List<OrderLineEntity> lines = new ArrayList<>();

    /** JPA requires it. Nothing else should use it. */
    protected OrderEntity() {
    }

    OrderEntity(UUID id) {
        this.id = id;
    }

    public UUID getId() { return id; }
    public UUID getCustomerId() { return customerId; }
    public String getStatus() { return status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getTotalCurrency() { return totalCurrency; }
    public String getCarrierTracking() { return carrierTracking; }
    public String getCancellationReason() { return cancellationReason; }
    public Instant getLastChangedAt() { return lastChangedAt; }
    public long getVersion() { return version; }
    public List<OrderLineEntity> getLines() { return lines; }

    void setCustomerId(UUID customerId) { this.customerId = customerId; }
    void setStatus(String status) { this.status = status; }
    void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    void setTotalCurrency(String totalCurrency) { this.totalCurrency = totalCurrency; }
    void setCarrierTracking(String carrierTracking) { this.carrierTracking = carrierTracking; }
    void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    void setLastChangedAt(Instant lastChangedAt) { this.lastChangedAt = lastChangedAt; }

    /**
     * Reconciles the mapped collection with what the aggregate now says, keyed by SKU.
     *
     * <p>Three mistakes are avoided here, and all three were made first.
     *
     * <p><b>Do not assign a new list.</b> Hibernate is watching this collection
     * instance; replacing the field throws <em>A collection with
     * cascade all-delete-orphan was no longer referenced</em>.
     *
     * <p><b>Do not clear and re-add.</b> Clearing schedules an orphan delete for every
     * line while the replacements carry the same identifiers, so within one persistence
     * context two different objects claim one identifier: <em>A different object with
     * the same identifier value was already associated with the session</em>.
     *
     * <p><b>Do not reconcile by position.</b> Removing the first of two lines then makes
     * row 0 change its SKU to the one row 1 still holds — and Hibernate issues UPDATEs
     * before DELETEs, so a unique constraint fires on a state that exists only for an
     * instant. Reconciling by the natural key sidesteps the ordering question instead of
     * trying to win it.
     *
     * <p>So: update the lines that stay, delete the ones that went — {@code orphanRemoval}
     * turns each removal into a DELETE for that row — and add the new ones.
     */
    void replaceLines(List<OrderLineEntity> replacements) {
        Map<String, OrderLineEntity> incoming = new LinkedHashMap<>();
        for (OrderLineEntity line : replacements) {
            incoming.put(line.getSku(), line);
        }

        lines.removeIf(existing -> !incoming.containsKey(existing.getSku()));

        for (OrderLineEntity existing : lines) {
            existing.copyValuesFrom(incoming.remove(existing.getSku()));
        }

        for (OrderLineEntity added : incoming.values()) {
            added.setOrder(this);
            lines.add(added);
        }
    }
}

package it.fonderia.ordini.app.infrastructure.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

/**
 * One row of {@code order_lines}, keyed by {@code (order, sku)}.
 *
 * <p>The SKU is the line's natural identity within an order — the aggregate merges
 * duplicates, so there is exactly one line per SKU by construction. Keying on it rather
 * than on a position is what lets the mapper update a collection without renumbering,
 * and the migration's comment records why the first attempt (a line number plus a
 * UNIQUE on the SKU) does not survive a realistic edit.
 *
 * <p>Covered in: course/module-22-jpa-and-hibernate/README.md
 */
@Entity
@Table(name = "order_lines")
@IdClass(OrderLineEntity.Key.class)
public class OrderLineEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Id
    @Column(nullable = false, length = 16)
    private String sku;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, length = 3)
    private String currency;

    protected OrderLineEntity() {
    }

    OrderLineEntity(String sku, int quantity, BigDecimal unitPrice, String currency) {
        this.sku = sku;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.currency = currency;
    }

    public String getSku() { return sku; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public String getCurrency() { return currency; }

    void setOrder(OrderEntity order) { this.order = order; }

    /** Updates the value columns, leaving identity alone. */
    void copyValuesFrom(OrderLineEntity other) {
        this.quantity = other.quantity;
        this.unitPrice = other.unitPrice;
        this.currency = other.currency;
    }

    /**
     * The composite key class.
     *
     * <p>Its field names must match the entity's {@code @Id} fields, and the type of
     * {@code order} is the <em>target's</em> id type — {@code UUID} — rather than
     * {@code OrderEntity}. Getting that wrong produces a mapping error whose message
     * does not say so. It needs a no-args constructor, {@code equals} and
     * {@code hashCode}, for the same reason any map key does: chapter 03.
     */
    public static class Key implements Serializable {

        private UUID order;
        private String sku;

        public Key() {
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof Key that
                && Objects.equals(order, that.order)
                && Objects.equals(sku, that.sku);
        }

        @Override
        public int hashCode() {
            return Objects.hash(order, sku);
        }
    }
}

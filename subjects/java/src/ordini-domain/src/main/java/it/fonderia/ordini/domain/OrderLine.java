package it.fonderia.ordini.domain;

import java.util.Objects;

/**
 * One product on an order, at the price agreed when it was added.
 *
 * <p><b>The unit price is copied onto the line, not looked up from the catalogue.</b>
 * That looks like duplication and is not: an order records what was agreed, and the
 * catalogue records what is true now. If a line read its price from the product, then
 * a price rise next March would silently change what a customer was billed last
 * January. Every invoice line in every real system is a snapshot for this reason.
 *
 * <p>Covered in: course/module-10-the-domain-model/README.md
 */
public record OrderLine(Sku sku, int quantity, Money unitPrice) {

    public OrderLine {
        Objects.requireNonNull(sku, "sku");
        Objects.requireNonNull(unitPrice, "unitPrice");
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive, got: " + quantity);
        }
        if (unitPrice.isNegative()) {
            throw new IllegalArgumentException("Unit price cannot be negative: " + unitPrice);
        }
    }

    public Money lineTotal() {
        return unitPrice.times(quantity);
    }

    /** Returns a new line; records are immutable and this one stays that way. */
    public OrderLine withQuantity(int newQuantity) {
        return new OrderLine(sku, newQuantity, unitPrice);
    }
}

package it.fonderia.ordini.domain;

import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Where an order is, and where it is allowed to go next.
 *
 * <p>The transitions live here, in a map, rather than as {@code if} statements
 * scattered through a service. That is the difference between a rule you can read in
 * one screen and a rule you have to reconstruct by grepping. It also means the test
 * for "which transitions are legal" is a test of data, not of behaviour, so it stays
 * short and total.
 *
 * <p><b>The interesting edge: you cannot cancel a SHIPPED order.</b> Not because
 * cancelling is technically hard, but because once it is on a lorry the business
 * process is a return, with different paperwork, a different refund path and
 * possibly a restocking fee. Modelling it as "cancel" would let the code claim
 * something the warehouse cannot do. A state machine that mirrors what is physically
 * possible is worth more than one that is merely convenient.
 *
 * <p>{@link EnumSet} and {@link EnumMap} rather than {@code HashSet}/{@code HashMap}:
 * both are backed by bit vectors and arrays indexed by ordinal, so they allocate
 * almost nothing and never hash. For enum keys they are simply the right structure —
 * chapter 04.
 *
 * <p>Covered in: course/module-11-the-state-machine/README.md
 */
public enum OrderStatus {

    /** Being built. Lines can still be added and removed. */
    DRAFT,

    /** The customer has committed. Stock is not yet reserved. */
    SUBMITTED,

    /** Stock reserved and payment authorised. The point of no return for editing. */
    CONFIRMED,

    /** Handed to the carrier. */
    SHIPPED,

    /** Signed for. Terminal. */
    DELIVERED,

    /** Ended before shipping. Terminal. */
    CANCELLED;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED;

    static {
        // Built in a static block and then wrapped unmodifiable, so the table cannot
        // be edited at run time by a well-meaning caller holding the reference.
        EnumMap<OrderStatus, Set<OrderStatus>> allowed = new EnumMap<>(OrderStatus.class);
        allowed.put(DRAFT,     EnumSet.of(SUBMITTED, CANCELLED));
        allowed.put(SUBMITTED, EnumSet.of(CONFIRMED, CANCELLED));
        allowed.put(CONFIRMED, EnumSet.of(SHIPPED, CANCELLED));
        allowed.put(SHIPPED,   EnumSet.of(DELIVERED));   // deliberately not CANCELLED
        allowed.put(DELIVERED, EnumSet.noneOf(OrderStatus.class));
        allowed.put(CANCELLED, EnumSet.noneOf(OrderStatus.class));
        ALLOWED = Collections.unmodifiableMap(allowed);
    }

    public boolean canMoveTo(OrderStatus next) {
        return ALLOWED.get(this).contains(next);
    }

    public Set<OrderStatus> allowedNext() {
        // Already unmodifiable via the map wrapper's values, but returning a copy of
        // the set would be safer still if EnumSet were mutable here. It is not,
        // because the map is wrapped and the sets were never handed out elsewhere.
        return Collections.unmodifiableSet(ALLOWED.get(this));
    }

    /** A terminal state has nowhere left to go. Derived, never a separate flag. */
    public boolean isTerminal() {
        return ALLOWED.get(this).isEmpty();
    }

    /** True once the order is committed and its lines must stop changing. */
    public boolean isEditable() {
        return this == DRAFT;
    }
}

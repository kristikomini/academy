package it.fonderia.ordini.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.util.EnumSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * The transition table, asserted as data.
 *
 * <p>{@code OrderStatus} claims its rules live in one map rather than scattered
 * across services. The payoff is that testing them is enumeration, not scenario
 * writing: the table below is the specification, and it is short enough to read in
 * one go and check against the warehouse's actual process.
 */
class OrderStatusTest {

    @Test
    @DisplayName("the whole transition table, stated once")
    void theTable() {
        assertEquals(EnumSet.of(OrderStatus.SUBMITTED, OrderStatus.CANCELLED),
            OrderStatus.DRAFT.allowedNext());
        assertEquals(EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.SUBMITTED.allowedNext());
        assertEquals(EnumSet.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED.allowedNext());
        assertEquals(EnumSet.of(OrderStatus.DELIVERED),
            OrderStatus.SHIPPED.allowedNext());
        assertEquals(Set.of(), OrderStatus.DELIVERED.allowedNext());
        assertEquals(Set.of(), OrderStatus.CANCELLED.allowedNext());
    }

    @Test
    @DisplayName("shipped is the one state cancellation cannot reach back into")
    void shippedIsNotCancellable() {
        assertFalse(OrderStatus.SHIPPED.canMoveTo(OrderStatus.CANCELLED));

        // Stated as the complement so that adding a sixth cancellable state would
        // fail here rather than quietly widening the rule.
        for (OrderStatus from : OrderStatus.values()) {
            boolean expected = EnumSet.of(OrderStatus.DRAFT, OrderStatus.SUBMITTED, OrderStatus.CONFIRMED)
                .contains(from);
            assertEquals(expected, from.canMoveTo(OrderStatus.CANCELLED),
                from + " -> CANCELLED");
        }
    }

    @ParameterizedTest
    @EnumSource(OrderStatus.class)
    @DisplayName("no state can move to itself")
    void noSelfTransitions(OrderStatus status) {
        // A self-transition would let submit() be called twice and raise two events.
        assertFalse(status.canMoveTo(status));
    }

    @ParameterizedTest
    @EnumSource(OrderStatus.class)
    @DisplayName("every state is either terminal or has somewhere to go")
    void terminalIsDerivedNotDeclared(OrderStatus status) {
        assertEquals(status.allowedNext().isEmpty(), status.isTerminal());
    }

    @Test
    @DisplayName("exactly two states are terminal, and exactly one is editable")
    void theShapeOfTheMachine() {
        long terminal = EnumSet.allOf(OrderStatus.class).stream().filter(OrderStatus::isTerminal).count();
        long editable = EnumSet.allOf(OrderStatus.class).stream().filter(OrderStatus::isEditable).count();

        assertEquals(2, terminal, "DELIVERED and CANCELLED");
        assertEquals(1, editable, "only DRAFT");
    }

    @Test
    @DisplayName("the table cannot be edited through the accessor")
    void theTableIsNotHandedOut() {
        assertThrows(UnsupportedOperationException.class,
            () -> OrderStatus.SHIPPED.allowedNext().add(OrderStatus.CANCELLED));
    }
}

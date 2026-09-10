package it.fonderia.ordini.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * These tests are documentation that fails when it goes out of date.
 *
 * <p>Each name says the behaviour, not the method — chapter 36's rule that a test
 * has one reason to fail and says it in its own name. If {@code plus} grows a bug,
 * exactly one of these goes red and its name tells you what broke.
 */
class MoneyTest {

    @Test
    @DisplayName("the same amount written with different scale is still the same money")
    void scaleIsNormalisedSoEqualsBehaves() {
        Money a = Money.euro("10");
        Money b = Money.euro("10.00");
        Money c = Money.euro("10.000");   // over-scale: rounded to the currency's 2 digits

        // The point of the whole class. Raw BigDecimal fails all three of these.
        assertEquals(a, b);
        assertEquals(b, c);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    @DisplayName("a HashMap finds money that was stored under a differently-scaled key")
    void worksAsAHashKey() {
        // The failure this prevents is silent: no exception, just a null where a
        // total should be. It is the equals/hashCode rule with a symptom attached.
        Map<Money, String> byPrice = new HashMap<>();
        byPrice.put(Money.euro("10.00"), "ten euro");

        assertEquals("ten euro", byPrice.get(Money.euro("10")));
    }

    @Test
    @DisplayName("rounding is half-up, the way an invoice rounds")
    void roundsHalfUp() {
        assertEquals(Money.euro("2.68"), Money.euro("2.675"));
        assertEquals(Money.euro("-2.68"), Money.euro("-2.675"));
    }

    @Test
    @DisplayName("addition and subtraction stay exact where doubles would not")
    void arithmeticIsExact() {
        Money sum = Money.euro("0.10").plus(Money.euro("0.20"));

        assertEquals(Money.euro("0.30"), sum);
        // The same sum in doubles is 0.30000000000000004. Stated here so the claim
        // in the course is checkable rather than asserted.
        assertNotEquals(0.1 + 0.2, 0.3);
    }

    @Test
    @DisplayName("a line total is the unit price times the quantity")
    void multipliesByAQuantity() {
        assertEquals(Money.euro("37.47"), Money.euro("12.49").times(3));
    }

    @Test
    @DisplayName("combining two currencies fails loudly instead of inventing a rate")
    void refusesMixedCurrencies() {
        Money euro = Money.euro("10.00");
        Money dollars = Money.of("10.00", java.util.Currency.getInstance("USD"));

        IllegalArgumentException thrown =
            assertThrows(IllegalArgumentException.class, () -> euro.plus(dollars));

        // Asserting on the message because the message is the teaching: a developer
        // who hits this at 18:00 should learn why from the exception alone.
        assertTrue(thrown.getMessage().contains("rate"), thrown.getMessage());
    }

    @Test
    @DisplayName("ordering agrees with equality")
    void comparableIsConsistentWithEquals() {
        Money a = Money.euro("10");
        Money b = Money.euro("10.00");

        assertEquals(0, a.compareTo(b));
        assertEquals(a, b);   // BigDecimal alone gives 0 here but reports not-equal
        assertTrue(Money.euro("9.99").compareTo(a) < 0);
    }

    @Test
    @DisplayName("null components are rejected at construction, not at first use")
    void rejectsNulls() {
        assertThrows(NullPointerException.class, () -> new Money(null, Money.EUR));
        assertThrows(NullPointerException.class, () -> new Money(BigDecimal.ONE, null));
    }
}

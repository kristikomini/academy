package it.fonderia.ordini.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Objects;

/**
 * An amount of money in one currency.
 *
 * <p>Three decisions here are worth more than the code around them.
 *
 * <p><b>1. Never {@code double}.</b> {@code 0.1 + 0.2} is {@code 0.30000000000000004}
 * in every IEEE-754 language, Java included. Over a few thousand order lines that
 * becomes a reconciliation meeting. {@link BigDecimal} is decimal, exact, and slow
 * in a way that has never once mattered next to a database round trip.
 *
 * <p><b>2. The scale is normalised in the constructor, and that is an
 * {@code equals} decision, not a formatting one.</b> {@code BigDecimal.equals}
 * compares scale as well as value, so {@code new BigDecimal("10.0")} is
 * <em>not</em> equal to {@code new BigDecimal("10.00")} — while {@code compareTo}
 * says they are the same number. A record's generated {@code equals} delegates to
 * the component's, so without the normalisation below, two Money objects for the
 * same ten euro would be unequal, hash differently, and quietly fail to find each
 * other in a {@code HashMap}. This is the {@code equals}/{@code hashCode} rule from
 * chapter 03 with real money attached to it.
 *
 * <p><b>3. Arithmetic across currencies throws.</b> There is no exchange rate here
 * and there should not be: converting is a business operation with a rate, a source
 * and a timestamp, not an arithmetic convenience. Making it impossible to add euro
 * to dollars by accident costs one {@code if} and removes a class of bug entirely.
 *
 * <p>Covered in: course/module-10-the-domain-model/README.md
 */
public record Money(BigDecimal amount, Currency currency) implements Comparable<Money> {

    /** The currency every advert in this subject's corpus is priced in. */
    public static final Currency EUR = Currency.getInstance("EUR");

    /**
     * Canonical constructor. Records let you validate and normalise here, and this
     * is the only place either happens — there is no other way to build a Money, so
     * there is no path that skips the check.
     */
    public Money {
        Objects.requireNonNull(amount, "amount");
        Objects.requireNonNull(currency, "currency");

        // setScale with an explicit RoundingMode, never the deprecated int overload.
        // HALF_UP is what an Italian invoice does; HALF_EVEN would be defensible for
        // statistics but would surprise an accountant, and the accountant is right.
        amount = amount.setScale(currency.getDefaultFractionDigits(), RoundingMode.HALF_UP);
    }

    public static Money euro(String amount) {
        return new Money(new BigDecimal(amount), EUR);
    }

    /**
     * Deliberately takes a String, not a double. An overload taking double would be
     * used by accident within a week, and would silently reintroduce the binary
     * rounding this class exists to prevent.
     */
    public static Money of(String amount, Currency currency) {
        return new Money(new BigDecimal(amount), currency);
    }

    public static Money zero(Currency currency) {
        return new Money(BigDecimal.ZERO, currency);
    }

    public Money plus(Money other) {
        requireSameCurrency(other);
        return new Money(amount.add(other.amount), currency);
    }

    public Money minus(Money other) {
        requireSameCurrency(other);
        return new Money(amount.subtract(other.amount), currency);
    }

    /**
     * Multiplication by a count, which is what a line total is. There is no
     * {@code times(Money)} because money times money is not money — it is an area,
     * and no order has ever needed one.
     */
    public Money times(int quantity) {
        return new Money(amount.multiply(BigDecimal.valueOf(quantity)), currency);
    }

    public boolean isNegative() {
        return amount.signum() < 0;
    }

    public boolean isZero() {
        return amount.signum() == 0;
    }

    private void requireSameCurrency(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException(
                "Cannot combine " + currency.getCurrencyCode() + " with " + other.currency.getCurrencyCode()
                    + " — conversion needs a rate and a date, so it is a business decision, not arithmetic.");
        }
    }

    /**
     * Ordering is only defined within a currency, so comparing across one throws
     * rather than inventing an answer. Note that this stays consistent with
     * {@code equals} because the scale is already normalised: two Money values that
     * compare equal are equal, which is the contract {@code Comparable} asks for and
     * that raw {@code BigDecimal} famously breaks.
     */
    @Override
    public int compareTo(Money other) {
        requireSameCurrency(other);
        return amount.compareTo(other.amount);
    }

    @Override
    public String toString() {
        return amount.toPlainString() + " " + currency.getCurrencyCode();
    }
}

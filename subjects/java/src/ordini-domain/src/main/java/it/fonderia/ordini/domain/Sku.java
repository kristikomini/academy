package it.fonderia.ordini.domain;

import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * A stock-keeping unit: the code on the shelf label.
 *
 * <p>A validated wrapper around a String is the cheapest way to stop a whole family
 * of defects, because the check runs once at the edge instead of being repeated,
 * differently, at every use. If a Sku exists, it is well-formed; nothing downstream
 * needs to ask.
 *
 * <p>Note the normalisation to upper case, and note that it happens <em>before</em>
 * the pattern check rather than after. Doing it after would accept "ab-1234" and
 * store "AB-1234", which is a normalisation that silently changes what the caller
 * asked for. Doing it first makes the rule "case does not matter", stated once.
 *
 * <p>Covered in: course/module-10-the-domain-model/README.md
 */
public record Sku(String value) {

    /** Two letters, a dash, four digits — the format the foundry's catalogue uses. */
    private static final Pattern FORMAT = Pattern.compile("^[A-Z]{2}-[0-9]{4}$");

    public Sku {
        Objects.requireNonNull(value, "value");
        // Locale.ROOT, never the no-argument overload. Under a Turkish locale the
        // upper case of "i" is "İ", so `toUpperCase()` would accept "in-2002" on a
        // developer's laptop and reject it on a server in tr_TR — same input, same
        // code, different answer. Case conversion on a machine-readable identifier
        // is never a locale-sensitive operation. Module 10, lab C.
        value = value.trim().toUpperCase(Locale.ROOT);
        if (!FORMAT.matcher(value).matches()) {
            throw new IllegalArgumentException(
                "SKU must look like AB-1234, got: " + value);
        }
    }

    @Override
    public String toString() {
        return value;
    }
}

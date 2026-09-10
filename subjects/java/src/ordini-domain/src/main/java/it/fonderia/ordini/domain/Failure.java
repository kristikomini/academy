package it.fonderia.ordini.domain;

import java.util.Objects;

/**
 * A named, expected failure.
 *
 * <p>The {@code code} is stable and machine-readable; the {@code detail} is for a
 * human and may change freely. That split is the whole reason this is not just a
 * String: an API client switches on the code, a support engineer reads the detail,
 * and rewording the detail must never break a client. Chapter 18 turns this pair
 * into an RFC 7807 problem document at the HTTP boundary.
 *
 * <p>Covered in: course/module-12-expected-failure/README.md
 */
public record Failure(String code, String detail) {

    public Failure {
        Objects.requireNonNull(code, "code");
        Objects.requireNonNull(detail, "detail");
    }

    public static Failure of(String code, String detail) {
        return new Failure(code, detail);
    }

    @Override
    public String toString() {
        return code + ": " + detail;
    }
}

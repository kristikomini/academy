package it.fonderia.accounts.security;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * The answer to "how do you reset a password with no email address?"
 *
 * <p>Blueprint §5.4 decision 1. There is no email column and no mail transport, and those
 * two facts are one decision: an address this service can never send to could never be
 * verified, never written to and never used to recover an account, so storing one would
 * be personal data collected for no purpose — which is precisely what data minimisation
 * exists to stop.
 *
 * <p>Which leaves the reset problem. Not by asking for the username and believing the
 * answer — that is an account takeover with a form around it. Instead every account is
 * issued a code at registration: 20 characters of Crockford base32, about 100 bits, shown
 * <b>exactly once</b> and stored only as a hash. Presenting it mints the reset ticket that
 * an emailed link would otherwise have carried.
 *
 * <p><b>Crockford base32, not hex or base64.</b> Its alphabet excludes I, L, O and U —
 * the characters people mistranscribe — and the normalisation below is deliberately
 * forgiving: case-insensitive, dashes and spaces stripped, {@code I} and {@code L} read as
 * {@code 1}, {@code O} as {@code 0}. Somebody is going to copy this off a piece of paper.
 *
 * <p><b>What it honestly is not:</b> proof that anyone can still reach you. An email loop
 * at least confirms the mailbox works. A lost code here is a lost account, and the site
 * says so in those words rather than pretending there is a way round it.
 */
@Component
public class RecoveryCode {

    /** Crockford base32: no I, L, O or U. */
    private static final char[] ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
    private static final int LENGTH = 20;
    private static final int GROUP = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    /** Twenty characters, grouped in fives with dashes: {@code A1B2C-D3E4F-...}. */
    public String generate() {
        StringBuilder code = new StringBuilder(LENGTH + LENGTH / GROUP);
        for (int i = 0; i < LENGTH; i++) {
            if (i > 0 && i % GROUP == 0) {
                code.append('-');
            }
            code.append(ALPHABET[RANDOM.nextInt(ALPHABET.length)]);
        }
        return code.toString();
    }

    /**
     * What the user typed → what was hashed.
     *
     * <p>Applied on both sides, so a code entered with lower case, spaces instead of
     * dashes and a hand-written "l" for "1" still matches. Forgiving input, exact
     * comparison.
     */
    public String normalise(String raw) {
        if (raw == null) {
            return "";
        }
        StringBuilder out = new StringBuilder(LENGTH);
        for (char c : raw.toUpperCase(java.util.Locale.ROOT).toCharArray()) {
            switch (c) {
                case '-', ' ', '\t' -> { /* separators are decoration */ }
                case 'I', 'L' -> out.append('1');
                case 'O' -> out.append('0');
                default -> {
                    if (Character.isLetterOrDigit(c)) {
                        out.append(c);
                    }
                }
            }
        }
        return out.toString();
    }
}

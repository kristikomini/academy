package it.fonderia.accounts.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

/**
 * SHA-256 for high-entropy secrets, and 32 random bytes to make them.
 *
 * <p><b>Why a fast hash here when passwords needed a slow one.</b> Blueprint §5.4
 * decision 4, and it is the detail most people get wrong in an interview. PBKDF2's
 * slowness only ever buys anything against a low-entropy, human-chosen secret — it makes
 * each of an attacker's guesses expensive. A refresh token is 256 random bits: there is
 * no guessing to slow down, and a fast hash costs the attacker nothing to begin with
 * because they were never going to brute-force it.
 *
 * <p>So the reason to hash it at all is different: it means a stolen database dump does
 * not contain working sessions. That is achieved by any preimage-resistant hash, and
 * making it slow would only tax every legitimate refresh.
 *
 * <p>The recovery code follows the same rule for the same reason — ~100 bits.
 */
@Component
public class TokenHasher {

    private static final SecureRandom RANDOM = new SecureRandom();

    /** 32 random bytes, base64url without padding — URL- and JSON-safe. */
    public String newToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /** Hex rather than base64 so the column is a fixed 64 characters. */
    public String hash(String token) {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(sha.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 is unavailable", e);
        }
    }
}

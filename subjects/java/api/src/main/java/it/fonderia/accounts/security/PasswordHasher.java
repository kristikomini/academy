package it.fonderia.accounts.security;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * PBKDF2-SHA256, salted, with the cost stored per user.
 *
 * <p>Blueprint §5.4 decision 2. <b>A plain fast hash is the trap</b> — SHA-256 is strong
 * <em>and fast</em>, and fast is the wrong property when the attacker has your dump and a
 * GPU. A password is a low-entropy, human-chosen secret, so the only defence is to make
 * each guess expensive.
 *
 * <p><b>The iteration count is stored with the user, not compiled in.</b> That is what
 * lets it be raised later without invalidating existing accounts: an old hash still
 * verifies against its own count, and is silently re-hashed at the new cost on the next
 * successful sign-in.
 *
 * <p><b>Comparison is constant-time.</b> {@code Arrays.equals} on a byte array returns as
 * soon as it finds a difference, which leaks how many leading bytes were right.
 * {@link MessageDigest#isEqual} does not.
 *
 * <p>Note the asymmetry with {@link TokenHasher}, and keep it: a deliberately slow hash
 * here, a fast one there. The reason is entropy — see that class.
 */
@Component
public class PasswordHasher {

    public static final int CURRENT_ITERATIONS = 210_000;
    private static final int SALT_BYTES = 16;
    private static final int HASH_BITS = 256;
    private static final SecureRandom RANDOM = new SecureRandom();

    public record Hashed(String hash, String salt, int iterations) {
    }

    public Hashed hash(String password) {
        byte[] salt = new byte[SALT_BYTES];
        RANDOM.nextBytes(salt);
        String encodedSalt = Base64.getEncoder().encodeToString(salt);
        return new Hashed(derive(password, salt, CURRENT_ITERATIONS), encodedSalt, CURRENT_ITERATIONS);
    }

    public boolean verify(String password, String expectedHash, String salt, int iterations) {
        String actual = derive(password, Base64.getDecoder().decode(salt), iterations);
        return MessageDigest.isEqual(
            actual.getBytes(java.nio.charset.StandardCharsets.UTF_8),
            expectedHash.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    /**
     * Spends the same work as a real verification and throws the answer away.
     *
     * <p>Blueprint §5.4 decision 3. Without this, an unknown username returns in a
     * microsecond and a wrong password takes a hundred milliseconds — so the login form
     * becomes an account-enumeration oracle even though both responses say the same
     * thing. The message being identical is only half the fix; the timing is the other.
     */
    public void burnEquivalentWork() {
        byte[] salt = new byte[SALT_BYTES];
        RANDOM.nextBytes(salt);
        derive("timing-equalisation", salt, CURRENT_ITERATIONS);
    }

    private String derive(String password, byte[] salt, int iterations) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, HASH_BITS);
            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            return Base64.getEncoder().encodeToString(factory.generateSecret(spec).getEncoded());
        } catch (Exception e) {
            // A missing algorithm is a broken JVM, not a condition any caller can act on.
            throw new IllegalStateException("PBKDF2WithHmacSHA256 is unavailable", e);
        }
    }
}

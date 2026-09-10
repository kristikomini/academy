package it.fonderia.accounts.web;

import org.springframework.http.HttpStatus;

/**
 * An expected failure, with the status and the stable title it should become.
 *
 * <p>Note the difference from the other project in this repository, which returns a
 * {@code Result} from the domain rather than throwing. Both are defensible and the choice
 * here is deliberate: this service is small enough to read in one sitting, and threading a
 * Result through six endpoints would add ceremony without adding safety. What matters — and
 * what module 12 of the course actually argues — is that the boundary is drawn once and
 * kept, rather than half the codebase doing each.
 *
 * <p>The {@code title} is stable and machine-readable; the {@code detail} is prose that may
 * be reworded freely. Same split as the other project's {@code Failure}, for the same
 * reason: a client switches on one and a human reads the other.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String title;

    public ApiException(HttpStatus status, String title, String detail) {
        super(detail);
        this.status = status;
        this.title = title;
    }

    public HttpStatus status() {
        return status;
    }

    public String title() {
        return title;
    }

    /**
     * The one message a wrong password and an unknown account share.
     *
     * <p>Blueprint §5.4 decision 3: the login form must not be an account-enumeration
     * oracle. Having exactly one factory for it is how the two paths stay identical when
     * somebody edits one of them later.
     */
    public static ApiException badCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "invalid-credentials",
            "That username and password do not match an account.");
    }

    public static ApiException locked() {
        return new ApiException(HttpStatus.LOCKED, "account-locked",
            "Too many failed attempts. This account is locked for a few minutes.");
    }

    public static ApiException usernameTaken() {
        return new ApiException(HttpStatus.CONFLICT, "username-taken",
            "That username is already in use.");
    }

    public static ApiException badRequest(String detail) {
        return new ApiException(HttpStatus.BAD_REQUEST, "invalid-request", detail);
    }

    public static ApiException notFound(String detail) {
        return new ApiException(HttpStatus.NOT_FOUND, "not-found", detail);
    }
}

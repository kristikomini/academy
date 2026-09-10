package it.fonderia.ordini.app.web;

import it.fonderia.ordini.domain.Failure;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import java.net.URI;
import java.util.Map;

/**
 * The translation layer: a domain {@link Failure} becomes an HTTP status and an
 * RFC 7807 problem document.
 *
 * <p>This is the whole reason {@code Failure} carries a stable {@code code} separate
 * from its human {@code detail}. The table below switches on the code; the detail is
 * copied through untouched. Reword a message and nothing here changes — which is the
 * property that lets support engineers improve wording without breaking clients.
 *
 * <p><b>Status codes are the API.</b> Chapter 17, and it is in the twelve. Returning
 * 200 with an error body forces every client to parse the body to find out whether it
 * worked, which means monitoring cannot tell either — every dashboard counts a
 * failure as a success.
 *
 * <p>The mapping itself is worth arguing about, and the two interesting choices are:
 *
 * <ul>
 *   <li><b>409 for an illegal transition.</b> Not 400: the request was well-formed and
 *       would have been valid a moment earlier. 409 Conflict says "the resource is not
 *       in a state where this applies", which is exactly true and tells a client that
 *       re-reading may change the answer.</li>
 *   <li><b>422 for an empty order.</b> The JSON parsed and the fields were present, so
 *       it is not 400; the entity was understood and semantically wrong.</li>
 * </ul>
 *
 * <p>Covered in: course/module-17-the-request-cycle/README.md
 */
final class FailureStatus {

    /** Where a client can read what a code means. Not dereferenced, per RFC 7807. */
    private static final String TYPE_BASE = "https://fonderia.example/problems/";

    private static final Map<String, HttpStatus> STATUS = Map.of(
        "order.not-found",           HttpStatus.NOT_FOUND,
        "order.line-not-found",      HttpStatus.NOT_FOUND,
        "order.empty",               HttpStatus.UNPROCESSABLE_ENTITY,
        "order.illegal-transition",  HttpStatus.CONFLICT,
        "order.already-shipped",     HttpStatus.CONFLICT,
        "order.not-editable",        HttpStatus.CONFLICT,
        "order.price-conflict",      HttpStatus.CONFLICT
    );

    private FailureStatus() {
    }

    static HttpStatus statusFor(Failure failure) {
        /* An unmapped code is a 500 on purpose, not a 400. A failure this class has
           never heard of means the domain grew an outcome nobody translated, and that
           is our bug — reporting it as the client's would hide it in the one place
           people look for other people's mistakes. */
        return STATUS.getOrDefault(failure.code(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    static ProblemDetail problem(Failure failure) {
        HttpStatus status = statusFor(failure);
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, failure.detail());
        problem.setType(URI.create(TYPE_BASE + failure.code()));
        problem.setTitle(failure.code());
        return problem;
    }
}

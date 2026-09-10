package it.fonderia.ordini.app.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * One advice, one error shape.
 *
 * <p>Chapter 18's rule. Note what this class does <em>not</em> handle: domain failures.
 * Those never become exceptions — {@link OrderController} turns a {@code Result} into a
 * response directly. What is left here is the genuinely exceptional: input that never
 * reached the domain, and bugs.
 *
 * <p><b>Every response carries a correlation id, and the same id is logged.</b> That
 * pairing is the point. The client gets an opaque string, the log gets the string plus
 * the stack trace, and a support conversation becomes "give me the reference" instead
 * of "can you reproduce it". Nothing about the internals crosses the boundary.
 *
 * <p><b>Stack traces are logged, never returned.</b> A stack trace in a response body
 * tells an attacker your framework versions, your package layout and often your file
 * paths, and tells a legitimate client nothing it can act on.
 *
 * <p>Extending {@link ResponseEntityExceptionHandler} is what makes malformed JSON and
 * type mismatches 400s with the same body shape as everything else. A blanket
 * {@code @ExceptionHandler(Exception.class)} without it would catch those first and
 * turn a client's typo into a 500 — chapter 18 again.
 *
 * <p>Covered in: course/module-17-the-request-cycle/README.md
 */
@RestControllerAdvice
public class ApiExceptionAdvice extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionAdvice.class);

    /**
     * Bean Validation failures on a request body: which field, and what was wrong with
     * it. Returned as a map rather than a sentence, because a form needs to know which
     * input to highlight.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex, HttpHeaders headers,
        HttpStatusCode status, WebRequest request) {

        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                org.springframework.validation.FieldError::getField,
                fieldError -> fieldError.getDefaultMessage() == null ? "invalid" : fieldError.getDefaultMessage(),
                (first, second) -> first));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "The request body failed validation.");
        problem.setTitle("validation.failed");
        problem.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(problem);
    }

    /**
     * A malformed id or SKU reaches us as {@link IllegalArgumentException} from a
     * value object's constructor. That is the domain refusing to build something
     * invalid, and it is the client's fault, so it is a 400 — with the value object's
     * own message, which was written to be read.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setTitle("request.invalid");
        return ResponseEntity.badRequest().body(problem);
    }

    /**
     * Somebody else wrote first.
     *
     * <p>Optimistic concurrency is only useful if the client is told, and told
     * something it can act on: 409 means "re-read and try again", which is exactly the
     * remedy. Letting this fall through to the handler below would make it a 500 —
     * reporting our correct behaviour as our bug, and inviting a retry that would fail
     * the same way.
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ProblemDetail> handleConcurrentModification(OptimisticLockingFailureException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
            "This order was changed by someone else while you were editing it. "
                + "Re-read it and apply your change again.");
        problem.setTitle("order.concurrent-modification");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
    }

    /** Everything else is a bug. Log it in full, tell the client nothing but a reference. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(Exception ex) {
        String correlationId = UUID.randomUUID().toString();
        log.error("Unhandled exception [correlationId={}]", correlationId, ex);

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong on our side. Quote this reference if you contact support.");
        problem.setTitle("internal.error");
        problem.setProperty("correlationId", correlationId);
        return ResponseEntity.internalServerError().body(problem);
    }
}

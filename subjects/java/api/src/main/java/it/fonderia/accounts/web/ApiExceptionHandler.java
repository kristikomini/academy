package it.fonderia.accounts.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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
 * One advice, one error shape: RFC 9457 problem details with a {@code traceId}.
 *
 * <p>Blueprint §5.2. The trace id goes in the response <em>and</em> in the log line with
 * the stack trace, so a support conversation is "give me the reference" rather than "can
 * you reproduce it" — and nothing about the internals crosses the boundary.
 *
 * <p>Extending {@link ResponseEntityExceptionHandler} is what makes malformed JSON and
 * type mismatches 400s with this same body shape. A bare
 * {@code @ExceptionHandler(Exception.class)} without it turns a client's typo into a 500.
 *
 * <p>Note what this class does <b>not</b> handle: the 401 from {@link
 * it.fonderia.accounts.security.JwtAuthFilter} and the 429 from the rate limiter. Filters
 * run outside the dispatcher, so their exceptions never reach an advice — those two write
 * the same shape by hand, and that duplication is the price of the filter ordering being
 * right.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ProblemDetail> handleApi(ApiException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.status(), ex.getMessage());
        problem.setTitle(ex.title());
        problem.setProperty("traceId", UUID.randomUUID().toString());
        return ResponseEntity.status(ex.status()).body(problem);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex, HttpHeaders headers,
        HttpStatusCode status, WebRequest request) {

        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                org.springframework.validation.FieldError::getField,
                error -> error.getDefaultMessage() == null ? "invalid" : error.getDefaultMessage(),
                (first, second) -> first));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "The request body failed validation.");
        problem.setTitle("invalid-request");
        problem.setProperty("errors", errors);
        problem.setProperty("traceId", UUID.randomUUID().toString());
        return ResponseEntity.badRequest().body(problem);
    }

    /** Everything else is a bug. Logged in full; the client gets a reference and nothing else. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(Exception ex) {
        String traceId = UUID.randomUUID().toString();
        log.error("Unhandled exception [traceId={}]", traceId, ex);

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong on our side. Quote this reference if you contact support.");
        problem.setTitle("internal-error");
        problem.setProperty("traceId", traceId);
        return ResponseEntity.internalServerError().body(problem);
    }
}

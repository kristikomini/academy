package it.fonderia.ordini.domain;

import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;

/**
 * Either a value or a named failure — for the failures you expect.
 *
 * <p><b>Why not just throw?</b> Chapter 08's rule is that exceptions are for
 * programming errors and for conditions the caller cannot act on. "You cannot cancel
 * an order that has already shipped" is neither: it is an ordinary outcome of a
 * valid request, the caller absolutely can act on it, and it will happen every day.
 * Modelling it as a return value puts it in the method signature, where the compiler
 * makes you deal with it, instead of in a stack trace nobody reads until production.
 *
 * <p><b>What it costs.</b> Java has no built-in Result and no syntax for chaining
 * one, so this is more ceremony than Rust or Kotlin would need, and mixing Result
 * with methods that also throw gets confusing fast. The boundary is therefore stated
 * once and kept: the domain returns Result for expected failures and throws only for
 * broken invariants; everything above it translates. A codebase that is half-and-half
 * is worse than either choice made consistently.
 *
 * <p>Sealed, so a {@code switch} over it is exhaustive and the compiler tells you
 * when a new case appears — chapter 07.
 *
 * <p>Covered in: course/module-12-expected-failure/README.md
 */
public sealed interface Result<T> {

    record Ok<T>(T value) implements Result<T> {
        public Ok {
            Objects.requireNonNull(value, "value");
        }
    }

    record Err<T>(Failure failure) implements Result<T> {
        public Err {
            Objects.requireNonNull(failure, "failure");
        }
    }

    static <T> Result<T> ok(T value) {
        return new Ok<>(value);
    }

    static <T> Result<T> err(Failure failure) {
        return new Err<>(failure);
    }

    static <T> Result<T> err(String code, String detail) {
        return new Err<>(Failure.of(code, detail));
    }

    default boolean isOk() {
        return this instanceof Ok<T>;
    }

    /**
     * Transforms the value and leaves a failure alone. Pattern matching in a switch
     * over a sealed type: no default branch, because there cannot be another case,
     * and if someone adds one this stops compiling.
     */
    default <R> Result<R> map(Function<T, R> fn) {
        return switch (this) {
            case Ok<T> ok -> Result.ok(fn.apply(ok.value()));
            case Err<T> e -> Result.err(e.failure());
        };
    }

    /** Chains an operation that can itself fail, without nesting Results. */
    default <R> Result<R> flatMap(Function<T, Result<R>> fn) {
        return switch (this) {
            case Ok<T> ok -> fn.apply(ok.value());
            case Err<T> e -> Result.err(e.failure());
        };
    }

    default Optional<T> toOptional() {
        return switch (this) {
            case Ok<T> ok -> Optional.of(ok.value());
            case Err<T> ignored -> Optional.empty();
        };
    }

    /**
     * Named {@code error()} rather than {@code failure()} because {@code Err} already
     * has a {@code failure()} accessor generated from its record component, and a
     * record component's accessor cannot be widened to return {@code Optional}. The
     * compiler catches this the moment you try — a small, useful reminder that record
     * accessors are part of the type's API, not an implementation detail.
     */
    default Optional<Failure> error() {
        return switch (this) {
            case Ok<T> ignored -> Optional.empty();
            case Err<T> e -> Optional.of(e.failure());
        };
    }

    /**
     * For callers that have already decided a failure here is impossible — a test,
     * usually. Named so that reading it aloud makes the assumption audible.
     */
    default T orElseThrow() {
        return switch (this) {
            case Ok<T> ok -> ok.value();
            case Err<T> e -> throw new NoSuchElementException(e.failure().toString());
        };
    }
}

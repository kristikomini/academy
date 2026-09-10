# Module 12 — Expected failure: `Result`, and where exceptions still belong

> Site chapters: [08 — Exceptions, checked and otherwise](../../site/chapters/08-exceptions.html),
> [18 — Validation and error responses](../../site/chapters/18-validation-errors.html)
>
> Code: [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java),
> [`Failure.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Failure.java)

---

## 1. The idea

Chapter 08's rule is that exceptions are for programming errors and for conditions the
caller cannot act on. Apply it honestly to an order service and most of what people
throw fails the test.

> *"You cannot cancel an order that has already shipped."*

Is that a programming error? No — the request was well-formed and the caller was
entitled to make it. Can the caller act on it? Yes: raise a return instead. Will it
happen? Every day.

That is not an exceptional condition. It is an ordinary outcome, and throwing it has
three costs. It is invisible in the method signature, so nothing reminds the caller it
exists. It unwinds the stack for something that is not an error, which is expensive
and, more importantly, misleading to whoever reads the log. And it tempts a
`catch (Exception e)` somewhere up the call chain that swallows real bugs alongside it.

`Result<T>` puts the outcome in the return type instead, where the compiler makes you
look at it.

```java
Result<Order> outcome = order.cancel("changed their mind");
// You cannot get the Order out without deciding what to do if there is not one.
```

### The line, stated once

- **`Result`** — the caller could reasonably have made this request and deserves a
  sentence explaining why not. *Cannot cancel a shipped order. Cannot submit an empty
  order. That SKU is already on the order at a different price.*
- **Exception** — the caller has a bug. *Quantity is negative. Tracking code is blank.
  Currency is null.*

`Order.ship` shows both in one method: an illegal transition returns a `Result`,
because a caller might legitimately try to ship something twice; a blank tracking code
throws, because no legitimate caller ships without one.

### What this costs, and why the boundary matters more than the choice

Java has no built-in `Result`, no syntax for chaining one, and no compiler warning if
you ignore it. So this is more ceremony than Kotlin or Rust would need, and — the real
danger — mixing `Result`-returning methods with throwing ones gets confusing fast.

**A codebase that is half-and-half is worse than either choice made consistently.** So
the boundary is declared once and kept: the domain returns `Result` for expected
failures and throws only for broken invariants; everything above it translates. Say
that in an interview and you will sound like someone who has maintained one of these,
because the failure mode of the pattern is not the pattern, it is the inconsistency.

### Why `Failure` is a record and not a `String`

```java
public record Failure(String code, String detail) { }
```

The `code` is stable and machine-readable; the `detail` is for a human and may change
freely. A client switches on `order.already-shipped`; a support engineer reads the
sentence. Rewording the sentence must never break a client — which it would, if the
only thing distinguishing failures were the message.

That pair is exactly what chapter 18 turns into an RFC 7807 problem document at the
HTTP boundary: `type` from the code, `detail` from the detail, plus a correlation id.
The domain does not know about HTTP, and it does not need to — it just has to make the
distinction the HTTP layer will need.

### Sealed, so the compiler counts the cases

```java
default <R> Result<R> map(Function<T, R> fn) {
    return switch (this) {
        case Ok<T> ok -> Result.ok(fn.apply(ok.value()));
        case Err<T> e -> Result.err(e.failure());
    };
}
```

No `default` branch. There cannot be another case, so the compiler proves the switch is
total — and if someone adds a third permitted subtype, this stops compiling instead of
silently falling through. That is chapter 07's argument for sealed types in four lines:
exhaustiveness checking is the reason to use them.

### One small thing the compiler taught us

The interface method that returns the failure is called `error()`, not `failure()` —
because `Err` already has a `failure()` accessor generated from its record component,
and a record's accessor cannot be widened to return `Optional<Failure>`. The compiler
rejects it immediately.

It is a small collision, and a useful reminder: **a record component's accessor is part
of the type's public API**, not an implementation detail you can rename later.

---

## 2. In this codebase

| File | What to look at |
|---|---|
| [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java) | The sealed interface, the two records, and `map`/`flatMap` written as total switches. Also the comment stating the boundary, which is the part that matters most. |
| [`Failure.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Failure.java) | Stable code, free-form detail, and why that split is not pedantry. |
| [`Order.cancel`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | A `Result` whose detail names the alternative and carries the tracking number. |
| [`Order.ship`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | Both kinds of failure in one method, with the reasoning in a comment. |
| [`OrderId.parse`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderId.java) | Wrapping and **passing the cause**. Chapter 08: losing the cause leaves a stack trace that stops at your own message. |
| [`OrderTest.refusesToSkipAStep`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/OrderTest.java) | Asserts on the failure *code*, then separately on the message content. Codes are contract; messages are prose. |

---

## 3. Do it

**Lab A — count the `Result`s.**

Grep the domain for `Result.err` and list the codes. There are six — `order.empty`,
`order.not-editable`, `order.price-conflict`, `order.line-not-found`,
`order.illegal-transition` and `order.already-shipped`. For each one, ask
the two questions: could a reasonable caller have triggered it, and can they do
something about it? If any answer is "no", it should have been an exception. (One is
arguable — `order.line-not-found`. Decide, and be able to defend it.)

**Lab B — throw instead, and watch the signature go quiet.**

Change `Order.submit` to throw `IllegalStateException` on an empty order instead of
returning a `Result`. `refusesToSubmitNothing` goes red; fix it with
`assertThrows`. Now look at the method signature:

```java
public Order submit()          // throws… what? You cannot tell.
public Result<Order> submit()  // one of two things, and both are named
```

Then find the second cost: a caller who forgets to catch gets a 500 instead of a 409,
and nothing in the type system warned them. Revert.

**Lab C — drop the cause.**

In `OrderId.parse`, change `new IllegalArgumentException(msg, e)` to
`new IllegalArgumentException(msg)`. Nothing fails — no test asserts on it. Now call it
with `"not-a-uuid"` from a scratch `main` and print the stack trace both ways. The
version without the cause stops at your own message and tells you nothing about *what*
was malformed. Then write the missing test, because a rule nothing asserts is a rule
that will be removed by someone tidying up.

**Lab D — make the boundary real.**

Write a small `toProblemDetail(Failure)` that maps a `Failure` to the RFC 7807 shape
from chapter 18, and a table from code to HTTP status: `order.already-shipped` → 409,
`order.empty` → 422, `order.line-not-found` → 404. Notice you can do this without the
domain knowing anything about HTTP — which is the test of whether the split was drawn
in the right place. Keep it; module 18 needs it.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:08,18 -->
**Chapter 08 — Exceptions, checked and otherwise**

1. **Unchecked for programming errors, checked only when the caller can genuinely recover** and modern frameworks use unchecked throughout.
2. **Catch only what you can act on,** at the level that can act on it.
3. **Always pass the cause when wrapping.** Otherwise you delete the evidence.
4. **Never swallow `InterruptedException`.** Propagate, or restore the flag.
5. **`try-with-resources` always,** and know that it preserves the original exception.

**Chapter 18 — Validation and error responses**

1. **Validate the DTO, not the entity.** Entity constraints fire at flush, in the wrong layer.
2. **`@Valid` on the request body** turns bad input into a 400 before your code runs.
3. **One `@RestControllerAdvice`,** one error shape, stack traces logged and never returned.
4. **Malformed JSON and type mismatches are 400s.** A blanket `Exception` handler hides that.
5. **RFC 7807, plus a correlation id.** Standard shape, traceable incident.
<!-- /CARD -->

---

## 5. Interview questions

**"Quando usa un'eccezione e quando no?"** — Exceptions for programming errors and for
things the caller cannot act on; a return value for outcomes that are ordinary and
actionable. Give the concrete pair: an illegal state transition is a `Result`, a
negative quantity throws. Then add the part most candidates miss — the consistency of
the boundary matters more than where you draw it.

**"Checked o unchecked?"** — Unchecked by default. Checked only when the caller can
genuinely recover *and* you want the compiler to force the decision, which is rarer
than the API designers of 1997 expected. The honest reason checked exceptions failed:
they leak through every layer and get wrapped or swallowed, and a swallowed exception
is worse than none.

**"Cosa fa quando incapsula un'eccezione?"** — Always pass the cause. Wrapping without
it produces a stack trace that stops at your own message, and you lose the line that
actually failed. It costs one argument.

**"Come traduce un errore di dominio in una risposta HTTP?"** — One
`@RestControllerAdvice`, a table from failure code to status, and RFC 7807 with a
correlation id. The domain returns a stable code and a human sentence; the web layer
owns the status. Clients switch on the code, never on the prose.

**"`Optional` o `Result`?"** — `Optional` says "there might be nothing" and carries no
reason. `Result` says "there might be nothing, and here is why". For a lookup,
`Optional`. For an operation that can be refused, `Result` — because the caller almost
always needs to tell the user something, and an empty `Optional` cannot.

**"Non è troppo verboso per Java?"** — Yes, somewhat, and that is a fair objection: no
built-in type, no chaining syntax, no compiler warning if you ignore the value. It pays
off where failures are frequent, named and user-visible — an order workflow — and it
does not pay off in a data-loading script. The wrong answer is to use it everywhere
because it is fashionable; the other wrong answer is to use it in half the codebase.

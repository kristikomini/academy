# Module 07 — Exceptions and the failure boundary

> Site chapter: [08 — Exceptions, checked and otherwise](../../site/chapters/08-exceptions.html)
>
> Code: [`OrderId.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderId.java),
> [`Order.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java),
> [`Money.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Money.java)

*This module is the language mechanics. [Module 12](../module-12-expected-failure/) is
the design decision built on top of it — when to throw at all.*

---

## 1. The idea

An exception is a non-local jump that carries evidence. Everything else about them
follows from deciding what evidence you keep and where you stop the jump.

### Checked or unchecked

The rule that survives contact with real code:

> **Unchecked for programming errors. Checked only when the caller can genuinely
> recover and you want the compiler to force the decision.**

The second case is rarer than the designers of 1997 expected, and the honest reason
checked exceptions lost is that they leak. A `throws IOException` on a low-level method
propagates up through every layer that calls it, so each layer either declares it — and
now your service interface mentions files — or wraps it, or swallows it. Two of those
three are bad, and the third is work. Spring, Hibernate and every modern framework
translate to unchecked and let you opt into handling.

Note what this is *not* an argument for: never using checked exceptions. It is an
argument for the default running the other way.

### Catch only what you can act on, where it can be acted on

`catch (Exception e)` in a loop body is how a system carries on running while doing
nothing useful. The question is not "could this throw?" but "do I have a better answer
than my caller does?" If the answer is no, let it go past.

The corollary is where the catch belongs. One place per application — a
`@RestControllerAdvice`, a worker's outer loop, a `main` — knows how to turn any
failure into a response, a retry or an exit code. Catching everywhere else is
duplication that gets out of sync.

### Always pass the cause

```java
throw new IllegalArgumentException("Not a valid order id: " + raw, e);
```

The second argument is the whole stack trace of what actually failed. Drop it and your
trace stops at your own message: you know the id was invalid and nothing about why.
It costs one argument and it is the single highest-value habit in this module.

### `try-with-resources`, and the exception it does not lose

```java
try (var connection = pool.getConnection()) { ... }
```

`close()` is called on every path. The detail worth knowing: if the body throws *and*
`close()` throws, the body's exception wins and the close failure is attached as a
**suppressed** exception rather than replacing it. The old `finally { close(); }`
pattern silently threw away the original — the interesting one — and that is why
`try-with-resources` is not just shorter.

### `InterruptedException` is not an error

It is a request to stop. Swallowing it discards the request and leaves a thread that
cannot be shut down. Either propagate it, or restore the flag:

```java
Thread.currentThread().interrupt();
```

This is the most commonly mishandled exception in Java, and it is worth knowing
precisely because an empty `catch (InterruptedException ignored) {}` is so easy to
write.

### Where the boundary is drawn in this codebase

Chapter 08's rule applied honestly means most "errors" in an order service are not
exceptional at all. `Order` throws only for broken invariants and returns a
[`Result`](../module-12-expected-failure/) for everything a caller could reasonably
have asked for. `Order.ship` shows both in one method:

```java
if (tracking == null || tracking.isBlank()) {
    throw new IllegalArgumentException("A shipped order needs a carrier tracking code.");
}
// …while an illegal transition returns Result.err("order.illegal-transition", …)
```

A caller might legitimately try to ship something twice — that is a `Result`. No
legitimate caller ships with a blank tracking code — that is a bug, so it throws.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Wrapping **with the cause** | [`OrderId.parse`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderId.java), [`CustomerId.parse`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/CustomerId.java) |
| Throwing for a broken invariant | [`Order.ship`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java), [`OrderLine`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderLine.java), [`Sku`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Sku.java) |
| An exception message that teaches | [`Money.requireSameCurrency`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Money.java) — it says conversion needs a rate and a date |
| `Objects.requireNonNull` at construction, not at first use | every record's compact constructor |
| The throw-versus-return line, in one method | [`Order.ship`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| Asserting on the *message*, because the message is the teaching | [`MoneyTest.refusesMixedCurrencies`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/MoneyTest.java) |

**What is not here yet, and why.** There is no `try-with-resources` and no
`InterruptedException` in `ordini-domain`, because the domain touches no resources and
starts no threads — which is the point of it. Those appear with the JDBC connection
pool in module 21 and the executors in module 08. A module that pointed at code that
does not exist would be exactly the cross-reference this repository's gate is built to
catch, so this table stops where the code does.

---

## 3. Do it

**Lab A — delete the cause and read the difference.**

`OrderId.parse` wraps with the cause. Compare the two traces:

```bash
cd src && mvn -q -pl ordini-domain compile
jshell -q --class-path ordini-domain/target/classes <<'EOF'
try { it.fonderia.ordini.domain.OrderId.parse("not-a-uuid"); }
catch (Exception e) { e.printStackTrace(); }
EOF
```

(No `--execution local` here, unlike the other labs: that mode runs your snippets in
jshell's own JVM and ignores `--class-path`, so the class would not be found.)

Then remove the `, e` from
the constructor call, recompile and run again. With the cause you get
`Caused by: java.lang.IllegalArgumentException: Invalid UUID string: not-a-uuid` and
the exact line inside `UUID.fromString`. Without it you get your own message and
nothing else.

Then note that **no test catches this**. Write one — a rule nothing asserts is a rule
somebody will remove while tidying up.

**Lab B — swallow an exception and watch the loop lie.**

Write a scratch loop that parses a list of ids, half of them malformed, inside
`try { … } catch (Exception ignored) {}`. It completes successfully and processes half
the input. That is what "resilient" code often means in practice — and why the rule is
*catch only what you can act on*. Then rewrite it to collect the failures and report
them, which is the version you would want at 3am.

**Lab C — suppressed exceptions.**

```bash
jshell -q --execution local <<'EOF'
class Res implements AutoCloseable {
    public void close() { throw new IllegalStateException("close failed"); }
}
try (var r = new Res()) { throw new RuntimeException("body failed"); }
catch (Exception e) {
    System.out.println("caught:     " + e.getMessage());
    System.out.println("suppressed: " + java.util.Arrays.toString(e.getSuppressed()));
}
EOF
```

The body's exception is the one you catch; the close failure is attached, not lost.
Then write the same thing with `finally { r.close(); }` and watch the body's exception
disappear entirely — replaced by the close failure, which tells you nothing about what
went wrong.

**Lab D — move the line.**

`Order.ship` throws on a blank tracking code. Change it to return
`Result.err("order.no-tracking", …)` instead, and fix `shippingNeedsTracking`. Now
argue it: is a blank tracking code something a legitimate caller does? If the tracking
code comes from a carrier's API that can return an empty string, the answer changes —
and so should the code. This is the judgement the whole module is about, and it depends
on facts outside the class.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:08 -->
**Chapter 08 — Exceptions, checked and otherwise**

1. **Unchecked for programming errors, checked only when the caller can genuinely recover** and modern frameworks use unchecked throughout.
2. **Catch only what you can act on,** at the level that can act on it.
3. **Always pass the cause when wrapping.** Otherwise you delete the evidence.
4. **Never swallow `InterruptedException`.** Propagate, or restore the flag.
5. **`try-with-resources` always,** and know that it preserves the original exception.
<!-- /CARD -->

---

## 5. Interview questions

**"Checked o unchecked?"** — Unchecked by default; checked only when the caller can
really recover and you want the compiler to force the decision. The reason checked
exceptions failed in practice is that they leak through every layer, so each one either
declares something irrelevant to it, wraps, or swallows — and swallowing is worse than
not having the exception at all.

**"Cosa fa quando incapsula un'eccezione?"** — Always pass the cause. Without it the
stack trace stops at my own message and the line that actually failed is gone. One
argument, and it is the difference between a five-minute diagnosis and an afternoon.

**"Dove mette il `catch`?"** — At the level that can act on it, and once per
application for the rest — a `@RestControllerAdvice` for a web app, the outer loop for a
worker. Catching everywhere else duplicates a decision and the copies drift.

**"Perché `try-with-resources` e non `finally`?"** — Because `finally { close(); }`
throws away the original exception if `close()` also throws, and the original is the
interesting one. `try-with-resources` keeps it and attaches the close failure as
suppressed. Shorter is the smaller reason.

**"Cosa fa con `InterruptedException`?"** — Never swallow it. It is a request to stop,
not an error: propagate it, or catch it and call `Thread.currentThread().interrupt()`
to restore the flag. A thread whose interrupt was swallowed cannot be shut down, and
that shows up as a deploy that hangs.

**"Un `NullPointerException` è un bug o un caso da gestire?"** — Almost always a bug, so
unchecked is right. The exception is the one that comes from auto-unboxing a `null`
wrapper, which looks like a dereference on a line with no `.` in it — worth naming,
because it is the version people fail to recognise.

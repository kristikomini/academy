# Module 05 — Lambdas, streams and Optional

> Site chapter: [06 — Lambdas, streams and Optional](../../site/chapters/06-streams-lambdas.html)
>
> Code: [`Order.total`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java),
> [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java),
> [`OrderService.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java)

---

## 1. The idea

### A lambda needs a functional interface

There is no function type in Java. A lambda is an instance of an interface with exactly
one abstract method, and the compiler works out which from the context. `Function`,
`Supplier`, `Predicate`, `Consumer` are just the ones in `java.util.function`;
`Comparator` and `Runnable` were functional interfaces years before lambdas existed,
which is why they suddenly became usable as ones.

`Order.transitionTo` takes a `Supplier<DomainEvent>` for exactly this reason: the event
must be constructed *only if* the transition is legal, so the caller passes the recipe
rather than the result.

### Streams are lazy and single-use

In the twelve, and both halves matter.

**Lazy.** Nothing runs until a terminal operation. A pipeline of `filter` and `map` with
no `collect` at the end does nothing at all — and does it silently, which is the bug.

**Single-use.** Consume a stream twice and you get `IllegalStateException: stream has
already been operated upon or closed`. A stream is not a collection; it is a pipeline
over one.

The laziness is also why the whole thing is one pass rather than N: `filter().map().findFirst()`
does not build intermediate lists, it pulls one element through the chain and stops.

### `flatMap` when each element yields many

`map` gives you a `Stream<Stream<T>>` and you have to flatten it. `flatMap` is the same
operation with the flattening built in — one level, not deep.

### `parallelStream()` shares the common pool

It uses the shared `ForkJoinPool.commonPool()`, sized to your core count minus one, and
**every** parallel stream in the JVM uses the same one. A blocking operation inside one —
a database call, an HTTP request — starves every other parallel stream in the
application, including ones in library code you did not write.

The bar is high: CPU-bound work, a large collection, and a measurement. For a list of
twenty order lines it is slower than sequential, because splitting and merging costs
more than the work.

### `Optional` is a return type

Not a field, not a parameter. It exists to make "there might be nothing" part of a
method's signature so the caller cannot forget. As a field it is a second allocation and
is not serialisable; as a parameter it forces every caller to wrap, which is worse than
an overload.

**`orElseGet`, not `orElse`.** `orElse(expensive())` evaluates the argument *always*,
even when the Optional is present, because it is an ordinary method call.
`orElseGet(() -> expensive())` only calls it when needed. If the default is a constant it
makes no difference; if it is a database lookup, it is the difference between one query
and two.

[`OrderService.find`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java)
uses `orElseGet` to build its not-found failure, which allocates a `Failure` and formats a
message — small, and there is no reason to do it on every successful lookup.

### `Optional` or `Result`?

`Optional` says there might be nothing. `Result` says there might be nothing *and here is
why* — module 12. For a lookup, `Optional`; the reason is uninteresting, the id was not
there. For an operation that can be refused, `Result`, because the caller almost always
needs to tell somebody what happened and an empty `Optional` cannot.

Both appear in the same class:
[`OrderRepository`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java)
returns `Optional`, and its comment says exactly this.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| A stream with `reduce` and a method reference | [`Order.total`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| `Supplier` so the event is built only if the transition is legal | [`Order.transitionTo`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| `Function` in a generic method, and `map`/`flatMap` implemented by hand | [`Result`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java) |
| `orElseGet`, deliberately | [`OrderService.find`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java) |
| `Optional` as a return type, never a field | [`OrderRepository`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java), [`Order.carrierTracking`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| `.stream().map(…).toList()` | [`JpaOrderRepository.findByCustomer`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |

`Order.total()` is the one to read:

```java
return lines.stream()
    .map(OrderLine::lineTotal)
    .reduce(Money.zero(Money.EUR), Money::plus);
```

The identity is `Money.zero`, which is why an empty order totals `0.00 EUR` rather than
throwing or returning `Optional`. And `Money::plus` is an associative operation on an
immutable type — which is exactly what `reduce` requires and what would make this
correct if it were ever parallelised. (It should not be. There are five lines.)

**There is no `parallelStream()` anywhere in this project**, and that is deliberate:
nothing here is CPU-bound over a large collection. Adding one to look sophisticated would
be the mistake this module warns about.

---

## 3. Do it

**Lab A — the pipeline that does nothing.**

```bash
jshell -q --execution local <<'EOF'
var names = java.util.List.of("ada", "grace", "alan");
names.stream().filter(n -> n.startsWith("a")).map(n -> { System.out.println("mapping " + n); return n; });
System.out.println("--- nothing printed above ---");
names.stream().filter(n -> n.startsWith("a")).map(n -> { System.out.println("mapping " + n); return n; }).toList();
EOF
```

The first pipeline prints nothing. No terminal operation, no work. In real code that is a
`forEach` you forgot to call, and the compiler is happy.

**Lab B — use a stream twice.**

```bash
jshell -q --execution local <<'EOF'
var s = java.util.stream.Stream.of(1, 2, 3);
System.out.println(s.count());
try { System.out.println(s.count()); } catch (Exception e) { System.out.println(e.getMessage()); }
EOF
```

**Lab C — `orElse` versus `orElseGet`.**

```bash
jshell -q --execution local <<'EOF'
String expensive() { System.out.println("computing…"); return "default"; }
var present = java.util.Optional.of("value");
System.out.println("orElse:    " + present.orElse(expensive()));
System.out.println("orElseGet: " + present.orElseGet(() -> expensive()));
EOF
```

"computing…" prints once — for `orElse`, on a *present* Optional. Now imagine that method
is a database query in a hot path.

**Lab D — starve the common pool.**

Run two `parallelStream()` pipelines at once, where one sleeps 200 ms per element. The
other one crawls, because they share `ForkJoinPool.commonPool()`. That is the argument
against blocking inside a parallel stream, and it is much more convincing after you have
watched an unrelated pipeline slow down.

**Lab E — parallel is slower.**

Take `Order.total()` with five lines and time it sequential versus parallel, a million
times each. Parallel loses. Splitting and merging costs more than adding five
`BigDecimal`s, and knowing where the crossover is beats knowing that parallel exists.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:06 -->
**Chapter 06 — Lambdas, streams and Optional**

1. **A lambda needs a functional interface** exactly one abstract method.
2. **Streams are lazy and single-use.** Nothing runs until a terminal operation.
3. **`flatMap` when each element yields many;** `map` when it yields one.
4. **`parallelStream()` shares the common pool.** Rarely right inside a web request.
5. **`Optional` is a return type.** Not a field, not a parameter, never null.
6. **`orElseGet`, not `orElse`,** when the fallback costs anything.
<!-- /CARD -->

---

## 5. Interview questions

**"Cos'è una functional interface?"** — An interface with exactly one abstract method,
which is what a lambda is an instance of — Java has no function type. `Comparator` and
`Runnable` were functional interfaces long before lambdas, which is why they became
usable as ones without changing.

**"Gli stream sono lazy?"** — Yes, and single-use. Nothing runs until a terminal
operation, so a pipeline without one silently does nothing; and consuming a stream twice
throws. The laziness is also why `filter().map().findFirst()` is one pass and does not
build intermediate lists.

**"Quando usa `parallelStream()`?"** — Rarely, and never with blocking work inside. It
uses the shared common pool, so a database call in one starves every parallel stream in
the JVM including library code. It needs CPU-bound work, a big collection, and a
measurement — otherwise splitting costs more than the work.

**"`orElse` o `orElseGet`?"** — `orElseGet` whenever the default costs anything, because
`orElse`'s argument is evaluated even when the value is present. With a constant it makes
no difference; with a query it is one call versus two.

**"Dove usa `Optional`?"** — As a return type, to put "there might be nothing" in the
signature. Not as a field — a second allocation and not serialisable — and not as a
parameter, where an overload is better. And for an operation that can be *refused* I use
a Result instead, because the caller usually needs the reason.

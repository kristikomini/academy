# Module 17 — The request cycle, and what a controller is for

> Site chapter: [16 — REST controllers and the request cycle](../../site/chapters/16-rest-controllers.html)
>
> Code: [`OrderController.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderController.java),
> [`OrderDtos.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java),
> [`FailureStatus.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java),
> [`ApiExceptionAdvice.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java)

---

## 1. The idea

### What actually happens to a request

```
Tomcat → filter chain → DispatcherServlet → HandlerMapping → argument resolvers
       → your method → return value handlers → HttpMessageConverter → response
```

Two things on that line are worth memorising.

**Security is a filter, before the dispatcher.** So a 401 happens before any of your
code runs, and a security problem is not visible from a controller test. It is also
why a CORS failure often *looks* like a 401 on the preflight — the browser's `OPTIONS`
request hit the filter chain and never reached your handler.

**Everything between `HandlerMapping` and your method is binding.** `@PathVariable`,
`@RequestBody`, `@Valid` — by the time your first line runs, the input is parsed,
converted and validated. Which is why validation failures are 400s that never reach
your code, and why they are handled in one advice rather than in every method.

### Thin controllers

Bind, call one thing, shape the output. No business rules.

The test of whether that held: could you add a second delivery mechanism — a message
consumer, a scheduled job — without copying anything out of the controller? In this
codebase you could. Every rule about what an order may do lives in `Order`, and
`OrderController` is 90 lines of routing.

When a controller grows `if (order.status() == CONFIRMED)`, a rule has escaped the
aggregate, and the copy in the message consumer will disagree with it within a month.

### Never return an entity

In the twelve, and there are three separate reasons:

1. **The schema becomes the public API.** Rename a column and you have shipped a
   breaking change you did not intend.
2. **Everything reachable is exposed** — audit columns, internal flags, a customer's
   whole record because it happened to be on an association.
3. **Once JPA is underneath**, serialising a lazy association outside the transaction
   throws `LazyInitializationException` *halfway through writing the response*. The
   client gets a truncated body and a 200, which is the worst possible combination.

The cost is one mapping method. `OrderResponse.from` is eight lines.

### Money and dates on the wire

`BigDecimal` money, ISO-8601 dates — chapter 16, and both for the same reason.

Money crosses as a **decimal string**, not a JSON number, because a JSON number becomes
a double in many clients before anyone notices. Note that
[`AddLineRequest`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java)
takes `unitPrice` as a `String` for the same reason in reverse: Jackson would bind a
JSON number to `BigDecimal` happily, but the value may already have been through a
double on the way in.

Timestamps carry a zone. `2026-03-14T09:15:00Z` is a fact; `2026-03-14 09:15:00` is a
question.

### Status codes are the API

Also in the twelve. Returning 200 with an error body forces every client to parse the
body to find out whether it worked — and monitoring cannot tell either, so every
dashboard counts a failure as a success.

The mapping in
[`FailureStatus`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java)
has two choices worth defending:

- **409 for an illegal transition.** Not 400 — the request was well-formed and would
  have been valid a moment earlier. 409 tells the client that re-reading may change the
  answer.
- **422 for an empty order.** The JSON parsed and the fields were present, so it is not
  400; the entity was understood and semantically wrong.

And one that is a judgement about ownership: **an unmapped failure code is a 500, not a
400.** A code this class has never heard of means the domain grew an outcome nobody
translated. That is our bug, and reporting it as the client's would hide it.

### One advice, one error shape

RFC 7807 (`application/problem+json`) plus a correlation id. The id goes in the
response *and* in the log line with the stack trace, so a support conversation becomes
"give me the reference" instead of "can you reproduce it".

Stack traces are logged, never returned: a trace tells an attacker your framework
versions and package layout, and tells a legitimate client nothing it can act on.

**Extending `ResponseEntityExceptionHandler` is what makes malformed JSON a 400** with
the same body shape as everything else. A bare `@ExceptionHandler(Exception.class)`
without it turns a client's typo into a 500.

### The one thing this codebase does differently

Domain failures **are not thrown**. `OrderService` returns a `Result`, and
`OrderController.respond` turns it into a response with an exhaustive `switch`.

Throwing at the boundary just to catch it in an advice would undo module 12's argument:
an expected outcome should not travel by exception because the framework offers a
convenient place to catch one. What is left for the advice is the genuinely
exceptional — input that never reached the domain, and bugs.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| A thin controller — routing, no rules | [`OrderController`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderController.java) |
| DTOs in, DTOs out | [`OrderDtos`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java) |
| Failure code → HTTP status, in one table | [`FailureStatus`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java) |
| RFC 7807 with a correlation id | [`ApiExceptionAdvice`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) |
| Validation on the request DTO, not the entity | [`AddLineRequest`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java) |
| A slice test with no mocks | [`OrderControllerTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderControllerTest.java) |

`OrderControllerTest` is worth reading as a specification of this module: it asserts
that money is a string, that internal fields do not leak, that an illegal transition is
409 with `application/problem+json`, that an empty order is 422 and not 409, and that
malformed JSON is 400 and not 500.

**`POST /orders/{id}/submit` is not a REST purity failure.** Nouns in the path and verbs
from HTTP is the rule, and a state transition is not a field update. Modelling submit as
`PATCH {"status": "SUBMITTED"}` would invite clients to invent transitions the state
machine does not allow, and would make the API's vocabulary larger than the domain's.

---

## 3. Do it

**Lab A — see it end to end.**

```bash
cd src && mvn -q install -DskipTests
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18080 &
```

```bash
# create, then add a line with a lower-case SKU
curl -s -X POST localhost:18080/api/orders -H 'Content-Type: application/json' \
  -d '{"customerId":"11111111-1111-1111-1111-111111111111"}'
```

Take the `id` from the response and add a line with `"sku":"bl-1001"`. It comes back
`BL-1001` — the value object normalised it, at the edge, once. Then try to ship before
confirming:

```
HTTP/1.1 409
Content-Type: application/problem+json

{"type":"https://fonderia.example/problems/order.illegal-transition",
 "title":"order.illegal-transition",
 "status":409,
 "detail":"An order cannot go from DRAFT to SHIPPED. From DRAFT the only moves are [SUBMITTED, CANCELLED].",
 "instance":"/api/orders/…/ship"}
```

The detail names the allowed moves. That sentence was written in the domain, in
`Order.transitionTo`, and travelled all the way out without the web layer knowing
anything about state machines.

**Lab B — return the entity and watch the API change.**

Make `get` return `Order` directly instead of `OrderResponse`, and run the tests.

`responseIsADto` fails — but not the way you would expect, and the way it fails is the
better lesson:

```
Status expected:<200> but was:<406>
```

**406 Not Acceptable.** Not a leak of internal fields: Jackson cannot serialise `Order`
*at all*. It looks for JavaBean getters — `getId()`, `getStatus()` — and the aggregate
has `id()` and `status()`, because it was designed for the domain and not for a
serialiser. No properties found, no representation produced, 406.

Sit with that for a second. The usual argument against returning entities is about
coupling and leakage, and it is true. This codebase adds a blunter one: **a domain
object shaped by its invariants is not shaped for the wire**, and the moment you return
one you start bending it — adding getters it does not need, a no-args constructor it
must not have, `@JsonIgnore` on the fields you forgot about.

To see the leak version too, add `@JsonAutoDetect(fieldVisibility = ANY)` and look at
what comes out: `pendingEvents`, `cancellationReason`, the `Clock`. Then imagine
renaming one of those private fields and shipping it.

**Lab C — 200 with an error body.**

Change `respond` to always return `ResponseEntity.ok(...)` with the problem document in
the body. Three tests fail on status. Now think about what does *not* fail: nothing in
your monitoring would. Every failure is a 2xx, every dashboard is green, and the only
way to know is to parse bodies.

**Lab D — remove `ResponseEntityExceptionHandler`.**

Make `ApiExceptionAdvice` a plain `@RestControllerAdvice` without extending it.
`malformedJsonIs400` fails — the blanket `Exception` handler catches
`HttpMessageNotReadableException` and turns a client's typo into a 500. This is chapter
18's rule with a failing test attached.

**Lab E — add a validation rule and watch where it fires.**

Add `@Size(max = 20)` to `ShipRequest.tracking`, then send a longer one. It is a 400
from the advice, and your controller never ran. Now move the constraint to a domain
object instead and see the difference: the failure becomes an
`IllegalArgumentException` from a constructor, handled by a different branch. Both are
400s; only one of them tells the client which field.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:16 -->
**Chapter 16 — REST controllers and the request cycle**

1. **Security is a filter, before the dispatcher.** That is why `@ControllerAdvice` never sees auth failures.
2. **Thin controllers.** Map, validate, delegate, set the status code.
3. **Never return an entity.** DTO records: one line, and the schema stops being the contract.
4. **`LazyInitializationException` during serialisation means the entity escaped the transaction.**
5. **ISO-8601 dates, `BigDecimal` money.** Configure once.
<!-- /CARD -->

---

## 5. Interview questions

**"Cosa succede a una richiesta HTTP in Spring?"** — Filter chain first — security lives
there, before the dispatcher — then `DispatcherServlet`, handler mapping, argument
resolvers doing binding and validation, your method, then a message converter on the
way out. The useful consequence: a 401 happens before your code, which is why a CORS
error is so often a 401 on the preflight.

**"Perché non restituire l'entità?"** — Three reasons: the schema becomes the public API,
everything reachable gets exposed, and with JPA underneath a lazy association
serialised outside the transaction throws halfway through the response — so the client
gets a truncated body with a 200. The cost of avoiding all that is one mapping method.

**"Dove mette la validazione?"** — On the request DTO, with `@Valid` on the body, so bad
input is a 400 before any of my code runs. Entity constraints fire at flush time, which
is the wrong layer and the wrong moment — by then you are inside a transaction and it
is a 500.

**"Come struttura gli errori dell'API?"** — One `@RestControllerAdvice`, RFC 7807, and a
correlation id in both the response and the log. Stack traces logged, never returned.
And status codes that mean something: 409 when the resource is in the wrong state, 422
when the body parsed but was semantically wrong, 400 when it did not parse.

**"200 con un body di errore?"** — No. Status codes are the API. It forces every client
to parse the body to know whether it worked, and it makes monitoring useless — every
failure counts as a success on every dashboard.

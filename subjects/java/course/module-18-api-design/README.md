# Module 18 — Designing the API: REST, errors and the contract

> Site chapters: [17 — Designing a REST API people can use](../../site/chapters/17-rest-design.html),
> [18 — Validation and error responses](../../site/chapters/18-validation-errors.html),
> [21 — OpenAPI, contracts and generated clients](../../site/chapters/21-openapi.html)
>
> Code: [`OrderController.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderController.java),
> [`FailureStatus.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java)

*Module 17 is the mechanics — how a request becomes a response. This one is the design:
what the API should look like to somebody who has to use it.*

---

## 1. The idea

### Nouns in the path, verbs from HTTP — and the honest exception

`GET /orders/{id}`, `POST /orders`. Not `/getOrder`, not `/createOrderServlet`.

But this API has `POST /orders/{id}/submit`, and that is deliberate. A state transition is
not a field update. Modelling it as `PATCH {"status": "SUBMITTED"}` invites clients to
invent transitions the state machine does not allow, and makes the API's vocabulary wider
than the domain's. A sub-resource action is the standard pragmatic answer, and being able
to defend the exception is worth more than reciting the rule.

### Status codes are the API

In the twelve. 200 with an error body forces every client to parse the body to find out
whether it worked — and so does your monitoring, which means it does not, and every
dashboard counts failures as successes.

The set that covers almost everything:

| Code | When |
|---|---|
| 200 / 201 | It worked; 201 with a `Location` when something was created |
| 400 | The request did not parse or failed validation |
| 401 / 403 | Who are you / you may not |
| 404 | No such resource |
| 409 | The resource is not in a state where this applies |
| 422 | It parsed, the fields were there, it was semantically wrong |
| 500 | Our bug |

Two of those are judgement calls this codebase makes explicitly, in
[`FailureStatus`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java):
**409 for an illegal transition** (well-formed, and would have been valid a moment
earlier — re-reading may change the answer) and **422 for an empty order** (it parsed;
the entity was understood and wrong).

### POST is not idempotent, and that is the client's problem too

`GET`, `PUT` and `DELETE` are idempotent — repeating them lands in the same state.
`POST` is not, so a client that retries after a timeout may create two orders.

The fix is an **idempotency key**: the client sends `Idempotency-Key: <uuid>`, the server
stores it with the result, and a repeat returns the first outcome instead of doing the
work again. Stripe made this the convention; it is worth naming in an interview because
it shows you have thought about what happens after a timeout, which is where real
integrations break.

### Cap page size server-side

`?size=1000000` should return your maximum, not attempt it. The cap belongs in
configuration because it is an operational decision —
[`OrdiniProperties.maxPageSize`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/OrdiniProperties.java)
exists for exactly this, validated at start-up.

Offset pagination gets slower and skips rows as data shifts under it. Keyset pagination
— `WHERE (changed_at, id) < (?, ?) ORDER BY … LIMIT n` — is stable and stays fast,
because the index does the work. It cannot jump to page 50, which is almost never what a
client actually needs.

### Versioning, and the change that is not breaking

**Adding an optional field is not a breaking change.** A client that ignores unknown
fields keeps working — which is why *your* clients should ignore unknown fields, and why
Jackson's default of failing on them is worth reconsidering at a consumer.

Breaking: removing a field, renaming one, changing a type, tightening validation, adding
a required request field, changing a status code.

When you must break it: `/api/v2/...` in the path is the pragmatic choice — visible in
logs, easy to route, easy to explain. Header versioning is purer and harder to debug. And
run both for a deprecation window, with `Deprecation` and `Sunset` headers on the old one.

### The contract: generate it from the code

`springdoc-openapi` reads the controllers and the Bean Validation annotations and
produces the document, so `@Positive` on a DTO becomes `minimum: 1` in the schema. One
source of truth, and it cannot drift.

**Contract-first — writing the OpenAPI document by hand and generating server stubs — is
the right choice when the consumer is another team or another company**, because then the
contract is a negotiation artefact that must exist before either side starts. Within one
team, code-first is less ceremony for the same result.

Either way, generated clients unblock the caller: they can start before you have
finished.

**A published bad API is still a bad API.** OpenAPI documents what you built; it does not
make it good, and a beautifully specified endpoint that returns 200 with an error body is
still wrong.

---

## 2. In this codebase

| Decision | Where |
|---|---|
| Nouns and HTTP verbs, with transitions as sub-resources | [`OrderController`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderController.java) |
| Failure code → status, in one table with the arguments | [`FailureStatus`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java) |
| An unmapped code is a 500, not a 400 | [`FailureStatus.statusFor`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java) |
| RFC 7807 with a correlation id | [`ApiExceptionAdvice`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) |
| A stale write is 409, not 500 | [`ApiExceptionAdvice.handleConcurrentModification`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) |
| Page size capped in validated configuration | [`OrdiniProperties`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/OrdiniProperties.java) |
| Money and dates as strings on the wire | [`OrderDtos`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java) |
| The status decisions, asserted | [`OrderControllerTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderControllerTest.java) |

**There is no OpenAPI document yet**, because `springdoc-openapi` is not on the classpath.
That is one dependency and a lab below, and saying so beats pointing at a file that does
not exist.

**And `maxPageSize` is configured but unused** — there is no paginated endpoint yet. It is
validated at start-up and read by nothing. That is worth flagging rather than hiding: a
configuration property with no consumer is a small lie about what the application does.

---

## 3. Do it

**Lab A — generate the document.**

Add to `ordini-app/pom.xml`:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.7.0</version>
</dependency>
```

Start with `--spring.profiles.active=dev` and open `/swagger-ui.html`. Then look at the
schema for `AddLineRequest`: `@Positive` on `quantity` became `minimum: 1` without
anybody writing it twice. That is what "generate the document from the code" buys.

**Lab B — write the endpoint `maxPageSize` was for.**

Add `GET /api/orders?customerId=…&size=…` over `OrderService`, clamping `size` to
`ordiniProperties.maxPageSize()`. Then ask for a million and confirm you get the cap
rather than a timeout. Now the property has a consumer and the honesty note above can be
deleted.

**Lab C — the idempotent POST.**

Accept an `Idempotency-Key` header on `POST /api/orders`, store the key with the created
order's id, and return the original response on a repeat. Then simulate the case it
exists for: send the request, drop the response, send it again. One order, not two.

**Lab D — break the contract on purpose.**

Rename `carrierTracking` to `trackingCode` in `OrderResponse`. Every test still passes —
DTO field names are asserted by nobody. Then imagine a client. This is the argument for a
contract test, and for the OpenAPI document being in the repository where a diff shows up
in review.

**Lab E — argue the status codes.**

Read `FailureStatus` and disagree with one of them. `order.price-conflict` as 409 —
should it be 422? `order.line-not-found` as 404 — the *order* exists, so is 404 right?
There is no single answer, and having the argument once means you will not be inventing
it in an interview.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:17,18,21 -->
**Chapter 17 — Designing a REST API people can use**

1. **Nouns in the path, verbs from HTTP.** `POST /orders`, never `/createOrder`.
2. **Status codes are the API.** 200-with-an-error-body forces every client to parse to find out.
3. **POST is not idempotent.** Use an idempotency key and a unique constraint, not a pre-check.
4. **Cap page size server-side,** and prefer keyset pagination for large collections.
5. **Adding an optional field is not a breaking change.** Design so you rarely need v2.

**Chapter 18 — Validation and error responses**

1. **Validate the DTO, not the entity.** Entity constraints fire at flush, in the wrong layer.
2. **`@Valid` on the request body** turns bad input into a 400 before your code runs.
3. **One `@RestControllerAdvice`,** one error shape, stack traces logged and never returned.
4. **Malformed JSON and type mismatches are 400s.** A blanket `Exception` handler hides that.
5. **RFC 7807, plus a correlation id.** Standard shape, traceable incident.

**Chapter 21 — OpenAPI, contracts and generated clients**

1. **Generate the document from the code** and it cannot drift from the code.
2. **Bean Validation annotations become schema constraints.** One more reason to use them.
3. **Contract-first when the consumer is another team or company;** code-first for one internal client.
4. **Generated clients unblock the caller** before your service exists.
5. **A published bad API is still a bad API.** Swagger UI does not make it a design.
<!-- /CARD -->

---

## 5. Interview questions

**"Come progetta un endpoint REST?"** — Nouns in the path, verbs from HTTP, and status
codes that mean something. Then I would volunteer the exception: a state transition like
`POST /orders/{id}/submit` is not a field update, and modelling it as a PATCH on status
invites clients to invent transitions the domain does not allow.

**"Quali status code usa?"** — 201 with a `Location` on creation, 400 for a request that
did not parse or failed validation, 401 and 403 for identity and permission, 404 for a
missing resource, 409 when the resource is in the wrong state, 422 when it parsed and was
semantically wrong, 500 for our bug. The 409-versus-422 distinction is the one worth being
able to defend.

**"POST è idempotente?"** — No, which is why a client that retries after a timeout can
create two orders. The fix is an idempotency key: the client sends one, the server stores
it with the result and returns the original on a repeat.

**"Aggiungere un campo è breaking?"** — Not if it is optional and clients ignore unknown
fields. Removing, renaming, retyping, tightening validation and changing a status code
all are. When I do have to break it, a version in the path and a deprecation window with
`Sunset` headers.

**"Come documenta l'API?"** — Generated from the code with springdoc, so the validation
annotations become schema constraints and the document cannot drift. Contract-first when
the consumer is another team or company, because then the contract has to exist before
either side writes anything.

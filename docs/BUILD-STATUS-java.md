# Fonderia Academy — build plan and honest status

A Java/Spring build of the LogiFlow Academy platform, following
`Desktop/C#/docs/BLUEPRINT.md` §10 (build order) and §12 (the numbers to hit).

**Every number in this file was measured, not estimated.** Regenerate them with
`php tools/doctor.php java` before editing any of them — the blueprint's integrity
gate (§8, check 11) exists because prose counts rot silently, and this document
is the most likely place for that to happen first.

---

## What this is

The same two-system design as the original: a **tutorial platform** (static,
framework-free, offline-capable, `file://`-openable) wrapped around a
**reference application** written in the language being taught — here Java
instead of C#.

Naming: the platform is **Fonderia Academy**. *Fonderia* = foundry: where things
are cast to run for twenty years, which is the Java market in this region.

---

## Status: all nine phases complete

| # | Phase (blueprint §10) | Status |
|---|---|---|
| 1 | Collect the adverts, derive the manifest | **Done** — 6 postings, 52 entries |
| 2 | The shell — CSS, site.js, manifest, one chapter | **Done** — engine synced, 52 chapter files generated |
| 3 | The engine, unchanged — store, quiz, learn, notes, the pages | **Done, verified in a browser** |
| 4 | Content in bulk — the prose and the question bank | **Done** — 52 chapters, 416 questions |
| 5 | The deep course + GOLDEN-RULES.md | **Done** — 28 of 28 modules, all links resolving |
| 6 | The viva — deck generator, viva.html, simulate.html | **Done, verified in a browser** — 291 cards, generated |
| 7 | The accounts service (Java) | **Done** — 14 endpoints, 27 tests, verified live and cross-origin |
| 8 | Offline and install | Ported; cache `fonderia.java-v8` |
| 9 | The integrity gate — 11 checks + CI | **Done** — `php tools/doctor.php java` passes |

### Measured counts, right now

| Thing | Now | Target (blueprint §12) |
|---|---:|---:|
| Site chapters (files + manifest entries) | 52 | 52 |
| Chapters actually written | **52** | 52 |
| Chapters that are honest placeholders | **0** | 0 |
| Chapters answering an advert line (`req`) | 27 | — |
| Chapters beyond the advert (`extra`) | 25 | — |
| Quiz questions | 416 | 432 |
| Chapters with questions | 52 | 52 |
| Glossary terms | 0 | 133 |
| Glossary categories | 7 | — |
| Italian chapter panels | 0 | 31 |
| Italian phrases | 0 | — |
| Viva rules | 291 | 362 |
| Course modules | 28 | 28 |
| API endpoints | 0 | 14 |
| Integrity checks (in `tools/doctor.php`) | 11 | 11 |

**There are no placeholders left.** Every chapter carries real content in the
worked shape from the PHP subject's `03-oop-in-php.html`: paired `.box.kid` /
`.box.pro` on each concept, a `.box.trap` for the mistake people actually make,
runnable `.tryit` code where it earns its place, `.rules`, and a `.qa` whose
answer is sketched in Italian.

**The question bank is 416, against the blueprint's headline target of 432.**
That is 8 per chapter, inside the blueprint's own 8–17 range but below the round
number in §12, and it is stated here rather than rounded up. The
chapters that would most repay a second pass are the ones this course argues are
highest-value: 09 (concurrency), 22 (pools), 25 (transactions) and 26 (N+1).

Per blueprint §10 the questions were supposed to go in alongside the prose
rather than after it. They did not, and the append-only lockfile is what made
adding them afterwards safe: 416 ids issued, none reassigned.

---

## Phase 1 — the adverts (done)

Six Java postings for Emilia-Romagna and Milano, collected September 2026:

1. **Java Developer (industry), Bologna** — microservices for industrial
   systems: Java 11+, Spring Boot, Spring Cloud, REST/GraphQL, OPC UA/MQTT/Modbus.
2. **Java Developer (AI / document lifecycle), Bologna** — Java, Spring,
   Spring Boot, AWS (EC2, S3, Route53).
3. **Middle Software Developer, Modena** — Java/Spring/Spring Boot behind an
   Angular/TypeScript front end.
4. **Senior Java Developer, Bologna** — Java 8+, Spring/Spring Boot, REST API,
   dependency injection, Spring Data JPA.
5. **Backend Developer mid-senior, Milano (hybrid)** — Java 17, Spring Boot,
   OpenShift/Kubernetes, Kafka/RabbitMQ, MongoDB, Oracle.
6. **Middle Backend Developer (public administration, remote)** — Java 11+,
   Quarkus and Spring Boot.

Recurring requirement lines are quoted verbatim in Italian in each chapter's
`req` field. Of the 52 manifest entries, 27 carry one and 25 carry an `extra`
explaining why they are here anyway.

---

## Phase 6 — the viva deck (done)

`site/assets/rules.js` holds **291 cards** and is generated. Two tools, both new,
both in `tools/`:

| Tool | Reads | Writes |
| --- | --- | --- |
| `viva-extract.php` | the `.rules` block of all 52 chapters | `course/GOLDEN-RULES.md` |
| `viva-deck.php` | `course/GOLDEN-RULES.md` | `site/assets/rules.js` |

Run them in that order; neither output is ever hand-edited.

**This inverts the blueprint's arrow, deliberately.** Blueprint §3.4 has
`GOLDEN-RULES.md` authored by hand with the chapters referring to it, which is
right for the C# subject, where the deep course was written first. Here the
chapters came first and already carried 292 rules in the exact
`<strong>claim</strong> why` shape the deck needs. Writing them out a second time
by hand would have produced two copies of every sentence, drifting apart from the
first edit onwards — the precise rot the gate exists to catch. So the chapters are
the source of truth and the markdown is derived. The blueprint's actual principle,
one authored place per fact, is kept; only the direction changed.

**What is still editorial.** Which rules are *the twelve that decide interviews*
and which are *the six that separate a senior candidate* cannot be extracted —
that is a judgement, and it lives in `course/viva-tiers.json` as a list of rule
slugs. `viva-extract.php --candidates` prints every slug to choose from, and a
slug that no longer matches a rule is reported as a warning rather than silently
dropping a card. The twelve here cover `equals`/`hashCode`, erasure, proxying, dirty checking, rollback rules. The twelve run in chapter order because the Java surface is broad and roughly independent; a candidate meets these ideas in any order.

**Card kinds.** 260 cards are `explain` (say why the claim is true) and
31 are `complete` (finish the sentence). The split is not arbitrary: a rule
whose chapter wrote no justification has nothing to reveal on the back, and a card
you cannot mark yourself against is where self-marking drifts generous. Those
become `complete`, with the stem cut at the rule's own clause boundary.

**Checks before it writes.** `viva-deck.php` refuses to emit a deck containing an
`explain` card with an empty back, a `complete` card whose stem gives away the
claim, an unbalanced backtick, a duplicate id, an undecoded HTML entity, or a
twelve that is not twelve. The entity check is there because `viva.js` escapes text
before re-adding its own markup — the same failure that put literal `<code>` tags
in the first thirty quiz questions.

**Verified in a browser on 2026-09-08**, port 8100: 291 cards load, a
session starts, the chapter title renders above each claim, a typed answer reveals
the written justification with a pointer to the chapter file, grading advances and
is recorded on the dashboard, and a `complete` card shows its stem with the task
text switching to "Finish the rule". Repeated `continues` claims show the
ellipsis correctly.

## Phase 5 — the deep course and its reference system (done)

All twenty-eight modules are written, and the code they cite is real.

### The blocker that had to be resolved first

Blueprint §3.6 makes part 2 of every module "In this codebase — the exact files in
`src/` that use it", and the PHP subject's course README turns that into a rule:

> Write the module whose code you have just finished in `src/`, so part 2 can cite real
> file paths rather than promises. A module pointing at a file that does not exist yet
> is exactly the kind of cross-reference `tools/doctor.php` was built to catch.

`src/` was empty. So phase 5 could not start as markdown; it had to start as a build.
JDK 21, Maven 3.9.9 and Docker are all present on the machine, so a reference system
that genuinely compiles and tests was achievable rather than aspirational.

### What exists in `src/`

A Maven multi-module build, `it.fonderia:ordini-parent`. The domain is order
fulfilment, kept from the C# subject deliberately (§9.4): real invariants, real
concurrency, real money arithmetic, real state.

| Module | State |
|---|---|
| `ordini-domain` | **Real.** 10 classes, 44 tests, `mvn test` green. |
| `ordini-app` | **Real.** Spring Boot 3.4.1: container, typed configuration, the web tier, RFC 7807 errors, and JPA over PostgreSQL with Flyway migrations and working optimistic concurrency. 32 fast tests plus 6 Testcontainers ones. Boots, serves HTTP, persists, verified with curl. The outbox and messaging still to come. |
| `ordini-exercises`, `ordini-demos` | Not started. |

`ordini-domain` has **no Spring and no JPA on its classpath at all** — its pom
declares JUnit and nothing else. "The domain must not depend on the framework" is
therefore enforced by the build rather than by a code review, which is the cheapest
architecture test there is and the reason its whole suite runs in milliseconds with
no container and no mocks.

The classes: `Money` (BigDecimal with normalised scale), `OrderId` / `CustomerId`
(typed ids), `Sku`, `OrderLine`, `OrderStatus` (the transition table as data),
`Order` (the aggregate, with a `Clock` injected and a version for optimistic
concurrency), `DomainEvent` (sealed), `Result` / `Failure`.

### Modules written

| # | Module | Chapters | Code it cites |
|---|---|---|---|
| 02 | Types, equality and the object contracts | 03 | `Money`, `Order`, the typed ids |
| 04 | Generics and erasure | 05 | `Result<T>`, `Ok<T>`, `Err<T>` |
| 06 | Records, sealed types and pattern matching | 07 | `DomainEvent`, `Result`, every record |
| 07 | Exceptions and the failure boundary | 08 | `OrderId.parse`, `Order.ship`, `Money` |
| 10 | The domain model: value objects, typed ids and money | 03, 07 | `Money`, `OrderId`, `Sku`, `OrderLine` |
| 11 | The state machine, invariants and domain events | 07, 25 | `Order`, `OrderStatus`, `DomainEvent` |
| 12 | Expected failure: `Result`, and where exceptions still belong | 08, 18 | `Result`, `Failure` |
| 13 | The Spring container: beans, scopes, lifecycle, proxies | 11 | `ClockConfig`, `OrdiniApplicationTests` |
| 14 | Dependency injection, and the design it exposes | 12 | `OrderService`, `OrderRepository` |
| 15 | Configuration, profiles and typed binding | 13 | `OrdiniProperties`, `application.yaml` |
| 16 | Spring Boot, auto-configuration, and Quarkus compared | 14, 15 | both poms |
| 17 | The request cycle, and what a controller is for | 16 | `OrderController`, `OrderDtos`, `FailureStatus` |
| 21 | JDBC, connection pools and what leaks | 22 | `application.yaml`, the poms |
| 22 | JPA and Hibernate: the persistence context | 23, 24 | `OrderEntity`, `OrderMapper`, `SpringDataOrderRepository` |
| 23 | Transactions, propagation and concurrency | 25 | `JpaOrderRepository`, `Order.baseVersion` |
| 24 | The N+1 problem and fetching strategies | 26 | `NPlusOneTest`, `SpringDataOrderRepository` |
| 25 | The SQL you will meet, and migrations | 27, 28, 29 | `V1__orders.sql`, `V2__index…sql` |
| 26 | Many services: messaging, the outbox, idempotency | 30, 31, 33, 34 | `V3__outbox.sql`, `OutboxRelay`, `OutboxPayload` |
| 01 | The JVM, and what actually runs | 01, 02 | `src/pom.xml` |
| 03 | Collections, and what each one costs | 04 | `OrderStatus`, `InMemoryOrderRepository` |
| 05 | Lambdas, streams and Optional | 06 | `Order.total`, `Result`, `OrderService` |
| 08 | Threads, executors and virtual threads | 09 | `InMemoryOrderRepository`, `OutboxRelay` |
| 09 | Memory, garbage collection and the heap | 10 | `application.yaml` |

Modules 02/06/07 are the language treatments; 10/11/12 apply them to a domain. Where
both cover a chapter they share its generated card, which cannot drift because it has
one source — and each says so in a line at the top.

### Part 4 is generated, like everything else in the rules chain

A module's "Golden rules" card would have been a third hand-written copy of sentences
that already exist in the chapters and in `GOLDEN-RULES.md`. Instead each module
declares which chapters its card comes from:

```
<!-- CARD:03,07 -->
...generated...
<!-- /CARD -->
```

and `tools/module-cards.php` fills it. `--check` fails if any card has drifted, so it
can go in CI. The chapter-reading logic it shares with `tools/viva-extract.php` was
factored into `tools/lib/rules.php` at the same time; the regenerated
`GOLDEN-RULES.md` was diffed byte-for-byte against the pre-refactor output to prove
the move changed nothing.

### The labs were run, not asserted

Every "delete this line and N tests fail" claim in these modules was executed. Three
were wrong as first written, and two of those were worth more than the lab:

- Module 10 lab A claimed two failures; the real number is **five**, and one of them
  is in `OrderTest`, three classes away from the change. The corrected text uses that:
  one line in one value object changes the answer of a test that was not about money.
- Module 11 lab A claimed three failures; only **two** occurred, because
  `Order.cancel` guarded on `SHIPPED` *before* consulting the transition table. That
  is duplication — the code could disagree with its own specification while the test
  asserting the table still passed. `cancel` now defers to the table, and the lab is
  true.
- Module 11 lab B claimed one failure; **none** occurred. The version bump for
  optimistic concurrency was entirely untested, and it hid well because in a
  single-threaded test nothing observable depends on it.
  `OrderTest.versionTracksEveryChange` now exists because of this exercise.
- Module 10 lab C's Turkish-locale trap does not reproduce with the SKU the tests
  use: `bl-1001` contains no `i`. The lab now uses `in-2002` and says why the original
  fixture hides the bug.

### More labs run, more claims corrected

The second batch of modules was checked the same way, and four more claims were wrong:

- Module 02 lab C named `contentsDoNotMakeIdentity` as the test that fails when `Order`
  gets contents equality. It **passes** — the two orders it builds have different ids,
  so including the id still separates them. The one that fails is
  `identityIsTheIdNotTheState`. The lab now asks the reader to predict, because the
  wrong guess is the instructive one.
- Both `java - <<EOF` snippets do not run: the single-file source launcher has no stdin
  form on JDK 21. Rewritten as `jshell -q --execution local`.
- Module 07 lab A then failed differently: `--execution local` runs snippets in
  jshell's own JVM and ignores `--class-path`, so the domain classes were not found.
  That lab drops the flag and says why.
- Module 04 lab B was right: swapping the `Err` rebuild for `(Result<R>) this` builds,
  all 44 tests pass, and `-Xlint:all` reports exactly two `unchecked cast` warnings.

### Two silent build failures the Spring slice uncovered

Both come from importing the Boot BOM rather than inheriting
`spring-boot-starter-parent` — a deliberate choice for a multi-module build, but the
parent was doing two things nobody notices until they stop:

1. **`-parameters`.** Without it, Spring cannot see that a controller argument is
   called `id`, and every `@PathVariable` fails at *request* time with a 400. Seven
   controller tests failed on this. The `@SpringBootTest` context-loads test passed
   throughout, because nothing is wrong until a request arrives. Note also that adding
   the flag needs `mvn clean` — incremental compilation leaves the old classes and the
   fix appears not to work.
2. **The `repackage` goal.** The parent binds it; the BOM does not. The plugin sat on
   the build doing nothing, `mvn package` produced an ordinary jar, the build stayed
   green, and the failure surfaced only at `java -jar`: `no main manifest attribute`.

Both are now in the poms with the reasoning next to them, and both are labs in module
16.

### Labs run in the Spring slice, and two more corrections

- **Module 17 lab B** claimed that returning `Order` from a controller leaks internal
  fields. It does something blunter: **406 Not Acceptable**. Jackson looks for
  JavaBean getters and the aggregate has `id()`, not `getId()`, so no representation is
  produced at all. The corrected lab uses that — a domain object shaped by its
  invariants is not shaped for the wire — and shows the leak separately with
  `@JsonAutoDetect`.
- **`OrdiniPropertiesTest` needed a rewrite mid-flight.** `ORDINI_ENVIRONMENTNAME` does
  not bind from an arbitrary property source: SCREAMING_SNAKE_CASE is decoded by
  `SystemEnvironmentPropertySource` specifically. The first version bound nothing and
  failed on a missing `@NotBlank`, which is a confusing way to learn the rule. The test
  now installs a real system-environment source and says why.
- Verified as written: module 13 lab B (nothing is proxied yet), module 17 lab C
  (exactly three tests fail when every response becomes 200), module 17 lab D
  (`malformedJsonIs400` becomes a 500 without `ResponseEntityExceptionHandler`).

### The application actually runs

Not just MockMvc. Built, started on port 18080, and driven with curl: creating an order,
adding a line with a lower-case SKU that came back normalised to `BL-1001`, money as
decimal strings, the version incrementing, and shipping before confirming returning
`409 application/problem+json` whose `detail` names the allowed moves — a sentence
written in the domain that reached the wire without the web layer knowing anything
about state machines.

### The persistence slice, and the four real bugs it produced

This was the most productive part of the build so far, because most of it did not work
first time and every failure was a teachable one.

1. **`ddl-auto: validate` earned its keep immediately.** The migration said `CHAR(3)`
   for currency codes and the mapping said `varchar(3)`; the context refused to start.
   `CHAR` pads to a fixed width, so "EUR" would have come back with trailing spaces and
   comparisons would have started failing in ways that look like data corruption.
2. **Three separate ways to break a mapped child collection**, all hit in sequence:
   assigning a new list (*collection with cascade all-delete-orphan was no longer
   referenced*), clearing and re-adding (*a different object with the same identifier
   value was already associated with the session*), and reconciling by position, which
   violates a unique constraint because Hibernate issues UPDATEs before DELETEs. The
   fix was to key `order_lines` on `(order_id, sku)` — the natural key the aggregate
   already guarantees — and reconcile by it. That removed the ordering problem instead
   of sequencing around it.
3. **Optimistic locking was present and doing nothing.** `@Version` was on the entity,
   the column incremented, and no write was ever rejected — because `save` re-read the
   row to get a managed instance, so Hibernate's check compared a value it had just
   loaded in the same transaction. `Order.baseVersion()` now records the revision an
   aggregate was loaded from and the repository compares it explicitly, which is what
   blueprint §9.4 describes. Deleting that check makes exactly one test fail, verified.
   **The general lesson: an annotation being present is not evidence the behaviour is
   happening.**
4. **`Order.rehydrate` silently dropped two fields.** It never restored
   `carrierTracking` or `cancellationReason`, so a shipped order round-tripped through
   the database and came back with no tracking code, no exception and no warning. The
   round-trip test asserted on status and lines and did not look. A round-trip test that
   checks *some* fields proves nothing about the others.

### Docker is not running here

`OrderPersistenceIT` starts PostgreSQL 16 with Testcontainers and runs the real
migrations against it — chapter 39's rule, test against the database you deploy on. The
Docker daemon is not available on this machine, so it **skips cleanly**: 6 tests, 6
skipped, no failures, with a disabled-reason saying to start Docker Desktop. It is
excluded from `mvn test` by name so the fast suite stays fast.

The H2 tests are the compromise, and the code says so: they catch mapping mistakes in
milliseconds and prove nothing about PostgreSQL.

### The N+1 is measured, not asserted

`NPlusOneTest` counts statements with Hibernate's own `Statistics`: the derived query
plus a read of the lines is **21**, the same list with `@EntityGraph` is **1**. Switching
`JpaOrderRepository` back to the naive query fails `theAdapterUsesTheFixedQuery` with
`expected: <1> but was: <21>` — verified, so the regression can never ship quietly.

Getting that test to measure anything took a correction worth recording: the first
version returned counts of 0 and 4, because `@DataJpaTest` runs the whole test in one
transaction and the entities saved in `setUp` were still in the first-level cache. **A
test that measures queries has to control its own transactions, or it is measuring the
cache.**

`V2__index_orders_by_customer_and_recency.sql` exists because module 24 added a query
V1's index did not serve — a composite index replacing the single-column one, with the
left-to-right rule and the write-amplification argument written next to it.

### A lab that was wrong in an instructive way

Module 25's first lab said to edit an applied migration and run the tests to see
Flyway's checksum refusal. **It does not reproduce**: `mvn test` uses an in-memory H2
created fresh on every run, so there is never any history to mismatch against. The
corrected lab uses a file-based database and two runs, verified to produce
`Validate failed: Migrations have failed validation / Migration checksum mismatch for
migration version 1` — and now makes the point the failure taught: your test suite
cannot catch this class of mistake, because it never has yesterday's schema.

### The outbox, and the wire contract it exposed

`V3__outbox.sql` plus a relay: domain events are written to a table **in the same
transaction as the order**, and a scheduled poller publishes them. That is the dual-write
problem sidestepped rather than solved — the event can never describe a rolled-back
state, at the price of at-least-once delivery.

`OutboxTest.rollbackLosesTheEventToo` is the test that proves the half you get: a failure
later in the transaction leaves neither the order nor its event. Verified running, too —
the live application published `OrderSubmitted` then `OrderConfirmed`, both keyed by the
order id.

**And running it exposed a real design flaw.** The first version serialised the domain
event directly, which produced
`"total":{"amount":10.00,"currency":"EUR","zero":false,"negative":false}` —
`Money.isZero()` and `isNegative()` reflected onto the wire because they look like
getters. An event is a public API, so that shape would have become a contract nobody
chose, where adding a helper method to a value object is a breaking change.
`OutboxPayload` now decides the shape with an exhaustive switch over the sealed
`DomainEvent`, and the test asserts that `zero` and `negative` are absent.

That is the same argument module 17 makes about never returning an entity from a
controller, arrived at independently at the other edge of the application — which is
probably the most useful thing this module teaches.

### The language and runtime modules, measured

01, 03, 05, 08 and 09 needed no new `src/` — they cite code that already exists — but
every runnable lab was executed and several claims were corrected to the numbers:

- **JIT warm-up** (01): identical work, 49 ms on the first run falling to 32 ms by the
  fifth. Any benchmark without a warm-up is measuring the interpreter.
- **`List.contains` in a loop** (03): 1875 ms versus 119 ms for a `HashSet`, at 50,000
  elements. The module originally said "two orders of magnitude" — it is sixteen times,
  and the text now carries the measured numbers.
- **Lost increments** (08): 99,760 of 100,000 with a plain `int`, exactly 100,000 with an
  `AtomicInteger` — and a different number of losses on every run, which is why the bug
  survives being "tested".
- **A million virtual threads** (08): about 27 seconds for a million sleeping tasks on
  this laptop. A million platform threads would not have started.
- Verified as written: the lazy stream that silently does nothing, the single-use stream's
  exception message, `orElse` evaluating its argument on a *present* Optional, the
  unmodifiable view that changes underneath you, and `ClassNotFoundException` from a
  reflective lookup.

Module 09 is the one with the least code to point at, and says so: the application has no
cache, no `ThreadLocal` and no static mutable state, so its memory profile is
uninteresting — which is the right outcome, not a demonstration. The JVM flags belong to
the container, which is module 27.

### The five modules that point at no code, and say so

The last round finished 18, 19, 20, 27 and 28. Five of the twenty-eight name a gap in
their own "In this codebase" section rather than inventing something to point at, and that
list is worth having in one place because it is also the honest description of what this
reference system is not:

| Module | What is missing, and why |
|---|---|
| 09 — memory | No cache, no `ThreadLocal`, no static mutable state. The memory profile is uninteresting, which is the right outcome. |
| 19 — GraphQL | Adding it would mean per-field caching, complexity limits and a DataLoader layer to solve a problem one client does not have — the exact mistake the module warns about. |
| 20 — security | **Genuinely missing.** No filter chain, no authentication, every endpoint open, and `findByCustomer` trusts the caller's customer id completely. This is the one gap that would be unacceptable in production. |
| 27 — operations | No Actuator, no metrics, no CI workflow, no Dockerfile. The test suite is where this module has something real to point at. |
| 28 — the market | Not about code. |

Two smaller honesty notes made it into the modules as well: `maxPageSize` is validated at
start-up and read by nothing (module 18), and the outbox relay has no poison-message
handling because a failure rolls back its own attempt counter (module 26).

### What is left in phase 5

Nothing. Twenty-eight of twenty-eight, 300 relative links all resolving, and
`php tools/module-cards.php java --check` green so no card can drift from its chapter. The writing order is in
`course/README.md` and follows the build, not the numbering.

## Phase 7 — the accounts service (done)

`subjects/java/api/` — a **separate Maven build** with no parent in this repository and no
dependency either way. Blueprint §5.1: two systems sharing a repository and nothing else.
It inherits `spring-boot-starter-parent`, unlike `src/` which imports the BOM, and for the
mirror-image reason: a single-module build has no parent of its own to want, so the
starter parent's plugin configuration is free. Module 16 of the course argues that trade;
this pom is the other side of it.

**All fourteen endpoints of §5.2**, the four tables of §5.3, and every one of the six
decisions in §5.4 implemented with the reasoning at the line that implements it:

| Decision | Where |
|---|---|
| No email address anywhere; a recovery code instead | `RecoveryCode` — 20 chars of Crockford base32, forgiving normalisation |
| PBKDF2-SHA256, 210 000 iterations, cost stored per user | `PasswordHasher`, re-hashed silently on the next sign-in |
| A wrong password and an unknown account are indistinguishable | `AuthService.login` burns equivalent PBKDF2 work |
| Refresh tokens hashed, rotated, replay kills the family | `AuthService.refresh` + `SessionRevoker` |
| Lockout and rate limiting are different defences | `UserAccount.recordFailure` and `RateLimitFilter` |
| Filter order is behaviour | `WebConfig`: CORS → rate limit → auth → dispatcher |

**27 tests against a real relational engine** — H2 in memory running the real
`schema.sql`, not a fake in-memory provider. Every assertion the blueprint's §5.6 lists is
there, including the enumeration-oracle checks, the replay, the stale revision carrying the
current document, the malformed document producing zeroes, and the rate limiter leaving
`/api/health` alone.

### Two real bugs the tests caught, both worth keeping

**1 · The revoke-the-family write was rolled back by the exception that reported it.**
The replay path revoked every session and then threw — in the same transaction, so the
rollback undid the revocation. The response said *"your session has been ended"* while
every session was still live: a security control reporting success and doing nothing.
`SessionRevoker` now does that work in `REQUIRES_NEW`, and it is a separate class on
purpose — `REQUIRES_NEW` lives on a proxy, so a `this.method()` call would have skipped it
silently. That is chapter 11's self-invocation rule and chapter 25's propagation rule
meeting in one four-line fix.

**2 · The database cascade did not fire.** `deleteAccount` relied on
`ON DELETE CASCADE`; the user row went and the refresh token stayed, so a session outlived
its account and a refresh answered 404 instead of 401. The children are now deleted
explicitly, with the constraint kept as the guarantee of last resort.

A third finding was in the test rather than the code, and is a nice fact: **flipping the
last base64 character of a JWT signature often leaves it valid.** A 32-byte HMAC is 43
base64url characters and the final one carries only two significant bits, so several
characters decode to the same bytes. The forged-token test tampers with the first
character of the signature instead, and says why.

### Verified live, not only in MockMvc

Started on :8090 with no configuration at all — H2 file under `data/`, signing key
generated on first run — and driven end to end:

- registration returned the one-time recovery code `WZW5R-KCMRH-S48PV-YWCGW`, and the
  access token's payload decoded in one line, because a JWT is signed and not encrypted
- a synced document with three chapters produced `chaptersPassed: 2` and
  `masteryPercent: 3.85` — **derived by the server**, not taken from the client
- a stale `baseRevision` returned 409 **carrying the current document**, and the retry
  against the returned revision won
- the rate limiter returned 429 on the tenth auth request in a minute and left
  `/api/health` answering 200 throughout

And **cross-origin from the site's real origin**, driven in the browser from
`http://localhost:8100` against `http://localhost:8090`: 201, 204 with an empty body, 200,
409 carrying the document, and 401 for an unauthenticated call — the one thing curl could
not prove, because CORS only exists in a browser.

### What is deliberately not here

No email, by decision. No migrations — create-if-missing, which the schema file argues is
right for one instance and wrong almost everywhere else. The rate limiter is a fixed
window with in-memory counters and takes the client IP from the socket; all three
limitations are named in its own comments rather than left to be discovered.

## Known gaps, stated plainly

- **Verified in a browser on 2026-09-06**, served over HTTP on port 8100: the
  sidebar, the 52 home cards, the coverage table (27 rows) and the beyond table
  (25 rows) all generate from the manifest; `chapters/23-jpa-hibernate.html`
  renders its advert line, its honest-status box and a pager wired to 22 and 24;
  no console errors. What is *not* verified is the service worker — see below.
- **`sw-cache` is derived, not verified.** The gate reports the cache name it
  computes (`fonderia.java-v8`); it does not prove the service worker precaches the right
  list. Bump `cacheVersion` in `subject.js` on every content change. Confirmed on
  2026-09-08 that this matters in practice: after regenerating `rules.js` the page
  kept loading the old empty deck, because the worker's install-time fetch was
  itself served the stale file from the browser's HTTP cache — `python -m
  http.server` sends no `Cache-Control`. The version bump is what breaks that
  cycle, since a new cache name forces a fresh install.
- **The glossary carries categories but no terms.** The contract and process
  vocabulary (RAL, CCNL, *presa in carico*) is genuinely identical across
  subjects and could be lifted from the PHP academy — but its `where` fields
  point at PHP chapter numbers. It gets copied when those are remapped, not
  before, because a glossary with silently wrong cross-references is exactly the
  rot the gate exists to prevent.
- **`index.html` reuses the PHP subject's engine-describing prose verbatim**
  ("How to read this site", "How this site tests you"). That is deliberate and
  follows the same argument as the shared engine: those sections describe the
  learning machinery, which is byte-identical, so the prose about it should be
  too. Everything subject-owned on that page — hero, advert list, diagram,
  kid/pro pair, coverage rationale — was written for this subject.

## Overlap with the Kafka subject

Chapter 33 (*Messaging from inside a Spring application*) and the Kafka
academy's chapter 41 (*Spring Kafka in practice*) are adjacent by design, not by
accident: here messaging is one option seen from inside a Spring app; there,
Spring is one client seen from inside the broker's model. **If those two
chapters start describing the same thing, delete one.**

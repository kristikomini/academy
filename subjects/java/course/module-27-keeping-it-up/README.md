# Module 27 — Keeping it up: resilience, observability, tests, pipeline

> Site chapters: [32 — Timeouts, retries and circuit breakers](../../site/chapters/32-resilience.html),
> [35 — Logs, metrics and traces](../../site/chapters/35-observability.html),
> [36 — JUnit 5](../../site/chapters/36-unit-testing.html),
> [39 — Testcontainers](../../site/chapters/39-testcontainers.html),
> [44 — Pipelines, and migrations in them](../../site/chapters/44-ci-cd.html)
>
> Code: the whole test suite, plus [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml)

*The largest module, because these four subjects are one subject: what it takes for
something to keep running after you stop looking at it.*

---

## 1. The idea

### Resilience

**Every outbound call gets a timeout.** Connect and read, both, explicitly. The default in
most HTTP clients is infinite, and an infinite timeout under load is how one slow
dependency exhausts your thread pool and takes down a service that was working.

**Retry only idempotent operations, only on transient failures.** Retrying a POST that
created an order creates a second one. Retrying a 400 fails identically, four times
slower. Retry a connection timeout on a GET; do not retry a validation error, ever.

**Exponential backoff with jitter.** Without backoff you hammer something already
struggling. Without *jitter* every client retries in lockstep and you have built a
thundering herd — the outage recovers, everyone retries at t+1s, it falls over again.

**Retries multiply through a chain.** In the senior six, and the arithmetic is the point:
three services, three retries each, is 27 requests for one user action. Budget them, and
prefer retrying at exactly one layer — usually the outermost, where you know what the user
asked for.

**A breaker turns a slow failure into a fast one.** After N failures it stops calling and
fails immediately, which frees your threads and stops battering the dependency. It does
not make anything work; it changes *how* you fail, from timing out to answering.

**An empty-list fallback is worse than an error.** Returning `[]` when the catalogue
service is down tells the user there are no products. An error tells them something is
broken. Only fall back to a value you can defend as *true*.

### Observability

**Metrics to alert, logs to explain one case, traces to find the slow hop.** Three tools,
three jobs, and using the wrong one is expensive: a metric per user id will bankrupt you
in cardinality, and a log-based alert will miss what it did not log.

**Alert on symptoms, not causes.** Errors, latency at p95/p99, saturation. "CPU is at 80%"
is not a problem if nobody is waiting; "the p99 is four seconds" always is.

**Never alert on an average.** An average latency of 200 ms is consistent with 99% of
users at 50 ms and 1% at fifteen seconds. The average is the one number that cannot show
you a tail, and the tail is where users leave.

**One trace id, propagated everywhere** — into the logs, across HTTP calls, into message
headers. Then "what happened to this request" is one query rather than a correlation
exercise across five services. And note that **context is thread-local**: it does not
follow an `@Async` or a message listener unless you propagate it deliberately.

### Tests

**Tests are for the person who changes this in eight months.** Usually you. A test that
fails without telling you what broke has done half its job — which is why the names in
this project are sentences.

**One reason to fail, and say it in the name.** `versionTracksEveryChange` and
`rollbackLosesTheEventToo` each break for exactly one reason, and the name is the
diagnosis.

**Test behaviour, not implementation.** Assert on what came back, not on which methods
were called. `OrderControllerTest` asserts on the JSON; it would catch a controller wired
to a service that never saves. A mock-verifying version would not.

**Prefer state verification, and mock the edges.** Chapter 37. The tests in this project
use a real in-memory repository and a real service — there is nothing to mock. The one
fake is `RecordingPublisher`, at the actual edge, and it has behaviour rather than
expectations.

**Never mock a type you do not own.** A mock of a third-party client encodes your belief
about how it behaves, and your belief is not tested. That is what Testcontainers is for.

**Slices over `@SpringBootTest`.** A suite that boots everything for every test becomes a
suite people stop running before pushing. This project has one `@SpringBootTest` — the
context-loads test, which earns it by catching wiring mistakes no slice can — and four
slices.

**H2 is not PostgreSQL, and a container per run beats a shared dev database.** Name the
`*IT` classes separately so the fast tests stay fast.

**Coverage is a floor detector.** 40% tells you something is untested. 90% tells you
nothing about whether the assertions are any good — you can reach it by executing every
line and asserting nothing.

### The pipeline

**Build once, promote the artefact.** In the senior six. The jar that passed testing is
the jar that reaches production. Rebuilding per environment tests something other than
what you ship.

**Tag with the git SHA**, so "what is running?" has an exact answer.

**Order stages by cost.** Compile, unit tests, integration tests, image build, deploy. A
failure should surface in ninety seconds, not after the twelve-minute container stage.

**Migrations are a gated pipeline step**, not something the application does at start-up —
N replicas would race. And **the runtime account should not hold DDL rights**: the
migration step gets its own credentials.

**Rollback reverses code, not schema.** Which is why expand-and-contract (module 25)
matters, and why a release that only adds columns is one you can deploy on a Friday.

---

## 2. In this codebase

**Resilience: nothing, because there is nothing to call.** No outbound HTTP, so no
timeouts, no retries, no circuit breaker. Adding Resilience4j to demonstrate a retry
against a service that does not exist would teach the annotation and not the judgement.
The one place the *shape* appears is
[`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java):
a failure leaves the row and the next run retries it — at-least-once with backoff supplied
by the poll interval.

**Observability: partial, and the gaps are real.**

| Present | Missing |
|---|---|
| A correlation id on every 500, logged with the trace — [`ApiExceptionAdvice`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) | Actuator, Micrometer, any metric at all |
| Structured messages with parameters, not concatenation — [`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java) | Distributed tracing; there is nothing to trace across |
| Per-package log levels — [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) | JSON log output for a collector |
| A relay that returns a count so it *can* be measured | Anything actually measuring it |

**Tests: this is where the module has the most to point at.** 89 of them, and every
pattern above is demonstrated:

| Rule | Example |
|---|---|
| One reason to fail, named | [`OutboxTest.rollbackLosesTheEventToo`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java) |
| Behaviour, not implementation | [`OrderControllerTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderControllerTest.java) asserts on JSON |
| State verification, no mocks | [`OrderServiceTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderServiceTest.java) |
| A fake at the real edge | `RecordingPublisher` in [`OutboxTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java) |
| Inject a `Clock` | every test that touches time |
| Slices over `@SpringBootTest` | four slices, one context test |
| The specification as data | [`OrderStatusTest.theTable`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/OrderStatusTest.java) |
| Measure, do not assert | [`NPlusOneTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/NPlusOneTest.java) — 21 versus 1 |
| Test against the real database | [`OrderPersistenceIT`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderPersistenceIT.java) |
| Fast and slow are different commands | Surefire excludes `**/*IT.java` — [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml) |

**The pipeline: there is no CI here, and no Dockerfile.** The build is `mvn clean test`
and it is green; the container, the image layering and the pipeline stages are described
above and not implemented. Lab E is the smallest honest version.

---

## 3. Do it

**Lab A — a timeout you can see.**

Add a `RestClient` call to `httpbin.org/delay/10` with no timeout, from a controller.
Watch the request hang. Now set `connectTimeout` and `readTimeout` to two seconds and
watch it fail fast. Then imagine twenty concurrent users doing the first version, with
ten Tomcat threads.

**Lab B — the thundering herd.**

Write twenty clients that retry a failing call three times with a fixed one-second delay,
and log the arrival times. They arrive in three tight clusters. Add
`delay * (1 + random())` and watch them spread. That is jitter, and it is the difference
between a recovery and a second outage.

**Lab C — alert on an average.**

Generate 100 latencies: 99 at 50 ms and one at 15 seconds. Compute the mean (about 200 ms)
and the p99 (15 s). Write down which one you would have alerted on. This is a two-minute
lab and it changes how people build dashboards.

**Lab D — measure your own suite.**

```bash
cd src && mvn clean test | grep "Tests run"
```

Note the wall time. Then add `@SpringBootTest` to `OrderServiceTest` instead of plain
construction and re-run. Multiply the difference by the number of tests a real codebase
has, and by the number of times a day you run them. That is why slices.

**Lab E — the smallest real pipeline.**

Write a `.github/workflows/build.yml` with: checkout, set up JDK 21, `mvn -B clean verify`,
and cache `~/.m2`. Then add a second job that runs only the `*IT` tests, so the fast
feedback stays fast. Notice the stage ordering is the same argument as the surefire
exclusion — cost first.

**Lab F — the Dockerfile that is missing.**

Write a multi-stage build: a Maven stage that produces the jar, a `jlink` or JRE-slim
stage that runs it, `-XX:MaxRAMPercentage=75`, a non-root `USER`, and Boot's layered jar
so dependencies and application code are separate layers. Compare the image size to a
naive `FROM openjdk:21` single-stage build. Module 09's flags now have somewhere to live.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:32,35,36,39,44 -->
**Chapter 32 — Timeouts, retries and circuit breakers**

1. **Every outbound call gets a timeout,** shorter than your caller’s.
2. **Retry only idempotent operations, only on transient failures.**
3. **Exponential backoff with jitter.** Without jitter you have built a herd.
4. **Retries multiply through a chain.** Budget them; prefer retrying at one layer.
5. **A breaker turns a slow failure into a fast one,** which is what protects you.
6. **An empty-list fallback is worse than an error.** Wrong data outlives an outage.

**Chapter 35 — Logs, metrics and traces**

1. **Metrics to alert, logs to explain one case, traces to find the slow hop.**
2. **OpenTelemetry** so the backend is replaceable without touching code.
3. **One trace id, propagated everywhere** including into message headers.
4. **Context is thread-local.** It does not follow you into an executor.
5. **Alert on symptoms: errors, p95/p99 latency, saturation.**
6. **Never alert on an average.** It hides the users who are suffering.

**Chapter 36 — JUnit 5 and what a unit test is for**

1. **Tests are for the person who changes this in eight months.**
2. **Hard to test usually means hard to use.** Listen to that.
3. **One reason to fail, and say it in the name.**
4. **Test behaviour, not implementation.** Asserting on private calls breaks on refactor and catches nothing.
5. **Edges: empty, null, zero, negative, boundary, duplicate.**
6. **Coverage is a floor detector.** Mutation testing is the real measure.

**Chapter 39 — Testcontainers and integration tests worth trusting**

1. **Test against the database you deploy on.** H2 is a different product.
2. **A container per run beats a shared dev database.** Isolated, reproducible, disposable.
3. **`@ServiceConnection`** removes the property plumbing.
4. **Run your real migrations against the container.** Then they are tested too.
5. **Reuse locally, never in CI.**
6. **Name them `*IT` and run them separately.** Fast suite stays fast.

**Chapter 44 — Pipelines, and migrations in them**

1. **Build once, promote the artefact.** Rebuilding per environment tests something else.
2. **Tag with the git SHA.** `latest` is not a version.
3. **Order stages by cost.** Slow feedback gets routed around.
4. **Migrations are a gated pipeline step,** not application start-up.
5. **The runtime account should not hold DDL rights.**
6. **Rollback reverses code, not schema.** Expand and contract, always.
<!-- /CARD -->

---

## 5. Interview questions

**"Come gestisce le chiamate a un servizio esterno?"** — An explicit connect and read
timeout on every one, because the default is usually infinite and an infinite timeout is
how one slow dependency exhausts your threads. Retries only for idempotent operations and
only on transient failures, with exponential backoff and jitter. A circuit breaker to turn
a slow failure into a fast one.

**"Quanti retry?"** — Few, and budgeted across the chain: three services retrying three
times each is 27 requests for one user action. I prefer to retry at one layer, usually the
outermost, where I know what the user actually asked for.

**"Su cosa fa alert?"** — Symptoms: error rate, p95 and p99 latency, saturation. Never on
an average — 200 ms mean is consistent with 1% of users waiting fifteen seconds, and that
1% is the one that leaves.

**"Cosa rende un buon test?"** — One reason to fail, and the name says which. Assertions on
behaviour rather than on which methods were called. And as few mocks as possible: if
everything is mocked, the test verifies the mocks.

**"Come struttura la test suite?"** — Fast unit tests with no Spring at all, slices for the
web and persistence layers, one context-loads test, and Testcontainers integration tests
named `*IT` and excluded from `mvn test`. The reason is behavioural: a suite that takes
four minutes stops being run before a push.

**"Come funziona la pipeline?"** — Build once and promote the artefact, tagged with the git
SHA. Stages ordered by cost so failures surface in ninety seconds. Migrations as a gated
step with their own credentials — the runtime account should not hold DDL rights — and the
knowledge that rollback reverses code and not schema.

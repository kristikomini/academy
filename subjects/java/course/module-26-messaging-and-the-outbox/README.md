# Module 26 — Many services: messaging, the outbox, idempotency

> Site chapters: [30 — Microservices](../../site/chapters/30-microservices.html),
> [31 — Spring Cloud](../../site/chapters/31-spring-cloud.html),
> [33 — Messaging from inside a Spring application](../../site/chapters/33-messaging.html),
> [34 — OPC UA, MQTT and Modbus](../../site/chapters/34-industrial-protocols.html)
>
> Code: [`V3__outbox.sql`](../../src/ordini-app/src/main/resources/db/migration/V3__outbox.sql),
> [`OutboxRelay.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java),
> [`OutboxTest.java`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java)

---

## 1. The idea

### The dual-write problem, which is the whole module

An order is saved to the database and an event is published to a broker. Two systems,
no shared transaction. Both orderings are broken:

```
publish, then commit  →  the commit fails, and consumers have already reacted
                         to an order that does not exist
commit, then publish  →  the process dies in between, and the event is lost
                         with no trace that it should have existed
```

There is no third ordering. Two-phase commit is the textbook answer and is not one in
practice: it holds locks across services and blocks when the coordinator dies.

**The outbox sidesteps it rather than solving it.** The event is written to a table in
the *same transaction* as the order — one database, one commit, no distributed anything.
A separate relay reads unpublished rows and sends them.

What you get: the event is never lost and never describes a rolled-back state.
What you accept: **at-least-once delivery**. The relay can publish a row and die before
marking it, so it will send it again.

That trade is the entire design, and
[`OutboxTest.rollbackLosesTheEventToo`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java)
is the test that proves the half you get.

### Delivery is at-least-once, so consumers must be idempotent

Not a consequence of the outbox — a consequence of distributed systems. Every broker
worth using is at-least-once too, because the alternative is at-most-once and that means
losing messages.

Ways to be idempotent, best first:

1. **Reshape the operation.** "Set status to CONFIRMED" is naturally idempotent; "add 5
   to the quantity" is not. A surprising amount of duplicate handling disappears if the
   message says what the world should look like rather than how to change it.
2. **A unique constraint on the message id.** Insert the id in the same transaction as
   the work; a constraint violation *is* the duplicate check. Treat it as success, not
   as an error — the work was already done.
3. **Check-then-act is a race.** `if (!seen(id)) { doWork(); markSeen(id); }` has a
   window between the check and the mark. Two consumers in it both do the work. The
   database constraint has no window.

And bound the dedup store: a table of every message id ever seen grows forever. Keep a
window — a few days — and rely on the broker's retention being shorter.

### The message key is the aggregate id

Ordering is guaranteed only within a partition, and a broker partitions by key. So
everything about one order must carry that order's id as the key, or "confirmed after
submitted" is not a guarantee a consumer can rely on.

[`OutboxTest.keyIsTheAggregateId`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java)
asserts it, because it is the kind of thing that is obviously right and quietly
forgotten.

### Events, not commands

Past tense, and it is not a naming convention. An event is a fact that has happened, so
a subscriber may decline to *handle* it but cannot decline to *accept* it. A command is
an instruction that can be refused.

A command-shaped topic name means the publisher knows its consumers — `order.send-email`
tells you exactly who is listening, and the coupling the whole pattern exists to remove
has come back through the naming.

### A poller, and what replaces it

The relay here polls. That is deliberate and worth defending: publishing from an
`@TransactionalEventListener(AFTER_COMMIT)` looks equivalent and is not — if the process
dies between the commit and the listener, the event is gone and nothing records that it
should have existed. A row survives that.

In a larger system the poller is replaced by **change-data-capture**: Debezium reads
the database's write-ahead log and publishes the outbox rows, which is the same design
with lower latency and considerably more operational surface. Knowing that the poller
and CDC are the same pattern at different scales is a good thing to be able to say.

### Microservices: the shape and the cost

**The main benefit is organisational.** Independent deployment by independent teams. If
you have one team, you are paying distributed-systems costs for an organisational
benefit you cannot collect — and a monolith is the right default for a small team.

**What you trade.** Local method calls become network calls that can time out. Local
transactions become sagas. A stack trace becomes a distributed trace, if you built one.

**A shared database means one service in two deployments.** The most common way to get
the costs and none of the benefits: two services that cannot be deployed independently
because they share a schema.

**Merging two services back together is a valid answer**, and being willing to say so in
an interview is a stronger signal than enthusiasm for splitting.

### Spring Cloud, honestly

Kubernetes has absorbed most of it. Config comes from ConfigMaps and Secrets; discovery
is a Service; a lot of Spring Cloud Netflix is retired.

What survives: **the gateway**, because routing, rate limiting and authentication at the
edge are real work. And Config Server still earns its place where the git history of who
changed which property, and when, is the audit trail somebody needs.

A gateway making business decisions, though, is a coordination point — every team ends
up queuing for a change to it.

### The industrial protocols, because this is Emilia-Romagna

The region builds machines, and a Java developer here meets these:

- **Modbus** — registers and a PDF. No types, no discovery; the meaning of register
  40001 is in a document, possibly a paper one.
- **MQTT** — publish/subscribe over TCP, tiny, designed for bad links. Good for
  telemetry from a plant with unreliable connectivity.
- **OPC UA** — typed, browsable, secure, and the answer for new work. Heavier, and worth
  it.

Three rules that matter more than the protocols: **never expose register numbers in your
API** (translate at the edge, or the PDF becomes your public contract),
**timestamp at the source** (the moment a value was true is not the moment your poller
saw it), and **poll rates are negotiated, not chosen** — the machine's owner knows what
it can take.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| The outbox table, with the dual-write argument in the file | [`V3__outbox.sql`](../../src/ordini-app/src/main/resources/db/migration/V3__outbox.sql) |
| Events written in the same transaction as the order | [`JpaOrderRepository.save`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| The relay, and what it deliberately does not do | [`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java) |
| A port for the broker, with a logging stand-in | [`EventPublisher`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/EventPublisher.java) |
| The wire shape, decided rather than reflected | [`OutboxPayload`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxPayload.java) |
| The guarantee, asserted | [`OutboxTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OutboxTest.java) |

**There is no broker here**, and that is a deliberate stopping point rather than an
omission. The outbox pattern is about the *transaction*; it is complete and testable
without one, and swapping `LoggingEventPublisher` for a `KafkaTemplate` changes one class
and no tests. Building a Kafka cluster to demonstrate a database transaction would have
added infrastructure and taught nothing extra.

**An event is a public API, and the first version of this forgot it.** The outbox
originally serialised the domain event directly, and running the application showed what
that produces:

```json
{"orderId":{"value":"b9fc…"},
 "total":{"amount":10.00,"currency":"EUR","zero":false,"negative":false},
 "occurredAt":"2026-09-08T02:28:53.330504100Z"}
```

`"zero":false,"negative":false` are `Money.isZero()` and `Money.isNegative()` — helper
methods, reflected onto the wire because they look like getters. Nobody decided that.
And consumers would have parsed it, at which point adding a convenience method to a value
object becomes a breaking change to a contract nobody wrote down.

[`OutboxPayload`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxPayload.java)
now decides the shape explicitly, with an exhaustive switch over the sealed
`DomainEvent` so a new event type cannot be added without someone choosing what it looks
like. It is the same argument module 17 makes about never returning an entity from a
controller, applied to the other edge — and `OutboxTest` now asserts the contract,
including that `negative` and `zero` do **not** appear.

**What the relay does not do, named in its own comments:** there is no poison-message
handling. A row the broker always rejects blocks the batch forever, because the failure
rolls back the attempt counter along with everything else. A real relay commits the
attempt count in a `REQUIRES_NEW` (module 23) and moves the row aside after N tries.
Pretending that is not missing would be worse than saying so.

---

## 3. Do it

**Lab A — the guarantee.**

Run `OutboxTest`. Then read `rollbackLosesTheEventToo` and change it: replace the outbox
write with a direct call to `publisher.publish(...)` inside `JpaOrderRepository.save`.
The test now fails — the event was published and the order was not saved. That failing
assertion is the dual-write problem, reproduced in about four lines.

**Lab B — kill the relay mid-batch.**

Make `RecordingPublisher` throw on the *third* of five events. Run the relay. Because
the whole batch is one transaction, all five stay unpublished, including the two the
broker already accepted — so the next run sends those two again. Watch it happen, then
say out loud why that is acceptable and what it demands of the consumer.

**Lab C — write the idempotent consumer.**

Add a `processed_messages` table with the outbox row id as its primary key. Write a
consumer that inserts the id and does the work in one transaction, and treats a
constraint violation as success. Then call it twice with the same event and confirm the
work happened once. Now try the check-then-act version and reason about the window
between the check and the mark.

**Lab D — break the ordering.**

Change the relay to publish with a random key instead of the aggregate id.
`keyIsTheAggregateId` fails. Then think about what that would do in production with a
real broker: `OrderConfirmed` arriving before `OrderSubmitted`, on a consumer that
assumed otherwise, occasionally, under load.

**Lab E — the listener that looks equivalent.**

Replace the outbox with `@TransactionalEventListener(phase = AFTER_COMMIT)` publishing
directly. Everything passes. Now describe precisely the window in which an event is lost,
and why no test you can write in this project will catch it. That gap between "the tests
pass" and "the guarantee holds" is the most valuable thing in this module.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:30,31,33,34 -->
**Chapter 30 — Microservices: the shape and the cost**

1. **The main benefit is organisational.** Independent deployment by independent teams.
2. **A monolith is the right default for a small team.** Split in response to a named problem.
3. **Split by bounded context,** never by technical layer.
4. **Shared database means one service in two deployments.**
5. **You trade local calls and transactions** for partial failure and eventual consistency.
6. **Merging two services back together is a valid answer.**

**Chapter 31 — Spring Cloud: config, discovery, gateway**

1. **Kubernetes has absorbed config and discovery.** Do not add Eureka to a cluster that already does it.
2. **Config Server’s git history still earns its place** in audited environments.
3. **The gateway is the piece that survives** auth, rate limiting, aggregation.
4. **A gateway making business decisions is a coordination point.** Keep it dumb.
5. **Every inter-service call needs a timeout.** The default is effectively forever.

**Chapter 33 — Messaging from inside a Spring application**

1. **Async buys latency, decoupling and load levelling,** and costs you eventual consistency.
2. **Queue for work distribution, log for event streams.** Replay is the deciding capability.
3. **Delivery is at-least-once.** Handlers must be idempotent.
4. **A poison message blocks its partition.** Configure a dead-letter route before you need one.
5. **The listener thread has no SecurityContext and no request scope.**
6. **The message key chooses the partition,** and therefore the ordering.

**Chapter 34 — OPC UA, MQTT and Modbus**

1. **Modbus is registers and a PDF.** No types, no discovery, no security — and check the word order.
2. **MQTT for telemetry over bad links;** QoS, retained messages, last will.
3. **OPC UA for new work** a typed address space with security, and a source timestamp.
4. **Never expose register numbers in your API.** Translate at the edge.
5. **Timestamp at the source.** Arrival time lies after an outage.
6. **Poll rates are negotiated, not chosen.** A PLC is not a web server.
<!-- /CARD -->

---

## 5. Interview questions

**"Come pubblica un evento in modo affidabile?"** — The transactional outbox: the event
is written to a table in the same transaction as the state change, and a relay publishes
it afterwards. Lead with the reason — publishing before the commit lets consumers react
to a rollback, publishing after can lose the event if the process dies, and with two
systems there is no third option.

**"E se il relay pubblica due volte?"** — It will, and that is the accepted cost.
Delivery is at-least-once, so the consumer has to be idempotent — which it did anyway,
because the broker is at-least-once too.

**"Come rende idempotente un consumer?"** — First by reshaping the operation if I can:
"set status to X" is naturally idempotent, "add 5" is not. Otherwise a unique constraint
on the message id, inserted in the same transaction as the work, treating the violation
as success. Not check-then-act — that has a race between the check and the mark.

**"Perché la chiave del messaggio è l'id dell'aggregato?"** — Because ordering is only
guaranteed within a partition and the broker partitions by key. Same order, same key,
same partition — otherwise `OrderConfirmed` can overtake `OrderSubmitted`.

**"Microservizi: quando sì?"** — When the benefit is organisational: independent teams
deploying independently. With one team you pay the distributed-systems costs for a
benefit you cannot collect. And I would name the anti-pattern: a shared database means
two services that cannot deploy independently, which is all of the cost and none of the
benefit.

**"Ha usato Spring Cloud?"** — Some of it, and I would be honest that Kubernetes has
absorbed most of it: config from ConfigMaps, discovery from Services. The gateway
survives because edge routing and rate limiting are real work. Config Server survives
where somebody needs the git history of property changes.

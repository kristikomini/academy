# Module 11 — The state machine, invariants and domain events

> Site chapters: [07 — Records, sealed types and pattern matching](../../site/chapters/07-records-sealed-pattern.html),
> [25 — Transactions, propagation and isolation](../../site/chapters/25-transactions.html)
>
> Code: [`Order.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java),
> [`OrderStatus.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java),
> [`DomainEvent.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/DomainEvent.java)

---

## 1. The idea

Module 10 built the nouns. This one is about the verbs: what an order is allowed to
*do*, and where that rule is written down.

The default in most codebases is that it is written down nowhere in particular. A
`status` column holds a string, and the rules about which string may follow which are
distributed across a service class, a controller, three `if` statements and a comment
that was true in 2023. Nobody can answer "can this be cancelled?" without reading all
of it.

A state machine is the alternative: the transitions are **data**, in one place.

```java
allowed.put(CONFIRMED, EnumSet.of(SHIPPED, CANCELLED));
allowed.put(SHIPPED,   EnumSet.of(DELIVERED));   // deliberately not CANCELLED
```

You can read the whole rule in six lines and check it against what the warehouse
actually does. Testing it stops being scenario-writing and becomes enumeration —
`OrderStatusTest.theTable` is the specification, asserted directly.

### The edge that makes it a domain model rather than a diagram

You cannot cancel a `SHIPPED` order.

Not because cancelling is technically hard. Because once it is on a lorry, the
business process is a **return**: different paperwork, a different refund path,
possibly a restocking fee, and a physical object that has to come back. Calling it
"cancel" would let the code claim something the warehouse cannot do.

This is the difference between a state machine that mirrors reality and one that
mirrors convenience, and it is a good thing to have an opinion about in an interview.
Note that `Order.cancel` does not merely refuse — it says what to do instead, and
includes the tracking number:

> This order is with the carrier. Cancelling is a return, not a cancellation — raise
> a return against tracking TNT-99881.

An error message that names the alternative is the difference between a support
ticket and a phone call.

### Invariants live in the aggregate, not above it

An aggregate is a consistency boundary: the object that guarantees its own rules can
never be observed broken. Everything that could violate one has to go through it.
That is why `Order.lines()` returns an unmodifiable view rather than the field — if
it returned the list, any caller could add a line to a shipped order and every rule
in the class would be decorative.

Chapter 03's note that immutability is shallow is doing real work here: the list is
unmodifiable *and* `OrderLine` is itself immutable. If lines were mutable, handing out
an unmodifiable list would protect the collection and not its contents, which is the
kind of half-measure that reads as safe and is not.

### Events, and the one thing that makes them hard

The aggregate raises facts in the past tense: `OrderSubmitted`, `OrderShipped`. Past
tense is not a naming convention — an event has already happened, so a subscriber can
refuse to *handle* it but cannot refuse to *accept* it. That is the whole difference
between an event and a command, and getting the name wrong is how a publisher ends up
knowing who its consumers are.

Two decisions in the code are worth arguing about:

**`pullEvents()` drains rather than reads.** If the caller could read the list twice,
a retry would publish everything a second time. The aggregate owns the "these have
been taken" fact because it is the only object that knows.

**`rehydrate()` raises nothing.** Loading a row out of a table is not a business
occurrence. An aggregate that emitted `OrderSubmitted` every time a repository read
it would flood every consumer downstream — and this is a real bug people write,
usually by putting event-raising in a constructor that persistence also calls.

The hard part is not raising them. It is publishing them *exactly when* the state
change is durable. Publishing before the transaction commits means a consumer can
react to something that then rolls back; publishing after means the process can die
in between and the event is lost. Both are the dual-write problem, both are
unsolvable with two systems and no coordination, and the answer is the outbox —
module 26. What this module gives you is the half you can do here: the events exist,
they are collected, and the caller decides when.

### Optimistic concurrency

`Order.version` increments on every change. The persistence layer writes
`WHERE version = ?` and treats zero rows affected as a conflict, which becomes a 409.

Chapter 25's rule is that `@Version` beats raising the isolation level, and the reason
is operational rather than theoretical: a higher isolation level makes the database
hold locks for the length of a web request. A system that was merely slow becomes a
system that deadlocks, and it does so under exactly the load where you least want to
be debugging it. Optimistic concurrency moves the cost to the rare case — two people
editing the same order — and leaves the common case untouched.

---

## 2. In this codebase

| File | What to look at |
|---|---|
| [`OrderStatus.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java) | The transition table as data. `EnumSet`/`EnumMap` rather than `HashSet`/`HashMap` — bit vectors and ordinal-indexed arrays, no hashing. `isTerminal()` is derived from the table, never a separate flag that can disagree with it. |
| [`Order.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | `transitionTo` is the single funnel: check, move, raise, bump the version. Every operation goes through it, so no operation can forget a step. |
| [`Order.lines()`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | Unmodifiable view. `OrderTest.linesAreNotAWayIn` is the test that proves it. |
| [`Order.addLine`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | Merges a repeated SKU instead of appending, and refuses a *different* price rather than silently changing what was agreed. |
| [`DomainEvent.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/DomainEvent.java) | A sealed interface, so a dispatcher's `switch` is exhaustive: add an event and every place that handles them stops compiling until it is considered. |
| [`OrderStatusTest.java`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/OrderStatusTest.java) | `theTable` — the specification asserted as data. `noSelfTransitions` is the one people forget. |
| [`OrderTest.java`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/OrderTest.java) | `failuresChangeNothing` and `eventsAreDrainedNotRead` are the two that catch real regressions. |

The whole suite runs with no Spring, no database and no mocks, in milliseconds. That
is the return on keeping the framework off this module's classpath, and it is chapter
38's rule — *most tests need no Spring at all* — in a form you can measure.

---

## 3. Do it

**Lab A — allow the transition the business does not.**

Add `CANCELLED` to `SHIPPED`'s allowed set. Run the suite. Three tests fail, and one
of them is `theTable` — the specification itself. Read the failure of
`aShippedOrderIsAReturnNotACancellation` and notice it is asserting on the *message*,
not just the code: the test cares that the alternative is offered. Revert.

**Lab B — forget to bump the version.**

Remove `version++` from `touch()` and run the suite.

`versionTracksEveryChange` fails. That test exists because when this module was
written, **it did not** — the whole suite passed with the version bump deleted. The
gap was found by doing this exercise, not by reading the code, and it is worth
understanding why it hid so well: in a single-threaded test nothing observable
depends on the version. Every assertion about status, lines, totals and events still
holds. The field only matters when two writers race, which is precisely the situation
a unit test does not create.

That is the shape of the production bug too: two concurrent edits, both write, no
conflict detected, one silently overwrites the other. No exception, no log line.
Optimistic concurrency is easy to leave untested and expensive to leave untested, and
a codebase where `@Version` is present but unasserted is a codebase that believes it
has protection it does not have.

**Lab C — make `pullEvents` a getter.**

Change it to return `List.copyOf(pendingEvents)` without clearing.
`eventsAreDrainedNotRead` goes red. Now argue the other side: is draining really the
aggregate's job, or should the caller track what it has published? Both designs exist
in real systems. The reason this one drains is that the alternative puts a
correctness requirement on every caller, and callers get written by people in a hurry.

**Lab D — add a state.**

Add `RETURNED`, reachable only from `DELIVERED`. Notice what the compiler does and
does not help with: the `EnumMap` will throw a `NullPointerException` at class-init
time if you forget to give the new constant a row, which is a good failure; but
nothing forces you to add a `DomainEvent` for it. Add `OrderReturned` and watch every
exhaustive `switch` over `DomainEvent` stop compiling until you handle it. That
contrast — data that fails at runtime, sealed types that fail at compile time — is
the argument for sealed interfaces in one exercise.

**Lab E — the ordering question.**

`OrderTest.happyPath` runs submit → confirm → ship → deliver. Write a test that runs
them in a different order and assert on the failure message. Then ask why
`transitionTo` reports *"From SUBMITTED the only moves are [CONFIRMED, CANCELLED]"*
rather than just "illegal transition". The second is correct; the first saves someone
a trip to the source.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change. The records-and-sealed-types
card belongs to [module 10](../module-10-the-domain-model/), which is where the
language feature is taught; this module's card is the transactional half.

<!-- CARD:25 -->
**Chapter 25 — Transactions, propagation and isolation**

1. **It is a proxy.** Self-invocation, `private` and `final` methods get no transaction, silently.
2. **Rollback on unchecked only.** A checked exception commits unless you set `rollbackFor`.
3. **Catching without rethrowing means no rollback.**
4. **`REQUIRES_NEW` for work that must survive the caller’s failure** audit rows, outbox entries.
5. **Keep transactions short.** They hold a connection (chapter 22) for their whole life.
6. **`@Version` beats a higher isolation level** for concurrent updates.
<!-- /CARD -->

---

## 5. Interview questions

**"Come modella lo stato di un ordine?"** — An enum plus an explicit allowed-transitions
map, in the aggregate, so the rule is readable in one place and testable as data. Then
give the `SHIPPED → CANCELLED` example unprompted: it shows you model the business
rather than the diagram, and it is the kind of detail that starts a real conversation.

**"Che cos'è un aggregate?"** — A consistency boundary: the object that guarantees its
own invariants can never be observed broken, so everything that could violate one goes
through it. The practical consequence is the one to lead with — no collection is handed
out unprotected, and there is no setter that bypasses a rule.

**"Perché `@Version` invece di alzare l'isolation level?"** — Because a higher isolation
level holds database locks for the length of a web request, and a system that was slow
becomes a system that deadlocks. Optimistic concurrency puts the cost on the rare
collision instead of on every request. Follow it with what the client sees: zero rows
affected, a 409, and a retry that re-reads.

**"Dove pubblica gli eventi di dominio?"** — Raised by the aggregate, collected by the
caller, dispatched inside the same transaction that saved the change. Then name the
problem rather than waiting to be asked: publishing before commit lets a consumer react
to a rollback, publishing after can lose the event if the process dies, and with two
systems and no coordination there is no third option — which is why the outbox exists.

**"Perché gli eventi sono al passato?"** — Because an event is a fact that has already
happened: a subscriber may decline to handle it but cannot decline to accept it. A
command is an instruction that can be refused. Naming an event like a command is how a
publisher ends up knowing its consumers, which is the coupling the whole pattern exists
to remove.

**"Come lo testa?"** — With nothing. No Spring, no database, no mocks: plain
construction and assertion, milliseconds for the whole file. That is only possible
because the domain has no framework on its classpath, which is a build decision rather
than a discipline one — and it is worth saying that out loud, because "we intend not to
import Spring here" and "Spring is not on the classpath" are very different promises.

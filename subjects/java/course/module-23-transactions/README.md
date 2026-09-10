# Module 23 — Transactions, propagation and concurrency

> Site chapter: [25 — Transactions, propagation and isolation](../../site/chapters/25-transactions.html)
>
> Code: [`JpaOrderRepository.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java),
> [`Order.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java),
> [`ApiExceptionAdvice.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java)

*Shares chapter 25's card with [module 11](../module-11-the-state-machine/), which uses
the transactional half to argue about domain events. The card is generated, so the two
cannot drift.*

---

## 1. The idea

### `@Transactional` is a proxy, and that is the first thing to know

In the twelve, and module 13 explains the mechanism. The consequences here:

- **Self-invocation gets no transaction.** A method calling another method of the same
  class on `this` bypasses the proxy. Silently.
- **`private` and `final` methods get no advice.** Nothing can override them.

Both fail without an error. A method you believe is transactional and is not will
happily half-write.

### Rollback on unchecked only

Also in the twelve. Spring rolls back for `RuntimeException` and `Error`. **A checked
exception commits**, unless you say `@Transactional(rollbackFor = …)`.

That default surprises people, and the reason it exists is historical rather than
principled: checked exceptions were supposed to be recoverable conditions. In practice
it means a `throws IOException` in a transactional method commits a half-finished unit
of work.

### Catching without rethrowing means no rollback

The proxy decides by watching what comes out of the method. Swallow the exception and
nothing comes out, so it commits — with your data in whatever state the failure left it.

If you must catch, either rethrow or call
`TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()`. The first is
almost always right.

### Keep transactions short

They hold a connection for their whole life (module 21). A transaction that spans an
HTTP call to a payment provider holds a pooled connection for the provider's latency,
and the pool empties under load while nothing looks wrong in the database.

`readOnly = true` on reads is worth the annotation: Hibernate skips dirty checking on
the way out, and some setups route the query to a replica.

### `REQUIRES_NEW` for work that must survive the caller's failure

Audit rows, outbox entries, failure records. `REQUIRES_NEW` suspends the outer
transaction and runs in its own, so it commits even when the caller rolls back.

The cost is real and should be stated in the same breath: it uses a **second
connection** while the first is suspended. A `REQUIRES_NEW` inside a loop over a
thousand rows is a thousand pairs of connections, and the pool is the first casualty.

### `@Version` beats a higher isolation level

The senior-six rule, and the reason is operational rather than theoretical. Raising the
isolation level makes the database hold locks for the length of a web request; a system
that was merely slow becomes a system that deadlocks, under exactly the load where you
least want to be debugging.

Optimistic concurrency holds nothing. It reads a version, and on write checks the row
still has it. The rare collision pays; the common case pays nothing.

### The mistake this codebase made, and it is a good one

`@Version` was on the entity. The column incremented. Everything looked right — and
nothing was guarded.

The repository's `save` re-read the row to get a managed instance to copy onto. So
Hibernate's version check compared the value it had loaded *in that same transaction*,
which was by definition current. The check could never fail.

```java
// This is the shape of the bug. It looks like optimistic locking.
var existing = rows.findById(id).orElseThrow();   // loads version 7
copyOnto(order, existing);                        // Hibernate: WHERE version = 7 ✓
```

The fix was to let the aggregate remember which revision it was loaded from —
`Order.baseVersion()` — and compare that explicitly before copying. Which is exactly
what blueprint §9.4 describes: *a version column and `WHERE version = ?` on update, 409
on zero rows affected.*

The general lesson is worth more than the fix: **an annotation being present is not
evidence that the behaviour it names is happening.** `optimisticLockingRejectsAStaleWrite`
exists because that assumption was tested and found false.

### And the client has to be told

An `OptimisticLockingFailureException` that falls through to the generic handler is a
500 — reporting correct behaviour as a bug, and inviting a retry that fails identically.
It is a **409**, with a message saying to re-read and try again. That mapping is in
`ApiExceptionAdvice`.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Transaction boundary at the outermost operation | [`JpaOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| `readOnly = true` on reads | [`JpaOrderRepository.findById`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| The explicit version check, and why the annotation alone was not enough | [`JpaOrderRepository.save`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| The revision an aggregate was loaded from | [`Order.baseVersion`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| A stale write becoming a 409 | [`ApiExceptionAdvice`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) |
| The test that proves it | [`JpaOrderRepositoryTest.optimisticLockingRejectsAStaleWrite`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/JpaOrderRepositoryTest.java) |
| The same, on PostgreSQL | [`OrderPersistenceIT.optimisticLocking`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderPersistenceIT.java) |

**Two version counters, and an honest word about them.** `Order.version()` counts
changes made to an instance in memory; `OrderEntity.version` belongs to the row and is
what guards concurrency; `Order.baseVersion()` is the revision the instance was loaded
from. Three numbers for one concept is more than ideal, and the reason it is not
collapsed is that the domain module cannot depend on JPA to find out what a row
version is. If this bothers you, it should — it is the seam where a clean domain meets
a framework that wants to own identity, and noticing it is worth more than a tidier
design would be.

---

## 3. Do it

**Lab A — prove self-invocation does nothing.**

Add two methods to a scratch `@Service`: `outer()` (not transactional) calling
`this.inner()` (`@Transactional`), where `inner` writes and then throws. The write
commits — no transaction was ever started. Now inject the bean into itself, or move
`inner` to another bean, and watch the rollback happen.

**Lab B — commit a half-finished unit of work.**

Make a `@Transactional` method write two rows and throw a *checked* exception between
them. The first row is there. Add `rollbackFor = Exception.class` and repeat.

**Lab C — swallow it.**

Same method, unchecked exception this time, wrapped in `try { … } catch (Exception e) { log.error(…); }`.
It commits. The log says something went wrong, the data says everything is fine, and
those two statements will be reconciled by a human at some point.

**Lab D — remove the version check and watch the protection vanish.**

Delete the `existing.getVersion() != order.baseVersion()` check in
`JpaOrderRepository.save`. `optimisticLockingRejectsAStaleWrite` fails — no exception is
thrown. The `@Version` annotation is still there, the column still increments, and Bob
silently overwrites Alice.

This is the single most useful lab in the module. Sit with the fact that the code looked
correct.

**Lab E — see the 409 from the outside.**

```bash
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar \
  --spring.profiles.active=dev --server.port=18080 &
```

Then write a small script that reads an order, waits, and submits — while another
submits first. The loser gets `409` and `order.concurrent-modification`, not a 500.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

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

**"Perché `@Transactional` a volte non funziona?"** — Because it is a proxy.
Self-invocation calls the real object and skips it entirely; `private` and `final`
methods cannot be advised. Both fail silently, which is what makes it worth knowing
rather than looking up.

**"Quando fa rollback Spring?"** — On unchecked exceptions and `Error`. A checked
exception commits unless you set `rollbackFor`. And catching without rethrowing means
nothing comes out of the method, so it commits with the data in whatever state the
failure left it.

**"`REQUIRES_NEW` quando?"** — For work that must survive the caller's failure: audit
rows, outbox entries. Then say the cost in the same breath — it suspends the outer
transaction and takes a second connection, so one inside a loop is a very good way to
empty a pool.

**"Isolation level o `@Version`?"** — `@Version`, almost always. A higher isolation level
holds locks for the length of a request and turns a slow system into a deadlocking one;
optimistic concurrency holds nothing and puts the cost on the rare collision. The client
gets a 409 and re-reads.

**"Ha mai avuto un bug di concorrenza?"** — A good question to answer with this one:
`@Version` was on the entity, the column incremented, and nothing was protected —
because the repository re-read the row inside the same transaction before writing, so
Hibernate's check compared a value it had just loaded. The fix was to compare against
the revision the caller's object was loaded from. The lesson is that an annotation being
present is not evidence the behaviour is happening, and that a concurrency claim needs a
test with two readers in it.

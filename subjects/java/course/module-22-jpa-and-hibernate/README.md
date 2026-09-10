# Module 22 — JPA and Hibernate: the persistence context

> Site chapters: [23 — JPA and Hibernate](../../site/chapters/23-jpa-hibernate.html),
> [24 — Spring Data repositories](../../site/chapters/24-spring-data.html)
>
> Code: [`OrderEntity.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderEntity.java),
> [`OrderMapper.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderMapper.java),
> [`JpaOrderRepository.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java)

---

## 1. The idea

### The bargain

An ORM offers to make rows look like objects. What you give up is control over *when*
SQL runs. Almost everything surprising about Hibernate is that trade being collected.

### Dirty checking means mutation is persistence

In the twelve. Inside a transaction, Hibernate keeps a snapshot of every managed entity.
At flush time it compares, and writes what changed.

```java
order.setStatus("SHIPPED");   // no save() anywhere
```

There is no `save()` to look for. The UPDATE happens because the object changed and the
transaction ended. Two consequences:

- **`save()` on a managed entity is usually redundant.** It reads like the thing that
  writes, and it is not.
- **Never mutate a managed entity you did not intend to save.** Loading one to inspect
  it and adjusting a field "just for the response" writes that field to the database.

### `LazyInitializationException` means the entity outlived its session

The other rule in the twelve. A lazy association is a proxy that fetches on first
touch — and it can only fetch while its session is open. Touch it afterwards and you
get the exception, classically halfway through serialising a response.

The fix is to fetch what you need inside the transaction, per query. The
**non**-fixes:

- **EAGER on the mapping.** Now every query pays for the association, including the
  ones that never look at it. It also cannot be turned off later.
- **`open-in-view: true`.** Keeps the session open for the whole request, so the
  exception disappears — and a database connection is held while the response is
  serialised to a possibly slow client. You have converted a visible bug into pool
  exhaustion under load. It is on by default in Spring Boot, and this application turns
  it off.

### No Lombok `@Data` on entities

`@Data` generates `equals`, `hashCode` and `toString` over all fields. On an entity all
three are wrong: `toString` walks lazy associations and triggers loads (or throws),
`equals` over mutable fields breaks the moment the entity is in a `Set`, and `hashCode`
changes when a generated id is assigned on flush.

### The mapping decisions in this codebase

**The entity is not the aggregate.** `OrderEntity` has a no-args constructor, mutable
fields and annotations; `Order` has invariants and none of those. One class cannot be
both without the domain losing — you would add the no-args constructor it must not
have, and end up with an object that can exist in states the business forbids.

The cost is [`OrderMapper`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderMapper.java):
one file, two methods, about eighty lines. The benefit is that the aggregate's 44 tests
need no database, no container and no mocks.

**Lines are a child entity with `orphanRemoval`, keyed by SKU.** Three things were got
wrong here before they were got right, and all three are in the code's comments:

1. Assigning a new list to a mapped collection throws *a collection with
   cascade all-delete-orphan was no longer referenced*.
2. Clearing and re-adding throws *a different object with the same identifier value was
   already associated with the session*, because the replacements carry the same keys.
3. Reconciling by *position* fails on a unique constraint: removing the first of two
   lines renumbers the second, Hibernate issues UPDATEs before DELETEs, and for an
   instant two rows claim one SKU.

The answer was to key the row on `(order_id, sku)` — the natural key, which the
aggregate already guarantees is unique — and reconcile by it. Note the shape of that
fix: it removed the ordering problem instead of trying to sequence around it.

**`@EntityGraph` on the one query that needs the lines**, not EAGER on the mapping.
That is module 24's subject, and it is visible in `SpringDataOrderRepository`.

### Spring Data, and where the port lives

`SpringDataOrderRepository` is **not** the domain's port. The domain declares
`OrderRepository`; `JpaOrderRepository` implements it *using* Spring Data. Letting
`JpaRepository` be the port would put `Pageable` and the entity type into the domain —
the leak the whole arrangement exists to prevent.

Derived queries are parsed at start-up, so a method name Spring Data cannot understand
fails when the context builds rather than on the first call. Past about three
conditions, write `@Query`: `findByCustomerIdAndStatusAndLastChangedAtAfterOrderBy…` is
a sentence, not a name.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Entity separate from aggregate | [`OrderEntity`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderEntity.java) vs [`Order`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| The whole cost of that separation | [`OrderMapper`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderMapper.java) |
| Collection reconciliation, with the three failures documented | [`OrderEntity.replaceLines`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderEntity.java) |
| A composite natural key | [`OrderLineEntity`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderLineEntity.java) |
| `@EntityGraph` per query | [`SpringDataOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java) |
| The port, still framework-free | [`OrderRepository`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java) |
| Mapping tests, against the real migration | [`JpaOrderRepositoryTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/JpaOrderRepositoryTest.java) |

**The bug the tests nearly missed.** `Order.rehydrate` originally did not restore
`carrierTracking` or `cancellationReason`. A shipped order round-tripped through the
database and came back with no tracking code — no exception, no warning. The round-trip
test was asserting on status and lines and did not look. `persistsTracking` and
`persistsCancellationReason` exist because of it, and the lesson is the general one: a
round-trip test that checks *some* fields proves nothing about the others.

---

## 3. Do it

**Lab A — watch dirty checking write something you did not ask it to.**

In a scratch `@Transactional` method, load an `OrderEntity`, set its status to
`"CANCELLED"`, and return without calling `save`. Re-read it. It is cancelled. Now
explain to yourself why that is a feature and why it is also how a "just for display"
adjustment reaches production data.

**Lab B — turn the SQL on.**

```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
logging:
  level:
    org.hibernate.orm.jdbc.bind: TRACE
```

Run `JpaOrderRepositoryTest` and read what actually executed. Chapter 26's rule is to
turn SQL logging on in development, and this is why: the statement count for a simple
save is not what most people would guess.

**Lab C — reintroduce each of the three collection bugs.**

Change `replaceLines` to `lines = new ArrayList<>(replacements)`, run the tests, read
the exception. Then to `lines.clear()` followed by adding the replacements, and read
that one. Then key the table on a line number instead of the SKU and reconcile by
position, and watch the unique-constraint violation. Three different messages, one
cause: Hibernate is tracking a collection and you changed it from underneath.

**Lab D — make the entity the aggregate.**

Try it. Put `@Entity` on `Order`. You need a no-args constructor, non-final fields, and
JPA on `ordini-domain`'s classpath — which does not compile until you add Spring to the
domain's pom. Stop there and look at what you would have had to give up. That is the
bargain, and it is worth having done once so the answer is experience rather than
opinion.

**Lab E — `open-in-view`, both ways.**

Set `spring.jpa.open-in-view: true`, remove the `@EntityGraph` from
`findWithLinesById`, and call `GET /api/orders/{id}`. It works. Set it back to `false`
and call again: `LazyInitializationException`. Now decide which behaviour you would
rather ship, and be able to say why the one that "works" is the worse one.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:23,24 -->
**Chapter 23 — JPA and Hibernate: the object-relational bargain**

1. **Dirty checking means mutation is persistence.** There is no `save()` to look for.
2. **Everything LAZY,** and fetch explicitly per query.
3. **`LazyInitializationException` means the entity outlived its transaction.** Return a DTO.
4. **`open-in-view` hides the problem and holds a connection** for the whole request.
5. **No Lombok `@Data` on entities.** It walks your associations.
6. **Never mutate a managed entity you did not intend to save.**

**Chapter 24 — JDBC, connection pools and what leaks**

1. **JPA for the domain, SQL for reporting.** Mixing them is not a failure.
2. **Derived queries are parsed at start-up.** A wrong property name fails the boot, not the request.
3. **Past three conditions, write `@Query`.** The method name has stopped being documentation.
4. **Projections select fewer columns.** Often a bigger win than an index.
5. **`Specification` for optional filters,** never string concatenation.
6. **`@Modifying` leaves the persistence context stale.** Clear it.
<!-- /CARD -->

---

## 5. Interview questions

**"Che cos'è il persistence context?"** — A first-level cache and a unit of work, scoped
to the transaction. It keeps one instance per row and a snapshot of each, so at flush
time it can compare and write what changed. That is dirty checking, and it is why there
is no `save()` to look for.

**"Cosa causa `LazyInitializationException`?"** — Touching a lazy association after its
session has closed — classically while serialising a response. The fix is to fetch it in
the query that needs it, with `join fetch` or `@EntityGraph`. Not EAGER, which makes
every query pay; and not `open-in-view`, which hides it by holding a connection for the
whole request and turns a visible bug into pool exhaustion.

**"Entità o DTO nel dominio?"** — Separate, with a mapper. One class cannot be both
without the domain losing: JPA needs a no-args constructor and mutable fields, and an
aggregate that has those can exist in states its invariants forbid. The mapper is about
eighty lines and it buys a domain test suite that needs no database.

**"Perché non `@Data` di Lombok su un'entità?"** — All three generated methods are wrong
there. `toString` walks lazy associations and triggers loads or throws, `equals` over
mutable fields breaks in a `Set`, and `hashCode` changes when the id is assigned at
flush.

**"Come gestisce una collezione figlia?"** — A child entity with `orphanRemoval`, keyed
on its natural key, reconciled in place. Never reassign the collection, never clear and
re-add, and do not key it on position — I can name the exception each of those produces,
because I have caused all three.

**"Spring Data o repository scritto a mano?"** — Spring Data underneath, behind an
interface the domain owns. The derived queries and the boilerplate are genuinely free,
and keeping `JpaRepository` out of the domain costs one small adapter class.

# Module 24 — The N+1 problem and fetching strategies

> Site chapter: [26 — The N+1 problem and fetching strategies](../../site/chapters/26-n-plus-one.html)
>
> Code: [`NPlusOneTest.java`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/NPlusOneTest.java),
> [`SpringDataOrderRepository.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java)

---

## 1. The idea

One query for the parents, then one more per parent for its children. Twenty orders
becomes twenty-one round trips.

Everybody can recite that. Fewer have watched the number, which is the part that makes
it stick — so this module is built around a test that counts:

| Query | Statements |
|---|---|
| `findByCustomerIdOrderByLastChangedAtDesc` then read the lines | **21** |
| `findAllByCustomerIdOrderByLastChangedAtDesc` (`@EntityGraph`) | **1** |

Same rows, same result, one annotation apart. Both numbers are asserted in
[`NPlusOneTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/NPlusOneTest.java),
using Hibernate's own `Statistics` rather than log parsing.

### Why it hides

Three things conspire, and it is worth knowing all three because they explain why this
survives code review.

**The query is innocent.** `findByCustomerIdOrderByLastChangedAtDesc` is one SELECT and
does nothing wrong. The extra twenty happen somewhere else entirely — in whatever code
reads `getLines()` on the results, possibly in a mapper, possibly in a template.

**Development data is small.** Three orders is four queries. Nobody notices four. The
same endpoint against a customer with four hundred orders is four hundred and one, and
it arrives as "the list page is slow" months later.

**Lazy loading is invisible.** Nothing in the calling code says "fetch". A field access
triggers a database round trip, which is the ORM bargain from module 22 being collected.

### The fixes, in order of preference

**1. Say what you need in the query.** `@EntityGraph(attributePaths = "lines")`, or
`join fetch` in JPQL. One query, the fetching decision made by the code that knows what
it is going to read.

**2. A projection.** If the list page only shows a total and a status, do not load the
lines at all — select the fields into a DTO or an interface projection. This sidesteps
the whole problem rather than solving it, and it is usually the right answer for a list
endpoint.

**3. `default_batch_fetch_size` as a safety net.** Hibernate then loads lazy
collections in batches with an `IN (…)` clause: 21 queries becomes about 3. It does not
remove the second query, it reduces the round trips — a net under the tightrope, not a
reason to stop looking down.

### The non-fixes

**Never fix it with EAGER.** It makes the problem disappear in the place you were
looking and appear everywhere else: now every query that touches an order loads its
lines, including the twenty that only wanted a status. And EAGER cannot be turned off
per query — LAZY can be turned on.

**`open-in-view` is not a fix either.** It keeps the session open so the lazy loads
succeed during serialisation. They still happen; they now happen while a database
connection is held for the whole response. You have hidden the query count and added
pool exhaustion.

### The one that catches people out: pagination plus a fetch join

Ask for `join fetch` and `Pageable` together and Hibernate logs:

```
HHH000104: firstResult/maxResults specified with collection fetch; applying in memory
```

It cannot do both in SQL — a join multiplies rows, so `LIMIT 20` would not mean twenty
orders. So it fetches **everything** and paginates in memory. Your page-of-twenty query
just loaded the whole table, and the only sign is a log line most people have filtered
out.

The fix is two queries: one to get the page of ids, one to fetch those ids with their
collections. Or a projection, which is fix 2 again.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| The naive query, kept on purpose | [`findByCustomerIdOrderByLastChangedAtDesc`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java) |
| The same list with `@EntityGraph` | [`findAllByCustomerIdOrderByLastChangedAtDesc`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java) |
| The adapter, using the fixed one | [`JpaOrderRepository.findByCustomer`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| 21 versus 1, asserted | [`NPlusOneTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/NPlusOneTest.java) |
| Everything LAZY in the mapping | [`OrderEntity`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/OrderEntity.java) |

The naive query is **kept rather than deleted**, which is unusual and deliberate: a
module about a performance problem needs the problem available to measure. It is not
reachable from the application — `JpaOrderRepository` uses the other one — and
`theAdapterUsesTheFixedQuery` fails with a number if anybody switches it back.

**A note on how the counting test had to be written.** The first version measured
nothing: `@DataJpaTest` wraps each test in a single transaction, so the entities saved
in `setUp` were still managed and the queries under test returned them from the
first-level cache. Every count came back as 0 or 4. Query counting is only meaningful
across transaction boundaries, which is why the class is
`@Transactional(propagation = NOT_SUPPORTED)` and each unit of work goes through a
`TransactionTemplate`. If you take one practical thing from this module, take that: **a
test that measures queries has to control its own transactions, or it is measuring the
cache.**

---

## 3. Do it

**Lab A — watch the number.**

```bash
cd src && mvn -q -Dtest=NPlusOneTest -DfailIfNoTests=false test
```

Then add SQL logging and run it again:

```yaml
spring.jpa.show-sql: true
```

Read the output of `theNaiveQueryIsNPlusOne`. Twenty near-identical
`select ... from order_lines where order_id=?` statements, one per order. That wall of
almost-the-same SQL is what an N+1 looks like in a log, and recognising the shape is
most of finding it in production.

**Lab B — break the fix.**

Change `JpaOrderRepository.findByCustomer` to call the derived query instead of the
entity-graph one. `theAdapterUsesTheFixedQuery` fails: `expected: <1> but was: <21>`.
That is what a query-count assertion buys you — a regression that would otherwise ship
silently becomes a red test with a number in it.

**Lab C — the pagination trap.**

Add to `SpringDataOrderRepository`:

```java
@Query("select o from OrderEntity o join fetch o.lines where o.customerId = :id")
List<OrderEntity> findPage(@Param("id") UUID id, Pageable pageable);
```

Call it with `PageRequest.of(0, 5)` and watch for `HHH000104` in the log. Then count the
rows it actually loaded. This is the one worth being able to describe in an interview,
because it looks like the fix and is worse than the problem.

**Lab D — batch fetching.**

Add `spring.jpa.properties.hibernate.default_batch_fetch_size: 10` and re-run
`theNaiveQueryIsNPlusOne`. It fails — the count is no longer 21, it is about 3. Read the
SQL: `where order_id in (?,?,?,?,?,?,?,?,?,?)`. Then decide whether you would set it
globally in a real application. (The usual answer is yes, and to keep fixing the queries
anyway.)

**Lab E — the projection.**

Write an interface projection with just `getId`, `getStatus` and `getTotalAmount`, and a
repository method returning `List<OrderSummary>`. Count the queries: one, and the SQL
selects three columns instead of every column of two tables. For a list page that is the
best answer of the three, and it is the one people reach for last.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:26 -->
**Chapter 26 — The N+1 problem and fetching strategies**

1. **Turn on SQL logging in development.** N+1 is invisible until you count queries.
2. **Never fix it with EAGER.** That answers a per-query question globally, and gets worse.
3. **`join fetch` or `@EntityGraph` per query;** `default_batch_fetch_size` as a safety net.
4. **One collection fetch per query.** Two is a cartesian product.
5. **HHH000104 means it is paginating in memory.** Page the ids, then fetch.
6. **A projection sidesteps the whole problem.**
<!-- /CARD -->

---

## 5. Interview questions

**"Che cos'è il problema N+1?"** — One query for the parents and one per parent for its
children, so twenty rows becomes twenty-one round trips. Then give the reason it
survives review: the query itself is innocent, the extra queries happen in whatever code
reads the lazy field, and with three rows of development data nobody notices.

**"Come lo risolve?"** — Say what you need in the query — `join fetch` or
`@EntityGraph` — or use a projection if the page does not need the children at all.
`default_batch_fetch_size` as a safety net underneath. Never EAGER: it moves the cost
onto every other query and cannot be turned off per call.

**"Come lo trova?"** — SQL logging in development, and a query count in a test. I would
show the test: Hibernate's `Statistics`, twenty-one versus one, asserted — so the
regression is a red build rather than a support ticket in six months.

**"`join fetch` con la paginazione?"** — Does not work, and fails quietly. Hibernate logs
`HHH000104` and paginates in memory, because a join multiplies rows so `LIMIT` would not
mean what you meant. Two queries — ids first, then fetch those ids — or a projection.

**"EAGER non è più semplice?"** — Simpler in one place and worse everywhere else. Every
query that touches the entity now loads the association, including the ones that only
wanted a status field. And LAZY can be made eager per query; EAGER cannot be made lazy.

**"E `open-in-view`?"** — It hides the exception, not the queries. The lazy loads still
happen, and now they happen while a pooled connection is held for the whole response
including serialisation to a slow client. It is on by default in Spring Boot and I turn
it off.

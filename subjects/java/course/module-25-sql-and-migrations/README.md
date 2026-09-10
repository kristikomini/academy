# Module 25 — The SQL you will meet, and migrations

> Site chapters: [27 — Oracle, and the SQL you will actually meet](../../site/chapters/27-oracle-and-sql.html),
> [28 — MongoDB](../../site/chapters/28-mongodb.html),
> [29 — Schema migrations with Flyway and Liquibase](../../site/chapters/29-migrations.html)
>
> Code: [`V1__orders.sql`](../../src/ordini-app/src/main/resources/db/migration/V1__orders.sql),
> [`V2__index_orders_by_customer_and_recency.sql`](../../src/ordini-app/src/main/resources/db/migration/V2__index_orders_by_customer_and_recency.sql)

---

## 1. The idea

### Migrations are reviewed artefacts

Versioned with the code that needs them, in the repository, reviewed like code. Not a
DBA's ad-hoc script, not `ddl-auto: update`.

**`validate` in production, never `update`.** In the twelve. `update` compares the
mapping to the schema and guesses; it will add a column and it will not drop one, so
your schema slowly accumulates the ghosts of every renamed field. `validate` refuses to
start when they disagree — which is exactly what you want, and this project has already
been saved by it: the first version of `V1__orders.sql` said `CHAR(3)` for currency
codes where the mapping said `varchar(3)`, and the application would not boot. `CHAR`
pads to a fixed width, so "EUR" would have come back with trailing spaces and
comparisons would have started failing in ways that look like data corruption.

**Flyway's checksum refusal is a feature.** Once a migration has run, editing the file
makes Flyway refuse to start. That reads as an obstacle the first time and it is
protection: a migration applied anywhere is history, and history is append-only. Editing
`V1` works on your empty laptop database and breaks every environment that already ran
it. The next change is `V2`, always.

**Migrate in the pipeline, not at start-up.** Running migrations when the application
boots means N replicas racing to alter the same table, and a rollback that has to
un-migrate. Make it a gated pipeline step (module 27) with its own credentials — the
runtime account should not hold DDL rights.

### Expand and contract

The pattern for changing a schema without a maintenance window. To rename
`carrier_tracking` to `tracking_code`:

1. **Expand.** Add `tracking_code`, nullable. Deploy code that writes both and reads the
   new one, falling back to the old.
2. **Backfill.** Copy the existing values, in batches.
3. **Contract.** Once every replica is on the new code and the data is copied, drop
   `carrier_tracking` — in a later release, not the same one.

Three deploys for one rename. That is the price of never taking the application down,
and the reason to know the pattern is that the alternative — one migration that renames
the column — breaks every running instance of the old code the instant it lands.

**Rollback reverses code, not schema.** Deploying yesterday's jar does not un-drop a
column. Which is why the contract step waits, and why a migration that only adds things
is a migration you can deploy on a Friday.

### Indexes are decisions about queries you actually run

`V2` in this project exists because `V1` was right and then a query changed. V1 indexed
`customer_id`, which served "which orders belong to this customer". Module 24 added:

```sql
SELECT ... FROM orders WHERE customer_id = ? ORDER BY last_changed_at DESC
```

With `customer_id` alone the database finds the rows and then sorts them. With
`(customer_id, last_changed_at DESC)` it walks the index and they come out ordered — no
sort step.

**Composite indexes work left to right.** That index serves `WHERE customer_id = ?` and
`WHERE customer_id = ? ORDER BY last_changed_at`. It does **not** serve a query
filtering on `last_changed_at` alone, because the first column is unconstrained. Column
order is a design decision.

And V2 *drops* the old index rather than leaving it: every redundant index is write
amplification on every insert and update, forever.

**A function on an indexed column disables the index.** `WHERE UPPER(sku) = 'BL-1001'`
cannot use an index on `sku` — the database would have to evaluate `UPPER` on every row
to know. Either index the expression, or normalise on the way in, which is what
[`Sku`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Sku.java) does:
upper-cased once, at the edge, so every query compares raw column to raw value.

### Oracle, because Emilia-Romagna runs a lot of it

Five things that will bite someone arriving from PostgreSQL or MySQL:

- **`''` is `NULL`.** An empty string and a null are the same value. `WHERE name = ''`
  matches nothing, ever, including rows where the name is empty.
- **Sequences, not auto-increment.** `IDENTITY` exists since 12c but sequences are what
  you will find, and Hibernate's generator choice matters for batching.
- **`ROWNUM` is applied before `ORDER BY`.** So `WHERE ROWNUM <= 10 ORDER BY total DESC`
  gives you ten arbitrary rows sorted, not the top ten. Use a subquery, or
  `FETCH FIRST n ROWS ONLY` on 12c and later.
- **`NULL`s sort last by default on Oracle**, first on PostgreSQL. Pagination that looks
  stable in test is not.
- **`VARCHAR2`, not `VARCHAR`.** And `DATE` includes a time.

**Database logic is not automatically wrong.** A stored procedure written in 2009 that
has been correct for fifteen years is not a bug because it is not in Java. Moving it is
a decision with a cost — testing, deployment coupling, the person who understood it —
and "it should be in the application" is an argument, not a fact.

### MongoDB, and when it earns its place

**Embed what is owned and bounded; reference what is shared.** Order lines are owned by
an order and there are ten of them: embed. A customer is shared by many orders and
unbounded: reference.

**Schemaless is not schema-free.** The schema moved into the application, where it is
now enforced by whichever code path happens to write. That is a real cost and it arrives
about eighteen months in, as documents from three different eras in one collection.

**No persistence context, no dirty checking.** You write the document. Nothing watches
an object and works out the update for you, which is less magic and more code.

**Needing multi-document transactions routinely is a modelling signal.** They exist and
they work; wanting them constantly means the aggregate boundaries are wrong.

The honest summary: **relational for invariants, documents for aggregates.** An order
with money and a state machine wants constraints and a transaction. A product catalogue
entry with forty optional attributes wants a document.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| The initial schema, with the reasoning per column | [`V1__orders.sql`](../../src/ordini-app/src/main/resources/db/migration/V1__orders.sql) |
| A second migration, motivated by a query that appeared later | [`V2__…`](../../src/ordini-app/src/main/resources/db/migration/V2__index_orders_by_customer_and_recency.sql) |
| `ddl-auto: validate`, and the mismatch it caught | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) |
| Normalising at the edge so queries stay index-friendly | [`Sku`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Sku.java) |
| Migrations run against the real database | [`OrderPersistenceIT`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderPersistenceIT.java) |

**No Oracle and no MongoDB here.** The reference system targets PostgreSQL, and this
module's Oracle and Mongo sections are knowledge rather than code — said plainly rather
than pretending otherwise. Pointing at a file that does not exist is the
cross-reference this repository's gate is built to catch.

**`OrderPersistenceIT` is where the migrations are actually proved.** H2 in PostgreSQL
compatibility mode runs them, but H2 accepts things PostgreSQL rejects. The container
test is the one whose green means the SQL is valid where it is deployed. It needs
Docker; without it, it skips and says so.

---

## 3. Do it

**Lab A — edit an applied migration.**

**This one will not reproduce against the test database**, and understanding why is
half the lab: `mvn test` uses an in-memory H2 that is created empty on every run, so
there is never any history for a checksum to mismatch against. Flyway only objects to a
migration that has *already been applied somewhere*.

So use a file-based database and run twice:

```bash
cd src && mvn -q install -DskipTests
URL='jdbc:h2:file:/tmp/flywaydemo;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE'

# Run 1 — applies V1 and V2, and records their checksums.
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18081   --spring.datasource.url="$URL" --spring.datasource.username=sa   --spring.datasource.password= --spring.datasource.driver-class-name=org.h2.Driver
# stop it, then edit any line of V1__orders.sql — a comment will do — and rebuild:
mvn -q install -DskipTests

# Run 2 — refuses to start.
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18081   --spring.datasource.url="$URL" --spring.datasource.username=sa   --spring.datasource.password= --spring.datasource.driver-class-name=org.h2.Driver
```

```
Validate failed: Migrations have failed validation
Migration checksum mismatch for migration version 1
```

Read that as protection rather than obstruction, then revert and delete
`/tmp/flywaydemo.mv.db`. Now make the same change as `V3__…` instead and watch it
apply — that is the whole discipline.

The thing worth taking away is the one the in-memory database hid: **your test suite
cannot catch this class of mistake**, because it never has yesterday's schema. Editing
an applied migration is caught by the first environment that already ran it, which in
the worst case is production.

**Lab B — `update` versus `validate`.**

Set `spring.jpa.hibernate.ddl-auto: update` and add a field to `OrderEntity` with no
migration. It starts, and the column appears. Now remove the field and restart: the
column is still there, unmentioned by anything. Do that four more times and you have a
schema nobody can explain. Set it back to `validate` and confirm it now refuses to
start.

**Lab C — write an expand-and-contract.**

Rename `carrier_tracking` to `tracking_code` properly. `V3` adds the new column,
nullable. Change `OrderEntity` to write both and read the new one with a fallback.
`V4`, in a later commit, drops the old one. Then ask yourself which step you could
safely deploy on a Friday afternoon, and why the answer is only the first two.

**Lab D — disable an index with a function.**

Add 50,000 orders, then compare:

```sql
EXPLAIN ANALYZE SELECT * FROM order_lines WHERE sku = 'BL-1001';
EXPLAIN ANALYZE SELECT * FROM order_lines WHERE UPPER(sku) = 'BL-1001';
```

Index scan versus sequential scan. Then look at `Sku`'s constructor and notice that the
normalisation there is what keeps every query in the application on the first line.

**Lab E — the Oracle empty string.**

If you have access to an Oracle instance, insert a row with `''` in a nullable column
and then `SELECT ... WHERE col = ''` and `WHERE col IS NULL`. The second finds it. If
you do not have one, write the two-sentence explanation from memory — it is a very
common interview question in this region and the answer takes ten seconds.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:27,28,29 -->
**Chapter 27 — Oracle, and the SQL you will actually meet**

1. **Oracle: `''` is `NULL`.** Comparisons to empty string match nothing.
2. **Sequences, not auto-increment.** Match `allocationSize` to `INCREMENT BY`; expect gaps.
3. **`ROWNUM` is applied before `ORDER BY`.** The naive top-N query is wrong.
4. **A function on an indexed column disables the index.**
5. **Composite indexes work left-to-right.** Leftmost prefix.
6. **Database logic is not automatically wrong.** Get it into git and under test.

**Chapter 28 — MongoDB, and when a document store earns its place**

1. **Embed what is owned and bounded; reference what is shared.** Model for the query you run most.
2. **Schemaless is not schema-free.** Validate, and version your documents.
3. **No persistence context, no dirty checking.** Nothing saves until you save it.
4. **Needing multi-document transactions routinely is a modelling signal.**
5. **Relational for invariants, documents for aggregates.** Both, on purpose.

**Chapter 29 — Schema migrations with Flyway and Liquibase**

1. **`validate` in production, never `update`.** `create-drop` is for tests.
2. **Migrations are reviewed artefacts.** A diff a human read before it touched production.
3. **Flyway’s checksum refusal is a feature.** Never edit an applied migration; add a new one.
4. **Migrate in the pipeline, not at start-up.** Instances race, and runtime accounts should not hold DDL rights.
5. **Expand and contract.** Every change survives one release of both versions.
<!-- /CARD -->

---

## 5. Interview questions

**"Come gestisce le migrazioni?"** — Flyway, versioned with the code, reviewed like code,
run as a gated pipeline step rather than at application start-up — otherwise N replicas
race to alter the same table. `ddl-auto: validate` in production, never `update`.

**"Perché non `update`?"** — Because it guesses. It adds columns and never drops them, so
the schema accumulates the ghosts of every rename, and nothing tells you when the
mapping and the database have drifted. `validate` refuses to start on a mismatch — which
has already caught a real one here, a `CHAR(3)` where the mapping said `varchar(3)`.

**"Come rinomina una colonna senza fermare il sistema?"** — Expand and contract. Add the
new column, deploy code that writes both, backfill, and drop the old one in a later
release once every replica is on the new code. Three deploys for one rename, and the
reason is that rollback reverses code and not schema.

**"Come sceglie gli indici?"** — From the queries that actually run, not from the columns
that look important. Composite indexes work left to right, so column order decides which
queries they serve; and every index is a write cost on every insert, so a redundant one
is worth dropping when a better one replaces it.

**"Qualcosa che sorprende in Oracle?"** — `''` is `NULL`, so `WHERE col = ''` never
matches anything. And `ROWNUM` is applied before `ORDER BY`, so a naive top-ten query
returns ten arbitrary rows sorted rather than the top ten.

**"Quando userebbe MongoDB?"** — For aggregates that are documents: owned, bounded,
read and written whole. Not for anything whose correctness depends on constraints and
transactions across records — an order with money and a state machine belongs in a
relational database. And I would say the cost out loud: schemaless means the schema
moved into the application, and you meet it eighteen months later as documents from
three different eras in one collection.

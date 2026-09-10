# Module 21 — JDBC, connection pools and what leaks

> Site chapter: [22 — JDBC, connection pools and what leaks](../../site/chapters/22-jdbc-and-pools.html)
>
> Code: [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml),
> [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml)

---

## 1. The idea

Opening a database connection is expensive — a TCP handshake, authentication, session
setup, tens of milliseconds. Doing it per request would dominate every response time.
So a pool opens some in advance and lends them out.

That single sentence generates every question in this module.

### A pool is not a queue, and small pools are faster

The instinct is that a bigger pool serves more traffic. It does not. The database can
only genuinely run so many statements at once — bounded by cores and disks — and past
that point extra connections add context switching and lock contention, not throughput.
A pool larger than the database's useful concurrency just moves the waiting from your
application into the database, where it is harder to see.

HikariCP's own guidance lands around `cores × 2` for a start, then measure. Ten is a
reasonable default and this project uses it.

### Every replica has its own pool — multiply before you deploy

In the senior six, and the arithmetic is the whole point:

```
3 replicas × 10 connections = 30
```

PostgreSQL's default `max_connections` is 100. Three replicas is fine; scaling to
fifteen under load is not, and the failure arrives as `FATAL: sorry, too many clients`
at exactly the moment you were adding capacity. Autoscaling and connection pools
interact, and nobody notices until they do.

### `maxLifetime` must sit below the database's and the firewall's idle timeouts

If the database, a proxy or a firewall closes an idle connection and the pool does not
know, the pool hands out a dead socket. The symptom is an intermittent
`Connection reset` that correlates with nothing you can find.

So retire connections *before* anything else does. Five minutes is a common default;
what matters is that it is smaller than every timeout between you and the database.

### A leaked connection breaks other requests, not the one that leaked it

The nastiest property in this module. A request that takes a connection and never
returns it finishes fine — 200, fast, no error. The pool is one smaller. After enough
of them the pool is empty and *every other request* blocks on `connection-timeout` and
fails, all pointing at innocent code.

That is why `try-with-resources` is not optional at the JDBC level, why
`@Transactional` boundaries should be short, and why `spring.jpa.open-in-view` is off
in this application — it holds a connection for the whole request including the time
spent serialising JSON to a slow client.

### Always parameterise

`PreparedStatement` with `?`, never string concatenation. Two reasons, and the second
is the one people forget:

1. **SQL injection.** Concatenation is the vulnerability, parameters are the fix.
2. **Statement caching.** A parameterised statement has one plan reused across values;
   concatenated SQL is a new statement every time, so the database plans it again and
   its cache fills with thousands of near-identical entries.

### JPA for the domain, SQL for reporting

Both, deliberately. An ORM is good at loading an aggregate and writing it back with its
invariants intact. It is bad at a twelve-table report with window functions, and the
HQL that expresses one is worse than the SQL.

Reaching for `JdbcClient` or a native query in that case is not a failure of the ORM;
it is using the right tool. The mistake is doing the reverse — hand-writing the CRUD an
ORM does perfectly well.

---

## 2. In this codebase

There is no hand-written JDBC here, and that is worth saying plainly rather than
inventing some. Hikari is configured, and the code above it uses JPA.

| Thing | Where |
|---|---|
| Pool size, lifetime, timeout — with the reasoning | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) |
| `open-in-view: false`, and why | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) |
| Short transaction boundaries at the repository | [`JpaOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| The driver, at `runtime` scope only | [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml) |

Note the `runtime` scope on the PostgreSQL driver. No code imports it — the connection
URL selects it — so compiling against it would be an invitation to write something
database-specific in a place that should not know.

Note also what appeared without being asked for: adding
`spring-boot-starter-data-jpa` created a `DataSource`, a HikariCP pool, an
`EntityManagerFactory` and a transaction manager. None are declared anywhere. That is
module 16's auto-configuration, and `--debug` will show you the conditions that fired.

---

## 3. Do it

**Lab A — see the pool.**

```bash
cd src && mvn -q install -DskipTests
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar \
  --spring.profiles.active=dev --server.port=18080 --debug 2>&1 | grep -i hikari
```

The pool is named `HikariPool-1` and logs its configuration. Now set
`spring.datasource.hikari.maximum-pool-size=1` and drive two concurrent slow requests
at it. The second waits, then fails at `connection-timeout`. That is what pool
exhaustion looks like from the outside: a timeout, not a database error.

**Lab B — leak one.**

Write a scratch endpoint that takes a `DataSource`, calls `getConnection()` and never
closes it. Call it as many times as `maximum-pool-size`. Every one of those requests
succeeds. Then call any *other* endpoint and watch it fail.

This is the lab worth doing slowly, because the failure has no relationship to the
code that caused it. Now wrap the connection in `try (var c = dataSource.getConnection())`
and repeat.

**Lab C — the arithmetic.**

Set `maximum-pool-size: 10` and imagine fifteen replicas. Then look up your database's
`max_connections`. Write down the number. That is the whole lab, and it is the one that
prevents a real incident.

**Lab D — parameterise, or do not.**

Add a `JdbcClient` query that concatenates a SKU into the SQL, then pass
`BL-1001' OR '1'='1`. Then do it with a parameter. Beyond the injection, run each a
thousand times and look at `pg_stat_statements`: one entry versus a thousand.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:22 -->
**Chapter 22 — JDBC, connection pools and what leaks**

1. **Always parameterise.** Separate channels for SQL and values; injection becomes structurally impossible.
2. **Small pools are faster.** 10–20 is normal; 200 is a misunderstanding.
3. **Every replica has its own pool.** Multiply before you deploy.
4. **`maxLifetime` below the database and firewall idle timeouts,** or you hand out dead connections.
5. **A leaked connection breaks other requests, not the one that leaked it.**
6. **JPA for the domain, SQL for reporting.** Mixing them is not a failure.
<!-- /CARD -->

---

## 5. Interview questions

**"Perché un connection pool?"** — Because opening a connection costs a handshake and
authentication, tens of milliseconds, and doing it per request would dominate the
response time. The pool keeps a few open and lends them out.

**"Quanto grande?"** — Smaller than people expect. The database can only run so many
statements concurrently; past that, more connections add contention rather than
throughput. Start around twice the core count and measure. Then the part that catches
people out: it is per replica, so ten connections and fifteen pods is a hundred and
fifty against a `max_connections` of a hundred.

**"Cosa succede se una connessione non viene restituita?"** — The pool shrinks by one
and the request that leaked it succeeds normally. Enough of those and every *other*
request blocks and times out, pointing at code that is innocent. It is the hardest kind
of bug to trace back, which is why `try-with-resources` and short transactions are
non-negotiable.

**"`maxLifetime` a cosa serve?"** — To retire a connection before the database, a proxy
or a firewall closes it behind the pool's back. If it is longer than their idle
timeouts, the pool eventually hands out a dead socket and you get intermittent
connection resets with no pattern.

**"Statement o PreparedStatement?"** — Always parameterised. Injection is the obvious
reason; the other is that the database caches a plan per statement text, so
concatenated SQL plans every execution afresh and fills the cache with near-duplicates.

**"Usa ancora SQL, o solo l'ORM?"** — Both, on purpose. JPA for the domain, where an
aggregate has to be loaded and written back with its invariants intact; SQL for
reporting, where a twelve-table query with window functions is clearer as SQL than as
anything an ORM would produce.

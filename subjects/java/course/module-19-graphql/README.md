# Module 19 — GraphQL, and when it beats REST

> Site chapter: [19 — GraphQL, and when it beats REST](../../site/chapters/19-graphql.html)
>
> Code: none — see below.

---

## 1. The idea

### What it actually changes

GraphQL moves **shape selection to the client**. Instead of the server deciding what a
`/orders/{id}` response contains, the client asks for the fields it wants and gets exactly
those.

That is the whole idea. Everything else — the schema language, the single endpoint, the
tooling — follows from it.

### What it costs, and this is the part interviews are checking

The single POST endpoint is not a detail; it removes four things you were getting free
from HTTP:

- **HTTP caching.** Every request is a POST to `/graphql`, so a CDN cannot cache it and
  neither can the browser. You rebuild caching inside the application, per field.
- **Endpoint rate limiting.** There is one endpoint, so "limit `/orders` to 100/min" is
  meaningless. You rate-limit by *query complexity*, which you must first learn to
  compute.
- **Status-code monitoring.** GraphQL returns 200 with an `errors` array. Every dashboard
  built on status codes goes green. You need error-aware monitoring or you are blind —
  and note this is exactly the "200 with an error body" anti-pattern from module 18,
  adopted deliberately.
- **A meaningful access log.** Every line says `POST /graphql`.

### N+1 is worse, not better

The classic misunderstanding. GraphQL does not fix N+1 — it *invites* it, because the
client chooses the shape and can ask for a nested field the server did not anticipate.

```graphql
{ orders { lines { sku } } }
```

A naive resolver runs one query for the orders and one per order for the lines, and no
one wrote that code path; the client did, at run time. The answer is **DataLoader**: a
per-request batching layer that collects the ids requested in one tick and fetches them
in a single query.

So module 24's problem arrives here in a harder form: the query shapes are not known in
advance, so you cannot fix them one at a time with an entity graph. You have to build the
batching infrastructure and keep it working.

### Design the schema, do not expose the entities

The most common failure: generating a GraphQL type per database table. You have published
your schema as an API with extra steps, and now every column rename is a breaking change
to clients — the same mistake as returning entities from a controller (module 17), with a
larger blast radius because clients are now writing their own queries against it.

### When it is worth it

**Many differing clients.** A web app, an iOS app and a partner integration that each
want a different subset of the same data. That is the case GraphQL was built for at
Facebook, and it is real.

**When it is not:** one client. If the web front end is the only consumer, the server
already knows the right shape, and you have taken on caching, rate limiting, monitoring
and N+1 infrastructure to solve a problem you did not have. BFF endpoints — one
REST endpoint shaped for one screen — solve the same problem for a fraction of the cost.

The honest interview answer is that GraphQL is a good solution to a specific problem, and
the question to ask before adopting it is how many genuinely different consumers there
are.

---

## 2. In this codebase

**There is no GraphQL here, and there should not be.**

This application has one consumer and a small, stable domain. Adding
`spring-boot-starter-graphql` to demonstrate a module would mean taking on per-field
caching, complexity-based rate limiting, error-aware monitoring and a DataLoader layer —
in order to solve a problem the application does not have. That would be the exact
mistake this module warns about, performed for teaching purposes.

So this module is knowledge, and the codebase's contribution is the **contrast**:

| GraphQL concern | How the REST version here handles it |
|---|---|
| Client-chosen shape | Server-chosen DTO — [`OrderResponse`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java) |
| N+1 from unanticipated nesting | Known queries, fixed per query — [`SpringDataOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java) |
| 200 with an `errors` array | Real status codes — [`FailureStatus`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/FailureStatus.java) |
| Complexity-based rate limiting | Per-endpoint, and a server-side page cap |

Read that table in both directions. It is a fair summary of what you give up by choosing
GraphQL — and of what you give up by not choosing it, which is one client having to
accept a response shaped for another.

---

## 3. Do it

**Lab A — build it anyway, on a branch.**

Add `spring-boot-starter-graphql`, write a schema with `Order` and `OrderLine`, and a
resolver over `OrderService`. Query `{ orders { lines { sku } } }` with SQL logging on,
and count the queries. You have reproduced module 24's N+1 without writing a single query.

**Lab B — fix it with a DataLoader.**

Add a `BatchLoader` for lines keyed by order id and re-run. One query. Then notice what
you had to build: a batching layer that has to be maintained for every association a
client might traverse, forever — versus one `@EntityGraph` on the one query that needed
it.

**Lab C — break the monitoring.**

Send a query for a field that does not exist. The response is **200** with an `errors`
array. Now imagine your alerting is "page me on 5xx rate". Write down what you would have
to change.

**Lab D — cost a query.**

Write `{ orders { lines { sku } } }` nested five levels deep against a schema that allows
it. There is no page size to cap and no endpoint to rate-limit. Look up query-complexity
analysis and estimate the work of introducing it. That estimate is the real cost of the
single endpoint.

**Lab E — the BFF alternative.**

Take the strongest case for GraphQL you can think of in this domain — a mobile client
wanting orders without lines, and a web client wanting them with — and solve it with two
REST endpoints instead. Compare the two solutions honestly. Sometimes GraphQL wins;
knowing when it does not is the more useful skill.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:19 -->
**Chapter 19 — GraphQL, and when it beats REST**

1. **GraphQL moves shape selection to the client.** That is the whole idea.
2. **It costs you HTTP caching, endpoint rate limiting and status-code monitoring.**
3. **N+1 is worse, not better.** `DataLoader` batching is mandatory, not optional.
4. **Worth it for many differing clients;** overkill for one front end or a fixed integration contract.
5. **Design the schema.** Do not expose the entity graph.
<!-- /CARD -->

---

## 5. Interview questions

**"Quando userebbe GraphQL?"** — When there are several genuinely different clients wanting
different subsets of the same data — a web app, a mobile app, a partner integration. With
one consumer the server already knows the right shape, and a BFF endpoint solves it for a
fraction of the cost.

**"Cosa perde rispetto a REST?"** — HTTP caching, endpoint rate limiting and status-code
monitoring, because everything is a POST to one endpoint that returns 200 with an errors
array. Each of those gets rebuilt inside the application: per-field caching,
complexity-based limits, error-aware alerting.

**"GraphQL risolve l'N+1?"** — The opposite: it invites it, because the client chooses the
shape and can nest a field nobody anticipated. The fix is a DataLoader batching layer per
association — infrastructure you have to build and keep working, rather than one entity
graph on one known query.

**"Come progetta lo schema?"** — As an API, not as the database. A type per table is the
same mistake as returning entities from a controller, except worse, because clients are
now writing their own queries against your column names.

**"Lo ha usato in produzione?"** — Be honest. Better: describe the decision you would make
and why, and name the specific costs — that is what the question is actually testing, and
"we considered it and chose BFF endpoints because we had one client" is a stronger answer
than a shallow yes.

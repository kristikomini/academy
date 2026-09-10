# The deep course — Fonderia Academy

The site teaches a topic well enough to hold a conversation about it. These modules
are the layer underneath: enough to be dangerous with it.

**Read a chapter to understand a topic. Read the module to be dangerous with it.**

Twenty-eight modules, blueprint §3.6. They are markdown, read in an editor, not
served by the site — the site is the tutorial layer, this is the reference layer, and
keeping them apart is what lets each be honest about its depth.

---

## The shape every module follows

Five parts, in this order, no exceptions. The consistency is what lets you skim to
the part you need:

1. **The idea** — what the concept is and what problem it solves.
2. **In this codebase** — the exact files in `../src/` that use it, by path.
3. **Do it** — an exercise, a lab, or a deliberate breakage to observe.
4. **Golden rules** — the module compressed into a dozen sentences, written as claims
   a person could be asked to recite rather than as prose.
5. **Interview questions** — what you will actually be asked, with the answer
   sketched, in Italian where the question would be asked in Italian.

## Where the Golden rules actually come from

Blueprint §3.4 has `GOLDEN-RULES.md` authored here and the site's `rules.js`
generated from it. **In this subject the arrow runs the other way**, because the
chapters were written before the course: `tools/viva-extract.php` reads the `.rules`
block of all 52 site chapters and generates `GOLDEN-RULES.md`, and
`tools/viva-deck.php` turns that into `site/assets/rules.js`.

So part 4 of a module is **not** hand-written here. It is the extracted card for the
chapters that module covers, and the way to change a rule is to change the chapter.
The blueprint's principle — one authored place per fact, everything downstream
generated — is kept; only the direction changed. `docs/BUILD-STATUS-java.md` records
the reasoning in full.

The one thing authored here is `course/viva-tiers.json`: which twelve rules decide
interviews and which six separate a senior candidate. That is a judgement, not an
extraction.

## The reference system

`../src/` is a Maven multi-module build. Its job is to be **read**, not to be
impressive — every non-obvious decision carries a comment saying what was traded
away, because a file you cannot argue with teaches nothing.

The domain is order fulfilment, kept from the C# subject on purpose (blueprint §9.4):
it has real invariants, real concurrency, real money arithmetic and real state, and
those are the things interviews are actually about.

```
src/
  pom.xml                parent: layering, one place for versions
  ordini-domain/         pure Java 21. No Spring, no JPA — enforced by the classpath,
                         not by a code review. Money, typed ids, the order state
                         machine, domain events, Result.
  ordini-app/            Spring Boot: the container, config, the web tier, and JPA over
                         PostgreSQL with Flyway migrations, and a transactional outbox.
                         Real, and it runs.
  ordini-exercises/      graded exercises, deliberately red until you make them green. [planned]
  ordini-demos/          runnable demos of invisible behaviour: an N+1, a race,
                         a connection leak, a rebalance.                             [planned]
```

Run it:

```bash
cd src && mvn test                      # fast: 76 tests, no daemon needed
mvn -Dtest=OrderPersistenceIT -DfailIfNoTests=false -Dsurefire.excludes=none test
```

The second needs Docker running; it starts PostgreSQL in a container and runs the real
migrations against it. Without Docker it skips rather than fails, and says why.

The layering is enforced by the build. `ordini-domain` cannot import Spring because
Spring is not on its classpath — the cheapest architecture test there is, and the
reason the domain's whole test suite runs in milliseconds with no container.

## The twenty-eight modules

Chapter numbers are the site's, in `site/chapters/`.

| # | Module | Site chapters |
|---|---|---|
| 01 | The JVM, and what actually runs | 01, 02 |
| 02 | Types, equality and the object contracts | 03 |
| 03 | Collections, and what each one costs | 04 |
| 04 | Generics and erasure | 05 |
| 05 | Lambdas, streams and Optional | 06 |
| 06 | Records, sealed types and pattern matching | 07 |
| 07 | Exceptions and the failure boundary | 08 |
| 08 | Threads, executors and virtual threads | 09 |
| 09 | Memory, garbage collection and the heap | 10 |
| 10 | The domain model: value objects, typed ids and money | 03, 07 |
| 11 | The state machine, invariants and domain events | 07, 25 |
| 12 | Expected failure: `Result`, and where exceptions still belong | 08, 18 |
| 13 | The Spring container: beans, scopes, lifecycle, proxies | 11 |
| 14 | Dependency injection, and the design it exposes | 12 |
| 15 | Configuration, profiles and typed binding | 13 |
| 16 | Spring Boot, auto-configuration, and Quarkus compared | 14, 15 |
| 17 | The request cycle, and what a controller is for | 16 |
| 18 | Designing the API: REST, errors and the contract | 17, 18, 21 |
| 19 | GraphQL, and when it beats REST | 19 |
| 20 | Security: the filter chain, JWT and OAuth2 | 20 |
| 21 | JDBC, connection pools and what leaks | 22 |
| 22 | JPA and Hibernate: the persistence context | 23, 24 |
| 23 | Transactions, propagation and concurrency | 25 |
| 24 | The N+1 problem and fetching strategies | 26 |
| 25 | The SQL you will meet, and migrations | 27, 28, 29 |
| 26 | Many services: messaging, the outbox, idempotency | 30, 31, 33, 34 |
| 27 | Keeping it up: resilience, observability, tests, pipeline | 32, 35, 36–44 |
| 28 | The code you inherit, and the job you are applying for | 45–51 |

## Writing order — and why it is not 01 to 28

Blueprint discipline, inherited from the PHP subject's course README:

> Write the module whose code you have just finished in `../src/`, so part 2 can cite
> real file paths rather than promises. A module pointing at a file that does not
> exist yet is exactly the kind of cross-reference `tools/doctor.php` was built to
> catch.

So the order is the order the reference system gets built, not the order it is read:

1. **10, 11, 12** — the domain. Pure Java, no framework, buildable first, and the
   thing every later module points back at.
2. **02, 04, 06, 07** — the language modules that can now cite real domain code
   instead of a toy example: `equals` on `Money`, erasure, records and sealed types,
   the exception boundary.
3. **13–17** — Spring, as `ordini-app` grows a container and a web tier.
4. **21–25** — data, as it grows persistence.
5. **26, 27** — messaging and operations, once there is something worth operating.
6. **01, 03, 05, 08, 09** — the remaining language and runtime modules, which need
   the least support from `src/` and are best written with the whole build to
   measure against.
7. **18, 19, 20, 28** — the API surface and the career layer, last.

## Status

**All twenty-eight written.** 89 tests pass across `ordini-domain` and `ordini-app`, plus
6 integration tests that need Docker.

Five of the twenty-eight point at no code of their own, and say so in their own text
rather than inventing some: 09 (memory — the application has no cache, no `ThreadLocal`
and no static mutable state), 19 (GraphQL — adding it here would be the mistake the module
warns about), 20 (security — genuinely missing, and the one gap that would be
unacceptable in production), 27 (no CI or Dockerfile yet) and 28 (the market, which is not
about code at all).


Twenty-three of twenty-eight, and 89 tests pass across the two modules (plus 6
integration tests that need Docker). Every lab has been
executed rather than asserted; where the result differed from what the module claimed,
the module was corrected — and several times the code or the tests were.

`docs/BUILD-STATUS-java.md` is the honest record. This table is a summary of it, and
if the two ever disagree, that file wins.

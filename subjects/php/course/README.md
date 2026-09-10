# The deep course

The site teaches a topic well enough to hold a conversation about it. These
modules are the layer underneath: enough to be dangerous with it.

**Status: not written yet.** This file exists so the link from the site's home
page resolves, and so the shape is fixed before the writing starts. It is a
placeholder and it says so, rather than being padded out with headings that
would read as progress.

---

## The shape every module follows

Blueprint §3.6. Five parts, in this order, no exceptions — the consistency is
what lets you skim to the part you need:

1. **The idea** — what the concept is and what problem it solves.
2. **In this codebase** — the exact files in `src/` that use it, by path.
3. **Do it** — an exercise, a lab, or a deliberate breakage to observe.
4. **Golden rules** — the module compressed into a dozen sentences. This card is
   also the source the viva deck is generated from, so write it as claims a
   person could be asked to recite, not as prose.
5. **Interview questions** — what you will actually be asked, with the answer
   sketched, in Italian where the question would be asked in Italian.

## The planned modules

Twenty-eight, in five parts, mapping onto the site's chapters but going deeper.
The order below is the writing order, chosen so each module can point at code
that already exists in `src/`.

| # | Module | Site chapters |
|---|---|---|
| 01 | The PHP runtime: FPM, OPcache, the request lifecycle | 01, 08 |
| 02 | The type system and what strict_types really changes | 02 |
| 03 | Objects, enums and value objects | 03 |
| 04 | Closures, callables and generators | 04 |
| 05 | SOLID, with the trade-offs stated | 05 |
| 06 | Arrays, SPL and copy-on-write | 06 |
| 07 | Errors, exceptions and the failure boundary | 07 |
| 08 | Schema design for MySQL | 09 |
| 09 | SQL beyond CRUD | 10, 10b |
| 10 | Indexes and the query planner | 11 |
| 11 | Transactions, isolation and concurrency | 11 |
| 12 | The ORM: Eloquent, Doctrine and the N+1 | 12 |
| 13 | HTTP, PSR-7 and PSR-15 | 13 |
| 14 | API design, versioning and error shapes | 14, 14b |
| 15 | Application security in depth | 15 |
| 16 | The framework: container, pipeline, providers | 16, 19 |
| 17 | Working in a legacy codebase | 16b |
| 18 | The front end a back-end developer owns | 17, 17b, 18 |
| 19 | Caching, and invalidating it | 20 |
| 20 | Search | 21 |
| 21 | Queues, workers and idempotency | 22 |
| 22 | Architecture: layers, ports, CQRS | 22b, 23 |
| 23 | Testing, doubles and mutation | 24 |
| 24 | Observability and production support | 25, 25b |
| 25 | Git, Composer, Docker | 26, 27, 28 |
| 26 | Deployment and CI/CD | 29, 29b, 30 |
| 27 | The Italian market: WordPress, e-commerce, gestionali | 31, 32, 33 |
| 28 | The human requirements | 34–38 |

## Two collected pages, generated as you go

- **`GOLDEN-RULES.md`** — every module's card, in module order, plus two priority
  tiers at the top: *the twelve that decide interviews* and *the six that
  separate a senior candidate*. `site/assets/rules.js` is **generated** from
  this file by `tools/viva-deck.php`; never hand-edit the generated one.
- **`LAWS-OF-PHP.md`** — the same knowledge reorganised **by concept** rather
  than by module, so that when something surprises you it is findable by what
  *kind* of thing it was.

## Writing order

Do not write these in numerical order. Write the module whose code you have just
finished in `src/`, so part 2 ("In this codebase") can cite real file paths
rather than promises. A module pointing at a file that does not exist yet is
exactly the kind of cross-reference `tools/doctor.php` was built to catch.

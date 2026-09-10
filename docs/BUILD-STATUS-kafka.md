# Officina Academy — build plan and honest status

An Apache Kafka build of the LogiFlow Academy platform, following
`Desktop/C#/docs/BLUEPRINT.md` §10 (build order) and §12 (the numbers to hit).

**Every number in this file was measured, not estimated.** Regenerate them with
`php tools/doctor.php kafka` before editing any of them — the blueprint's integrity
gate (§8, check 11) exists because prose counts rot silently, and this document
is the most likely place for that to happen first.

---

## What this is

The same two-system design as the original: a **tutorial platform** (static,
framework-free, offline-capable, `file://`-openable) wrapped around a
**reference application** — here an event-driven one.

Naming: the platform is **Officina Academy**. *Officina* = workshop, and
specifically the kind with things moving through it, which is the mental model
this subject is trying to install.

---

## The thing to read before anything else

**There is no standalone Kafka job in this market.** Phase 1 collected five
postings and every Kafka line in them came from a Java or backend advert — most
Milano or remote, several written in English. The adverts say "Apache Kafka" and
stop; they rarely name partitions, offsets or delivery semantics, which are the
things the work actually turns on.

Two consequences, both deliberate:

1. **This subject exists separately from `java` by choice, not by evidence.**
   The adverts argue for one combined subject. It was split anyway so that Kafka
   is treated as a system with its own model rather than as one chapter at the
   back of a Spring course — which is how it is usually taught and why most
   candidates can name it but not reason about it. The cost is real: two
   manifests quote overlapping advert lines, and a reader doing both meets
   Spring twice.

2. **29 of 46 chapters carry an `extra` rather than a `req`** — a far higher
   ratio than any other subject here. That is the honest finding, not an
   omission. The advert asks for one word; this course is the expansion of it.

---

## Status: phase 6 complete — chapters, question bank and the viva deck

| # | Phase (blueprint §10) | Status |
|---|---|---|
| 1 | Collect the adverts, derive the manifest | **Done** — 5 postings, 46 entries |
| 2 | The shell — CSS, site.js, manifest, one chapter | **Done** — engine synced, 46 chapter files generated |
| 3 | The engine, unchanged — store, quiz, learn, notes, the pages | **Done, verified in a browser** |
| 4 | Content in bulk — the prose and the question bank | **Done** — 46 chapters, 368 questions |
| 5 | The deep course + GOLDEN-RULES.md | Not started |
| 6 | The viva — deck generator, viva.html, simulate.html | **Done, verified in a browser** — 273 cards, generated |
| 7 | The accounts service | Not started |
| 8 | Offline and install | Ported; cache `officina.kafka-v5` |
| 9 | The integrity gate — 11 checks + CI | **Done** — `php tools/doctor.php kafka` passes |

### Measured counts, right now

| Thing | Now | Target |
|---|---:|---:|
| Site chapters (files + manifest entries) | 46 | 46 |
| Chapters actually written | **46** | 46 |
| Chapters that are honest placeholders | **0** | 0 |
| Chapters answering an advert line (`req`) | 17 | — |
| Chapters beyond the advert (`extra`) | 29 | — |
| Quiz questions | 368 | ~400 |
| Chapters with questions | 46 | 46 |
| Glossary terms | 0 | ~130 |
| Glossary categories | 7 | — |
| Italian chapter panels | 0 | ~30 |
| Viva rules | 273 | ~350 |
| Course modules | 0 | 28 |
| API endpoints | 0 | 14 |
| Integrity checks (in `tools/doctor.php`) | 11 | 11 |

---

## Phase 1 — the adverts (done)

1. **Backend Developer mid-senior, Milano (hybrid)** — Java 17, Spring Boot,
   OpenShift/Kubernetes, Kafka/RabbitMQ, MongoDB, Oracle.
2. **Esprimo S.R.L., Milano** — 5+ years, application architectures, REST, SQL
   and Apache Kafka. CCNL Metalmeccanico, 35–38k.
3. **Sinergidea Srl, Milano** — "Sviluppatore Java e Kafka".
4. **Java Backend Developer, Microservices & Kafka** — remote, Italy.
5. **Aggregated Kafka-developer requirement lines from Italian listings** —
   Kafka Streams, Connect, ZooKeeper, Schema Registry, Prometheus/Grafana, and
   the Confluent certification.

Source 5 is weaker evidence than 1–4 and is marked as such here on purpose: it
is a composite of requirement lines rather than a single posting. Chapters
resting on it (05, 14, 20, 23, 28, 31, 33) would be the first to re-check if the
manifest is ever revised.

---

## Phase 6 — the viva deck (done)

`site/assets/rules.js` holds **273 cards** and is generated. Two tools, both new,
both in `tools/`:

| Tool | Reads | Writes |
| --- | --- | --- |
| `viva-extract.php` | the `.rules` block of all 46 chapters | `course/GOLDEN-RULES.md` |
| `viva-deck.php` | `course/GOLDEN-RULES.md` | `site/assets/rules.js` |

Run them in that order; neither output is ever hand-edited.

**This inverts the blueprint's arrow, deliberately.** Blueprint §3.4 has
`GOLDEN-RULES.md` authored by hand with the chapters referring to it, which is
right for the C# subject, where the deep course was written first. Here the
chapters came first and already carried 275 rules in the exact
`<strong>claim</strong> why` shape the deck needs. Writing them out a second time
by hand would have produced two copies of every sentence, drifting apart from the
first edit onwards — the precise rot the gate exists to catch. So the chapters are
the source of truth and the markdown is derived. The blueprint's actual principle,
one authored place per fact, is kept; only the direction changed.

**What is still editorial.** Which rules are *the twelve that decide interviews*
and which are *the six that separate a senior candidate* cannot be extracted —
that is a judgement, and it lives in `course/viva-tiers.json` as a list of rule
slugs. `viva-extract.php --candidates` prints every slug to choose from, and a
slug that no longer matches a rule is reported as a warning rather than silently
dropping a card. The twelve here cover the log, ordering, keys, group membership, delivery semantics, the outbox. The twelve run in dependency order rather than chapter order, because the Kafka answers build on each other: you cannot argue about delivery semantics before the log and the partition are settled.

**Card kinds.** 229 cards are `explain` (say why the claim is true) and
44 are `complete` (finish the sentence). The split is not arbitrary: a rule
whose chapter wrote no justification has nothing to reveal on the back, and a card
you cannot mark yourself against is where self-marking drifts generous. Those
become `complete`, with the stem cut at the rule's own clause boundary.

**Checks before it writes.** `viva-deck.php` refuses to emit a deck containing an
`explain` card with an empty back, a `complete` card whose stem gives away the
claim, an unbalanced backtick, a duplicate id, an undecoded HTML entity, or a
twelve that is not twelve. The entity check is there because `viva.js` escapes text
before re-adding its own markup — the same failure that put literal `<code>` tags
in the first thirty quiz questions.

**Verified in a browser on 2026-09-08**, port 8101: 273 cards load, a
session starts, the chapter title renders above each claim, a typed answer reveals
the written justification with a pointer to the chapter file, grading advances and
is recorded on the dashboard, and a `complete` card shows its stem with the task
text switching to "Finish the rule". Repeated `continues` claims show the
ellipsis correctly.

## Known gaps, stated plainly

- **Verified in a browser on 2026-09-06**, served over HTTP on port 8101: the
  sidebar, the 46 home cards, the coverage table (17 rows) and the beyond table
  (29 rows) all generate from the manifest, and there are no console errors.
  What is *not* verified is the service worker — see below.
- **The question bank is 368: eight per chapter across all 46.** Per blueprint
  §10 the questions were meant to go in alongside the prose rather than after it;
  they did not. The append-only lockfile is what made adding them afterwards
  safe — 368 ids issued, none reassigned.
- **Where a second pass would pay best**, by this course's own argument about
  what carries interview weight: 12 (offsets), 13 (rebalancing), 15 (delivery
  semantics), 16 (idempotent consumers) and 39 (the outbox).
- **`sw-cache` is derived, not verified.** The gate reports the cache name it
  computes (`officina.kafka-v5`); it does not prove the service worker precaches the right
  list. Bump `cacheVersion` in `subject.js` on every content change. Confirmed on
  2026-09-08 that this matters in practice: after regenerating `rules.js` the page
  kept loading the old empty deck, because the worker's install-time fetch was
  itself served the stale file from the browser's HTTP cache — `python -m
  http.server` sends no `Cache-Control`. The version bump is what breaks that
  cycle, since a new cache name forces a fresh install.
- **The glossary carries categories but no terms**, for the same reason as the
  Java subject: the reusable Italian process vocabulary has `where` fields
  pointing at PHP chapter numbers, and copying it before remapping them would
  plant exactly the rot the gate exists to catch.
- **The accounts pages describe a service that does not exist.** `account.html`,
  `signin.html`, `register.html` and `reset.html` were ported and their examples
  rewritten for this subject (topic auto-creation and ACLs in place of the
  original's EF Core migrations), but phase 7 is not started, so nothing is
  listening. Sign-in fails until an API exists.

## Overlap with the Java subject

Chapter 41 (*Spring Kafka in practice*) and the Java academy's chapter 33
(*Messaging from inside a Spring application*) are adjacent by design. Here
Spring is one client seen from inside the broker's model; there, messaging is
one option seen from inside a Spring app. **If those two chapters start
describing the same thing, delete one.**

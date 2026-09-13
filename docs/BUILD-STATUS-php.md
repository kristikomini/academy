# Bottega Academy — build plan and honest status

A PHP rebuild of the LogiFlow Academy platform, following
`Desktop/C#/docs/BLUEPRINT.md` §9 ("The PHP rebuild") and its nine-phase build
order in §10.

**Every number in this file was measured, not estimated.** Regenerate them with
`php tools/doctor.php php` before editing any of them — the blueprint's integrity
gate (§8, check 11) exists because prose counts rot silently, and this document
is the most likely place for that to happen first.

---

## What this is

The same two-system design as the original: a **tutorial platform** (static,
framework-free, offline-capable, `file://`-openable) wrapped around a
**reference application** written in the language being taught — here PHP
instead of C#. The reference domain stays order fulfilment, per blueprint §9.4,
because it has real invariants, real concurrency, real money arithmetic and a
real state machine.

Naming: the platform is **Bottega Academy**; the reference system is
**Bottega**, an order-fulfilment application. (`bottega` = workshop/small shop —
fits the domain, and the market this is aimed at.)

---

## Status: phases 1–4, 6, 8 and 9 complete

| # | Phase (blueprint §10) | Status |
|---|---|---|
| 1 | Collect the adverts, derive the manifest | **Done** |
| 2 | The shell — CSS, site.js, manifest, one chapter | **Done** |
| 3 | The engine, unchanged — store, quiz, learn, notes, the pages | **Done, verified in a browser** |
| 4 | Content in bulk — 47 chapters, ~430 questions | **Done** — 47 chapters of 47 written, every one with a full test |
| 5 | The deep course — 28 modules + GOLDEN-RULES.md | `GOLDEN-RULES.md` generated from the chapters; the modules are not written |
| 6 | The viva — deck generator, viva.html, simulate.html | **Done** — deck generated, viva and simulator have content |
| 7 | The accounts service (PHP) | Not started |
| 8 | Offline and install | Ported; cache name derived as `bottega.php-v19` from `subject.js` |
| 9 | The integrity gate — 11 checks + CI | **Done** — `tools/doctor.php`, 11 checks (3 not in the blueprint), CI runs it per subject |

### Measured counts, right now

| Thing | Now | Target (blueprint §12) |
|---|---:|---:|
| Site chapters (files + manifest entries) | 47 | 47 |
| Chapters actually written | **47** | 47 |
| Chapters that are honest placeholders | **0** | 0 |
| Quiz questions | 470 | 432 |
| Chapters with questions | 47 | 47 |
| Glossary terms | 133 | 133 |
| Glossary categories | 7 | — |
| Italian chapter panels | 31 | 31 |
| Italian phrases (in 8 groups) | 26 | — |
| Viva rules | 350 | 362 |
| Course modules (shape + writing order fixed) | 0 | 28 |
| API endpoints | 0 | 14 |
| Integrity checks (in `tools/doctor.php`) | 11 | 11 |

There are no placeholders left. Every chapter file carries real content in the
worked shape from `03-oop-in-php.html`: paired `.box.kid` / `.box.pro` on each
concept, a `.box.trap` for the mistake people actually make, runnable `.tryit`
code, `.rules`, and a `.qa` whose answer is sketched in Italian.

The retrieval loop is now closed. **Every chapter has at least ten questions**,
so there is no chapter you can read and not be tested on, and the mastery
formula — `0.25 if read + 0.75 × best test score` — can reach 100% anywhere in
the course rather than being capped at a quarter for three quarters of it.

The honesty rule (§9.5) now applies to two other lines. The **viva deck is
generated, not authored**: `tools/viva-extract.php` derives it from the `.rules`
block of each chapter, which is why its count is what the chapters happen to
contain rather than the blueprint's round target. And **`course/` still holds no
modules** — the deep course is the one content phase not started, and phases 7
and the reference system in `src/` have not been begun either.

---

## Phase 1 — the adverts (done)

The manifest was derived from PHP postings for Emilia-Romagna and Milano
collected in September 2026: a Bologna web agency (Laravel), a Modena software
house building gestionali, Zucchetti Axess in Bologna, and two consultancies
staffing client teams. Recurring requirement lines are quoted verbatim in
Italian in each chapter's `req` field.

**33 chapters answer an advert line. 14 carry an `extra`** explaining why they
exist although no advert asked. The home page renders those as two separate
tables from the manifest, so "nothing in the adverts is uncovered" stays
checkable rather than asserted.

The market differs from the .NET original in ways that shaped the map:
Laravel replaces ASP.NET, MySQL/MariaDB replaces SQL Server, and three whole
regional realities got their own chapters — WordPress (31), e-commerce (32),
and gestionali with `fatturazione elettronica`/SDI (33). Two more exist because
they are large, unglamorous parts of the actual job that no course covers:
legacy PHP migration (16b) and shared cPanel hosting (29b).

---

## Phases 2–3 — the platform (done, verified)

The engine ported **verbatim** as the blueprint predicted (§9.1) — it contains
no .NET-specific logic:

```
store.js  site.js  quiz.js  learn.js  viva.js  simulate.js
notes.js  account.js  auth-page.js  cv.js  italiano-panel.js
style.css  learn.css  sw.js
```

Rewritten for the subject: `chapters.js`, `quizzes-*.js`, `glossary.js`,
`italiano.js`, `index.html`, and the brand throughout (`bottega.profile.v1`,
`bottega.api.*`, and the cache name, which the restructure later moved into `subject.js`).

**Verified working in a browser**, not assumed: sidebar and search generated
from the manifest, chapter pages, the Both/Simple/Pro switch, the per-chapter
Italian panel, prev/next pager, the mastery pill computing `0.25 / 47 = 0.5%`
after one chapter read, and the full retrieval loop — start test → question 1/8
→ answer → "✓ Correct" with the `why` explanation → "I was sure" /
"I half-guessed" feeding the scheduler.

The mastery formula is intact from the blueprint (§4.3): `0.25 if read + 0.75 ×
best test score`, averaged over `window.CHAPTERS.length`.

---

## What to do next, in order

1. ~~**Write chapters.**~~ Done. All 47 follow the worked pattern from
   `03-oop-in-php.html`: `.box.kid` + `.box.pro` on every concept, `.box.trap`
   for the mistake people actually make, `.tryit` with runnable code, `.rules`,
   and a `.qa` with the answer sketched **in Italian**. The gate's `kid-pro`
   check passes across all of them, so the Simple/Pro switch cannot render an
   empty section (see postscript 2).
2. ~~**Questions.**~~ Done. Every chapter carries at least ten, so a full test
   runs anywhere in the course. Append-only still governs any further work here:
   ids are `<chapter-id>#<index>` and the index is the array position. Never
   reorder, never delete — that silently reassigns a learner's review schedule
   to the wrong questions. `tools/quiz-ids.lock` holds every id ever issued and
   the gate refuses to let one disappear.
3. ~~**The integrity gate, early.**~~ Done, and it earned its keep on this pass:
   see postscript 5.
4. ~~**The viva deck.**~~ Done, and it inverted the blueprint's arrow — see
   postscript 6. `course/viva-tiers.json` is the only hand-written part.
5. **The deep course** (`course/`), 28 modules in the five-part shape. Note that
   `GOLDEN-RULES.md` already exists and is generated from the chapters, so a
   module must not restate a rule: it links to it.
6. **The accounts service.** Slim 4 + PDO, per blueprint §9.2's recommendation:
   an explicit, readable middleware pipeline, about six files, no magic. The
   endpoint contract (§5.2), four-table schema (§5.3), six decisions (§5.4) and
   test list (§5.6) all transfer unchanged. Two PHP-specific changes to write up
   rather than make silently: `password_hash(PASSWORD_ARGON2ID)` removes the
   `PasswordSalt`/`PasswordIterations` columns, and `round()` is already half-up
   so it matches JavaScript without adjustment.
7. **The reference system** (`src/`), the Bottega order-fulfilment domain:
   `readonly` value objects with integer minor units, a backed enum state
   machine, optimistic concurrency via a `version` column, domain events inside
   the transaction, and a transactional outbox. Use `deptrac` for the
   architecture tests — it fails the build if the domain layer references the
   ORM, which is what the .NET architecture tests did.

---

## Decisions taken, and why

- **Slim 4 + PDO for the accounts API**, not Laravel. The service is portfolio
  code whose point is being readable end to end in one sitting; Laravel hides
  the middleware pipeline behind conventions, and the pipeline order *is* half
  of what the chapter on it teaches. If the adverts you are actually answering
  say Laravel, revisit this — the blueprint says to make the call deliberately
  and write down which way you went.
- **MySQL/MariaDB, not PostgreSQL.** It is what the PHP market runs.
- **The engine was not rewritten in a framework.** It is framework-free vanilla
  JS with no build step, which is exactly why it was portable in a single pass.
  Rewriting it in React would trade a working, offline-capable,
  `file://`-openable system for a toolchain.

## Known gaps — do not let these go quiet

- **`course/` has no modules.** The deep course is the one content phase not
  begun, and `course/README.md` still says so in its own words. The viva no
  longer depends on it — the deck is derived from the chapters instead — so this
  is now a gap in depth rather than a blocker for anything downstream.
- **`api/` and `src/` are empty.** The accounts service and the Bottega
  reference domain are phases 7 and beyond. Nothing on the site links into them,
  so their absence is honest rather than broken, but the blueprint's fourteen
  endpoints and the order-fulfilment domain do not exist.
- **Nobody has answered all 470 questions in a browser.** They are structurally
  verified — every `c` index is inside its own options array, every id is in the
  lock, the bank parses at runtime — and the wording of any individual `why` is
  asserted, not tested. The same caveat the chapters carry (postscript 5).
- **The service worker cache is derived but not content-hashed.** `sw.js` builds
  its name from `subject.js` (`key + "-v" + cacheVersion`), which removes the
  two-places problem but still requires a human to bump `cacheVersion` on a
  content change — bumped to 19 for this pass. Blueprint §11.4 wants it derived
  from a hash of the content; that remains unsolved, and the gate says so in its
  own output rather than claiming the check is stronger than it is.

Four gaps listed here previously have been closed and are recorded so the
document does not keep re-reporting them: the integrity gate now exists
(postscript 3); `cv.js` lints against this manifest's own chapter 36, which has
the content its rules refer to; the question bank now covers every chapter; and
`rules.js` is no longer an empty array.

---

## Postscript: the cache bug, hit on day one

Writing `03-oop-in-php.html` and reloading served the **old placeholder**. Not a
build error, not a 404 — the service worker is cache-first, the cache name had
not changed, so it correctly served what it had. Bumping `CACHE` in `sw.js` from
`bottega-academy-v1` to `-v2` fixed it.

This is blueprint §11.4 happening within an hour of the platform existing, which
is the argument for making it an integrity check rather than a discipline: the
failure is silent, it looks like your edit did nothing, and in production it
means returning visitors quietly read last month's chapters. Derive the cache
name from a content hash, or fail the build when site content changed and the
name did not.

---

## Postscript 2: the Simple/Pro switch was silently broken

After writing five more chapters, an audit found that five of the six had more
`pro` boxes than `kid` boxes. Blueprint §3.2 says every concept needs both, and
this is why: switching the top bar to **Simple** left "Facades" and "Validation
and form requests" as headings with *nothing underneath them*. No error, no
layout break — just a section that silently ceased to exist for anyone using the
switch as a self-test, which is its whole purpose.

Twelve `kid` boxes were added (`tools/add-kid-boxes.js`, a one-off) and the
invariant is now enforced in `tools/counts.js`: a chapter whose `kid` and `pro`
counts differ is an error, not a warning.

The blueprint's eleven checks do not include this one. It is the second defect
in this build that was invisible rather than loud — after the service-worker
cache — which is the pattern worth internalising: in a content system, the
failures that matter do not throw. They render something plausible and wrong.

---

## Postscript 3: building the gate, and the hole in the gate

`tools/doctor.php` now runs nine checks (blueprint §8 has eleven; the five that
need `course/`, `src/` and the viva deck cannot exist yet, and three of the nine
here are additions the blueprint does not have). Written in PHP, dependency-free,
so it runs on a machine with no Composer install.

It found real rot immediately: two dead links to chapters from the .NET original
(`12-ef-core.html`, `30-azure-devops-cicd.html`) still sitting in `account.html`,
and a link to `course/README.md`, which did not exist.

**It also had two bugs of its own, and one of them is the more interesting.**

1. The link checker scanned inside `<script>` blocks, so JavaScript that builds
   hrefs by concatenation (`'chapters/' + c.id + '.html'`) was reported as six
   broken links. Six false positives beside two real ones is how a gate teaches
   people to ignore it. Fixed by stripping script blocks first — and the fix
   itself then silently did nothing, because the regex had been written with a
   literal `0x08` backspace byte where `\b` was intended. It matched nothing,
   reported nothing, and looked correct in the source.

2. **The negative test is what earned its keep.** After the gate went green, four
   defects were introduced deliberately to check it would fail. Three were
   caught. The fourth — changing a number in the counts table — passed clean,
   because the prose scan looks for "&lt;n&gt; questions" and a table row puts the
   label first. The authoritative table, the thing a reader actually trusts, was
   the one part of the document nothing verified.

That is blueprint §11.2 recurring in a tool written specifically to avoid it: *a
gate that only inspects what it was told about reports green for the same reason
a missing gate does.* Every row of the counts table is now checked against a
measured value, and a renamed row raises a warning saying it has become
unchecked rather than disappearing quietly.

**The rule this build keeps re-learning:** verify a check by breaking something.
A gate that has never failed has not been tested, it has only been run.

---

## Postscript 4: the restructure, and the reason for it

This subject moved from `Desktop/PHP-Academy` to `Academy/subjects/php` when a
second subject was added. The reason was measurable rather than aesthetic: the
learning engine had been **copied**, and diffing the C# and PHP copies after
normalising the brand name gave **zero differing lines across eleven files**. A
third copy would have made every engine fix a three-place edit, and they would
have drifted in whichever direction the week's work pointed.

`/engine` is now the single source of truth, `tools/sync-engine.php` copies it
into each subject so every site stays self-contained and `file://`-openable, and
the gate fails on drift.

Making the engine genuinely subject-agnostic took more surgery than the diff
suggested, because the coupling was not in the logic — it was in **strings**:
seven `localStorage` keys, the service-worker cache name, the brand mark, and a
`dotnet run --project src/Bottega.Academy.Api` instruction still being shown to
PHP learners on the sign-in page. All of it now comes from `assets/subject.js`.

The `localStorage` namespace is the load-bearing part. Two subjects open in one
browser must not share a profile, so `subject.js` must load **before**
`store.js` — a late load falls back to a shared namespace and silently pools one
subject's progress with another's. That is check eleven, and it was
negative-tested.

**A note on tooling, for whoever hits it next.** Several edits in this session
were mangled by the shell heredoc collapsing `\` to `\`, which then became a
Python escape. It wrote a literal `0x08` backspace byte into a regex in
`doctor.php` — a check that silently matched nothing and looked correct in the
source — and later a real newline into the middle of a JavaScript string. Both
cost far more time than they should have. When scripting an edit that contains
backslashes, build them with `chr(92)` or verify the bytes afterwards.

---

## Postscript 5: finishing the chapters, and the third false positive

The remaining placeholders were written in one pass, taking the count to 47 of
47. The gate caught three things on the way, and two of them are the same defect
class this document keeps describing.

**1. The link checker reported two broken links that were code samples.** The
Blade chapter shows `href="{{ $url }}"` to explain that HTML escaping does not
make a `javascript:` URL safe; the WordPress chapter shows a `printf` containing
`href="%s"`. Neither is a link. This is *exactly* the failure recorded in
postscript 3 — the check had been taught to skip `<script>` blocks after
reporting six false positives, and nobody extended the same reasoning to
`<pre>` and `<code>`. The fix strips both, `<pre>` first so `<pre><code>` goes
in one piece.

It was negative-tested the way this build now insists on: a genuinely broken
`<a href>` was added to a chapter's prose, the gate failed on it, and the file
was restored. A check that only stops reporting is indistinguishable from a
check that stopped working.

**2. The prose scan caught a number in a heading this pass introduced.** The
status heading was rewritten to say that phase four's chapters were complete,
the noun-adjacent scan read the phase number as a chapter count, and it failed
— correctly, and on prose written seconds earlier. It is the inverted
check from §11.2 working on prose written minutes earlier by the person who
should most have known better — which is the argument for inverting it.

**3. The cache version needed bumping, again.** `cacheVersion` is now 8. This is
postscript 1 recurring: writing chapters and not bumping the cache means the
person testing the change reads the old one and concludes the edit did nothing.
It is derived rather than duplicated now, so it is one edit instead of two — but
it is still a thing a human must remember, and the gate still says so out loud
instead of pretending otherwise.

**What is deliberately not claimed.** The chapters are written and structurally
verified — manifest, filenames, script order, links, `kid`/`pro` pairing. Nobody
has read all 47 end to end in a browser, and no test can tell you whether the
prose teaches. The counts in this document are measured; the quality is
asserted.

---

## Postscript 6: the phase that was not blocked, and the lock that earned its keep

This pass closed phases 4 and 6: the question bank went from 70 to 470, every
chapter gained a bank of at least ten, and the viva deck went from an empty
array to a generated one.

**The planning error worth recording.** This document listed the viva deck as
step five, behind the deep course, because blueprint §3.4 has `GOLDEN-RULES.md`
authored by hand and `rules.js` generated from it. That is true of the C#
subject, where the course was written first. It is not true here, and
`tools/viva-extract.php` already knew it: the arrow runs the other way, from the
`.rules` block of each chapter into the markdown. So the whole of phase 6 cost
one hand-written file — `course/viva-tiers.json`, twelve slugs and six — and two
commands. It had been sitting behind a phase it did not depend on, and nobody
checked. Read the tool before scheduling the work it does.

**The append-only lock was exercised for real, and it held.** Twelve chapters
already had questions, and bringing them to the same floor meant adding to
arrays whose indices are somebody's review schedule. The additions went in
before each block's closing bracket, never among the existing entries, so every
previously issued id still points at the question it was issued for. The gate
then confirmed it rather than taking anyone's word: 400 new ids appended, zero
missing. This is the first pass where that check could have failed, which means
it is the first pass where it demonstrated anything.

**And the counts table failed before it passed.** Splicing the content in and
running the gate produced four errors — quiz questions, chapters with questions,
glossary terms, Italian panels — each naming the measured value against the
stale one. That is postscript 3's fix doing exactly the job it was added for, on
the document most likely to rot, without anyone having to remember the table
existed.

**What is deliberately not claimed.** The bank is structurally verified: every
`c` index lies inside its own options array, every id is in the lock, all three
files parse at runtime and the chapter keys all exist in the manifest. Nobody
has sat and answered 470 questions in a browser, and no check can tell you
whether a distractor is plausible or a `why` actually explains. Measured counts,
asserted quality — the same line this document has drawn since the chapters.

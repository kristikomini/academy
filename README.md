# Academy

Interview-preparation platforms for the Emilia-Romagna developer market, one per
subject, sharing one learning engine.

```
Academy/
  engine/               THE ENGINE. One copy. Subject-agnostic. The source of truth.
  subjects/
    php/                Bottega Academy — PHP        (chapters, questions and viva complete)
  tools/
    doctor.php          the integrity gate — run it before you trust anything
    sync-engine.php     copies /engine into each subject; --check reports drift
    gen-chapters.js     generates skeleton chapter files from a manifest
  docs/                 BUILD-STATUS-<subject>.md — honest status per subject
```

Two further academies are **complete** and live outside this structure:

| Subject | Where | Size |
|---|---|---|
| **C#/.NET** | `Desktop/C#` | 47 chapters, 432 questions, 362 viva rules |
| **SQL** | `Downloads/SQL` | 52 chapters, 529 questions, 456 viva rules |

Both predate this layout and are deliberately untouched: they are finished and
working, and migrating a finished thing to a new storage schema buys nothing.
Each carries its own copy of the engine, so fixes to `/engine` do not reach them
— acceptable while they are frozen, and the reason to bring them under
`/engine` is the next time either one needs an edit, not before.

---

## The one architectural decision

The learning engine is genuinely subject-independent. Diffing the C# and PHP
copies after normalising the brand name gave **zero differing lines** across
eleven files. So every subject wants the same engine, and both obvious ways of
arranging that are wrong:

- A **shared folder referenced by relative path** breaks the property the whole
  design rests on — each site must open from `file://` and deploy on its own,
  with no build step.
- **Independent copies drift.** Silently, and in the direction of whichever
  subject you happened to be working on that week.

So: `/engine` is the single source of truth, `tools/sync-engine.php` copies it
into each subject, and `tools/doctor.php` **fails the build** when a subject's
copy no longer matches. Each site stays self-contained; drift becomes an error
instead of a discovery.

**Never edit an engine file inside a subject.** The next sync overwrites it. Edit
`/engine`, then sync.

## What is subject-owned

Everything the engine is not: `chapters.js`, `quizzes-*.js`, `glossary.js`,
`italiano.js`, `rules.js`, every chapter page, the prose on every top-level page
— and `assets/subject.js`, which carries the strings and, critically, the
**localStorage namespace**.

That namespace is load-bearing. Two subjects open in the same browser must not
share a profile, so each declares its own `key` (`bottega.php`, and one per
subject added later).
`subject.js` must load **before** `store.js`, and the gate fails any page where
it does not — a late load silently falls back to a shared `academy` namespace and
pools one subject's progress with another's.

Theme and the Simple/Pro switch are deliberately **global** (`academy-theme`,
`academy-mode`): a display preference should survive switching subject. Progress,
review schedules, CV drafts and API sessions are per-subject.

## Running one

```bash
python -m http.server 8099 --directory subjects/php/site
```

Or just open `subjects/php/site/index.html` — there is no build step, and the
site works from `file://`.

## Before you trust anything

```bash
php tools/doctor.php php
php tools/sync-engine.php --check
```

The gate runs eleven checks. Three of them are not in the original blueprint and
exist because the defect happened here first: engine drift, `subject.js` load
order, and `kid`/`pro` box pairing. Every one of them fails silently in
production if unchecked — which is the whole argument for the gate.

**Verify a check by breaking something.** A gate that has never failed has not
been tested, it has only been run. Each check in `doctor.php` has been confirmed
to fail on a deliberately introduced defect; one of them — the counts table —
only started working *because* that test was run.

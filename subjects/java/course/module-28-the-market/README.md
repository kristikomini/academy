# Module 28 — The code you inherit, and the job you are applying for

> Site chapters: [45 — Java EE, Jakarta and the code you will inherit](../../site/chapters/45-legacy-java-ee.html),
> [47 — Gestionali, ERP integrations and the Italian software house](../../site/chapters/47-gestionali.html),
> [50 — The CV and the ATS](../../site/chapters/50-the-cv.html),
> [51 — The interview](../../site/chapters/51-the-interview.html)
>
> Code: none. This module is about everything around it.

*The last module, and the one most likely to change the outcome. Twenty-seven modules of
technique matter only if somebody reads your CV and then talks to you.*

---

## 1. The idea

### The code you will inherit

The reference system in `../src/` is a clean-architecture Spring Boot 3 application on
Java 21. **Almost nothing you are hired to work on will look like it.**

What you will actually meet in Emilia-Romagna:

- **EJB, CDI and container-managed transactions.** These are the same concepts as
  `@Service`, `@Autowired` and `@Transactional`, with different names and more XML.
  Recognising that is most of the job — a stateless session bean is a singleton service,
  and container-managed transactions are `@Transactional` with the boundary declared
  somewhere else.
- **JSF.** Stateful, server-side, component-based, and nothing like an SPA. The mental
  model is closer to Swing than to React: there is a component tree on the server, and it
  has a lifecycle you have to learn.
- **`javax` → `jakarta`.** The reason a great many systems are stuck on Java 8 or 11. It
  is a package rename, so it looks trivial and is not: every dependency has to have a
  Jakarta build, and rename tools miss the names inside strings — `Class.forName`,
  persistence.xml, Spring XML config, log configuration.

**Strangler, not rewrite.** Put the new thing in front, route one endpoint at a time to
it, and let the old system shrink. A big-bang rewrite competes with a moving target and
loses. And **characterisation tests first**: before changing legacy code, write tests that
record what it currently does — not what it should do. Then you can tell a change from a
regression.

Be genuinely willing to say this in an interview. "I would want to understand why it is
like that before proposing to replace it" is a much stronger signal than enthusiasm for a
rewrite.

### The Italian software house

**Gestionale describes the job.** It is a management system — orders, stock, invoicing,
production — and it is what an enormous share of the region's software actually is. The
reference system in this repository is a gestionale in miniature, which was not an
accident.

- **Fatturazione elettronica is XML through SDI.** Electronic invoicing is mandatory, the
  format is defined by the Agenzia delle Entrate, and it is a real integration with
  validation rules and rejection codes.
- **Invoice numbering is a legal constraint**, not a business preference. Sequential, no
  gaps, per year. It is one of the few places where "we will just use a UUID" is actually
  illegal.
- **Integrations arrive as CSV, SFTP or a database view.** Not a REST API. A nightly file
  drop is a normal, current integration pattern, not a legacy embarrassment.
- **The spreadsheet is the specification.** Somebody in the warehouse has an Excel file
  that encodes fifteen years of business rules. Read it. It is the requirements document,
  and it is more accurate than anything you will be handed.

**Curiosity about the domain is a differentiator.** Most candidates talk only about
technology. Asking how orders actually flow through the warehouse puts you in a different
category, and it is not a trick — you will do the job better.

### The CV

**Single column, real text, standard headings.** An ATS parses your PDF before a human
sees it. Two columns often interleave into nonsense. Text in a graphic is invisible.
Headings it recognises — *Esperienza*, *Competenze*, *Formazione* — get parsed into the
right fields.

**Verify the extracted text layer.** Open your own PDF, select all, copy, paste into a
text editor. That is roughly what the ATS sees. If it is scrambled, the ATS sees scrambled
too — and this takes thirty seconds to check and almost nobody does it.

**Use the advert's exact words for things you have really done.** If it says "Spring
Boot", write "Spring Boot", not "Spring ecosystem". Keyword matching is real, and this is
not gaming it — it is answering the question that was asked. The "really done" half is
not negotiable.

**Outcome plus evidence, not responsibilities.** "Responsible for the order service" says
nothing. "Reduced the order list endpoint from 21 queries to 1, cutting p95 from 800 ms to
90 ms" says what you did and invites the follow-up.

**Every number invites a question.** So only write numbers you can talk about for five
minutes. This module's own project is a good source of them, because you measured them:
the N+1, the collection benchmark, the lost increments.

**Photo for Italian SMEs, none for international.** Local convention still expects one;
international and larger companies increasingly do not.

### The interview

**Two minutes for *mi parli un po' di lei*.** Not your life story: where you are now, one
or two things you have built, why this role. Rehearse it out loud — it is the only
question guaranteed to be asked, and the only one people reliably fumble.

**Answer with a structure.** For a technical question: what it is, why it matters, the
trade-off, an example. For an experience question, STAR. Structure is what makes an answer
sound considered rather than remembered.

**Think out loud.** In a system-design or debugging question, silence is unreadable. Say
what you are considering and why you are discarding it.

**"I do not know, but…" beats a confident guess.** Then say how you would find out. Every
interviewer has met the candidate who invents an answer, and it ends the conversation
badly.

**Never oversell.** If your CV says Kafka and you have run a tutorial, say exactly that.
The follow-up question is coming, and being caught short is worse than the gap.

**RAL as a gross annual range.** Know your number before the first call. In Italy the
figure discussed is RAL — gross annual, before tax, usually across 13 or 14 mensilità, so
confirm which.

**Always have questions.** Who owns the architecture decisions? What does a normal week
look like? What is the oldest code I would touch? How do you handle deployments? Not
having any reads as not being interested.

### Il colloquio è in italiano

The interview will be in Italian; the technical vocabulary stays English. Nobody says
*iniezione delle dipendenze*.

Two false friends worth burning in, because they invert your meaning:
**eventually ≠ eventualmente** (*eventualmente* = if necessary; eventually =
*alla fine*), and **actually ≠ attualmente** (*attualmente* = currently; actually =
*in realtà*).

And ask for repetition without apologising: *"Può ripetere, per favore?"* is a normal
sentence, not a confession.

---

## 2. In this codebase

**Nothing, and that is the point.** This module is the one place the course stops being
about Java.

But the project is the raw material for most of what is above, and that is worth being
explicit about — because the hardest part of a CV is having something concrete to put on
it:

| CV or interview material | Where it came from |
|---|---|
| "Reduced a list endpoint from 21 queries to 1" | [`NPlusOneTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/NPlusOneTest.java) — measured, not estimated |
| "Implemented a transactional outbox for reliable event publishing" | [module 26](../module-26-messaging-and-the-outbox/) |
| "Optimistic concurrency with a 409 rather than lost updates" | [module 23](../module-23-transactions/) |
| "Kept the domain framework-free, enforced by the build" | `ordini-domain`'s pom |
| A gestionale, in miniature | the whole of `../src/` |

Every one of those is something you can be asked about for five minutes and answer from
memory, because you built it and measured it. That is the difference between a project on
a CV and a project that survives the follow-up question.

---

## 3. Do it

**Lab A — read your own CV as a machine.**

Open your PDF, select all, copy, paste into a plain text editor. Is it in order? Are the
headings intact? Did the two-column layout interleave? Fix whatever is scrambled — this is
thirty seconds of work that determines whether a human ever sees it.

**Lab B — rewrite three bullets.**

Take three lines from your CV that describe responsibilities and rewrite them as outcome
plus evidence. Then, for each number you wrote, talk about it out loud for two minutes. If
you cannot, take the number out.

**Lab C — record *mi parli di lei*.**

In Italian, out loud, recorded, twice. Listen back to the first one; it will be too long
and will start too far in the past. The second will be better. That is the whole lab and
it is worth more than most technical preparation.

**Lab D — the honest audit.**

Go through the twenty-eight modules and mark each one: *could explain in an interview*,
*could recognise*, *have not read*. Then look at the first column and check that your CV
claims nothing outside it. That list is also your revision plan, and the viva deck at
`site/viva.html` drills exactly these rules.

**Lab E — prepare the domain questions.**

Write five questions about the business, not the stack, for a company that builds
gestionali. "How does an order reach the warehouse today?" "Who decides invoice
numbering?" "What is the oldest system this has to talk to?" Ask them. Watch what happens
to the conversation.

**Lab F — the legacy sentence.**

Prepare an answer to "our system is Java 8, JSF and EJB — how would you approach it?"
Structure it: understand first, characterisation tests, strangler at the edges, and the
`javax`/`jakarta` migration as the thing that unblocks the rest. Being able to say that
calmly is worth more than any framework on your CV.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:45,47,50,51 -->
**Chapter 45 — Java EE, Jakarta and the code you will inherit**

1. **EJB, CDI and container-managed transactions are the same concerns Spring later solved.**
2. **JSF is stateful, server-side and nothing like an SPA.** Do not reason about it as one.
3. **javax → jakarta is the reason many systems are stuck.** Boot 3 requires the new namespace.
4. **Rename tools miss strings** XML, persistence.xml, reflection.
5. **Strangler, not rewrite.** Facade in front, move one capability at a time.
6. **Characterisation tests first.** The behaviour is the specification.

**Chapter 47 — Gestionali, ERP integrations and the Italian software house**

1. **Gestionale describes the job.** Learn the domain vocabulary before the first call.
2. **Fatturazione elettronica is XML through SDI,** asynchronous, with receipts and deadlines.
3. **Invoice numbering is a legal constraint,** not an application detail.
4. **Integrations arrive as CSV, SFTP or a database view.** Meet the other side where it is.
5. **The spreadsheet is the specification.** Ask domain questions early, and write the answers down.
6. **Curiosity about the domain is a differentiator.** Most candidates only ask about the stack.

**Chapter 50 — The CV and the ATS**

1. **Single column, real text, standard headings.** The parser is not clever.
2. **Use the advert’s exact words for things you have really done.** Alignment, never stuffing.
3. **Verify the extracted text layer.** Layout changes can reorder it silently.
4. **Outcome plus evidence, not responsibilities.**
5. **Every number invites a question.** Only claim what you can defend.
6. **Photo for Italian SMEs, none for international.** Keep both versions maintained.

**Chapter 51 — The interview**

1. **Two minutes for mi parli di lei,** ending on why this role.
2. **Answer with a structure** mechanism, consequence, example.
3. **“I do not know, but…” beats a confident guess.** Every time.
4. **Think out loud.** The process is what is being assessed.
5. **Never oversell.** An inflated claim makes your true ones suspect.
6. **RAL as a gross annual range,** and ask about CCNL, level and mensilità.
7. **Always have questions.** Ask how a change reaches production.
<!-- /CARD -->

---

## 5. Interview questions

**"Mi parli un po' di lei."** — Two minutes. Where you are now, one or two things you have
built, why this role. Rehearsed out loud, not written down and read.

**"Il nostro sistema è Java 8 con JSF ed EJB. Come lo affronterebbe?"** — Understand why it
is like that before proposing anything. Characterisation tests to record current
behaviour, then strangler at the edges — new functionality in front, one endpoint at a
time. And name the real blocker: `javax` → `jakarta`, which looks like a rename and is a
dependency-graph problem, with rename tools missing the names inside strings.

**"Conosce la fatturazione elettronica?"** — XML through SDI, mandated, with validation
rules and rejection codes — and invoice numbering as a legal constraint rather than a
design choice: sequential, no gaps, per year. If you have not built one, say so and say
that, which shows you know what the work involves.

**"Che stipendio cerca?"** — A gross annual range, and confirm whether it is 13 or 14
mensilità. Know the number before the first call rather than inventing it live.

**"Ha domande per noi?"** — Always yes. Who owns architecture decisions, what a normal week
looks like, what the oldest code you would touch is, how deployments work. Not having any
reads as not being interested.

**"Qual è il suo punto debole?"** — Something real, with what you are doing about it. "I had
not operated a system at scale until this project, so I built one with a transactional
outbox and optimistic concurrency and measured the N+1 rather than guessing at it" is a
weakness answer that is really a strength answer, and it is true.

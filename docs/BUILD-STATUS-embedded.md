# Centralina Academy — build plan and honest status

A C and C++ embedded-firmware build of the LogiFlow Academy platform, following
`Desktop/C#/docs/BLUEPRINT.md` §10 (build order) and §12 (the numbers to hit).

**Every number in this file was measured, not estimated.** Regenerate them with
`php tools/doctor.php embedded` before editing any of them — the blueprint's integrity
gate (§8, check 11) exists because prose counts rot silently, and this document is the
most likely place for that to happen first.

> **Do not write a target as a number next to the word *chapters* or *questions* in
> prose anywhere in this file.** The doctor's count check scans for exactly that shape
> and compares it against reality, and its allowlist is hard-coded for another subject.
> Targets belong in the Target column of a table, where the scan does not reach.

---

## What this is

The same two-system design as the original: a **tutorial platform** (static,
framework-free, offline-capable, `file://`-openable) wrapped around a **reference
application** — which for this subject does not exist and may never need to.

Naming: the platform is **Centralina Academy**. *Centralina* is what an Italian
technician calls the box this course is about — an electronic control unit. It is the
object on the bench, which is the mental model the subject is trying to install.

Namespace `centralina.embedded`, accent `#2E6B41` (solder-mask green, darkened until it
passes 4.5:1), domain `embedded.testdemo.it`, worker `centralina-academy`.

---

## The thing to read before anything else

**This subject is the first one written by somebody who was not already working in it.**
The other five academies were a practitioner systematising a subject for interviews. This
one is not, and pretending otherwise would be the fastest way to make it useless.

Three consequences, all deliberate and all visible on the site itself:

1. **Every claim is checkable against a datasheet, a reference manual or a standard, and
   the chapter says which.** Where the other subjects could lean on remembered production
   experience, this one cites. That is a constraint on how chapters get written here, not
   a disclaimer.

2. **There is a hardware boundary a website cannot cross, and it is stated on the front
   page** rather than discovered in an interview. Reading about DMA is not watching a
   transfer half-complete at 3 a.m. Most `.tryit` blocks deliberately run on a PC with
   nothing but a compiler, so the course is not gated behind owning a board; the ones that
   genuinely need hardware say so, and chapter 70 is about what that means for a CV.

3. **The `extra`-to-`req` ratio is high, and that is the finding.** The anchor advert asks
   for "programmazione in C (e C++) in ambito embedded" in eleven words. Parts 1 to 4 are
   the expansion of those eleven words, and a chapter only carries a `req` if a real advert
   line asked for *that*.

---

## Status: phase 4 in progress — the shell and the engine are done, the prose is not

| # | Phase (blueprint §10) | Status |
|---|---|---|
| 1 | Collect the adverts, derive the manifest | **Done** — 1 anchor posting + regional market scan |
| 2 | The shell — CSS, site.js, manifest, one chapter | **Done** — engine synced, every chapter file generated |
| 3 | The engine, unchanged — store, quiz, learn, notes, the pages | **Done** — synced from `/engine`, 14 files match |
| 4 | Content in bulk — the prose and the question bank | **In progress** — see the table below |
| 5 | The deep course + GOLDEN-RULES.md | Not started |
| 6 | The viva — deck generator, viva.html, simulate.html | Blocked on phase 4 prose (`.rules` blocks are the source) |
| 7 | The accounts service | Not started, and deliberately so — `apiBase` is empty |
| 8 | Offline and install | Ported; cache `centralina.embedded-v4` |
| 9 | Deploy | Not deployed — no wrangler run, no DNS record yet |

---

## The measured counts

| Thing | Count | Target |
|---|---|---|
| Site chapters (files + manifest entries) | 75 | 75 |
| Chapters actually written | **43** | 75 |
| Chapters that are honest placeholders | **32** | 0 |
| Quiz questions | 407 | ~750 |
| Chapters with questions | 43 | 75 |
| Glossary terms | 0 | ~130 |
| Italian chapter panels | 0 | ~30 |

A placeholder here is labelled as one *on its own page* — it says it is not written, names
its planned coverage, and does not pad itself out with filler that would read as content.
That is the generator's design (`tools/gen-chapters.js`) and it should stay that way.

### Which chapters are written

Chosen as the spine of the course rather than as a contiguous block: the ones an interviewer is
most likely to reach for, plus the two ends of the arc. **Parts 4, 5, 6 and 7 are now complete** —
every chapter in them has prose, a Try-it, golden rules, an Italian panel and questions. Parts 6
and 7 came first because an interviewer reaches for an RTOS and a protocol long before reaching
for `constexpr`; Parts 4 and 5 followed because they are the expansion of the advert's own
*ambiente di sviluppo STM32*.

| Ch | Title | Why this one first |
|---|---|---|
| 00 | The job posting, and the boundary of this course | The frame for everything else, and where the hardware boundary is declared |
| 03 | Types, sizes, and the integer rules that catch everyone | The half of C candidates claim and cannot defend |
| 06 | const, volatile, and the compiler that deleted your poll loop | The most frequently asked single question in embedded hiring, worldwide |
| 11 | Why embedded code avoids malloc | A house rule nobody writes in an advert and everybody asks about |
| 21 | What is actually on the die | The block diagram everything else is a detail of, and the disabled-clock trap |
| 22 | ARM Cortex-M: core, modes, registers | The most portable knowledge in the course, and the fault-debugging recipe |
| 23 | Memory-mapped I/O and the peripheral register | A pin is an address — the idea the whole field is built on |
| 24 | The startup path: reset vector to main | The first place to look when a board does nothing, and where beginners never look |
| 25 | Clocks and PLLs | The most common cause of a peripheral that is configured correctly and does nothing |
| 26 | Interrupts, the NVIC and the rules for an ISR | Everything in Part 6 assumes it |
| 27 | DMA | What makes a fast link and an idle CPU compatible, plus the cache-coherency bug |
| 28 | Low power, sleep modes and the watchdog | The watchdog half is universal, and the timer-ISR kick is the clearest self-defeating pattern in firmware |
| 29 | The STM32 family, and choosing a part | The advert's STM32 line, silicon half: how to choose, and why speed is the wrong axis |
| 30 | CubeMX, CubeIDE, HAL, LL and the bare registers | The advert's one hard technical gate, and a question with a wrong confident answer in both directions |
| 31 | GPIO | The first peripheral anyone touches, and BSRR is the concurrency lesson in one register |
| 32 | Timers, PWM and input capture | Pumps and fans out, tachometer in, and the ADC trigger that makes a control loop real |
| 33 | ADC, DAC and the analogue front end | Sampling time, the reference, and looking at raw samples before filtering |
| 34 | Flash, option bytes and the bootloader | Field update, and the power-cut test almost nobody runs |
| 35 | Designing the software architecture of a firmware project | Both adverts use the word *architettura*, and this is the only chapter that answers it |
| 36 | Makefile, CMake and the linker script | The *build e integrazione* line, and the file that decides whether the program fits |
| 37 | What 'real-time' actually means | The answer most likely to be scored, because "fast" is wrong and common |
| 38 | Superloop or RTOS: choosing honestly | Regional listings ask for bare-metal *and* RTOS; arguing either side beats preferring one |
| 39 | Tasks, the scheduler and priorities | The concrete half of chapter 37 — the mechanism you use to meet the deadline |
| 40 | Queues, semaphores and mutexes | The most common RTOS design error, and the setup for chapter 41 |
| 41 | Priority inversion, and the rover that rebooted | The canonical follow-up to any mutex answer |
| 42 | Interrupts and the RTOS: the FromISR rule | The first thing that goes wrong on a real RTOS project, and it fails quietly |
| 43 | Timing, jitter, and how you measure it | The advert says *ottimizzare*, and you cannot optimise what you have not measured |
| 44 | FreeRTOS concretely, and what else exists | An advert saying "an RTOS" means FreeRTOS three times in four |
| 45 | The physical layer, and why RS-485 | The word *approfondita* starts one layer below HAL_UART_Transmit |
| 46 | UART | Everything in chapter 50 runs on top of it |
| 47 | Framing: knowing where a message starts | Most of what *e testare* in the advert actually costs |
| 48 | SPI and I2C | Every sensor on the proprietary board speaks one of the two |
| 49 | CAN and CANopen | The usual answer when a machine has intelligent actuators |
| 49a | ISO-TP: more than eight bytes over CAN | The layer a candidate who says "CAN and UDS" is expected to be able to name |
| 49b | UDS: the diagnostic language of the ECU | The one line of the automotive advert nothing else in this course answers |
| 50 | Modbus RTU | The most probable protocol between this board and that PLC |
| 56 | What a PLC is, for a firmware engineer | The seam the anchor advert is really hiring for |
| 58 | Talking to the PLC: who is master, and what happens when the link drops | The integration design conversation, which is the advert's word *configurare* |
| 64a | The automotive V-cycle: requirements, architecture, integration | The *build e integrazione* job, which is a different seat from the rest of this course |
| 66 | Git, code review and the release | *Dimestichezza con Git* is the modest half; knowing what is in the field is the half that separates candidates |
| 67 | Technical English | Both adverts ask for it, one of them as *fluente*, and it is tested by switching language mid-interview |
| 70 | The CV and the ATS | Where the hardware boundary becomes a sentence you can defend |
| 71 | The interview, the contract and the RAL | CCNL, 13 mensilità, apprendistato, and the questions to ask them |

Everything else is a labelled placeholder. Writing order from here should follow the same
logic: **Part 6 and Part 7 before Part 3**, because an interviewer asks about an RTOS and a
protocol long before asking about `constexpr`.

**The three lettered chapters were inserted, not appended, and that is why they are lettered.**
A question's id is `<chapter-id>#<index>`, so renumbering 50 to 71 in order to open a gap after
49 would rename every file below it and break `quiz-ids.lock` — somebody's review schedule
against every chapter in Parts 8 to 11. LogiFlow already solved this with 32b/32c/32d; the same
idiom is used here. **Never renumber to insert.**

**The four chapters named verbatim by the second advert — 35, 36, 66 and 67 — were written on
2026-09-16**, immediately after 49a/49b/64a, for the same reason: architecture, build, Git and
English are asked for by *both* adverts and were the last placeholders among the lines either
one actually writes down. With them, **every line of the automotive advert now has written
prose behind it**, and the anchor advert's `req` set is complete except for the C and C++
expansion in Parts 1 to 3.

**Parts 4 and 5 were then completed on 2026-09-16** — 21, 22, 25, 28, 29, 31, 32, 33 and 34 —
which closes the STM32 half of the anchor advert. With Parts 4 to 7 done, a reader can go from
a block diagram to a working peripheral to a protocol on the wire without meeting a placeholder.

**Remaining, in writing order: Part 10 (60–65), Part 9 (57, 59), Part 8 (51–55), Parts 1 and 2
(01, 02, 04, 05, 07–10, 12–14), Part 11 (68, 69), then Part 3 (15–20).** Part 3 is last on
purpose: C++ on a microcontroller is the least-asked topic in this market, and chapter 15
already frames the trade.

---

## The corpus

**The anchor advert.** Formigine (MO), a manufacturer of liquid-cooling components and
systems for electrical and electronic devices, hiring an **Embedded Software Engineer**
*"inserito in un percorso di formazione"* who will work *"sia su firmware di sistemi
embedded, che su software PLC"*. CCNL Metalmeccanica Aziende Industriali, 13 mensilità,
RAL 26–32K, full time 08.30–17.30, initial fixed term or apprendistato, *inquadramento*
Impiegato, no direct reports.

It is unusually explicit — most firmware adverts write "C/C++, RTOS, STM32" and stop —
which is why a fifth of the manifest can quote a line of it verbatim.

**The surrounding market**, collected the same day (September 2026) across Modena and
Emilia-Romagna firmware listings. It converges on a set the anchor advert does not name:
bare-metal *and* FreeRTOS, ARM Cortex-M (STM32, NXP), Modbus RTU/TCP, CANopen, EtherCAT,
PROFINET, EtherNet/IP, OPC UA, embedded Linux with Yocto or Buildroot, MISRA C with static
analysis, IEC 61508 functional safety, Git, written test plans, and hardware bring-up with
an oscilloscope and a logic analyser. Those are `extra`, not `req` — but they are why the
course is this long.

**The second advert**, September 2026, and deliberately *not* promoted to `req`. An
**Embedded Integration Engineer** at a large engineering services company, Automotive, on
*"sistemi embedded per applicazioni di propulsion"*: *"progettare, sviluppare e mantenere
requisiti e architetture software"*, *"implementare e integrare componenti software"*,
*"supportare le attività di build e integrazione software"*, *"esperienza in attività di
integrazione software/hardware embedded"*, *"comprensione del linguaggio C"*, *"protocolli di
comunicazione, quali CAN e UDS"*, Git, fluent English, STEM degree, up to two years.

Almost all of it already had a chapter — C is Parts 1 and 2, hardware/software integration is
Parts 4, 5 and 10, CAN is 49, Git is 66, English is 67, the architecture line is 35 and the
build line is 36. **Three things existed nowhere and were added: 49a (ISO-TP), 49b (UDS) and
64a (the automotive V-cycle).** They carry `extra` rather than `req` on purpose: `index.html`
states *"one posting"* and *"nothing in the advert is left uncovered"*, and the coverage table
is generated from the `req` fields, so a `req` sourced from a different advert would quietly
turn a true claim into a false one. Each of the three names this advert in its own *From the
advert* box, which is honest at the point a reader is actually standing.

---

## Two seams with work that already exists. Do not let them converge.

**LogiFlow (the C# academy), chapters 32b/32c/32d.** Modbus register maps, line and AGV
deadlock, and serial framing with RS-485 and CAN — all of it *from the PC side*, a .NET
application talking to a machine it does not control. Part 7 here is the same wire seen
from the firmware side, where the timing and the buffer are yours. Chapter 32d also
carries the advert-triage table that separates a C#/.NET machine-interfacing job from a
C/C++ firmware one; **this course is what you do once that table says "firmware"**.

If a chapter here starts explaining how to write a C# client, delete it — that chapter
exists, somewhere else.

**`Desktop/plc-lab`.** Five IEC 61131-3 Structured Text programs, each ending in a
deliberate-breakage exercise. Part 9 covers only as much of the PLC world as a firmware
engineer needs in order to be the device on the other end of the cable; it points at the
lab rather than restating it, and **this course is not an attempt to turn anybody into a
PLC programmer**. That framing is deliberate and was decided before this subject existed.

Note that `plc-lab` is a **private** repository. Nothing on this public site may link to
it or name a GitHub account — see the de-personalisation decision recorded for the hub and
the other five courses.

---

## Decisions worth not relitigating

**Why a sixth subject rather than a part inside LogiFlow.** The PLC course was previously
scoped as a new Part inside LogiFlow, on the grounds that ladder is graphical and the
Academy engine gives nothing for drawing it. That reasoning does not transfer here: C and
C++ are text, the engine handles them perfectly, and this is a whole language plus a
hardware model plus an RTOS plus two protocol families. It is the same size as Java or
PHP, not the size of a Part.

**`apiBase` is empty on purpose.** No accounts service is deployed, and borrowing another
subject's would be wrong: each instance owns its own user table, and its chapter count is
the denominator for every mastery percentage, so this subject's learners would be scored
against another subject's chapters. Everything except sign-in, cross-device sync and the
leaderboard works without one, and `account.js` says so in plain words.

**Scaled integers over floats, latched status, sequence-numbered commands, heartbeat
counters.** Chapter 58's golden rules are opinions, stated as rules. They are the
conventional answers in Italian machine building and they are defensible in an interview,
but a house style elsewhere may differ — which is fine, and the chapter says the document
is the contract rather than the convention.

---

## Known gaps, in the order they should be closed

1. **The prose.** Thirty-two labelled placeholders. Parts 4, 5, 6 and 7 are complete, as are
   the advert-named chapters (35, 36, 66, 67, plus 49a/49b/64a). Remaining order: Part 10
   (60–65), Part 9 (57, 59), Part 8 (51–55), Parts 1 and 2, Part 11 (68, 69), then Part 3.
2. **The question bank.** Questions exist only for written chapters, because a question
   written against a placeholder is a question written against nothing.
3. **`glossary.js` is categories only.** The contract and process vocabulary (RAL, CCNL,
   *colloquio conoscitivo*, *presa in carico*) is identical across subjects and could be
   lifted — but its `where` fields point at another subject's chapter numbers, and a
   glossary whose cross-references are silently wrong is exactly the rot the doctor exists
   to prevent. Copy it when the numbers are remapped, not before. The **industrial half**
   (*quadro*, *morsettiera*, *bordo macchina*, *fermo impianto*, *collaudo*) has no
   equivalent anywhere in the Academy and must be written from scratch.
4. **`italiano.js` is empty**, so no chapter shows the Italian panel. Coverage was designed
   to be partial precisely so that this is the correct failure mode rather than a broken one.
5. **The viva deck.** `course/GOLDEN-RULES.md` and `site/assets/rules.js` are both
   **generated** — `viva-extract.php` then `viva-deck.php`. The only hand-written input is
   `course/viva-tiers.json`. Do not hand-write either output. This cannot usefully run until
   more `.rules` blocks exist.
6. **Verified in a browser** on 2026-09-14, via `centralina-academy` on port 8107 in
   `Desktop/Kristi Komini/.claude/launch.json`. Navigation, the coverage and beyond tables,
   the brand accent, the service worker and the full quiz loop all work. Two engine
   behaviours that look like faults and are not: `learn.js` *removes* `#toc` on a chapter
   with few `h2`s, and the quiz injects its own `h2#test-yourself`.
7. **Not deployed.** `wrangler.jsonc` is configured for `embedded.testdemo.it` but has never
   been run, and the subject is not in the CI matrix.
8. **`api/` and `src/` are empty directories**, as in the kafka subject. That is a decision,
   not an oversight.

---

## Gates, and how to run them

```
php tools/sync-engine.php --check        # engine drift across all subjects
php tools/sync-engine.php embedded       # copy /engine in
php tools/doctor.php embedded            # the 12-check integrity gate
php tools/doctor.php embedded --fix-lock # append new question ids to quiz-ids.lock
node tools/gen-chapters.js embedded      # generate any missing chapter shells
php tools/head-brand.php embedded        # restamp the accent into every head
php tools/head-theme.php embedded        # restamp the theme-boot script
```

**Never edit an engine file inside this subject** — edit `/engine`, then sync. The doctor
fails the build when a copy has drifted.

**Bump `cacheVersion` in `site/assets/subject.js` on every content change.** `sw.js` builds
its cache name from it, and `site.js` registers `sw.js?v=<cacheVersion>` because `sw.js`
itself never changes when content does — so without the bump the browser's byte comparison
of the registered script would never notice. Do not tidy that query string away.

**`site/404.html` is in the service worker's SHELL list and is required.** A missing entry
aborts the install outright, by design. It carries `<base href="/">` because `worker.mjs`
serves its body at the missed URL, at any depth.

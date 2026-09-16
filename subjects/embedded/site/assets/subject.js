/* ==========================================================================
   subject.js -- everything about this site that is NOT the learning engine.

   The engine (store.js, quiz.js, learn.js, viva.js, simulate.js, notes.js,
   account.js, auth-page.js, cv.js, site.js, sw.js and both stylesheets) is
   byte-identical across every subject and lives in /engine at the repository
   root. It is copied in by tools/sync-engine.php, and tools/doctor.php fails
   the build if a copy has drifted. Never edit an engine file inside a subject:
   the next sync overwrites it.

   Anything subject-specific goes here, or in chapters.js / quizzes-*.js /
   glossary.js / italiano.js / the chapter pages themselves.

   `self`, not `window`: sw.js does importScripts() on this file to build its
   cache name, and there is no `window` in a service worker.

   MUST LOAD FIRST -- before store.js, which derives its localStorage key from
   `key` below. If it loads late, the engine falls back to the "academy"
   namespace and a learner's progress lands in the wrong bucket.

   ---------------------------------------------------------------------------
   WHY THIS SUBJECT EXISTS, AND WHAT IS HONESTLY DIFFERENT ABOUT IT.

   The other five academies were written by someone who already knew the
   subject and was systematising it for interviews. This one is not, and
   pretending otherwise would be the fastest way to make it useless.

   What that changes:

     * Every chapter here is checkable against a datasheet, a reference manual
       or a standard, and says which one. Where the other subjects could lean
       on remembered production experience, this one cites. The ST reference
       manual, the ARM architecture reference, the FreeRTOS docs and the Modbus
       spec are named in the chapters that depend on them.
     * There is a hardware boundary this site cannot cross. Reading about DMA
       is not the same as watching a transfer half-complete at 3 a.m., and the
       chapters that describe an oscilloscope trace say plainly that they are
       describing one rather than teaching you to read one. Chapter 00 states
       the boundary and chapter 60 states what you may truthfully put on a CV
       because of it.
     * The `.tryit` blocks matter more here than anywhere else in the Academy.
       Most of them run on a PC with nothing but a compiler -- that is a
       deliberate choice, so that the course is not gated behind owning a board.
       The ones that genuinely need hardware are labelled as needing it.

   THE CORPUS BEHIND THE `req` FIELDS. See chapters.js for the postings
   themselves. The anchor advert is the Formigine (MO) liquid-cooling company
   hiring an EMBEDDED SOFTWARE ENGINEER on a training path -- firmware in C/C++
   on microcontrollers and an RTOS, STM32, serial and Ethernet protocols, and
   the interface between proprietary boards and the PLC/sensor/actuator world.
   That one advert is unusually explicit, which is why it carries so many `req`
   fields on its own.

   ON THE OVERLAP WITH THE OTHER SUBJECTS. Two deliberate seams:

     * LogiFlow (C#) chapter 32b/32c/32d already cover Modbus register maps,
       AGV deadlock and serial framing FROM THE PC SIDE -- a .NET application
       talking to a machine. Here the same wire is seen from the firmware side,
       where you own the timing and the buffer. If a chapter here starts
       explaining how to write a C# client, delete it; that chapter exists.
     * `Desktop/plc-lab` holds five IEC 61131-3 Structured Text programs. This
       course does NOT teach you to be a PLC programmer -- Part 8 covers only
       as much of the PLC world as a firmware engineer must know to talk to
       one, and it points at the lab rather than duplicating it.
   ========================================================================== */

self.SUBJECT = {
  /* Short id. Used in paths and nowhere user-visible. */
  id: "embedded",

  /* localStorage NAMESPACE. "centralina" is what an Italian technician calls
     the box this course is about -- an electronic control unit. It is the
     object on the bench, which is the mental model the subject wants installed.
     Must not collide with bottega.php / fonderia.java / officina.kafka. */
  key: "centralina.embedded",

  /* Bump to invalidate the offline cache. sw.js builds its cache name as
     `key + "-v" + cacheVersion`. CHANGE THIS ON EVERY CONTENT CHANGE. */
  cacheVersion: 6,

  /* Display strings. */
  name: "Centralina Academy",
  mark: "C/C++",
  sub:  "Embedded &amp; firmware &mdash; Emilia-Romagna",

  /* Accent colour, stamped into every <head> by tools/head-brand.php.
     Both themes are required: `base` carries link text so it has to clear
     4.5:1 against the page, and `ink` is only ever drawn on `soft`.

     Solder-mask green, darkened until it passes. It is the one colour none of
     the other five subjects uses, and it is the colour of the object. */
  brand: {
    light: { base: "#2E6B41", soft: "#e6f3ea", ink: "#245232", lift: "#245232" },
    dark:  { base: "#6fce8d", soft: "#17301f", ink: "#9ce0b1", lift: "#a6e8ba" },
  },

  /* WHERE THE ACCOUNTS SERVICE LIVES -- deliberately empty, and written out
     rather than left absent so that it reads as a decision and not an
     oversight. No accounts instance is deployed for this subject, and
     borrowing another one would be wrong: each instance owns its own user
     table, and its chapter count is the denominator for every mastery
     percentage, so this subject's learners would be scored against another
     subject's chapters.

     Empty is not the same as broken. account.js falls back to this origin,
     finds no API there, and -- because baseIsGuessed() is then true -- says so
     in plain words with a box to type a real address into. Everything except
     sign-in, cross-device sync and the leaderboard works without one. */
  apiBase: "",

  /* The address offered as an example when somebody sets the API by hand, and
     the commands the pages quote. Per subject: the engine is shared, and a
     port or a command hard-coded in it is wrong for every subject but the one
     it was written for. */
  apiExample:   "http://localhost:8092",
  apiCommand:   "docker compose up -d api",
  vivaCommand:  "php tools/viva-deck.php embedded",

  /* Seed values for the CV builder. Not advice -- a starting point the learner
     overwrites. Every technology named appears in a collected advert; see the
     `req` fields in chapters.js.

     Deliberately modest, and more so than any other subject. The honest claim
     after this course is that you can read and write embedded C, reason about
     an RTOS and a protocol, and have built and debugged something on a real
     board -- not that you have shipped firmware. Chapter 60 is about the
     difference, and about why overclaiming here is caught faster than in any
     other field: the interviewer has an oscilloscope. */
  cv: {
    role:    "Embedded Software Engineer / Firmware",
    skills:  "C, C++, STM32 (HAL e registri), FreeRTOS, UART, SPI, I2C, CAN, Modbus RTU/TCP, Ethernet, Git, oscilloscopio e analizzatore logico",
    summary: "Sviluppatore con base informatica e percorso mirato su firmware embedded: C e C++ su microcontrollori ARM Cortex-M, RTOS, protocolli seriali e di rete, e integrazione con PLC e sensoristica industriale\u2026",
    bullet:  "Sviluppato su STM32 un nodo Modbus RTU su RS-485 con FreeRTOS: 3 task, coda di comando, watchdog, e log diagnostico su UART.",
  },
};

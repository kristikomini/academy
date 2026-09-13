/* ==========================================================================
   subject.js — everything about this site that is NOT the learning engine.

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

   MUST LOAD FIRST — before store.js, which derives its localStorage key from
   `key` below. If it loads late, the engine falls back to the "academy"
   namespace and a learner's progress lands in the wrong bucket.

   ---------------------------------------------------------------------------
   WHY THIS SUBJECT EXISTS SEPARATELY FROM `java`, WHICH IS WORTH KNOWING BEFORE
   YOU EDIT EITHER.

   Every Kafka line collected during phase 1 came from a JAVA advert — there is
   no standalone Kafka job in this market. Splitting them anyway was a
   deliberate call, and it costs something: two manifests quote overlapping
   advert lines, and a reader doing both subjects meets Spring twice.

   What it buys is that Kafka gets treated as a system with its own model —
   partitions, offsets, delivery semantics, rebalancing — rather than as one
   chapter at the back of a Spring course, which is how it is usually taught and
   why most candidates can name it but not reason about it.

   The honesty rule still binds: a chapter only gets a `req` if a real advert
   line asked for THAT, and the Kafka-mentioning lines are quoted verbatim.
   Everything the ecosystem needs but no advert named gets an `extra`.
   ========================================================================== */

self.SUBJECT = {
  /* Short id. Used in paths and nowhere user-visible. */
  id: "kafka",

  /* localStorage NAMESPACE. See the note in subjects/java/site/assets/subject.js:
     these two subjects are the pair most likely to be open side by side, so the
     namespaces must not collide. */
  key: "officina.kafka",

  /* Bump to invalidate the offline cache. sw.js builds its cache name as
     `key + "-v" + cacheVersion`. CHANGE THIS ON EVERY CONTENT CHANGE. */
  cacheVersion: 15,

  /* Display strings. `officina` = workshop, and specifically the kind with
     things moving through it — which is the mental model this subject is
     trying to install. */
  name: "Officina Academy",
  mark: "Kafka",
  sub:  "Event-driven developer &mdash; Emilia-Romagna &amp; Milano",

  /* Accent colour, stamped into every <head> by tools/head-brand.php. See the
     long note in subjects/java/site/assets/subject.js for why it lives in this
     file: both themes are required, `base` carries link text so it has to clear
     4.5:1 against the page, and `ink` is only ever drawn on `soft`.

     Kafka's own mark is black, which is no use as an accent — a black link is
     just text. This is the teal the favicon uses, darkened until it passes. */
  brand: {
    light: { base: "#0E6E82", soft: "#e6f4f7", ink: "#0A5265", lift: "#0A5265" },
    dark:  { base: "#56c8dd", soft: "#15303a", ink: "#8adaea", lift: "#92e2f0" },
  },

  /* WHERE THE ACCOUNTS SERVICE LIVES — deliberately empty, and written out
     rather than left absent so that it reads as a decision and not an
     oversight. No accounts instance is deployed for Kafka. Borrowing the Java
     one (api.hub.testdemo.it) is the tempting mistake and would be wrong: each
     instance owns its own user table, and its chapter count is the denominator
     for every mastery percentage, so Kafka's learners would be scored against
     52 Java chapters.

     Empty is not the same as broken. account.js falls back to this origin,
     finds no API there, and — because baseIsGuessed() is then true — says so in
     plain words with a box to type a real address into. Everything except
     sign-in, cross-device sync and the leaderboard works without one. */
  apiBase: "",

  /* Shown by the sign-in page when no API base is configured. */
  /* The address offered as an example when somebody sets the API by hand.
     Per subject: the engine is shared, and a port hard-coded in it is wrong
     for every subject but the one it was written for. */
  apiExample:   "http://localhost:8090",
  apiCommand:   "docker compose up -d && ./mvnw spring-boot:run -pl api",
  vivaCommand:  "./mvnw -q exec:java -Dexec.mainClass=tools.VivaDeck",

  /* Seed values for the CV builder. Not advice — a starting point the learner
     overwrites. Every technology named appears in a collected advert; see the
     `req` fields in chapters.js.

     Deliberately modest on Kafka itself: the honest claim for someone who has
     worked through this course is that they understand the model and have run
     it locally, not that they have operated a cluster in production. */
    cv: {
    role:    "Sviluppatore Java / Event-Driven",
    skills:  "Apache Kafka, Kafka Streams, Kafka Connect, Java 17, Spring Boot, Docker, SQL",
    summary: "Sviluppatore backend con esperienza su architetture event-driven e Apache Kafka…",
    bullet:  "Progettato un flusso event-driven con Kafka: 4 topic, consumer group idempotente, replay da offset.",
  },
};

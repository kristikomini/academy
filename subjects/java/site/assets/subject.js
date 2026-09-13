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
   ========================================================================== */

self.SUBJECT = {
  /* Short id. Used in paths and nowhere user-visible. */
  id: "java",

  /* localStorage NAMESPACE. This is the load-bearing field: every subject must
     have a different one, or two subjects open in the same browser overwrite
     each other's profile, review schedule and CV draft.

     NOTE the neighbour: the Kafka academy uses "officina.kafka". These two
     subjects overlap in content more than any other pair here, so they are the
     most likely to be open in the same browser at the same time — which makes
     a distinct namespace matter more, not less. */
  key: "fonderia.java",

  /* Bump to invalidate the offline cache. sw.js builds its cache name as
     `key + "-v" + cacheVersion`, and a new name is what makes install() rebuild
     and activate() delete the old one. CHANGE THIS ON EVERY CONTENT CHANGE —
     forget, and returning visitors keep reading last month's chapters with no
     error anywhere. */
  cacheVersion: 18,

  /* Display strings. `fonderia` = foundry: where things are cast to run for
     twenty years, which is the Java market in this region. */
  name: "Fonderia Academy",
  mark: "Java",
  sub:  "Java &amp; Spring developer &mdash; Emilia-Romagna",

  /* THE ACCENT COLOUR, LIGHT AND DARK.

     It lives here and not in engine/style.css because the engine is
     byte-identical across subjects on purpose — sync-engine.php copies it in
     and doctor.php fails the build when a copy has drifted — so a per-subject
     colour cannot go there without teaching the shared engine the names of its
     subjects, and a fourth subject would then mean editing the engine to add
     one. tools/head-brand.php reads this block and stamps the six tokens into
     every page's <head> as an inline <style>. That is the same trade
     head-theme.php makes, for the same reason: a separate brand.css would be a
     render-blocking round trip before the first paint, spent on 250 bytes.

     BOTH THEMES ARE REQUIRED. engine/style.css sets --brand three times — once
     for light, once inside `prefers-color-scheme: dark`, once for the explicit
     [data-theme="dark"] toggle — so overriding only the light one leaves the
     whole dark site on the .NET purple this was cloned from, which is the
     failure that is easy to ship and hard to notice.

     `base` is link text and a button fill, so it is chosen to clear 4.5:1
     against the page rather than to match the logo: Java's own #E76F00 is
     3.1:1 on white and cannot legally carry text, which is why this is the
     deeper rust and the bright orange stays on the favicon, where it is a fill
     and not type. `ink` is only ever drawn on `soft`, never on the page.

     `lift` is the far stop of the brand gradients — the mark in the top bar,
     the level bar, the account avatar. TWO OF THOSE CARRY TEXT, in --on-brand,
     so it moves AWAY from the page, not toward it: darker in light mode,
     lighter in dark. The bright #F0921E was tried here first, because it is
     the favicon's light stop and tying the tab icon to the page was appealing.
     It measured 3.4:1 under the mark's 12px label — worse than the .NET purple
     it replaced, which managed 5.8:1 by being dark at both ends. The gradient
     is quieter this way. The label is readable, which it has to be. */
  brand: {
    light: { base: "#B4530B", soft: "#fdf0e4", ink: "#8A3D06", lift: "#8F3F06" },
    dark:  { base: "#f0a868", soft: "#2f2013", ink: "#f6c79b", lift: "#f8c98f" },
  },

  /* WHERE THE ACCOUNTS SERVICE LIVES for this subject.

     Set because this site is published as static files on Cloudflare Workers,
     where the engine's fallback — assume the API serves the page — is wrong.
     A visitor can still override it in the account panel; that always wins.

     PER SUBJECT, NOT PER ENGINE. Each instance owns its own user table and its
     own chapter-count, and chapter-count is the denominator for every mastery
     percentage. Kafka and PHP deliberately leave this empty: no instance is
     deployed for them, and borrowing this one would score their learners
     against 52 Java chapters.

     Runs on the VPS, not on Workers: it is a JVM, and Workers is V8 isolates.
     See api/deploy/README.md. */
  apiBase: "https://api.hub.testdemo.it",

  /* Shown by the sign-in page when no API base is configured, so the
     instruction matches the language being taught rather than the one the
     engine was first written in. */
  /* The address offered as an example when somebody sets the API by hand.
     Per subject: the engine is shared, and a port hard-coded in it is wrong
     for every subject but the one it was written for. */
  apiExample:   "http://localhost:8090",
  apiCommand:   "./mvnw spring-boot:run -pl api",
  vivaCommand:  "./mvnw -q exec:java -Dexec.mainClass=tools.VivaDeck",

  /* Seed values for the CV builder. Not advice — a starting point the learner
     overwrites, sized to what a junior/mid Java advert in this region asks for.
     Every technology named here appears in a collected advert; see the
     `req` fields in chapters.js. */
  cv: {
    role:    "Sviluppatore Java",
    skills:  "Java 17, Spring Boot, Spring Data JPA, REST, Maven, Docker, SQL, Git",
    summary: "Sviluppatore backend Java con esperienza su Spring Boot, JPA e API REST…",
    bullet:  "Realizzati 6 microservizi Spring Boot: 34 endpoint REST, 210 test, deploy su Kubernetes.",
  },
};

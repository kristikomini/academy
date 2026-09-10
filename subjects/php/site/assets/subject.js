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
  id: "php",

  /* localStorage NAMESPACE. This is the load-bearing field: every subject must
     have a different one, or two subjects open in the same browser overwrite
     each other's profile, review schedule and CV draft. */
  key: "bottega.php",

  /* Bump to invalidate the offline cache. sw.js builds its cache name as
     `key + "-v" + cacheVersion`, and a new name is what makes install() rebuild
     and activate() delete the old one. CHANGE THIS ON EVERY CONTENT CHANGE —
     forget, and returning visitors keep reading last month's chapters with no
     error anywhere. */
  cacheVersion: 17,

  /* Display strings. */
  name: "Bottega Academy",
  mark: "PHP",
  sub:  "PHP developer &mdash; Emilia-Romagna",

  /* Accent colour, stamped into every <head> by tools/head-brand.php. See the
     long note in subjects/java/site/assets/subject.js for why it lives in this
     file: both themes are required, `base` carries link text so it has to clear
     4.5:1 against the page, and `ink` is only ever drawn on `soft`.

     PHP is the lucky one — #4F5B93 is the logo's own indigo and passes at
     6.5:1 unmodified, so nothing had to be invented here. */
  brand: {
    light: { base: "#4F5B93", soft: "#eceef8", ink: "#3A4370", lift: "#3C4674" },
    dark:  { base: "#9aa5e0", soft: "#232a4a", ink: "#b9c2ee", lift: "#c3caf0" },
  },

  /* WHERE THE ACCOUNTS SERVICE LIVES — deliberately empty, and written out
     rather than left absent so that it reads as a decision and not an
     oversight. No accounts instance is deployed for PHP. Borrowing the Java one
     (api.hub.testdemo.it) is the tempting mistake and would be wrong: each
     instance owns its own user table, and its chapter count is the denominator
     for every mastery percentage, so PHP's learners would be scored against 52
     Java chapters.

     Empty is not the same as broken. account.js falls back to this origin,
     finds no API there, and — because baseIsGuessed() is then true — says so in
     plain words with a box to type a real address into. Everything except
     sign-in, cross-device sync and the leaderboard works without one. */
  apiBase: "",

  /* Shown by the sign-in page when no API base is configured, so the
     instruction matches the language being taught rather than the one the
     engine was first written in. */
  /* The address offered as an example when somebody sets the API by hand.
     Per subject: the engine is shared, and a port hard-coded in it is wrong
     for every subject but the one it was written for. */
  apiExample:   "http://localhost:8000",
  apiCommand:   "php -S localhost:5280 -t api/public",
  vivaCommand:  "php tools/viva-deck.php",

  /* Seed values for the CV builder. Not advice — a starting point the learner
     overwrites, sized to what a junior PHP advert in this region asks for. */
  cv: {
    role:    "Sviluppatore PHP",
    skills:  "PHP 8, Laravel, MySQL, Eloquent, SQL, JavaScript, Git, Docker",
    summary: "Sviluppatore PHP con esperienza su Laravel, MySQL ed Eloquent…",
    bullet:  "Costruita una API REST in Laravel: 28 endpoint, JWT, 120 test.",
  },
};

/* ==========================================================================
   sw.js — the service worker. Makes the whole tutorial work offline.

   WHY THIS EXISTS
   This is a course somebody revises on a train to Bologna, in a waiting room,
   on a phone with two bars. Every page here is already a static file with no
   API call in the reading path — it is *already* offline-capable in every way
   except the one that matters, which is that the browser still asks the
   network for it.

   WHAT IT DOES NOT DO
   It does not touch the accounts API. Sign-in, sync and the leaderboard need
   the network and should fail honestly when it is not there — a cached 200 for
   "here is your profile" would be a lie with someone's progress attached. Only
   GET requests for the site's own static files are cached; anything under
   /api/ is passed straight through.

   ONE THING TO KNOW ABOUT SERVICE WORKERS
   They only run over http(s). Opening index.html from disk (file://) skips all
   of this silently, which is correct — nothing to cache, nothing to serve — and
   is why site.js checks the protocol before registering.

   Covered in: site/README.md
   ========================================================================== */

/* The chapter list, imported rather than duplicated. chapters.js assigns onto
   `self`, which is why that works here — see the note at the bottom of it. */
importScripts("assets/chapters.js");

/* BUMP subject.js's cacheVersion ON EVERY CONTENT CHANGE.
   The cache name is the version. A new name means install() builds a fresh
   cache and activate() deletes every older one, which is the whole upgrade
   mechanism — there is no partial invalidation and you do not want one. Forget
   to bump it and returning visitors keep last month's chapters, with no error
   anywhere, which is the single most common service-worker bug.

   AND NOTE WHERE THE VERSION LIVES, because it is not here. This file is an
   engine file: byte-identical across every subject, and it does not change when
   a subject's content does — only subject.js does. But the browser decides
   whether to replace a worker by byte-comparing THE REGISTERED SCRIPT. So a
   cacheVersion bump on its own is not reliably an update: it changes a file the
   update check is not obliged to look at.

   site.js closes that by registering this worker as `sw.js?v=<cacheVersion>`.
   The registration is keyed by scope, not by URL, so the query does not create a
   second worker or move the scope — it just guarantees the bytes differ when the
   version does, which is what makes the bump mean something. */
importScripts("assets/subject.js");
const CACHE = (self.SUBJECT.key || "academy") + "-v" + (self.SUBJECT.cacheVersion || 1);

const SHELL = [
  "./",
  "index.html",
  "404.html",
  "dashboard.html",
  "review.html",
  "viva.html",
  "exam.html",
  "simulate.html",
  "notes.html",
  "glossary.html",
  "italiano.html",
  "cv.html",
  "account.html",
  "signin.html",
  "register.html",
  "reset.html",
  "favicon.svg",
  "manifest.webmanifest",
  "assets/style.css",
  "assets/learn.css",
  /* subject.js was missing from this list until it was noticed that sw.js
     importScripts() it and every page loads it: it reached the cache only by the
     runtime put() below, so a genuinely cold offline start had no self.SUBJECT
     and store.js fell back to the shared "academy" namespace — somebody's
     progress, filed under the wrong subject. It is shell, not incidental. */
  "assets/subject.js",
  "assets/chapters.js",
  "assets/quizzes-1.js",
  "assets/quizzes-2.js",
  "assets/quizzes-3.js",
  "assets/rules.js",
  "assets/glossary.js",
  "assets/italiano.js",
  "assets/italiano-panel.js",
  "assets/store.js",
  "assets/site.js",
  "assets/quiz.js",
  "assets/learn.js",
  "assets/viva.js",
  "assets/simulate.js",
  "assets/cv.js",
  "assets/notes.js",
  "assets/account.js",
  "assets/auth-page.js",
];

/* Every chapter, from the manifest. 47 files nobody has to list by hand. */
const CHAPTER_FILES = (self.CHAPTERS || []).map((c) => "chapters/" + c.id + ".html");

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);

      /* THE SHELL IS REQUIRED, AND A FAILURE HERE MUST FAIL THE INSTALL.
         activate() below deletes every other cache wholesale, so a worker that
         activates over a half-filled cache has just thrown away the complete
         copy and put a worse one in its place. Rejecting instead leaves the OLD
         worker in charge of the OLD, complete cache, and the upgrade is simply
         retried on the next visit. Nothing is lost by refusing to upgrade; a
         great deal is lost by upgrading badly.

         This is the bug that produced "the page 404s for a moment and then
         loads": every add was wrapped in .catch(), so install always reported
         success. One flaky response — 84 requests go out at once — was enough to
         activate a worker over an emptied cache, and from then on every page
         change fell through to the network. */
      const failed = [];
      await Promise.all(SHELL.map((url) => cache.add(url).catch(() => failed.push(url))));
      if (failed.length) {
        throw new Error("[sw] shell incomplete, install aborted: " + failed.join(", "));
      }

      /* Chapters are best-effort, by contrast. One chapter missing from the
         offline copy is a gap; the fetch handler falls through to the network
         for it and the visitor never notices unless they are on a train. That
         is not worth refusing an upgrade over. */
      await Promise.all(
        CHAPTER_FILES.map((url) =>
          cache.add(url).catch((err) => console.warn("[sw] could not precache", url, err))
        )
      );

      /* Take over as soon as the install finishes rather than waiting for every
         tab to close — and only now, with the shell verified present. Safe here
         because the cache is versioned wholesale: there is no state in an old
         page that a new worker could corrupt. */
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  /* Only our own GETs. A POST to the accounts API must never be served from a
     cache, and neither must anything from another origin. */
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  if (new URL(request.url).pathname.includes("/api/")) {
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);

      /* CACHE FIRST, with a background refresh — "stale while revalidate".
         The reasoning is specific to this site: the content is a course, not a
         feed. A chapter that is one version old is completely fine to read and
         a spinner is not, so the cached copy wins the race every time and the
         network updates it for next visit.

         Network-first would be right for anything where staleness is a
         correctness problem. It is not right for a tutorial. */
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            /* put() rejects on a redirected response, among other things. That
               must not become an unhandled rejection: failing to cache is a
               missed optimisation, not an error the visitor should ever see. */
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => null);

      if (cached) return cached;

      const fresh = await network;
      if (fresh) return fresh;

      /* EVERY PATH FROM HERE MUST RETURN A RESPONSE.
         This is the bug that used to live here: on a cache miss whose fetch then
         failed, this handler resolved with `undefined`, and respondWith(undefined)
         is a network error — the visitor got a bare ERR_FAILED that vanished on
         retry, which reads like a broken host and is impossible to search for. A
         service worker that intercepts a request owns the answer to it. */
      if (request.mode === "navigate") {
        const home = await caches.match("index.html");
        if (home) return home;
      }
      return new Response("Offline, and this page was never cached.", {
        status: 504,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    })()
  );
});

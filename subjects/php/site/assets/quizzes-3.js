/* ==========================================================================
   quizzes-3.js — the question bank, part 3.

   APPEND ONLY. Ids are "<chapter-id>#<index>" and the index is the array
   position; it keys a learner's spaced-repetition schedule. Reordering or
   deleting silently reassigns somebody's review history.

   `why` is shown on correct answers too.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- chapter 09 --- */
  "09-databases-and-mysql": [
    { q: "Why should a MySQL table use utf8mb4 rather than utf8?",
      a: ["MySQL's utf8 is limited to 3 bytes per character and cannot store emoji or some CJK characters",
          "utf8 is slower",
          "utf8 does not support accented characters",
          "utf8 is deprecated and removed in MySQL 8"],
      c: 0,
      why: "MySQL's 'utf8' is an alias for utf8mb3 — a maximum of three bytes, so anything outside the Basic Multilingual Plane cannot be stored and is either rejected or silently truncated. utf8mb4 is real UTF-8. Set it on the column, the connection AND the PDO DSN; the connection is the one people forget." },

    { q: "Which storage engine should a new MySQL table use, and why?",
      a: ["InnoDB — transactions, foreign keys, row-level locking and crash recovery",
          "MyISAM — faster reads",
          "MEMORY — everything is cached anyway",
          "It makes no difference in MySQL 8"],
      c: 0,
      why: "MyISAM has no transactions, no foreign keys, locks the entire table on write and can corrupt on crash. You still meet it in legacy Italian gestionali, and it is the first thing to check when one 'randomly loses data' or stalls under concurrent writes." },

    { q: "How should a monetary amount be stored in MySQL?",
      a: ["DECIMAL, or an integer number of cents",
          "FLOAT, for speed",
          "DOUBLE, for precision",
          "VARCHAR, to preserve formatting"],
      c: 0,
      why: "FLOAT and DOUBLE are binary approximations: 0.1 + 0.2 is not exactly 0.3, so totals drift by a cent and an invoice stops adding up. DECIMAL is exact decimal arithmetic; integer cents is exact everywhere, including in JavaScript on the way to the browser." },

    { q: "Why is a random UUIDv4 a poor choice for an InnoDB primary key?",
      a: ["The primary key determines physical row order, so random keys make every insert land mid-table and fragment the index",
          "UUIDs cannot be indexed",
          "UUIDs are too long for a primary key",
          "InnoDB requires integer primary keys"],
      c: 0,
      why: "InnoDB clusters the table on the primary key, so sequential keys append and random ones insert in the middle, causing page splits and fragmentation. Either keep an auto-increment key internally and expose a UUID alongside it, or use UUIDv7, which is time-ordered." },

    { q: "How should an Italian codice destinatario or CAP be stored?",
      a: ["As a string — they are identifiers, and integers would drop leading zeros",
          "As an INT, since they are numeric",
          "As a DECIMAL",
          "As an ENUM of valid values"],
      c: 0,
      why: "You never do arithmetic on them, and a codice destinatario of '0000000' becomes 0 as an integer. Anything that is an identifier rather than a quantity — partita IVA, CAP, VAT numbers, phone numbers — is CHAR or VARCHAR." },
  ],

  /* ------------------------------------------------------- chapter 13 --- */
  "13-http-and-psr": [
    { q: "Which HTTP methods are idempotent?",
      a: ["GET, HEAD, OPTIONS, PUT and DELETE — but not POST or PATCH",
          "Only GET and HEAD",
          "All of them except DELETE",
          "GET, POST and PUT"],
      c: 0,
      why: "Idempotent means N identical requests have the same effect as one. It decides what a client, proxy or flaky mobile connection may safely retry: a retried PUT is harmless, a retried POST creates a second order. That is why payment endpoints take an idempotency key." },

    { q: "A request parses correctly as JSON but fails your validation rules. Which status code?",
      a: ["422 Unprocessable Content", "400 Bad Request", "409 Conflict", "500 Internal Server Error"],
      c: 0,
      why: "400 means the request itself was malformed — broken JSON, a missing required header. 422 means it was well-formed but semantically wrong. Laravel returns 422 for validation failures and clients depend on that distinction to know they can render per-field errors." },

    { q: "What is the difference between 401 and 403?",
      a: ["401 means the server does not know who you are; 403 means it does and the answer is still no",
          "401 is for APIs, 403 is for web pages",
          "403 means the resource does not exist",
          "They are interchangeable"],
      c: 0,
      why: "401 invites the client to authenticate — retrying with credentials makes sense. 403 says authentication succeeded and authorisation failed, so retrying with the same credentials is pointless. Returning the wrong one sends clients into useless retry loops." },

    { q: "Why must a GET request never change server state?",
      a: ["Crawlers, prefetch and link scanners follow GETs automatically, so state changes fire without a user acting",
          "GET requests cannot carry a body",
          "GET responses are always cached",
          "HTTP forbids it at the protocol level"],
      c: 0,
      why: "A URL like /orders/5/delete works fine until a crawler, browser prefetcher, or a corporate mail scanner walks your admin panel and deletes everything — and the logs will show the request came from the logged-in user." },

    { q: "PSR-7 HTTP message objects are immutable. What does that mean in practice?",
      a: ["Methods like withHeader() return a NEW object — discarding the return value silently does nothing",
          "They cannot be serialised",
          "Headers can only be set in the constructor",
          "They are read-only after the response is sent"],
      c: 0,
      why: "Calling $response->withHeader('X-Foo', 'bar') without reassigning is a no-op, and it fails silently — no error, the header simply never appears. This is the single most common PSR-7 bug and the reason middleware always reads `$request = $request->withAttribute(...)`." },
  ],

  /* ------------------------------------------------------- chapter 24 --- */
  "24-testing": [
    { q: "What is the difference between a stub and a mock?",
      a: ["A stub returns canned values; a mock also carries expectations about how it was called and fails if they are not met",
          "A mock is faster",
          "A stub is for interfaces, a mock for classes",
          "They are two names for the same thing"],
      c: 0,
      why: "Stub = state verification (what came back). Mock = behaviour verification (that it was called, how many times, with what). Use mocks where the interaction itself is the requirement — 'charge the card exactly once' — and stubs where you just need a value." },

    { q: "Why is substituting SQLite for MySQL in tests a bad idea?",
      a: ["Different type handling, date functions and strict-mode behaviour mean tests pass that would fail against MySQL",
          "SQLite is too slow",
          "SQLite cannot be used from PHP",
          "It is fine — an in-memory database is equivalent"],
      c: 0,
      why: "You would be testing against a database you do not deploy, which hides precisely the bugs integration tests exist to catch. Testcontainers starts a real MySQL in Docker for the run, so CI matches production." },

    { q: "What does 90% line coverage actually prove?",
      a: ["That 90% of lines executed during the test run — not that their behaviour was verified",
          "That 90% of bugs are caught",
          "That the test suite is well designed",
          "That 90% of requirements are tested"],
      c: 0,
      why: "Coverage measures execution, not verification: a test with no assertions covers plenty of lines and proves nothing. Mutation testing (infection/infection) is the honest counterpart — it changes your code and counts how many mutants your tests fail to notice." },

    { q: "Which is the strongest reason a bug fix should begin with a failing test?",
      a: ["It proves the bug exists and then proves it cannot silently return",
          "It increases coverage",
          "It is required by TDD",
          "It documents the fix for the changelog"],
      c: 0,
      why: "A test written after the fix might pass for the wrong reason — you never saw it fail. Watching it go red first proves it actually exercises the bug, and once green it is a permanent regression guard on exactly that behaviour." },

    { q: "Why is asserting 'the service called save() twice' usually a bad test?",
      a: ["It asserts implementation rather than behaviour, so it breaks on every refactor while catching no real bugs",
          "Mocks cannot count calls",
          "It is too slow",
          "save() should be private"],
      c: 0,
      why: "Tests coupled to how the code works — rather than what a caller can observe — fail whenever you restructure working code. They get deleted eventually, and they take the team's trust in the test suite with them." },
  ],

});

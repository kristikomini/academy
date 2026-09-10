/* ==========================================================================
   quizzes-2.js — the question bank, part 2.

   Same rules as part 1, and they are worth repeating because breaking them is
   silent:

   APPEND ONLY. A question's id is "<chapter-id>#<index>" and the index is its
   position in this array. That id keys a learner's spaced-repetition schedule.
   Reordering or deleting reassigns somebody's review history to the wrong
   questions and nothing tells you it happened.

   `why` is shown on correct answers too.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- chapter 01 --- */
  "01-php-platform": [
    { q: "What does PHP-FPM's process model mean for application state?",
      a: ["Nothing survives between requests — each is handled by a worker with a clean memory space",
          "State is shared across all workers automatically",
          "Each worker keeps its own persistent application state",
          "State survives only within the same worker"],
      c: 0,
      why: "This is 'shared-nothing', PHP's biggest structural difference from Java or .NET. It explains why there is no application-level connection pool, why 'just make it static' is almost always wrong, and why deployment is as simple as replacing files." },

    { q: "What does OPcache actually cache?",
      a: ["The compiled bytecode of your PHP files",
          "The HTML output of each page",
          "Database query results",
          "Composer's autoload map"],
      c: 0,
      why: "Without it PHP re-parses and re-compiles every file on every request. OPcache keeps the compiled opcodes in shared memory, which is typically the single largest performance setting on a production PHP server. It caches code, not data — that is what Redis is for." },

    { q: "Why does composer.lock belong in version control?",
      a: ["It pins the exact dependency versions, so production installs what you tested",
          "It speeds up autoloading",
          "Composer refuses to run without it",
          "It contains the PSR-4 mappings"],
      c: 0,
      why: "composer.json states acceptable ranges; composer.lock records the exact resolved versions. Commit the lock and run `composer install` (not `update`) in CI and production, otherwise a patch release you never tested can ship on a Friday." },

    { q: "What is the difference between the CLI and FPM SAPIs regarding php.ini?",
      a: ["They commonly load different php.ini files, so settings can differ between them",
          "They always share one configuration",
          "CLI ignores php.ini entirely",
          "FPM has no memory limit"],
      c: 0,
      why: "A classic lost afternoon: a script works via `php script.php` and fails through the web server, or vice versa. Run `php --ini` and check `phpinfo()` from the web to see which files each SAPI actually loaded. CLI also defaults to no max_execution_time." },
  ],

  /* ------------------------------------------------------- chapter 10 --- */
  "10-sql-querying": [
    { q: "What happens to a LEFT JOIN when you filter the right-hand table in WHERE?",
      code: "SELECT c.*, o.total\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.total > 100;",
      a: ["It behaves as an INNER JOIN — customers with no orders are removed",
          "It still returns all customers, with NULL totals",
          "It returns a syntax error",
          "It returns only customers with no orders"],
      c: 0,
      why: "The unmatched rows have o.total = NULL, and NULL > 100 is not true, so WHERE discards them — silently undoing the LEFT JOIN. To keep them, move the condition into the ON clause, or add OR o.total IS NULL. This is the most common SQL bug in interviews and in production." },

    { q: "What is the difference between WHERE and HAVING?",
      a: ["WHERE filters rows before grouping; HAVING filters groups after aggregation",
          "HAVING is only valid on indexed columns",
          "They are interchangeable",
          "WHERE works on joins, HAVING on subqueries"],
      c: 0,
      why: "WHERE cannot see aggregates because they do not exist yet; HAVING can. Filter as much as possible in WHERE — it reduces the rows that ever reach the grouping step, so it is both correct and faster." },

    { q: "Which construct returns the top 3 rows per category in one query?",
      a: ["A window function: ROW_NUMBER() OVER (PARTITION BY category ORDER BY total DESC)",
          "GROUP BY category LIMIT 3",
          "DISTINCT ON category with LIMIT",
          "Three separate UNION ALL queries"],
      c: 0,
      why: "GROUP BY collapses each category to one row, so LIMIT 3 gives three categories, not three rows each. ROW_NUMBER() numbers rows within each partition, then you filter that number in an outer query or CTE. This is a very common live-coding exercise." },

    { q: "What is the practical difference between EXISTS and IN with a subquery?",
      a: ["EXISTS stops at the first match and handles NULLs safely; NOT IN returns nothing if the subquery yields any NULL",
          "IN is always faster",
          "EXISTS cannot use an index",
          "They are identical in every engine"],
      c: 0,
      why: "The NULL behaviour is the trap: NOT IN (1, 2, NULL) is never true for anything, because comparing to NULL is unknown. So a NOT IN over a nullable column silently returns an empty set. NOT EXISTS does not have this problem." },

    { q: "What does a CTE (WITH clause) give you?",
      a: ["A named, readable subquery you can reference — and, with RECURSIVE, hierarchy traversal",
          "A guaranteed performance improvement",
          "A temporary table persisted between sessions",
          "Automatic indexing of the intermediate result"],
      c: 0,
      why: "The main win is readability: a three-level nested subquery becomes three named steps. Recursive CTEs walk trees, which is how you query a category hierarchy or a bill of materials. Do not assume a performance gain — MySQL may materialise it." },
  ],

  /* ------------------------------------------------------- chapter 16 --- */
  "16-the-framework": [
    { q: "In a Laravel middleware, when does code AFTER $next($request) run?",
      a: ["On the way out, once the response has been produced by everything deeper in the stack",
          "Before the controller, immediately after the code above it",
          "Only if the request failed",
          "It never runs — code after $next is unreachable"],
      c: 0,
      why: "Middleware is an onion, not a queue. Code before $next() runs inbound; $next() dives through the remaining middleware and the controller; code after it runs outbound with the response in hand. That is how you add a timing header or log a status code." },

    { q: "How does Laravel's service container decide what to inject into a constructor?",
      a: ["It reads the parameter type hints and resolves each one recursively",
          "It matches parameter names against config keys",
          "It injects everything registered, in order",
          "It requires an explicit annotation on each parameter"],
      c: 0,
      why: "Type hints drive autowiring. A concrete class it can just build; an interface needs a binding to say which implementation. That binding is the seam that makes the code swappable and testable — the practical payoff of dependency inversion." },

    { q: "What is the lifetime of a Laravel singleton?",
      a: ["One HTTP request — PHP is shared-nothing, so nothing persists between requests",
          "The lifetime of the server process, shared by all users",
          "Until the cache is cleared",
          "One session"],
      c: 0,
      why: "singleton() means 'resolve once per request', not 'once per application' as it would in Java or .NET. Candidates arriving from those languages get this wrong, and it matters: you cannot use a Laravel singleton as a cross-request cache." },

    { q: "What is a Laravel facade, technically?",
      a: ["A static proxy that resolves the real object from the container and forwards the call",
          "A class of static methods",
          "A singleton with a shorter name",
          "A trait providing static access"],
      c: 0,
      why: "Cache::get() is not a static call on a Cache class — it resolves the bound instance and forwards. That is why facades are mockable in tests. The cost is hidden dependencies: a class using facades declares nothing in its constructor, so its real dependencies are invisible." },

    { q: "What does a Form Request's authorize() method control?",
      a: ["Whether the user is permitted to make this request at all — returning false produces a 403",
          "Whether the validation rules run",
          "Whether the route is registered",
          "Which middleware group applies"],
      c: 0,
      why: "authorize() answers 'may you?' and rules() answers 'is the input valid?'. They are separate questions with separate failure codes — 403 versus 422 — and both are resolved before your controller method is entered." },

    { q: "Where should validation live in a Laravel application?",
      a: ["In a Form Request, so the controller only ever receives valid input",
          "In the model's boot method",
          "In the controller, at the top of each method",
          "In middleware, manually"],
      c: 0,
      why: "A form request runs before the controller and returns 422 with field errors automatically. It keeps controllers thin, makes the rules reusable and testable in isolation, and means the controller body never begins with fifteen lines of if-statements." },
  ],

});

/* ==========================================================================
   quizzes-1.js — the question bank, part 1.

   Split across three files only so each stays editable. All three merge into
   one map keyed by chapter id.

   THE RULE THAT IS NOT NEGOTIABLE:
   A question's id is "<chapter-id>#<index>", and the index is its position in
   this array. That id is the key a learner's spaced-repetition schedule is
   stored under. APPEND ONLY. Never reorder, never delete. Reordering silently
   reassigns somebody's review history to the wrong questions, and nothing will
   tell you it happened. tools/quiz-ids.lock exists to catch exactly this.

   `why` is shown on CORRECT answers too. Feedback that only appears on failure
   teaches people to guess and check.

   Every stem must stand alone two weeks later, out of context — each question
   doubles as a flashcard. "Which of these is true?" is a bad stem for that
   reason; name the subject.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- chapter 02 --- */
  "02-php-fundamentals": [
    { q: "In PHP 8, what does the comparison 0 == \"foo\" evaluate to?",
      a: ["true, because \"foo\" casts to 0", "false, because PHP 8 compares them as strings", "A TypeError is thrown", "null"],
      c: 1,
      why: "PHP 8 changed this. When comparing a number to a non-numeric string, the NUMBER is now cast to string, so it compares \"0\" with \"foo\" — false. In PHP 7 the string became 0 and the result was true. This is the single most-cited PHP 8 breaking change and a very common interview question." },

    { q: "What does declare(strict_types=1) actually affect?",
      a: ["All type coercion everywhere in the file",
          "Only the coercion of arguments and return values in calls made FROM that file",
          "Only the file's own function declarations",
          "Nothing at runtime; it is a linter hint"],
      c: 1,
      why: "It is per-file and applies to calls originating in that file. It does not change internal casting like (int)$x or string interpolation, and it does not affect files that call into yours. That per-call-site behaviour is why it must be declared in every file." },

    { q: "Which comparison returns true in PHP 8?",
      code: "var_dump(\"1e2\" == \"100\");",
      a: ["true — both are numeric strings, compared numerically", "false — they are different strings", "true only with strict_types disabled", "A deprecation notice, then false"],
      c: 0,
      why: "Two numeric strings are compared as numbers, and \"1e2\" is scientific notation for 100. This survived the PHP 8 changes: PHP 8 only changed number-to-non-numeric-string comparisons. Use === when you mean identity." },

    { q: "What is the difference between == and === in PHP?",
      a: ["=== also compares types; == coerces first",
          "=== is faster but otherwise identical",
          "=== works only on scalars",
          "== compares objects by value, === by reference — nothing else differs"],
      c: 0,
      why: "== applies type juggling, === requires the same type as well as the same value. For objects specifically there IS a second difference: == means same class and equal properties, === means literally the same instance." },

    { q: "What does the null coalescing operator ?? do that ?: does not?",
      a: ["It suppresses the notice for an undefined variable or key",
          "It is right-associative",
          "It works on arrays only",
          "Nothing — they are aliases"],
      c: 0,
      why: "$a ?? $b returns $b when $a is null OR not set, without emitting a warning. $a ?: $b tests falsiness and warns on undefined. So $_GET['page'] ?? 1 is safe; $_GET['page'] ?: 1 warns. Note also that ?? treats \"\" and 0 as valid values, while ?: does not." },

    { q: "In PHP, what is the result of this array operation?",
      code: "$a = ['x' => 1, 'y' => 2];\n$b = ['y' => 9, 'z' => 3];\nvar_dump($a + $b);",
      a: ["['x'=>1, 'y'=>2, 'z'=>3]", "['x'=>1, 'y'=>9, 'z'=>3]", "['x'=>1,'y'=>2,'y'=>9,'z'=>3]", "A TypeError"],
      c: 0,
      why: "The + operator keeps the LEFT operand's value on key collisions — 'y' stays 2. array_merge() does the opposite and would give 9. Getting these the wrong way round is a classic silent bug." },

    { q: "Why does PHP have no separate list and dictionary type?",
      a: ["Because an array IS an ordered hash map, used for both",
          "Because lists are provided by SPL only",
          "Because PHP converts lists to objects internally",
          "It does — list() and array() are different types"],
      c: 0,
      why: "A PHP array is a single ordered hash map that preserves insertion order. That is why it can be used as a list, a dictionary, a stack and a queue — and why array_values() exists, since 'is it a list?' is a question you sometimes have to ask it. PHP 8.1 added array_is_list() for exactly that." },

    { q: "What does the spread operator do with string keys in PHP 8.1+?",
      code: "$a = ['x' => 1];\n$b = ['y' => 2];\n$c = [...$a, ...$b];",
      a: ["Works — string keys are supported from 8.1", "Fatal error — spread requires integer keys", "Silently drops the keys", "Produces a nested array"],
      c: 0,
      why: "PHP 8.1 allowed string keys in array unpacking; before that it was a fatal error. Later keys win on collision, which is the opposite of the + operator's behaviour." },
  ],

  /* ------------------------------------------------------- chapter 03 --- */
  "03-oop-in-php": [
    { q: "What is the practical difference between an interface and an abstract class in PHP?",
      a: ["An interface declares a contract with no state; an abstract class can hold state and implementation, and a class may extend only one",
          "An interface can have properties, an abstract class cannot",
          "Abstract classes cannot have constructors",
          "There is none in PHP 8"],
      c: 0,
      why: "The load-bearing part is single inheritance: a class implements many interfaces but extends one class. So reach for an interface when you need a contract, and an abstract class only when you have shared state or implementation to hand down." },

    { q: "What does a trait solve that inheritance does not?",
      a: ["Reusing implementation across classes that cannot share a parent",
          "Enforcing a contract at compile time",
          "Allowing multiple inheritance of state safely",
          "Lazy loading of methods"],
      c: 0,
      why: "Traits are horizontal reuse — copy-paste performed by the compiler. They are not a type: you cannot type-hint a trait. Overuse produces classes whose behaviour is impossible to locate, which is why the usual advice is composition first, trait second." },

    { q: "In PHP 8.1, what does a BACKED enum add over a pure enum?",
      a: ["A scalar value per case, plus from() and tryFrom()",
          "The ability to have methods",
          "The ability to implement interfaces",
          "Automatic database persistence"],
      c: 0,
      why: "Both kinds can have methods and implement interfaces. Backed enums add a string or int value per case and the from()/tryFrom() lookups, which is what makes them usable as database column values. tryFrom() returns null instead of throwing — usually what you want for external input." },

    { q: "What does the readonly modifier on a property guarantee in PHP 8.1?",
      a: ["It can be written once, from inside the declaring class scope, then never again",
          "It can never be written at all",
          "It is write-protected only outside the class",
          "It makes the whole object immutable"],
      c: 0,
      why: "Initialise it once — normally in the constructor — and any later write throws. It does NOT deep-freeze: a readonly property holding an array is fixed, but a readonly property holding an object still lets you mutate that object's own properties." },

    { q: "What does constructor property promotion change?",
      code: "final class Money {\n    public function __construct(\n        public readonly int $amount,\n        public readonly string $currency,\n    ) {}\n}",
      a: ["It declares, type-hints and assigns the properties in one place",
          "It makes the constructor implicit",
          "It makes the properties public regardless of the modifier",
          "It is syntax sugar only for public properties"],
      c: 0,
      why: "Promotion removes the three-line ritual of declaring a property, taking a parameter and assigning it. Any visibility works, and it combines with readonly — which is why PHP 8.1 value objects are suddenly so short." },

    { q: "When is __get() called on a PHP object?",
      a: ["Only when reading a property that is inaccessible or does not exist",
          "On every property read",
          "Only for private properties, from anywhere",
          "Only when the property is null"],
      c: 0,
      why: "Magic accessors are a fallback, not a hook on every read. That is why they are invisible to static analysis and to IDE autocompletion — which is the real argument against building an API on them, not performance." },

    { q: "What does declaring a class final actually prevent?",
      a: ["Extending it", "Instantiating it", "Modifying its properties", "Implementing interfaces on it"],
      c: 0,
      why: "final blocks inheritance. It is a design statement — 'I have not designed this to be a base class' — and it makes changes safe later, because nobody can be depending on internals through a subclass. It does not stop composition or mocking against an interface." },

    { q: "What is the difference between self:: and static:: inside a class?",
      a: ["self:: binds to the defining class; static:: binds to the called class (late static binding)",
          "They are identical",
          "static:: only works on static properties",
          "self:: is faster"],
      c: 0,
      why: "In a parent class, self::create() always instantiates the parent even when called on a child; static::create() instantiates the child. This is late static binding, and it is what makes fluent factory methods on base classes work." },
  ],

  /* ------------------------------------------------------- chapter 11 --- */
  "11-indexes-and-transactions": [
    { q: "You have an index on (customer_id, created_at). Which query can use it for the lookup?",
      a: ["WHERE created_at > '2026-01-01'",
          "WHERE customer_id = 5",
          "WHERE created_at > '2026-01-01' ORDER BY customer_id",
          "None of these"],
      c: 1,
      why: "A composite index is usable left-to-right, like a phone book sorted by surname then first name. customer_id alone works; created_at alone cannot, because rows for a given date are scattered across every customer. This 'leftmost prefix' rule is the single most-tested index fact." },

    { q: "Why does wrapping a column in a function usually stop MySQL using its index?",
      code: "WHERE YEAR(created_at) = 2026",
      a: ["The index stores raw column values, not the function's output",
          "MySQL cannot parse functions in WHERE",
          "It only fails on DATE columns",
          "It does not — the optimiser rewrites it"],
      c: 0,
      why: "The predicate becomes non-sargable: the index is sorted by created_at, not by YEAR(created_at), so the engine must compute the function for every row. Rewrite as a range — created_at >= '2026-01-01' AND created_at < '2027-01-01' — and the index works." },

    { q: "Which isolation level is MySQL/InnoDB's default?",
      a: ["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE", "READ UNCOMMITTED"],
      c: 1,
      why: "InnoDB defaults to REPEATABLE READ, unlike PostgreSQL and SQL Server which default to READ COMMITTED. It matters: inside one MySQL transaction you keep seeing the same snapshot, so re-reading a row will not show another transaction's committed change." },

    { q: "What anomaly does READ COMMITTED prevent that READ UNCOMMITTED does not?",
      a: ["Dirty reads", "Phantom reads", "Non-repeatable reads", "Lost updates"],
      c: 0,
      why: "READ COMMITTED guarantees you never see uncommitted data. It still allows non-repeatable reads and phantoms. The ladder is: dirty read → non-repeatable read → phantom, each level removing one more." },

    { q: "What is the most reliable way to avoid deadlocks between two transactions updating the same rows?",
      a: ["Always acquire locks on rows in the same order",
          "Use a longer lock timeout",
          "Raise the isolation level",
          "Retry immediately on failure"],
      c: 0,
      why: "A deadlock needs a cycle. Consistent lock ordering makes a cycle impossible. Retrying is a necessary safety net — deadlocks are normal under load — but ordering is the fix. Raising isolation makes it worse, not better." },

    { q: "In an EXPLAIN plan, what does type: ALL indicate?",
      a: ["A full table scan", "All indexes were used", "All rows matched the filter", "The optimiser tried every plan"],
      c: 0,
      why: "type: ALL is a full scan. On a small lookup table it is fine and often optimal; on a large table with a selective WHERE it means your index is missing or unusable. Read `key` alongside it to see which index, if any, was chosen." },

    { q: "What is a covering index?",
      a: ["An index containing every column the query needs, so the table itself is never read",
          "An index on every column of the table",
          "A unique index over multiple columns",
          "An index that covers NULL values"],
      c: 0,
      why: "If the index holds every column in SELECT and WHERE, the engine answers from the index alone and skips the row lookup. EXPLAIN shows 'Using index'. It is the cheapest large win available on a read-heavy query." },

    { q: "SELECT ... FOR UPDATE inside a transaction does what?",
      a: ["Takes an exclusive lock on the matched rows until the transaction ends",
          "Upgrades the isolation level for that query",
          "Caches the rows for later update",
          "Prevents other sessions from reading the rows"],
      c: 0,
      why: "It locks the matched rows against other writers, which is how you implement 'reserve the last unit in stock' correctly. Other sessions can still read them normally under MVCC — it blocks writers and other FOR UPDATE readers, not plain SELECTs." },
  ],

  /* ------------------------------------------------------- chapter 12 --- */
  "12-orm-in-depth": [
    { q: "What is the N+1 query problem?",
      a: ["One query fetches N parents, then a separate query runs per parent to fetch its relation",
          "A query returning N+1 rows instead of N",
          "N joins producing one oversized result",
          "A query that must be retried N times"],
      c: 0,
      why: "Fetch 100 orders, then touch $order->customer in a loop: 1 + 100 queries. It never shows up on a seeded dev database with ten rows, and it is the most common cause of a slow Laravel page in production." },

    { q: "In Eloquent, how do you fix an N+1 on $order->customer?",
      a: ["Order::with('customer')->get()", "Order::all()->load()", "Order::query()->join('customers')", "Set lazy loading to false globally"],
      c: 0,
      why: "with() eager-loads: two queries total, the second an IN over the collected keys. load() also exists for eager-loading after the fact on an already-fetched collection. Laravel can also be told to throw on lazy loading in development — preventLazyLoading() — which turns this from a production surprise into a local failure." },

    { q: "What is the core difference between Eloquent and Doctrine?",
      a: ["Eloquent is Active Record — the model knows how to save itself; Doctrine is a Data Mapper — persistence lives in a separate layer",
          "Eloquent supports MySQL only",
          "Doctrine cannot do migrations",
          "Eloquent has no relationships"],
      c: 0,
      why: "Active Record is faster to write and couples your domain object to the database. Data Mapper keeps entities persistence-ignorant at the cost of more ceremony. That is the whole trade-off, and it is why Doctrine dominates where the domain model is complex." },

    { q: "In Doctrine, what does the EntityManager's unit of work do?",
      a: ["Tracks loaded entities and computes the changes to flush in one transaction",
          "Manages the database connection pool",
          "Caches query results between requests",
          "Validates entities before insert"],
      c: 0,
      why: "It watches managed entities, and on flush() computes the diff and writes it as one transaction. That is why you do not call save() per entity in Doctrine — and why an entity fetched and modified will be written even if you never explicitly persist it." },

    { q: "Why should a database migration never be edited after it has run in production?",
      a: ["Machines that already ran it will not re-run it, so they silently diverge",
          "Migrations are checksummed and will refuse to run",
          "It corrupts the schema table",
          "It only matters with multiple developers"],
      c: 0,
      why: "The migrations table records which have run. Editing one leaves every environment that already applied it in the old shape with no error anywhere. Add a new migration instead — the same discipline as append-only quiz ids, and for the same reason." },

    { q: "What does Eloquent's chunk() method solve?",
      a: ["Loading a huge result set without exhausting memory",
          "Splitting a query across several connections",
          "Batching inserts into one statement",
          "Paginating for a UI"],
      c: 0,
      why: "chunk() pages through results in fixed batches so you never hold the whole set in memory. lazy() / cursor() do the same with a generator. It is the standard fix for a nightly job that dies with 'Allowed memory size exhausted'." },
  ],

  /* ------------------------------------------------------- chapter 15 --- */
  "15-api-security": [
    { q: "Why does a prepared statement prevent SQL injection?",
      a: ["The query structure is sent and parsed separately from the values, so a value can never become syntax",
          "It escapes dangerous characters in the values",
          "It restricts the query to a single statement",
          "It validates values against the column type"],
      c: 0,
      why: "This is the distinction that matters: escaping is a filter that can be wrong, while a parameter is never parsed as SQL at all. Saying 'it escapes the input' in an interview is the answer of someone who has not understood why it works." },

    { q: "Which PHP function should hash a user password?",
      a: ["password_hash($p, PASSWORD_ARGON2ID)", "hash('sha256', $p)", "md5($p . $salt)", "crypt($p)"],
      c: 0,
      why: "password_hash() is deliberately SLOW and stores the algorithm, cost and salt inside the resulting string. SHA-256 and MD5 are fast, which is precisely the wrong property against a GPU. Verify with password_verify() and re-hash on login when password_needs_rehash() says so." },

    { q: "Where does a stored XSS payload get neutralised?",
      a: ["On output, by escaping for the context it is rendered into",
          "On input, by stripping tags",
          "In the database, by a column constraint",
          "By setting the correct charset"],
      c: 0,
      why: "Escape on output, because the correct escaping depends on where the value lands — HTML body, an attribute, inside JavaScript, a URL. Sanitising on input destroys data and still gets it wrong, since you cannot know at write time how it will be rendered." },

    { q: "What does a CSRF token actually prove?",
      a: ["That the request came from a page your own site served",
          "That the user is authenticated",
          "That the payload was not tampered with",
          "That the origin header is trusted"],
      c: 0,
      why: "It proves origin, not identity. The attack works precisely because the browser sends the session cookie automatically; the token is the one thing a cross-site form cannot know. This is also why it is unnecessary for a stateless API using an Authorization header." },

    { q: "Why is storing a JWT in localStorage generally worse than in an httpOnly cookie?",
      a: ["JavaScript can read localStorage, so any XSS steals the token",
          "localStorage has a smaller size limit",
          "localStorage is sent with every request",
          "Cookies cannot be stolen"],
      c: 0,
      why: "httpOnly cookies are unreadable from JavaScript, so XSS cannot exfiltrate them — at the cost of needing CSRF protection. The honest framing is a trade between two attacks, not a clean win, and saying so is the strong interview answer." },

    { q: "What makes a JWT unable to be revoked before it expires?",
      a: ["It is validated by signature alone, with no server-side lookup",
          "It is encrypted with a public key",
          "The expiry is embedded in the signature",
          "It is stored on the client"],
      c: 0,
      why: "Statelessness is the feature and the cost. It is why access tokens are given short lifetimes (minutes) and paired with a stateful, revocable refresh token — the design the accounts service in this repository uses." },
  ],

  /* ------------------------------------------------------- chapter 26 --- */
  "26-git": [
    { q: "What does git rebase do that git merge does not?",
      a: ["Rewrites your commits onto a new base, producing linear history and new hashes",
          "Combines branches without a commit",
          "Deletes the source branch",
          "Merges without conflicts"],
      c: 0,
      why: "Rebase replays your commits on top of the target, so they get NEW hashes. That is why the rule is: rebase your own unpushed branch to tidy it; never rebase a branch other people have pulled, because their history and yours no longer share those commits." },

    { q: "You committed to the wrong branch and have not pushed. What is the cleanest fix?",
      a: ["git reset --soft HEAD~1, switch branch, commit again",
          "git revert HEAD then cherry-pick",
          "git checkout -- .",
          "git push --force"],
      c: 0,
      why: "reset --soft moves the branch pointer back but leaves the changes staged, so you can carry them to the right branch. --mixed keeps them unstaged; --hard discards them, which is the one to be careful with." },

    { q: "What does git cherry-pick do?",
      a: ["Applies a single commit from elsewhere onto the current branch as a new commit",
          "Merges only the files you select",
          "Splits a commit into several",
          "Reorders commits interactively"],
      c: 0,
      why: "It copies one commit's changes, producing a new commit with a new hash. Useful for pulling one hotfix from main into a release branch. Overusing it produces duplicated commits that later confuse a merge." },

    { q: "What is git reflog for?",
      a: ["Recovering commits that are no longer reachable from any branch",
          "Showing the remote's history",
          "Logging who pushed what",
          "Showing the diff of each commit"],
      c: 0,
      why: "It records where HEAD has been, including after a bad reset or a deleted branch. It is the answer to 'I destroyed my work with git reset --hard' — the commits usually still exist and reflog is how you find them." },
  ],

});

# Golden rules — the whole course on one page

**GENERATED FILE.** Written by `tools/viva-extract.php` from the `.rules` block of
every chapter, and read by `tools/viva-deck.php` to produce `site/assets/rules.js`.
Edit the chapter, not this file.

Blueprint §3.4 has this file authored by hand and the chapters referring to it. In this
subject the chapters were written first, so the arrow runs the other way — but the
principle it protects is the same one: the rule exists in exactly one place, and
everything downstream is derived from it.

The tiers below come from `course/viva-tiers.json`, which is the one part of this
document that is an editorial judgement rather than an extraction.

## The twelve that decide interviews

If you only rehearse twelve, rehearse these. Each links to the chapter that earns it.

1. **PHP 8 casts the number to string** when comparing against a non-numeric string. `0 == "foo"` is now false. — [02](../site/chapters/02-php-fundamentals.html)
2. **`declare(strict_types=1)` in every file.** It is per-file and per-call-site; one central declaration does not exist. — [02](../site/chapters/02-php-fundamentals.html)
3. **Arrays by value, objects by handle.** — [02](../site/chapters/02-php-fundamentals.html)
4. **Interface for a contract, abstract class for shared state** and you only get one parent. — [03](../site/chapters/03-oop-in-php.html)
5. **Money is never a float.** Integer minor units, or BCMath. — [03](../site/chapters/03-oop-in-php.html)
6. **Prepared statements because values never reach the parser** not because they escape. — [15](../site/chapters/15-api-security.html)
7. **Identifiers cannot be bound.** Allowlist them. — [15](../site/chapters/15-api-security.html)
8. **Escape on output, for the context.** Sanitising on input loses data and still fails. — [15](../site/chapters/15-api-security.html)
9. **`password_hash` with Argon2id.** Slow is the point. — [15](../site/chapters/15-api-security.html)
10. **N+1 is the default failure mode of an ORM.** Eager-load with `with()`, and turn on `preventLazyLoading()` in development. — [12](../site/chapters/12-orm-in-depth.html)
11. **Composite indexes work left to right.** `(a, b)` cannot serve a query filtering only on `b`. — [11](../site/chapters/11-indexes-and-transactions.html)
12. **A function on a column kills the index.** Rewrite it as a range. — [11](../site/chapters/11-indexes-and-transactions.html)

## The six that separate a senior candidate

Not harder, but the ones that show you have operated something rather than only built it.

1. **Shared-nothing: nothing survives the request.** Persist in Redis or the database. — [08](../site/chapters/08-memory-and-references.html)
2. **Middleware is an onion.** Before `$next()` on the way in, after it on the way out; order is behaviour, not style. — [16](../site/chapters/16-the-framework.html)
3. **Document root is `public/`.** The single most consequential line. — [29](../site/chapters/29-cloud-hosting.html)
4. **Dispatch after commit.** The worker is faster than your transaction. — [22](../site/chapters/22-queues-and-messaging.html)
5. **Measure, fix the query, then cache.** Never in the other order. — [20](../site/chapters/20-caching.html)
6. **An invoice is a state machine,** not a boolean. The SDI answers asynchronously. — [33](../site/chapters/33-gestionali-and-sdi.html)

## [Chapter 00 — The job posting, decoded](../site/chapters/00-the-job-posting.html)

*Start here*

1. **A requirement line is a task, not a skill.** Unpack it into the Tuesday it describes. — [00](../site/chapters/00-the-job-posting.html)
2. **The qualifier is the requirement.** Gradita and consolidata are different jobs. — [00](../site/chapters/00-the-job-posting.html)
3. **Two thirds is a candidate.** The list is a wish list, not a gate. — [00](../site/chapters/00-the-job-posting.html)
4. **Prepare the unwritten four** debugging, legacy, explaining yourself, and where it deploys. — [00](../site/chapters/00-the-job-posting.html)
5. **Read the advert’s chapters, not all of them.** Depth on the quoted lines beats breadth on everything. — [00](../site/chapters/00-the-job-posting.html)

## [Chapter 01 — PHP the platform](../site/chapters/01-php-platform.html)

*Part 1 — The platform and the language*

1. **Name the version you are speaking about.** "On 8.1+" is a senior habit. — [01](../site/chapters/01-php-platform.html)
2. **CLI and FPM are different worlds** different ini file, different limits. — [01](../site/chapters/01-php-platform.html)
3. **`pm.max_children` is a concurrency ceiling,** sized by RAM, not optimism. — [01](../site/chapters/01-php-platform.html)
4. **Every outbound call gets a timeout.** A blocked worker is a worker serving nobody. — [01](../site/chapters/01-php-platform.html)
5. **Reload FPM on deploy** when `validate_timestamps=0`, or you shipped nothing. — [01](../site/chapters/01-php-platform.html)
6. **`install` on servers, `update` on your machine.** The lock file is the point. — [01](../site/chapters/01-php-platform.html)
7. **`display_errors=Off` in production.** Log it, never show it. — [01](../site/chapters/01-php-platform.html)

## [Chapter 02 — Fundamentals: types, juggling, strings, arrays](../site/chapters/02-php-fundamentals.html)

*Part 1 — The platform and the language*

1. **`===` unless you have a reason.** Loose comparison is a decision, not a default. — [02](../site/chapters/02-php-fundamentals.html)
2. **`??` for "not set", `?:` for "falsy".** They are not interchangeable, and `0` is where they differ. — [02](../site/chapters/02-php-fundamentals.html)
3. **An array is an ordered hash map.** Everything surprising about it follows from that. — [02](../site/chapters/02-php-fundamentals.html) · [06](../site/chapters/06-arrays-and-collections.html)
4. **`+` keeps left, `array_merge()` keeps right** and merge renumbers integer keys. — [02](../site/chapters/02-php-fundamentals.html)

## [Chapter 03 — OOP in PHP](../site/chapters/03-oop-in-php.html)

*Part 1 — The platform and the language*

1. **A trait is not a type.** It buys reuse and no polymorphism, so you cannot type-hint it. — [03](../site/chapters/03-oop-in-php.html)
2. **`tryFrom()` for anything from outside;** `from()` only when an unknown value genuinely is a bug. — [03](../site/chapters/03-oop-in-php.html)
3. **`readonly` is shallow.** The reference is frozen; the object behind it is not. — [03](../site/chapters/03-oop-in-php.html)
4. **Put the transition rule on the enum.** Then the state machine cannot drift out of step with the states. — [03](../site/chapters/03-oop-in-php.html)
5. **`static::` when a subclass should get itself back,** `self::` when it genuinely must be this class. — [03](../site/chapters/03-oop-in-php.html)

## [Chapter 04 — Closures, callables and generators](../site/chapters/04-closures-and-generators.html)

*Part 1 — The platform and the language*

1. **`use ($x)` copies at definition time.** Capture by reference only when you mean to share. — [04](../site/chapters/04-closures-and-generators.html)
2. **Arrow functions capture everything, by value, one expression.** That is the whole contract. — [04](../site/chapters/04-closures-and-generators.html)
3. **Prefer `$obj->method(...)`** over string and array callables — it fails where you wrote it. — [04](../site/chapters/04-closures-and-generators.html)
4. **If it does not fit in memory, `yield` it.** O(1) instead of O(n). — [04](../site/chapters/04-closures-and-generators.html)
5. **Generators clean up in `finally`,** because the consumer may break early. — [04](../site/chapters/04-closures-and-generators.html)
6. **A generator is single-use and uncountable.** Wanting `count()` means you wanted an array. — [04](../site/chapters/04-closures-and-generators.html)

## [Chapter 05 — SOLID and design patterns](../site/chapters/05-solid-and-patterns.html)

*Part 1 — The platform and the language*

1. **One reason to change means one person who can ask.** Count the people, not the methods. — [05](../site/chapters/05-solid-and-patterns.html)
2. **Abstract at the second case,** not the first. The second case shows you the seam. — [05](../site/chapters/05-solid-and-patterns.html)
3. **`throw new BadMethodCallException` is an ISP violation** that reported itself. — [05](../site/chapters/05-solid-and-patterns.html)
4. **The consumer owns the interface.** That is what makes it inversion. — [05](../site/chapters/05-solid-and-patterns.html)
5. **DIP is the principle, DI the mechanism, the container the tool.** Three different words. — [05](../site/chapters/05-solid-and-patterns.html)
6. **An interface with one implementation and no fake is ceremony.** — [05](../site/chapters/05-solid-and-patterns.html)
7. **Three patterns you used beats eleven you named.** — [05](../site/chapters/05-solid-and-patterns.html)

## [Chapter 06 — Arrays, SPL and the array_* family](../site/chapters/06-arrays-and-collections.html)

*Part 1 — The platform and the language*

1. **`array_values()` before `json_encode()`** whenever you filtered. — [06](../site/chapters/06-arrays-and-collections.html)
2. **Searching by value is O(n).** Flip it and search by key. — [06](../site/chapters/06-arrays-and-collections.html)
3. **`in_array` always with `strict: true`.** — [06](../site/chapters/06-arrays-and-collections.html)
4. **`unset($v)` after `foreach` by reference.** Always. — [06](../site/chapters/06-arrays-and-collections.html)
5. **Copy-on-write means passing is cheap.** `&` for speed is a myth with a mutation bug attached. — [06](../site/chapters/06-arrays-and-collections.html)
6. **`array_key_exists` when null is a real value;** `isset` otherwise. — [06](../site/chapters/06-arrays-and-collections.html)

## [Chapter 07 — Errors, exceptions and async](../site/chapters/07-errors-and-async.html)

*Part 1 — The platform and the language*

1. **`Error` is not an `Exception`.** Catch `Throwable` at the edge. — [07](../site/chapters/07-errors-and-async.html)
2. **Warnings are not exceptions** until you make them so with an error handler. — [07](../site/chapters/07-errors-and-async.html)
3. **Only a shutdown function sees a real fatal.** Without one, the log just stops. — [07](../site/chapters/07-errors-and-async.html)
4. **Always pass `$previous`.** An unchained rethrow destroys the evidence. — [07](../site/chapters/07-errors-and-async.html)
5. **Catch the narrowest type you can act on;** catch broadly only at the boundary. — [07](../site/chapters/07-errors-and-async.html)
6. **No empty catch.** Log it, or do not catch it. — [07](../site/chapters/07-errors-and-async.html)
7. **Slow work goes on a queue,** not into an async experiment inside the request. — [07](../site/chapters/07-errors-and-async.html)

## [Chapter 08 — Memory, references and the request lifecycle](../site/chapters/08-memory-and-references.html)

*Part 1 — The platform and the language*

1. **Re-read every `static` when code moves into a worker.** Lifetime changed underneath it. — [08](../site/chapters/08-memory-and-references.html)
2. **Destruction is deterministic** refcount zero, right now — except for cycles. — [08](../site/chapters/08-memory-and-references.html)
3. **Objects are handles.** You rarely want `&$object`. — [08](../site/chapters/08-memory-and-references.html)
4. **`clone` is shallow,** like `readonly`. — [08](../site/chapters/08-memory-and-references.html)
5. **Never put references in arrays.** — [08](../site/chapters/08-memory-and-references.html)
6. **Out of memory means unbounded rows** nine times out of ten. Stream it. — [08](../site/chapters/08-memory-and-references.html)

## [Chapter 09 — Databases and MySQL/MariaDB](../site/chapters/09-databases-and-mysql.html)

*Part 2 — Data*

1. **InnoDB, always.** Transactions, foreign keys, row-level locking. — [09](../site/chapters/09-databases-and-mysql.html)
2. **`utf8mb4`, never `utf8`** and set it on the column, the connection and the DSN. — [09](../site/chapters/09-databases-and-mysql.html)
3. **Money is `DECIMAL` or integer cents.** Never a float, in the database or in PHP. — [09](../site/chapters/09-databases-and-mysql.html)
4. **Identifiers are strings.** Partita IVA, CAP, codice destinatario — you never add them up. — [09](../site/chapters/09-databases-and-mysql.html)
5. **Sequential primary keys.** In InnoDB the primary key is the physical row order. — [09](../site/chapters/09-databases-and-mysql.html)
6. **Declare foreign keys, and choose `ON DELETE` on purpose.** — [09](../site/chapters/09-databases-and-mysql.html)
7. **Prefer `NOT NULL`.** Every nullable column is a branch in every query. — [09](../site/chapters/09-databases-and-mysql.html)
8. **Copy the price onto the order line.** History is a fact, not a duplicate. — [09](../site/chapters/09-databases-and-mysql.html)

## [Chapter 10 — SQL: querying](../site/chapters/10-sql-querying.html)

*Part 2 — Data*

1. **Filtering the right table in `WHERE` turns a LEFT JOIN into an INNER JOIN.** Put the condition in `ON`. — [10](../site/chapters/10-sql-querying.html)
2. **`WHERE` before grouping, `HAVING` after.** Filter as early as you can. — [10](../site/chapters/10-sql-querying.html)
3. **`COUNT(*)` counts rows; `COUNT(col)` skips NULLs.** After a LEFT JOIN you almost always want the second. — [10](../site/chapters/10-sql-querying.html)
4. **Top-N-per-group is a window function.** `GROUP BY` cannot express it. — [10](../site/chapters/10-sql-querying.html)
5. **You cannot filter a window function in `WHERE`** wrap it in a CTE and filter outside. — [10](../site/chapters/10-sql-querying.html)
6. **`NOT IN` with a NULL returns nothing.** Use `NOT EXISTS`. — [10](../site/chapters/10-sql-querying.html)
7. **Name your steps with CTEs.** The query you can read in six months is the one you can fix. — [10](../site/chapters/10-sql-querying.html)

## [Chapter 10b — Views, functions and stored procedures](../site/chapters/10b-views-and-procedures.html)

*Part 2 — Data*

1. **A view that aggregates materialises.** Filtering it from outside is too late. — [10b](../site/chapters/10b-views-and-procedures.html)
2. **MySQL has no materialised views.** A "materialised view" is a summary table with a staleness question. — [10b](../site/chapters/10b-views-and-procedures.html)
3. **A function in a `WHERE` clause kills the index.** — [10b](../site/chapters/10b-views-and-procedures.html)
4. **Routines need an `EXIT HANDLER`,** or a failure leaves the transaction open. — [10b](../site/chapters/10b-views-and-procedures.html)
5. **Triggers are invisible,** per-row, and lie to your ORM. — [10b](../site/chapters/10b-views-and-procedures.html)
6. **Dump routines into Git** before doing anything else. — [10b](../site/chapters/10b-views-and-procedures.html)
7. **Find the other writers** before moving a rule out of the database. — [10b](../site/chapters/10b-views-and-procedures.html)

## [Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks](../site/chapters/11-indexes-and-transactions.html)

*Part 2 — Data*

1. **Measure with `EXPLAIN`, not intuition** read `type`, `key`, `rows`, `Extra`. — [11](../site/chapters/11-indexes-and-transactions.html)
2. **Every index makes writes slower.** That is the answer to "why not index everything". — [11](../site/chapters/11-indexes-and-transactions.html)
3. **InnoDB defaults to REPEATABLE READ.** Most other engines do not. — [11](../site/chapters/11-indexes-and-transactions.html)
4. **Consistent lock ordering prevents deadlocks; retries survive them.** You need both. — [11](../site/chapters/11-indexes-and-transactions.html)
5. **Never hold a database lock across user think-time.** That is what a version column is for. — [11](../site/chapters/11-indexes-and-transactions.html)

## [Chapter 12 — The ORM in depth: Eloquent and Doctrine](../site/chapters/12-orm-in-depth.html)

*Part 2 — Data*

1. **Active Record couples the model to the schema; Data Mapper does not.** Choose on how complex the domain is. — [12](../site/chapters/12-orm-in-depth.html)
2. **In Doctrine, a managed entity is saved on flush** whether you persisted it or not. — [12](../site/chapters/12-orm-in-depth.html)
3. **Migrations are append-only** once they have run outside your machine. — [12](../site/chapters/12-orm-in-depth.html)
4. **`all()` is a memory bomb.** `chunkById()` when you are also writing. — [12](../site/chapters/12-orm-in-depth.html)
5. **An ORM is a convenience, not a replacement for SQL.** Read the generated query when it matters. — [12](../site/chapters/12-orm-in-depth.html)

## [Chapter 13 — HTTP, REST, PSR-7 and PSR-15](../site/chapters/13-http-and-psr.html)

*Part 3 — The web*

1. **Safe means no state change; idempotent means repeating is harmless.** It decides what may be retried. — [13](../site/chapters/13-http-and-psr.html)
2. **`POST` is not idempotent** use an idempotency key on anything that takes money or creates an order. — [13](../site/chapters/13-http-and-psr.html)
3. **Never change state on a `GET`.** Something will crawl it. — [13](../site/chapters/13-http-and-psr.html)
4. **400 is malformed, 422 is invalid; 401 is who are you, 403 is no.** — [13](../site/chapters/13-http-and-psr.html)
5. **409 for a stale version,** and return the current state with it. — [13](../site/chapters/13-http-and-psr.html)
6. **Errors need a schema too.** RFC 9457 plus a trace id. — [13](../site/chapters/13-http-and-psr.html)
7. **PSR-7 messages are immutable.** `with*()` returns a new object; reassign it. — [13](../site/chapters/13-http-and-psr.html)

## [Chapter 14 — Building an API](../site/chapters/14-building-an-api.html)

*Part 3 — The web*

1. **Validate at the boundary into a typed object,** and never trust an array again. — [14](../site/chapters/14-building-an-api.html)
2. **Domain invariants live on the model,** not in the request class the worker never runs. — [14](../site/chapters/14-building-an-api.html)
3. **Never `create($request->all())`.** `validated()`, always. — [14](../site/chapters/14-building-an-api.html)
4. **422 for invalid content, 400 for unparseable,** and report every field at once. — [14](../site/chapters/14-building-an-api.html)
5. **Resources, not models, in responses.** Money in minor units, dates ISO-8601, ids as strings. — [14](../site/chapters/14-building-an-api.html)
6. **Keyset pagination for feeds,** offset only where a page number is genuinely needed. — [14](../site/chapters/14-building-an-api.html)
7. **Problem Details plus a correlation id.** Adding a field is safe; removing one is not. — [14](../site/chapters/14-building-an-api.html)

## [Chapter 14b — Integrations: webhooks, SOAP, CSV and XML](../site/chapters/14b-integrations.html)

*Part 3 — The web*

1. **Two timeouts on every outbound call.** No timeout is an outage waiting for someone else's. — [14b](../site/chapters/14b-integrations.html)
2. **Retry 429 and 5xx with backoff and jitter;** never retry a 4xx. — [14b](../site/chapters/14b-integrations.html)
3. **A retried POST needs an idempotency key,** or it is a business decision. — [14b](../site/chapters/14b-integrations.html)
4. **Verify webhook signatures over the raw body** with `hash_equals()`. — [14b](../site/chapters/14b-integrations.html)
5. **Webhooks are at-least-once.** Unique constraint on the event id; let the database win the race. — [14b](../site/chapters/14b-integrations.html)
6. **Store the payload, answer 200, work on the queue.** Replayability comes free. — [14b](../site/chapters/14b-integrations.html)
7. **Untrusted XML is an XXE risk.** No external entities, no network. — [14b](../site/chapters/14b-integrations.html)
8. **CSV means encoding, partial files and the comma decimal.** All three, every time. — [14b](../site/chapters/14b-integrations.html)

## [Chapter 15 — Security: OWASP, injection, XSS, CSRF and auth](../site/chapters/15-api-security.html)

*Part 3 — The web*

1. **One error message for bad user and bad password,** and burn equivalent time on the unknown path. — [15](../site/chapters/15-api-security.html)
2. **A CSRF token proves origin, not identity** and is redundant for header-authenticated APIs. — [15](../site/chapters/15-api-security.html)
3. **A JWT cannot be revoked.** Short access token, revocable refresh token. — [15](../site/chapters/15-api-security.html)
4. **`hash_equals()` for secrets,** never `===`. — [15](../site/chapters/15-api-security.html)

## [Chapter 16 — The framework: Laravel and Symfony](../site/chapters/16-the-framework.html)

*Part 3 — The web*

1. **The container resolves from type hints.** Bind an interface and you have a seam. — [16](../site/chapters/16-the-framework.html)
2. **A Laravel singleton lasts one request.** Shared-nothing means there is no longer scope. — [16](../site/chapters/16-the-framework.html)
3. **A facade is a container lookup wearing static syntax** convenient, and it hides dependencies. — [16](../site/chapters/16-the-framework.html)
4. **Validate in a form request,** so the controller only ever sees valid input. `authorize()` is a separate question from `rules()`. — [16](../site/chapters/16-the-framework.html)
5. **Laravel is built on Symfony components.** They are not opposite worlds. — [16](../site/chapters/16-the-framework.html)
6. **Learn what the framework does, not just how to call it.** That is the entire difference the interview is measuring. — [16](../site/chapters/16-the-framework.html)

## [Chapter 16b — Legacy PHP and how to migrate it](../site/chapters/16b-legacy-php.html)

*Part 3 — The web*

1. **Runnable locally, then Git, then tests, then changes.** In that order. — [16b](../site/chapters/16b-legacy-php.html)
2. **Characterisation tests capture what it does,** bugs included. — [16b](../site/chapters/16b-legacy-php.html)
3. **Never propose the rewrite.** Strangle it, one route at a time. — [16b](../site/chapters/16b-legacy-php.html)
4. **Upgrade one version at a time,** with Rector for the mechanical part. — [16b](../site/chapters/16b-legacy-php.html)
5. **PHPStan with a baseline:** freeze old debt, fail on new. — [16b](../site/chapters/16b-legacy-php.html) · [27](../site/chapters/27-tooling-and-xdebug.html)
6. **Sprout new code beside the old;** do not untangle it first. — [16b](../site/chapters/16b-legacy-php.html)
7. **Refactor and behaviour change are two commits.** Always. — [16b](../site/chapters/16b-legacy-php.html)

## [Chapter 17 — HTML, CSS and the DOM](../site/chapters/17-frontend-basics.html)

*Part 3 — The web*

1. **The tag is a contract.** `<button>` for actions, `<a href>` for navigation. — [17](../site/chapters/17-frontend-basics.html)
2. **Specificity is (ids, classes, elements),** then source order. One id outranks ten classes. — [17](../site/chapters/17-frontend-basics.html)
3. **`:where()` for defaults, `@layer` for order.** That is the end of `!important`. — [17](../site/chapters/17-frontend-basics.html)
4. **A mystery gap is a collapsed margin.** Vertical only, never in flex or grid. — [17](../site/chapters/17-frontend-basics.html)
5. **Flex is one dimension, grid is two.** `min-width: 0` when a flex item will not shrink. — [17](../site/chapters/17-frontend-basics.html)
6. **`auto-fill` + `minmax` + `gap`** is a responsive layout with no media query. — [17](../site/chapters/17-frontend-basics.html)
7. **Tab through it before you call it done.** Contrast, labels, focus. — [17](../site/chapters/17-frontend-basics.html)

## [Chapter 17b — JavaScript as a language](../site/chapters/17b-javascript.html)

*Part 3 — The web*

1. **Microtasks drain before the next macrotask.** `.then` beats `setTimeout(0)`. — [17b](../site/chapters/17b-javascript.html)
2. **One thread: a long loop freezes the page.** Not slow — blocked. — [17b](../site/chapters/17b-javascript.html)
3. **`await` in a loop is sequential.** Independent work goes in `Promise.all`. — [17b](../site/chapters/17b-javascript.html)
4. **Never `async` inside `forEach`.** It ignores the promise. — [17b](../site/chapters/17b-javascript.html)
5. **`fetch` does not reject on 404 or 500.** Check `res.ok`. — [17b](../site/chapters/17b-javascript.html)
6. **Arrow functions for callbacks,** because `this` is lexical. — [17b](../site/chapters/17b-javascript.html)
7. **`===` always;** `??` when `0` and `''` are real values. — [17b](../site/chapters/17b-javascript.html)

## [Chapter 18 — SPAs, Vue and TypeScript](../site/chapters/18-spa-and-vue.html)

*Part 3 — The web*

1. **Reactivity tracks what the render read.** Re-render is queued, so `nextTick` before touching the DOM. — [18](../site/chapters/18-spa-and-vue.html)
2. **Destructuring a `reactive()` loses reactivity.** — [18](../site/chapters/18-spa-and-vue.html)
3. **`computed` to derive, `watch` for side effects.** A syncing `watch` is a missed `computed`. — [18](../site/chapters/18-spa-and-vue.html)
4. **Props down, events up.** Never mutate a prop. — [18](../site/chapters/18-spa-and-vue.html)
5. **`:key` is an identity,** never the array index. — [18](../site/chapters/18-spa-and-vue.html)
6. **Server state is a cache,** not global state. Keep them apart. — [18](../site/chapters/18-spa-and-vue.html)
7. **Generate types from the API,** or TypeScript is describing a shape nothing verifies. — [18](../site/chapters/18-spa-and-vue.html)
8. **CRUD does not need an SPA.** Know when it does. — [18](../site/chapters/18-spa-and-vue.html)

## [Chapter 19 — Blade, Twig, Livewire and Inertia](../site/chapters/19-server-rendered-ui.html)

*Part 3 — The web*

1. **`{{ }}` escapes, `{!! !!}` does not.** Grep for the second one. — [19](../site/chapters/19-server-rendered-ui.html)
2. **HTML escaping is not JavaScript escaping.** `@json()` for data in a script. — [19](../site/chapters/19-server-rendered-ui.html)
3. **Validate the scheme of any user-supplied URL.** `javascript:` survives escaping. — [19](../site/chapters/19-server-rendered-ui.html)
4. **A lazy relation in a loop in a view is an N+1** the controller does not show. — [19](../site/chapters/19-server-rendered-ui.html)
5. **Livewire public properties travel to the browser and back.** Nothing big, nothing secret. — [19](../site/chapters/19-server-rendered-ui.html)
6. **`.live.debounce`, not `.live`,** on a text input. — [19](../site/chapters/19-server-rendered-ui.html)
7. **Build the API when someone else consumes it,** not to make a web page interactive. — [19](../site/chapters/19-server-rendered-ui.html)

## [Chapter 20 — Caching: Redis, OPcache and HTTP](../site/chapters/20-caching.html)

*Part 4 — Fast at scale*

1. **The key contains everything that changes the answer** tenant, locale, version. — [20](../site/chapters/20-caching.html)
2. **TTL is a business decision:** how stale can you afford to be? — [20](../site/chapters/20-caching.html)
3. **Prefer key versioning to deletion.** There is no delete to forget. — [20](../site/chapters/20-caching.html)
4. **Lock or serve stale on recompute.** Expiry on a busy key is a stampede. — [20](../site/chapters/20-caching.html)
5. **Jitter TTLs** so warmed keys do not expire together. — [20](../site/chapters/20-caching.html)
6. **Separate Redis for cache and queue.** Eviction must not eat a job. — [20](../site/chapters/20-caching.html)
7. **`private` on anything user-specific.** A CDN takes `public` literally. — [20](../site/chapters/20-caching.html)

## [Chapter 21 — Search: Elasticsearch and Meilisearch](../site/chapters/21-search.html)

*Part 4 — Fast at scale*

1. **`LIKE '%x%'` cannot use an index** and has no relevance, which is worse. — [21](../site/chapters/21-search.html)
2. **The analyser must be identical at index and query time.** Accents and stemming, always, for Italian. — [21](../site/chapters/21-search.html)
3. **Start with `FULLTEXT`,** escalate to Meilisearch, escalate to Elasticsearch only for a reason you can name. — [21](../site/chapters/21-search.html)
4. **Index only what is searched or filtered.** — [21](../site/chapters/21-search.html)
5. **Index on a queue,** or their outage is your outage. — [21](../site/chapters/21-search.html)
6. **Bulk updates skip model events.** Re-import after them. — [21](../site/chapters/21-search.html)
7. **Reindex into a new index and swap the alias.** — [21](../site/chapters/21-search.html)
8. **Log the zero-result searches.** That is your synonym list. — [21](../site/chapters/21-search.html)

## [Chapter 22 — Queues, workers and messaging](../site/chapters/22-queues-and-messaging.html)

*Part 4 — Fast at scale*

1. **Queue what the response does not depend on.** Not merely what is slow. — [22](../site/chapters/22-queues-and-messaging.html)
2. **Every job is idempotent,** because delivery is at-least-once. — [22](../site/chapters/22-queues-and-messaging.html)
3. **Bounded retries with backoff;** fail permanent errors immediately. — [22](../site/chapters/22-queues-and-messaging.html)
4. **Job timeout below the broker's visibility timeout,** or it runs twice concurrently. — [22](../site/chapters/22-queues-and-messaging.html)
5. **`queue:restart` on every deploy.** Workers hold the old code. — [22](../site/chapters/22-queues-and-messaging.html)
6. **Separate queues by latency** so a report cannot block an email. — [22](../site/chapters/22-queues-and-messaging.html)
7. **Alert on `failed_jobs` and on queue depth.** An unwatched failed table is silent data loss. — [22](../site/chapters/22-queues-and-messaging.html)

## [Chapter 22b — Microservices — and when a monolith wins](../site/chapters/22b-microservices.html)

*Part 4 — Fast at scale*

1. **Independent deployment is the real benefit,** and it is organisational. — [22b](../site/chapters/22b-microservices.html)
2. **Distribution never makes a page faster.** It adds a network hop. — [22b](../site/chapters/22b-microservices.html)
3. **Losing the transaction is the biggest cost.** A saga needs a business decision, not just code. — [22b](../site/chapters/22b-microservices.html)
4. **Split by business capability,** never by technical layer. — [22b](../site/chapters/22b-microservices.html)
5. **If they cannot deploy separately, it is a distributed monolith.** — [22b](../site/chapters/22b-microservices.html)
6. **Modular monolith first,** with boundaries enforced in CI. — [22b](../site/chapters/22b-microservices.html)
7. **One force, one service.** Extract for a named reason. — [22b](../site/chapters/22b-microservices.html)
8. **Never call their architecture wrong.** Ask how they handle consistency instead. — [22b](../site/chapters/22b-microservices.html)

## [Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD](../site/chapters/23-architecture.html)

*Part 4 — Fast at scale*

1. **Dependencies point inward.** The domain compiles without the framework. — [23](../site/chapters/23-architecture.html)
2. **Getters and setters plus a 900-line service is an anaemic model.** — [23](../site/chapters/23-architecture.html)
3. **Value objects first.** Highest return of anything in this chapter. — [23](../site/chapters/23-architecture.html)
4. **One transaction, one aggregate.** Needing two means the boundary is wrong. — [23](../site/chapters/23-architecture.html)
5. **Speak the business's words** in the code, untranslated. — [23](../site/chapters/23-architecture.html)
6. **Commands through the domain, queries straight to SQL.** — [23](../site/chapters/23-architecture.html)
7. **Event sourcing is not CQRS,** and it is not a first-project decision. — [23](../site/chapters/23-architecture.html)
8. **Enforce boundaries in CI,** or they are decoration. — [23](../site/chapters/23-architecture.html)

## [Chapter 24 — Testing: PHPUnit, Pest and test doubles](../site/chapters/24-testing.html)

*Part 5 — Building it properly*

1. **Mock the boundaries you do not own.** Use real objects inside your own domain. — [24](../site/chapters/24-testing.html)
2. **Test against the database you deploy.** SQLite-instead-of-MySQL hides the bugs you were hunting. — [24](../site/chapters/24-testing.html)
3. **Transaction per test, rolled back.** Fast, and it keeps tests independent. — [24](../site/chapters/24-testing.html)
4. **Coverage measures execution, not verification.** Mutation score is the honest number. — [24](../site/chapters/24-testing.html)
5. **Assert behaviour, not implementation,** or every refactor breaks the suite. — [24](../site/chapters/24-testing.html)
6. **A bug fix starts with a failing test.** It proves the bug and stops it returning. — [24](../site/chapters/24-testing.html)
7. **Test names are documentation.** `test_a_shipped_order_cannot_be_cancelled` tells you the rule. — [24](../site/chapters/24-testing.html)

## [Chapter 25 — Logging, metrics and tracing](../site/chapters/25-observability.html)

*Part 5 — Building it properly*

1. **Stable message, variables in the context array.** That is what makes logs queryable. — [25](../site/chapters/25-observability.html)
2. **JSON to stdout** in production; the platform collects it. — [25](../site/chapters/25-observability.html)
3. **Alert on `error` and mean it.** Everything-is-an-error trains people to ignore it. — [25](../site/chapters/25-observability.html)
4. **Never log credentials, tokens or personal data.** Redact at the logger. — [25](../site/chapters/25-observability.html)
5. **A correlation id on every line,** propagated into jobs and returned to the user. — [25](../site/chapters/25-observability.html)
6. **Percentiles, not averages.** The p99 is the person telephoning. — [25](../site/chapters/25-observability.html)
7. **Readiness checks dependencies;** liveness does not. — [25](../site/chapters/25-observability.html)
8. **Log state changes and failures,** not successful reads. — [25](../site/chapters/25-observability.html)

## [Chapter 25b — Production support as a process](../site/chapters/25b-production-support.html)

*Part 5 — Building it properly*

1. **Severity is impact × scope,** not the volume of the complaint. — [25b](../site/chapters/25b-production-support.html)
2. **Acknowledge in minutes.** Silence causes escalation, not the bug. — [25b](../site/chapters/25b-production-support.html)
3. **Ask what changed** before reading any code. — [25b](../site/chapters/25b-production-support.html)
4. **Reproduce, then write the failing test,** then fix. — [25b](../site/chapters/25b-production-support.html)
5. **Default to rollback** unless a migration made it impossible. — [25b](../site/chapters/25b-production-support.html)
6. **Expand/contract keeps rollback available.** — [25b](../site/chapters/25b-production-support.html)
7. **Hotfix from the production tag,** never from `main`. — [25b](../site/chapters/25b-production-support.html)
8. **Blameless post-mortem, and measure time-to-detect.** — [25b](../site/chapters/25b-production-support.html)

## [Chapter 26 — Git](../site/chapters/26-git.html)

*Part 6 — Tools and shipping*

1. **A commit is a snapshot; a branch is a pointer.** Everything follows. — [26](../site/chapters/26-git.html)
2. **Rebase your own work, never shared history.** — [26](../site/chapters/26-git.html)
3. **`--force-with-lease`, never bare `--force`.** — [26](../site/chapters/26-git.html)
4. **`revert` in public, `reset` in private.** — [26](../site/chapters/26-git.html)
5. **`reflog` first** when something looks lost. It usually is not. — [26](../site/chapters/26-git.html)
6. **`--abort` always exists.** A conflict is never a trap. — [26](../site/chapters/26-git.html)
7. **The message explains why;** the diff already shows what. — [26](../site/chapters/26-git.html)
8. **A committed secret is a leaked secret.** Rotate it, do not just rewrite. — [26](../site/chapters/26-git.html)

## [Chapter 27 — The toolchain and the debugger nobody sets up](../site/chapters/27-tooling-and-xdebug.html)

*Part 6 — Tools and shipping*

1. **Configure Xdebug once.** It repays the twenty minutes in the first week. — [27](../site/chapters/27-tooling-and-xdebug.html)
2. **A silent breakpoint is a path mapping,** not a broken extension. — [27](../site/chapters/27-tooling-and-xdebug.html)
3. **Conditional breakpoints and break-on-exception** are where the real speed is. — [27](../site/chapters/27-tooling-and-xdebug.html)
4. **Never Xdebug in production.** Cost and remote-execution risk. — [27](../site/chapters/27-tooling-and-xdebug.html)
5. **Automate formatting** so review is about design, not spacing. — [27](../site/chapters/27-tooling-and-xdebug.html)
6. **Profile before optimising.** Measured, not guessed. — [27](../site/chapters/27-tooling-and-xdebug.html)
7. **Grep for `dd(` in CI.** It leaks more than it embarrasses. — [27](../site/chapters/27-tooling-and-xdebug.html)

## [Chapter 28 — Composer, autoloading and Docker](../site/chapters/28-containers-and-composer.html)

*Part 6 — Tools and shipping*

1. **PSR-4 is case-sensitive where it matters.** Filename equals class name. — [28](../site/chapters/28-containers-and-composer.html)
2. **`update` locally, `install` everywhere else.** — [28](../site/chapters/28-containers-and-composer.html)
3. **Commit the lock file for an application,** never for a library. — [28](../site/chapters/28-containers-and-composer.html)
4. **`^` for constraints;** `>=` is an invitation to a breaking change. — [28](../site/chapters/28-containers-and-composer.html)
5. **Update one package with `--with-dependencies`,** not the world. — [28](../site/chapters/28-containers-and-composer.html)
6. **Manifests before source in the Dockerfile.** That is the build cache. — [28](../site/chapters/28-containers-and-composer.html)
7. **Multi-stage: no compiler in the runtime image.** — [28](../site/chapters/28-containers-and-composer.html)
8. **No secrets in layers.** They survive deletion. — [28](../site/chapters/28-containers-and-composer.html)
9. **Two commands in the README,** or it is not really containerised. — [28](../site/chapters/28-containers-and-composer.html)

## [Chapter 29 — Cloud hosting and deployment](../site/chapters/29-cloud-hosting.html)

*Part 6 — Tools and shipping*

1. **`APP_DEBUG=false` in production.** The debug page prints your secrets. — [29](../site/chapters/29-cloud-hosting.html)
2. **Never `env()` outside config.** Caching makes it null. — [29](../site/chapters/29-cloud-hosting.html)
3. **Commit `.env.example`, never `.env`.** — [29](../site/chapters/29-cloud-hosting.html)
4. **Atomic deploys via symlink,** with shared storage outside the release. — [29](../site/chapters/29-cloud-hosting.html)
5. **Reload FPM and restart queues** on every deploy. — [29](../site/chapters/29-cloud-hosting.html)
6. **Expand/contract for migrations,** so rollback stays possible. — [29](../site/chapters/29-cloud-hosting.html)
7. **An untested backup is not a backup.** Know your RPO and RTO. — [29](../site/chapters/29-cloud-hosting.html)

## [Chapter 29b — Shared hosting, cPanel and FTP](../site/chapters/29b-shared-hosting.html)

*Part 6 — Tools and shipping*

1. **Ask for a subdomain pointed at `public/`** before anything else. — [29b](../site/chapters/29b-shared-hosting.html)
2. **Application above the web root, `public/` contents inside it.** — [29b](../site/chapters/29b-shared-hosting.html)
3. **Fetch `/.env` yourself after every deploy.** Scanners will. — [29b](../site/chapters/29b-shared-hosting.html)
4. **Never deploy `.git` or leave a dump in the web root.** — [29b](../site/chapters/29b-shared-hosting.html)
5. **`vendor/` is built locally and uploaded as an archive.** — [29b](../site/chapters/29b-shared-hosting.html)
6. **Cron plus `flock` plus `--stop-when-empty`** replaces the worker. — [29b](../site/chapters/29b-shared-hosting.html)
7. **SMTP with SPF, DKIM and DMARC,** never the host's `mail()`. — [29b](../site/chapters/29b-shared-hosting.html)
8. **Argue for a VPS with limits and euros,** never with taste. — [29b](../site/chapters/29b-shared-hosting.html)

## [Chapter 30 — CI/CD pipelines](../site/chapters/30-ci-cd.html)

*Part 6 — Tools and shipping*

1. **Order stages fail-fast.** Lint, analyse, unit, integration, deploy. — [30](../site/chapters/30-ci-cd.html)
2. **Build once, deploy many.** The tested artefact is the shipped artefact. — [30](../site/chapters/30-ci-cd.html)
3. **Cache Composer on the lock file hash.** Cheapest speed-up available. — [30](../site/chapters/30-ci-cd.html)
4. **Service containers need health checks,** or migrations race the database. — [30](../site/chapters/30-ci-cd.html)
5. **Secrets never reach a fork's pull request.** Gate the deploy on the branch. — [30](../site/chapters/30-ci-cd.html)
6. **Only additive migrations in the deploy.** Destructive ones ship later. — [30](../site/chapters/30-ci-cd.html)
7. **Fix a flaky test the same day.** It disables the whole gate. — [30](../site/chapters/30-ci-cd.html)
8. **Rehearse the rollback** before you need it. — [30](../site/chapters/30-ci-cd.html)

## [Chapter 31 — WordPress, done professionally](../site/chapters/31-wordpress.html)

*Part 7 — What the region actually runs*

1. **Filters must return.** Actions must not. — [31](../site/chapters/31-wordpress.html)
2. **Never edit core, themes or plugins in place.** Child theme or your own plugin. — [31](../site/chapters/31-wordpress.html)
3. **Taxonomy for filtering, meta for storing.** `meta_query` does not scale. — [31](../site/chapters/31-wordpress.html)
4. **`$wpdb->prepare()` always.** Never build SQL by concatenation. — [31](../site/chapters/31-wordpress.html)
5. **Nonce plus capability.** Two checks, two purposes. — [31](../site/chapters/31-wordpress.html)
6. **Escape late, per context.** `esc_html`, `esc_attr`, `esc_url`. — [31](../site/chapters/31-wordpress.html)
7. **`wp search-replace` for migrations,** because of serialised data. — [31](../site/chapters/31-wordpress.html)
8. **Replace `wp-cron` with real cron** on any site that matters. — [31](../site/chapters/31-wordpress.html)

## [Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce](../site/chapters/32-ecommerce.html)

*Part 7 — What the region actually runs*

1. **Integer cents, never floats.** One cent reaches the accountant. — [32](../site/chapters/32-ecommerce.html)
2. **VAT per line, rounded per line, then summed.** Rates differ within one cart. — [32](../site/chapters/32-ecommerce.html)
3. **Decide net or gross once,** write it down, never mix. — [32](../site/chapters/32-ecommerce.html)
4. **Snapshot price and VAT onto the order line.** Never re-derive history. — [32](../site/chapters/32-ecommerce.html)
5. **Stock changes with a conditional UPDATE.** Check-then-act oversells. — [32](../site/chapters/32-ecommerce.html)
6. **Checkout is idempotent,** with a unique key the database enforces. — [32](../site/chapters/32-ecommerce.html)
7. **The webhook is the truth about payment,** not the browser redirect. — [32](../site/chapters/32-ecommerce.html)
8. **Never store card data.** Hosted fields or redirect. — [32](../site/chapters/32-ecommerce.html)

## [Chapter 33 — Gestionali, ERP and fatturazione elettronica](../site/chapters/33-gestionali-and-sdi.html)

*Part 7 — What the region actually runs*

1. **Handle `NS`, `MC` and `NE` explicitly,** and show the error code to the user. — [33](../site/chapters/33-gestionali-and-sdi.html)
2. **Numbering is sequential with no gaps.** Reserve it in the transaction, never `MAX+1`. — [33](../site/chapters/33-gestionali-and-sdi.html)
3. **An accepted invoice is immutable.** Correct with a nota di credito. — [33](../site/chapters/33-gestionali-and-sdi.html)
4. **`CodiceDestinatario`: 7, 6, or `0000000`.** Wrong means a rejection days later. — [33](../site/chapters/33-gestionali-and-sdi.html)
5. **Write down who owns each field.** Two-way sync on one field is a trap. — [33](../site/chapters/33-gestionali-and-sdi.html)
6. **Never delete on absence** from an import file. — [33](../site/chapters/33-gestionali-and-sdi.html)
7. **Codes are strings.** Leading zeros are meaningful. — [33](../site/chapters/33-gestionali-and-sdi.html)

## [Chapter 33b — AI inside a PHP application](../site/chapters/33b-ai-in-php.html)

*Part 7 — What the region actually runs*

1. **The call goes on a queue,** or it holds an FPM worker for ten seconds. — [33b](../site/chapters/33b-ai-in-php.html)
2. **Log tokens from day one.** Cost you do not measure is cost you cannot forecast. — [33b](../site/chapters/33b-ai-in-php.html)
3. **User text in a prompt is untrusted input,** and there is no escaping for it. — [33b](../site/chapters/33b-ai-in-php.html)
4. **Authorise in your code, never in the prompt.** — [33b](../site/chapters/33b-ai-in-php.html)
5. **Validate the output against an allow-list.** It is a text generator, not an API. — [33b](../site/chapters/33b-ai-in-php.html)
6. **Escape model output before rendering.** It is XSS like any other string. — [33b](../site/chapters/33b-ai-in-php.html)
7. **Never ask it to do arithmetic** or apply a business rule. — [33b](../site/chapters/33b-ai-in-php.html)
8. **Sending customer data is a GDPR transfer.** Ask before you build. — [33b](../site/chapters/33b-ai-in-php.html)

## [Chapter 34 — Agile, Scrum and the daily rhythm](../site/chapters/34-agile.html)

*Part 8 — The human requirements*

1. **Stand-up asks "is anything blocked".** It is not a status report. — [34](../site/chapters/34-agile.html)
2. **Refinement is the meeting to protect.** It is where vague becomes doable. — [34](../site/chapters/34-agile.html)
3. **Points are size and uncertainty,** never hours, never a target. — [34](../site/chapters/34-agile.html)
4. **Estimate as a range and name the risk.** — [34](../site/chapters/34-agile.html)
5. **Raise the slip the day you know it.** The single highest-trust habit. — [34](../site/chapters/34-agile.html)
6. **Never pad silently.** The buffer belongs to the plan, not the ticket. — [34](../site/chapters/34-agile.html)
7. **Testable acceptance criteria,** agreed before starting. — [34](../site/chapters/34-agile.html)
8. **Finish before you start.** WIP limits over multitasking. — [34](../site/chapters/34-agile.html)

## [Chapter 35 — Analysis, autonomy and code review](../site/chapters/35-teamwork.html)

*Part 8 — The human requirements*

1. **Requests arrive as solutions.** Ask what they are trying to achieve. — [35](../site/chapters/35-teamwork.html)
2. **The manual workaround is the specification.** — [35](../site/chapters/35-teamwork.html)
3. **Write the understanding back before building.** Five minutes, catches everything. — [35](../site/chapters/35-teamwork.html)
4. **Timebox before asking,** then ask with what you tried and what you think. — [35](../site/chapters/35-teamwork.html)
5. **Write the answer down** where the next person will look. — [35](../site/chapters/35-teamwork.html)
6. **Review the code, not the person,** and label severity. — [35](../site/chapters/35-teamwork.html)
7. **Small PRs, and say what you are unsure about.** — [35](../site/chapters/35-teamwork.html)
8. **Never "impossible" when you mean expensive.** Offer the trade. — [35](../site/chapters/35-teamwork.html)

## [Chapter 36 — Your CV, LinkedIn and this project](../site/chapters/36-cv-and-linkedin.html)

*Part 8 — The human requirements*

1. **Action → means → result.** Presence words cannot be the whole bullet. — [36](../site/chapters/36-cv-and-linkedin.html)
2. **A number wherever one honestly exists,** and nowhere it does not. — [36](../site/chapters/36-cv-and-linkedin.html)
3. **One column, selectable text, no headers or tables.** — [36](../site/chapters/36-cv-and-linkedin.html)
4. **The GDPR line on the Italian version.** One line, filtered on. — [36](../site/chapters/36-cv-and-linkedin.html)
5. **One page as a junior.** Cut the oldest, never the newest. — [36](../site/chapters/36-cv-and-linkedin.html)
6. **City on the CV.** This market filters on distance. — [36](../site/chapters/36-cv-and-linkedin.html)
7. **CEFR levels.** "Buono" is unverifiable; B2 is testable. — [36](../site/chapters/36-cv-and-linkedin.html)
8. **Mirror the advert's true words** "Laravel", not "framework PHP". — [36](../site/chapters/36-cv-and-linkedin.html)

## [Chapter 37 — The screening test](../site/chapters/37-screening-test.html)

*Part 8 — The human requirements*

1. **It must run from a clean clone.** Test that yourself, in a fresh directory. — [37](../site/chapters/37-screening-test.html)
2. **Respect the timebox,** and say what you would do with more. — [37](../site/chapters/37-screening-test.html)
3. **The README is the highest-value twenty minutes.** Decisions, not features. — [37](../site/chapters/37-screening-test.html)
4. **Say where you deliberately stopped.** Restraint reads as judgement. — [37](../site/chapters/37-screening-test.html)
5. **A few real tests,** on the part with actual rules. — [37](../site/chapters/37-screening-test.html)
6. **Handle the edge cases.** Most submissions do not. — [37](../site/chapters/37-screening-test.html)
7. **Narrate in live sessions.** Silence is the only real failure. — [37](../site/chapters/37-screening-test.html)
8. **Working first, clever never.** — [37](../site/chapters/37-screening-test.html)

## [Chapter 38 — The interview](../site/chapters/38-the-interview.html)

*Part 8 — The human requirements*

1. **Ninety seconds for "mi parli di lei",** with hooks you want to be asked about. — [38](../site/chapters/38-the-interview.html)
2. **Answer, mechanism, then your own example.** The example is the differentiator. — [38](../site/chapters/38-the-interview.html)
3. **"I don't know, and here is how I'd find out"** beats bluffing, always. — [38](../site/chapters/38-the-interview.html)
4. **Never criticise their stack.** Same knowledge, asked as curiosity. — [38](../site/chapters/38-the-interview.html)
5. **RAL is gross, over 13 or 14 months.** Ask which, and ask the CCNL and livello. — [38](../site/chapters/38-the-interview.html)
6. **Give a range with a reason,** never a single low number. — [38](../site/chapters/38-the-interview.html)
7. **Ask what reservations they have.** It is the question that saves offers. — [38](../site/chapters/38-the-interview.html)
8. **Write down what you could not answer.** That is your study plan. — [38](../site/chapters/38-the-interview.html)

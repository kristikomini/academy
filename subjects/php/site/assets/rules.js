/* ==========================================================================
   rules.js — the viva deck. GENERATED FILE, DO NOT EDIT.

   Source:      course/GOLDEN-RULES.md
   Regenerate:  php tools/viva-extract.php php && php tools/viva-deck.php php

   One card per Golden rule. `kind` is "explain" (say why the claim is true)
   or "complete" (finish the sentence), the second being for the rules the
   course states without a written justification — there has to be something
   on paper to mark yourself against, or self-marking drifts generous.

   `id` is the spaced-repetition key. It is derived from the claim text, so
   reordering the rules costs nothing and rewording one resets that card only.

   The chain starts at the chapters, not here: the `.rules` block of each
   chapter is the only place a rule is written by hand.
   ========================================================================== */
window.RULES = [
    {
        "id": "t12-php-8-casts-the-number-to-string",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "PHP 8 casts the number to string",
        "why": "when comparing against a non-numeric string. `0 == \"foo\"` is now false.",
        "continues": true,
        "checkpoints": [
            "0 == \"foo\""
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "t12-declare-strict-types-1-in-every-file",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "`declare(strict_types=1)` in every file.",
        "why": "It is per-file and per-call-site; one central declaration does not exist.",
        "continues": false,
        "checkpoints": [
            "declare(strict_types=1)"
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "t12-arrays-by-value-objects-by-handle",
        "kind": "complete",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "Arrays by value, objects by handle.",
        "why": "",
        "stem": "Arrays by value,",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "t12-interface-for-a-contract-abstract-class-for-shared-state",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "Interface for a contract, abstract class for shared state",
        "why": "and you only get one parent.",
        "continues": true,
        "refs": [
            "03"
        ]
    },
    {
        "id": "t12-money-is-never-a-float",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "Money is never a float.",
        "why": "Integer minor units, or BCMath.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "t12-prepared-statements-because-values-never-reach-the-parser",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-api-security.html",
        "claim": "Prepared statements because values never reach the parser",
        "why": "not because they escape.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-identifiers-cannot-be-bound",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-api-security.html",
        "claim": "Identifiers cannot be bound.",
        "why": "Allowlist them.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-escape-on-output-for-the-context",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-api-security.html",
        "claim": "Escape on output, for the context.",
        "why": "Sanitising on input loses data and still fails.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-password-hash-with-argon2id",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/15-api-security.html",
        "claim": "`password_hash` with Argon2id.",
        "why": "Slow is the point.",
        "continues": false,
        "checkpoints": [
            "password_hash"
        ],
        "refs": [
            "15"
        ]
    },
    {
        "id": "t12-n-1-is-the-default-failure-mode-of-an-orm",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "N+1 is the default failure mode of an ORM.",
        "why": "Eager-load with `with()`, and turn on `preventLazyLoading()` in development.",
        "continues": false,
        "checkpoints": [
            "with()",
            "preventLazyLoading()"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "t12-composite-indexes-work-left-to-right",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "Composite indexes work left to right.",
        "why": "`(a, b)` cannot serve a query filtering only on `b`.",
        "continues": false,
        "checkpoints": [
            "(a, b)",
            "b"
        ],
        "refs": [
            "11"
        ]
    },
    {
        "id": "t12-a-function-on-a-column-kills-the-index",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "A function on a column kills the index.",
        "why": "Rewrite it as a range.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "s6-shared-nothing-nothing-survives-the-request",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Shared-nothing: nothing survives the request.",
        "why": "Persist in Redis or the database.",
        "continues": false,
        "refs": [
            "08"
        ]
    },
    {
        "id": "s6-middleware-is-an-onion",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/16-the-framework.html",
        "claim": "Middleware is an onion.",
        "why": "Before `$next()` on the way in, after it on the way out; order is behaviour, not style.",
        "continues": false,
        "checkpoints": [
            "$next()"
        ],
        "refs": [
            "16"
        ]
    },
    {
        "id": "s6-document-root-is-public",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Document root is `public/`.",
        "why": "The single most consequential line.",
        "continues": false,
        "checkpoints": [
            "public/"
        ],
        "refs": [
            "29"
        ]
    },
    {
        "id": "s6-dispatch-after-commit",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Dispatch after commit.",
        "why": "The worker is faster than your transaction.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "s6-measure-fix-the-query-then-cache",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/20-caching.html",
        "claim": "Measure, fix the query, then cache.",
        "why": "Never in the other order.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "s6-an-invoice-is-a-state-machine",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "An invoice is a state machine,",
        "why": "not a boolean. The SDI answers asynchronously.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m00-a-requirement-line-is-a-task-not-a-skill",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "A requirement line is a task, not a skill.",
        "why": "Unpack it into the Tuesday it describes.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-the-qualifier-is-the-requirement",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "The qualifier is the requirement.",
        "why": "Gradita and consolidata are different jobs.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-two-thirds-is-a-candidate",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Two thirds is a candidate.",
        "why": "The list is a wish list, not a gate.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-prepare-the-unwritten-four",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Prepare the unwritten four",
        "why": "debugging, legacy, explaining yourself, and where it deploys.",
        "continues": true,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-read-the-advert-s-chapters-not-all-of-them",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Read the advert’s chapters, not all of them.",
        "why": "Depth on the quoted lines beats breadth on everything.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m01-name-the-version-you-are-speaking-about",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "Name the version you are speaking about.",
        "why": "\"On 8.1+\" is a senior habit.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-cli-and-fpm-are-different-worlds",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "CLI and FPM are different worlds",
        "why": "different ini file, different limits.",
        "continues": true,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-pm-max-children-is-a-concurrency-ceiling",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "`pm.max_children` is a concurrency ceiling,",
        "why": "sized by RAM, not optimism.",
        "continues": true,
        "checkpoints": [
            "pm.max_children"
        ],
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-every-outbound-call-gets-a-timeout",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "Every outbound call gets a timeout.",
        "why": "A blocked worker is a worker serving nobody.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-reload-fpm-on-deploy",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "Reload FPM on deploy",
        "why": "when `validate_timestamps=0`, or you shipped nothing.",
        "continues": true,
        "checkpoints": [
            "validate_timestamps=0"
        ],
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-install-on-servers-update-on-your-machine",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "`install` on servers, `update` on your machine.",
        "why": "The lock file is the point.",
        "continues": false,
        "checkpoints": [
            "install",
            "update"
        ],
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-display-errors-off-in-production",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — PHP the platform",
        "href": "site/chapters/01-php-platform.html",
        "claim": "`display_errors=Off` in production.",
        "why": "Log it, never show it.",
        "continues": false,
        "checkpoints": [
            "display_errors=Off"
        ],
        "refs": [
            "01"
        ]
    },
    {
        "id": "m02--unless-you-have-a-reason",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Fundamentals: types, juggling, strings, arrays",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "`===` unless you have a reason.",
        "why": "Loose comparison is a decision, not a default.",
        "continues": false,
        "checkpoints": [
            "==="
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02--for-not-set-for-falsy",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Fundamentals: types, juggling, strings, arrays",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "`??` for \"not set\", `?:` for \"falsy\".",
        "why": "They are not interchangeable, and `0` is where they differ.",
        "continues": false,
        "checkpoints": [
            "??",
            "?:",
            "0"
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-an-array-is-an-ordered-hash-map",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Fundamentals: types, juggling, strings, arrays",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "An array is an ordered hash map.",
        "why": "Everything surprising about it follows from that.",
        "continues": false,
        "refs": [
            "02",
            "06"
        ]
    },
    {
        "id": "m02--keeps-left-array-merge-keeps-right",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Fundamentals: types, juggling, strings, arrays",
        "href": "site/chapters/02-php-fundamentals.html",
        "claim": "`+` keeps left, `array_merge()` keeps right",
        "why": "and merge renumbers integer keys.",
        "continues": true,
        "checkpoints": [
            "+",
            "array_merge()"
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "m03-a-trait-is-not-a-type",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — OOP in PHP",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "A trait is not a type.",
        "why": "It buys reuse and no polymorphism, so you cannot type-hint it.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-tryfrom-for-anything-from-outside",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — OOP in PHP",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "`tryFrom()` for anything from outside;",
        "why": "`from()` only when an unknown value genuinely is a bug.",
        "continues": true,
        "checkpoints": [
            "tryFrom()",
            "from()"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-readonly-is-shallow",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — OOP in PHP",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "`readonly` is shallow.",
        "why": "The reference is frozen; the object behind it is not.",
        "continues": false,
        "checkpoints": [
            "readonly"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-put-the-transition-rule-on-the-enum",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — OOP in PHP",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "Put the transition rule on the enum.",
        "why": "Then the state machine cannot drift out of step with the states.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-static-when-a-subclass-should-get-itself-back",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — OOP in PHP",
        "href": "site/chapters/03-oop-in-php.html",
        "claim": "`static::` when a subclass should get itself back,",
        "why": "`self::` when it genuinely must be this class.",
        "continues": true,
        "checkpoints": [
            "static::",
            "self::"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m04-use-x-copies-at-definition-time",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "`use ($x)` copies at definition time.",
        "why": "Capture by reference only when you mean to share.",
        "continues": false,
        "checkpoints": [
            "use ($x)"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-arrow-functions-capture-everything-by-value-one-expression",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "Arrow functions capture everything, by value, one expression.",
        "why": "That is the whole contract.",
        "continues": false,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-prefer-obj-method",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "Prefer `$obj->method(...)`",
        "why": "over string and array callables — it fails where you wrote it.",
        "continues": true,
        "checkpoints": [
            "$obj->method(...)"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-if-it-does-not-fit-in-memory-yield-it",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "If it does not fit in memory, `yield` it.",
        "why": "O(1) instead of O(n).",
        "continues": false,
        "checkpoints": [
            "yield"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-generators-clean-up-in-finally",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "Generators clean up in `finally`,",
        "why": "because the consumer may break early.",
        "continues": true,
        "checkpoints": [
            "finally"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-a-generator-is-single-use-and-uncountable",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Closures, callables and generators",
        "href": "site/chapters/04-closures-and-generators.html",
        "claim": "A generator is single-use and uncountable.",
        "why": "Wanting `count()` means you wanted an array.",
        "continues": false,
        "checkpoints": [
            "count()"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m05-one-reason-to-change-means-one-person-who-can-ask",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "One reason to change means one person who can ask.",
        "why": "Count the people, not the methods.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-abstract-at-the-second-case",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "Abstract at the second case,",
        "why": "not the first. The second case shows you the seam.",
        "continues": true,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-throw-new-badmethodcallexception-is-an-isp-violation",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "`throw new BadMethodCallException` is an ISP violation",
        "why": "that reported itself.",
        "continues": true,
        "checkpoints": [
            "throw new BadMethodCallException"
        ],
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-the-consumer-owns-the-interface",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "The consumer owns the interface.",
        "why": "That is what makes it inversion.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-dip-is-the-principle-di-the-mechanism-the-container-the-tool",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "DIP is the principle, DI the mechanism, the container the tool.",
        "why": "Three different words.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-an-interface-with-one-implementation-and-no-fake-is-ceremony",
        "kind": "complete",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "An interface with one implementation and no fake is ceremony.",
        "why": "",
        "stem": "An interface with one implementation",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-three-patterns-you-used-beats-eleven-you-named",
        "kind": "complete",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — SOLID and design patterns",
        "href": "site/chapters/05-solid-and-patterns.html",
        "claim": "Three patterns you used beats eleven you named.",
        "why": "",
        "stem": "Three patterns you used",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m06-array-values-before-json-encode",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "`array_values()` before `json_encode()`",
        "why": "whenever you filtered.",
        "continues": true,
        "checkpoints": [
            "array_values()",
            "json_encode()"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-searching-by-value-is-o-n",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "Searching by value is O(n).",
        "why": "Flip it and search by key.",
        "continues": false,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-in-array-always-with-strict-true",
        "kind": "complete",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "`in_array` always with `strict: true`.",
        "why": "",
        "stem": "`in_array` always with",
        "continues": false,
        "checkpoints": [
            "in_array",
            "strict: true"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-unset-v-after-foreach-by-reference",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "`unset($v)` after `foreach` by reference.",
        "why": "Always.",
        "continues": false,
        "checkpoints": [
            "unset($v)",
            "foreach"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-copy-on-write-means-passing-is-cheap",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "Copy-on-write means passing is cheap.",
        "why": "`&` for speed is a myth with a mutation bug attached.",
        "continues": false,
        "checkpoints": [
            "&"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-array-key-exists-when-null-is-a-real-value",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Arrays, SPL and the array_* family",
        "href": "site/chapters/06-arrays-and-collections.html",
        "claim": "`array_key_exists` when null is a real value;",
        "why": "`isset` otherwise.",
        "continues": true,
        "checkpoints": [
            "array_key_exists",
            "isset"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m07-error-is-not-an-exception",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "`Error` is not an `Exception`.",
        "why": "Catch `Throwable` at the edge.",
        "continues": false,
        "checkpoints": [
            "Error",
            "Exception",
            "Throwable"
        ],
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-warnings-are-not-exceptions",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "Warnings are not exceptions",
        "why": "until you make them so with an error handler.",
        "continues": true,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-only-a-shutdown-function-sees-a-real-fatal",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "Only a shutdown function sees a real fatal.",
        "why": "Without one, the log just stops.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-always-pass-previous",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "Always pass `$previous`.",
        "why": "An unchained rethrow destroys the evidence.",
        "continues": false,
        "checkpoints": [
            "$previous"
        ],
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-catch-the-narrowest-type-you-can-act-on",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "Catch the narrowest type you can act on;",
        "why": "catch broadly only at the boundary.",
        "continues": true,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-no-empty-catch",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "No empty catch.",
        "why": "Log it, or do not catch it.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-slow-work-goes-on-a-queue",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Errors, exceptions and async",
        "href": "site/chapters/07-errors-and-async.html",
        "claim": "Slow work goes on a queue,",
        "why": "not into an async experiment inside the request.",
        "continues": true,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m08-re-read-every-static-when-code-moves-into-a-worker",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Re-read every `static` when code moves into a worker.",
        "why": "Lifetime changed underneath it.",
        "continues": false,
        "checkpoints": [
            "static"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-destruction-is-deterministic",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Destruction is deterministic",
        "why": "refcount zero, right now — except for cycles.",
        "continues": true,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-objects-are-handles",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Objects are handles.",
        "why": "You rarely want `&$object`.",
        "continues": false,
        "checkpoints": [
            "&$object"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-clone-is-shallow",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "`clone` is shallow,",
        "why": "like `readonly`.",
        "continues": true,
        "checkpoints": [
            "clone",
            "readonly"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-never-put-references-in-arrays",
        "kind": "complete",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Never put references in arrays.",
        "why": "",
        "stem": "Never put references",
        "continues": false,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-out-of-memory-means-unbounded-rows",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Memory, references and the request lifecycle",
        "href": "site/chapters/08-memory-and-references.html",
        "claim": "Out of memory means unbounded rows",
        "why": "nine times out of ten. Stream it.",
        "continues": true,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m09-innodb-always",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "InnoDB, always.",
        "why": "Transactions, foreign keys, row-level locking.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-utf8mb4-never-utf8",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "`utf8mb4`, never `utf8`",
        "why": "and set it on the column, the connection and the DSN.",
        "continues": true,
        "checkpoints": [
            "utf8mb4",
            "utf8"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-money-is-decimal-or-integer-cents",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Money is `DECIMAL` or integer cents.",
        "why": "Never a float, in the database or in PHP.",
        "continues": false,
        "checkpoints": [
            "DECIMAL"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-identifiers-are-strings",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Identifiers are strings.",
        "why": "Partita IVA, CAP, codice destinatario — you never add them up.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-sequential-primary-keys",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Sequential primary keys.",
        "why": "In InnoDB the primary key is the physical row order.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-declare-foreign-keys-and-choose-on-delete-on-purpose",
        "kind": "complete",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Declare foreign keys, and choose `ON DELETE` on purpose.",
        "why": "",
        "stem": "Declare foreign keys,",
        "continues": false,
        "checkpoints": [
            "ON DELETE"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-prefer-not-null",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Prefer `NOT NULL`.",
        "why": "Every nullable column is a branch in every query.",
        "continues": false,
        "checkpoints": [
            "NOT NULL"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-copy-the-price-onto-the-order-line",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Databases and MySQL/MariaDB",
        "href": "site/chapters/09-databases-and-mysql.html",
        "claim": "Copy the price onto the order line.",
        "why": "History is a fact, not a duplicate.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m10-filtering-the-right-table-in-where-turns-a-left-join-into-an-inner-join",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "Filtering the right table in `WHERE` turns a LEFT JOIN into an INNER JOIN.",
        "why": "Put the condition in `ON`.",
        "continues": false,
        "checkpoints": [
            "WHERE",
            "ON"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-where-before-grouping-having-after",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "`WHERE` before grouping, `HAVING` after.",
        "why": "Filter as early as you can.",
        "continues": false,
        "checkpoints": [
            "WHERE",
            "HAVING"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-count-counts-rows-count-col-skips-nulls",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "`COUNT(*)` counts rows; `COUNT(col)` skips NULLs.",
        "why": "After a LEFT JOIN you almost always want the second.",
        "continues": false,
        "checkpoints": [
            "COUNT(*)",
            "COUNT(col)"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-top-n-per-group-is-a-window-function",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "Top-N-per-group is a window function.",
        "why": "`GROUP BY` cannot express it.",
        "continues": false,
        "checkpoints": [
            "GROUP BY"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-you-cannot-filter-a-window-function-in-where",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "You cannot filter a window function in `WHERE`",
        "why": "wrap it in a CTE and filter outside.",
        "continues": true,
        "checkpoints": [
            "WHERE"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-not-in-with-a-null-returns-nothing",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "`NOT IN` with a NULL returns nothing.",
        "why": "Use `NOT EXISTS`.",
        "continues": false,
        "checkpoints": [
            "NOT IN",
            "NOT EXISTS"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-name-your-steps-with-ctes",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — SQL: querying",
        "href": "site/chapters/10-sql-querying.html",
        "claim": "Name your steps with CTEs.",
        "why": "The query you can read in six months is the one you can fix.",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10b-a-view-that-aggregates-materialises",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "A view that aggregates materialises.",
        "why": "Filtering it from outside is too late.",
        "continues": false,
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-mysql-has-no-materialised-views",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "MySQL has no materialised views.",
        "why": "A \"materialised view\" is a summary table with a staleness question.",
        "continues": false,
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-a-function-in-a-where-clause-kills-the-index",
        "kind": "complete",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "A function in a `WHERE` clause kills the index.",
        "why": "",
        "stem": "A function in a `WHERE`",
        "continues": false,
        "checkpoints": [
            "WHERE"
        ],
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-routines-need-an-exit-handler",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "Routines need an `EXIT HANDLER`,",
        "why": "or a failure leaves the transaction open.",
        "continues": true,
        "checkpoints": [
            "EXIT HANDLER"
        ],
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-triggers-are-invisible",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "Triggers are invisible,",
        "why": "per-row, and lie to your ORM.",
        "continues": true,
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-dump-routines-into-git",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "Dump routines into Git",
        "why": "before doing anything else.",
        "continues": true,
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m10b-find-the-other-writers",
        "kind": "explain",
        "tier": "module",
        "module": "10b",
        "part": "Chapter 10b — Views, functions and stored procedures",
        "href": "site/chapters/10b-views-and-procedures.html",
        "claim": "Find the other writers",
        "why": "before moving a rule out of the database.",
        "continues": true,
        "refs": [
            "10b"
        ]
    },
    {
        "id": "m11-measure-with-explain-not-intuition",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "Measure with `EXPLAIN`, not intuition",
        "why": "read `type`, `key`, `rows`, `Extra`.",
        "continues": true,
        "checkpoints": [
            "EXPLAIN",
            "type",
            "key",
            "rows",
            "Extra"
        ],
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-every-index-makes-writes-slower",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "Every index makes writes slower.",
        "why": "That is the answer to \"why not index everything\".",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-innodb-defaults-to-repeatable-read",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "InnoDB defaults to REPEATABLE READ.",
        "why": "Most other engines do not.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-consistent-lock-ordering-prevents-deadlocks-retries-survive-them",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "Consistent lock ordering prevents deadlocks; retries survive them.",
        "why": "You need both.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-never-hold-a-database-lock-across-user-think-time",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — Indexes, EXPLAIN, transactions and deadlocks",
        "href": "site/chapters/11-indexes-and-transactions.html",
        "claim": "Never hold a database lock across user think-time.",
        "why": "That is what a version column is for.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m12-active-record-couples-the-model-to-the-schema-data-mapper-does-not",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — The ORM in depth: Eloquent and Doctrine",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "Active Record couples the model to the schema; Data Mapper does not.",
        "why": "Choose on how complex the domain is.",
        "continues": false,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-in-doctrine-a-managed-entity-is-saved-on-flush",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — The ORM in depth: Eloquent and Doctrine",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "In Doctrine, a managed entity is saved on flush",
        "why": "whether you persisted it or not.",
        "continues": true,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-migrations-are-append-only",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — The ORM in depth: Eloquent and Doctrine",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "Migrations are append-only",
        "why": "once they have run outside your machine.",
        "continues": true,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-all-is-a-memory-bomb",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — The ORM in depth: Eloquent and Doctrine",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "`all()` is a memory bomb.",
        "why": "`chunkById()` when you are also writing.",
        "continues": false,
        "checkpoints": [
            "all()",
            "chunkById()"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-an-orm-is-a-convenience-not-a-replacement-for-sql",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — The ORM in depth: Eloquent and Doctrine",
        "href": "site/chapters/12-orm-in-depth.html",
        "claim": "An ORM is a convenience, not a replacement for SQL.",
        "why": "Read the generated query when it matters.",
        "continues": false,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m13-safe-means-no-state-change-idempotent-means-repeating-is-harmless",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "Safe means no state change; idempotent means repeating is harmless.",
        "why": "It decides what may be retried.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-post-is-not-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "`POST` is not idempotent",
        "why": "use an idempotency key on anything that takes money or creates an order.",
        "continues": true,
        "checkpoints": [
            "POST"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-never-change-state-on-a-get",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "Never change state on a `GET`.",
        "why": "Something will crawl it.",
        "continues": false,
        "checkpoints": [
            "GET"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-400-is-malformed-422-is-invalid-401-is-who-are-you-403-is-no",
        "kind": "complete",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "400 is malformed, 422 is invalid; 401 is who are you, 403 is no.",
        "why": "",
        "stem": "400 is malformed, 422 is invalid;",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-409-for-a-stale-version",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "409 for a stale version,",
        "why": "and return the current state with it.",
        "continues": true,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-errors-need-a-schema-too",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "Errors need a schema too.",
        "why": "RFC 9457 plus a trace id.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-psr-7-messages-are-immutable",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — HTTP, REST, PSR-7 and PSR-15",
        "href": "site/chapters/13-http-and-psr.html",
        "claim": "PSR-7 messages are immutable.",
        "why": "`with*()` returns a new object; reassign it.",
        "continues": false,
        "checkpoints": [
            "with*()"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m14-validate-at-the-boundary-into-a-typed-object",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Validate at the boundary into a typed object,",
        "why": "and never trust an array again.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-domain-invariants-live-on-the-model",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Domain invariants live on the model,",
        "why": "not in the request class the worker never runs.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-never-create-request-all",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Never `create($request->all())`.",
        "why": "`validated()`, always.",
        "continues": false,
        "checkpoints": [
            "create($request->all())",
            "validated()"
        ],
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-422-for-invalid-content-400-for-unparseable",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "422 for invalid content, 400 for unparseable,",
        "why": "and report every field at once.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-resources-not-models-in-responses",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Resources, not models, in responses.",
        "why": "Money in minor units, dates ISO-8601, ids as strings.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-keyset-pagination-for-feeds",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Keyset pagination for feeds,",
        "why": "offset only where a page number is genuinely needed.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-problem-details-plus-a-correlation-id",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Building an API",
        "href": "site/chapters/14-building-an-api.html",
        "claim": "Problem Details plus a correlation id.",
        "why": "Adding a field is safe; removing one is not.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14b-two-timeouts-on-every-outbound-call",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Two timeouts on every outbound call.",
        "why": "No timeout is an outage waiting for someone else's.",
        "continues": false,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-retry-429-and-5xx-with-backoff-and-jitter",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Retry 429 and 5xx with backoff and jitter;",
        "why": "never retry a 4xx.",
        "continues": true,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-a-retried-post-needs-an-idempotency-key",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "A retried POST needs an idempotency key,",
        "why": "or it is a business decision.",
        "continues": true,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-verify-webhook-signatures-over-the-raw-body",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Verify webhook signatures over the raw body",
        "why": "with `hash_equals()`.",
        "continues": true,
        "checkpoints": [
            "hash_equals()"
        ],
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-webhooks-are-at-least-once",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Webhooks are at-least-once.",
        "why": "Unique constraint on the event id; let the database win the race.",
        "continues": false,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-store-the-payload-answer-200-work-on-the-queue",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Store the payload, answer 200, work on the queue.",
        "why": "Replayability comes free.",
        "continues": false,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-untrusted-xml-is-an-xxe-risk",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "Untrusted XML is an XXE risk.",
        "why": "No external entities, no network.",
        "continues": false,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m14b-csv-means-encoding-partial-files-and-the-comma-decimal",
        "kind": "explain",
        "tier": "module",
        "module": "14b",
        "part": "Chapter 14b — Integrations: webhooks, SOAP, CSV and XML",
        "href": "site/chapters/14b-integrations.html",
        "claim": "CSV means encoding, partial files and the comma decimal.",
        "why": "All three, every time.",
        "continues": false,
        "refs": [
            "14b"
        ]
    },
    {
        "id": "m15-one-error-message-for-bad-user-and-bad-password",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Security: OWASP, injection, XSS, CSRF and auth",
        "href": "site/chapters/15-api-security.html",
        "claim": "One error message for bad user and bad password,",
        "why": "and burn equivalent time on the unknown path.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-a-csrf-token-proves-origin-not-identity",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Security: OWASP, injection, XSS, CSRF and auth",
        "href": "site/chapters/15-api-security.html",
        "claim": "A CSRF token proves origin, not identity",
        "why": "and is redundant for header-authenticated APIs.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-a-jwt-cannot-be-revoked",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Security: OWASP, injection, XSS, CSRF and auth",
        "href": "site/chapters/15-api-security.html",
        "claim": "A JWT cannot be revoked.",
        "why": "Short access token, revocable refresh token.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-hash-equals-for-secrets",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Security: OWASP, injection, XSS, CSRF and auth",
        "href": "site/chapters/15-api-security.html",
        "claim": "`hash_equals()` for secrets,",
        "why": "never `===`.",
        "continues": true,
        "checkpoints": [
            "hash_equals()",
            "==="
        ],
        "refs": [
            "15"
        ]
    },
    {
        "id": "m16-the-container-resolves-from-type-hints",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "The container resolves from type hints.",
        "why": "Bind an interface and you have a seam.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-a-laravel-singleton-lasts-one-request",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "A Laravel singleton lasts one request.",
        "why": "Shared-nothing means there is no longer scope.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-a-facade-is-a-container-lookup-wearing-static-syntax",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "A facade is a container lookup wearing static syntax",
        "why": "convenient, and it hides dependencies.",
        "continues": true,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-validate-in-a-form-request",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "Validate in a form request,",
        "why": "so the controller only ever sees valid input. `authorize()` is a separate question from `rules()`.",
        "continues": true,
        "checkpoints": [
            "authorize()",
            "rules()"
        ],
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-laravel-is-built-on-symfony-components",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "Laravel is built on Symfony components.",
        "why": "They are not opposite worlds.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-learn-what-the-framework-does-not-just-how-to-call-it",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — The framework: Laravel and Symfony",
        "href": "site/chapters/16-the-framework.html",
        "claim": "Learn what the framework does, not just how to call it.",
        "why": "That is the entire difference the interview is measuring.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16b-runnable-locally-then-git-then-tests-then-changes",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Runnable locally, then Git, then tests, then changes.",
        "why": "In that order.",
        "continues": false,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m16b-characterisation-tests-capture-what-it-does",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Characterisation tests capture what it does,",
        "why": "bugs included.",
        "continues": true,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m16b-never-propose-the-rewrite",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Never propose the rewrite.",
        "why": "Strangle it, one route at a time.",
        "continues": false,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m16b-upgrade-one-version-at-a-time",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Upgrade one version at a time,",
        "why": "with Rector for the mechanical part.",
        "continues": true,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m16b-phpstan-with-a-baseline",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "PHPStan with a baseline:",
        "why": "freeze old debt, fail on new.",
        "continues": true,
        "refs": [
            "16b",
            "27"
        ]
    },
    {
        "id": "m16b-sprout-new-code-beside-the-old",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Sprout new code beside the old;",
        "why": "do not untangle it first.",
        "continues": true,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m16b-refactor-and-behaviour-change-are-two-commits",
        "kind": "explain",
        "tier": "module",
        "module": "16b",
        "part": "Chapter 16b — Legacy PHP and how to migrate it",
        "href": "site/chapters/16b-legacy-php.html",
        "claim": "Refactor and behaviour change are two commits.",
        "why": "Always.",
        "continues": false,
        "refs": [
            "16b"
        ]
    },
    {
        "id": "m17-the-tag-is-a-contract",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "The tag is a contract.",
        "why": "`<button>` for actions, `<a href>` for navigation.",
        "continues": false,
        "checkpoints": [
            "<button>",
            "<a href>"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-specificity-is-ids-classes-elements",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "Specificity is (ids, classes, elements),",
        "why": "then source order. One id outranks ten classes.",
        "continues": true,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17--where-for-defaults-layer-for-order",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "`:where()` for defaults, `@layer` for order.",
        "why": "That is the end of `!important`.",
        "continues": false,
        "checkpoints": [
            ":where()",
            "@layer",
            "!important"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-a-mystery-gap-is-a-collapsed-margin",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "A mystery gap is a collapsed margin.",
        "why": "Vertical only, never in flex or grid.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-flex-is-one-dimension-grid-is-two",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "Flex is one dimension, grid is two.",
        "why": "`min-width: 0` when a flex item will not shrink.",
        "continues": false,
        "checkpoints": [
            "min-width: 0"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-auto-fill-minmax-gap",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "`auto-fill` + `minmax` + `gap`",
        "why": "is a responsive layout with no media query.",
        "continues": true,
        "checkpoints": [
            "auto-fill",
            "minmax",
            "gap"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-tab-through-it-before-you-call-it-done",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — HTML, CSS and the DOM",
        "href": "site/chapters/17-frontend-basics.html",
        "claim": "Tab through it before you call it done.",
        "why": "Contrast, labels, focus.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17b-microtasks-drain-before-the-next-macrotask",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "Microtasks drain before the next macrotask.",
        "why": "`.then` beats `setTimeout(0)`.",
        "continues": false,
        "checkpoints": [
            ".then",
            "setTimeout(0)"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b-one-thread-a-long-loop-freezes-the-page",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "One thread: a long loop freezes the page.",
        "why": "Not slow — blocked.",
        "continues": false,
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b-await-in-a-loop-is-sequential",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "`await` in a loop is sequential.",
        "why": "Independent work goes in `Promise.all`.",
        "continues": false,
        "checkpoints": [
            "await",
            "Promise.all"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b-never-async-inside-foreach",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "Never `async` inside `forEach`.",
        "why": "It ignores the promise.",
        "continues": false,
        "checkpoints": [
            "async",
            "forEach"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b-fetch-does-not-reject-on-404-or-500",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "`fetch` does not reject on 404 or 500.",
        "why": "Check `res.ok`.",
        "continues": false,
        "checkpoints": [
            "fetch",
            "res.ok"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b-arrow-functions-for-callbacks",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "Arrow functions for callbacks,",
        "why": "because `this` is lexical.",
        "continues": true,
        "checkpoints": [
            "this"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m17b--always",
        "kind": "explain",
        "tier": "module",
        "module": "17b",
        "part": "Chapter 17b — JavaScript as a language",
        "href": "site/chapters/17b-javascript.html",
        "claim": "`===` always;",
        "why": "`??` when `0` and `''` are real values.",
        "continues": true,
        "checkpoints": [
            "===",
            "??",
            "0",
            "''"
        ],
        "refs": [
            "17b"
        ]
    },
    {
        "id": "m18-reactivity-tracks-what-the-render-read",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "Reactivity tracks what the render read.",
        "why": "Re-render is queued, so `nextTick` before touching the DOM.",
        "continues": false,
        "checkpoints": [
            "nextTick"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-destructuring-a-reactive-loses-reactivity",
        "kind": "complete",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "Destructuring a `reactive()` loses reactivity.",
        "why": "",
        "stem": "Destructuring a `reactive()`",
        "continues": false,
        "checkpoints": [
            "reactive()"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-computed-to-derive-watch-for-side-effects",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "`computed` to derive, `watch` for side effects.",
        "why": "A syncing `watch` is a missed `computed`.",
        "continues": false,
        "checkpoints": [
            "computed",
            "watch"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-props-down-events-up",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "Props down, events up.",
        "why": "Never mutate a prop.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18--key-is-an-identity",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "`:key` is an identity,",
        "why": "never the array index.",
        "continues": true,
        "checkpoints": [
            ":key"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-server-state-is-a-cache",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "Server state is a cache,",
        "why": "not global state. Keep them apart.",
        "continues": true,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-generate-types-from-the-api",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "Generate types from the API,",
        "why": "or TypeScript is describing a shape nothing verifies.",
        "continues": true,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-crud-does-not-need-an-spa",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — SPAs, Vue and TypeScript",
        "href": "site/chapters/18-spa-and-vue.html",
        "claim": "CRUD does not need an SPA.",
        "why": "Know when it does.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m19--escapes-does-not",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "`{{ }}` escapes, `{!! !!}` does not.",
        "why": "Grep for the second one.",
        "continues": false,
        "checkpoints": [
            "{{ }}",
            "{!! !!}"
        ],
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-html-escaping-is-not-javascript-escaping",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "HTML escaping is not JavaScript escaping.",
        "why": "`@json()` for data in a script.",
        "continues": false,
        "checkpoints": [
            "@json()"
        ],
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-validate-the-scheme-of-any-user-supplied-url",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "Validate the scheme of any user-supplied URL.",
        "why": "`javascript:` survives escaping.",
        "continues": false,
        "checkpoints": [
            "javascript:"
        ],
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-a-lazy-relation-in-a-loop-in-a-view-is-an-n-1",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "A lazy relation in a loop in a view is an N+1",
        "why": "the controller does not show.",
        "continues": true,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-livewire-public-properties-travel-to-the-browser-and-back",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "Livewire public properties travel to the browser and back.",
        "why": "Nothing big, nothing secret.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19--live-debounce-not-live",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "`.live.debounce`, not `.live`,",
        "why": "on a text input.",
        "continues": true,
        "checkpoints": [
            ".live.debounce",
            ".live"
        ],
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-build-the-api-when-someone-else-consumes-it",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — Blade, Twig, Livewire and Inertia",
        "href": "site/chapters/19-server-rendered-ui.html",
        "claim": "Build the API when someone else consumes it,",
        "why": "not to make a web page interactive.",
        "continues": true,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m20-the-key-contains-everything-that-changes-the-answer",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "The key contains everything that changes the answer",
        "why": "tenant, locale, version.",
        "continues": true,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-ttl-is-a-business-decision",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "TTL is a business decision:",
        "why": "how stale can you afford to be?",
        "continues": true,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-prefer-key-versioning-to-deletion",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "Prefer key versioning to deletion.",
        "why": "There is no delete to forget.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-lock-or-serve-stale-on-recompute",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "Lock or serve stale on recompute.",
        "why": "Expiry on a busy key is a stampede.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-jitter-ttls",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "Jitter TTLs",
        "why": "so warmed keys do not expire together.",
        "continues": true,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-separate-redis-for-cache-and-queue",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "Separate Redis for cache and queue.",
        "why": "Eviction must not eat a job.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-private-on-anything-user-specific",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Caching: Redis, OPcache and HTTP",
        "href": "site/chapters/20-caching.html",
        "claim": "`private` on anything user-specific.",
        "why": "A CDN takes `public` literally.",
        "continues": false,
        "checkpoints": [
            "private",
            "public"
        ],
        "refs": [
            "20"
        ]
    },
    {
        "id": "m21-like-x-cannot-use-an-index",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "`LIKE '%x%'` cannot use an index",
        "why": "and has no relevance, which is worse.",
        "continues": true,
        "checkpoints": [
            "LIKE '%x%'"
        ],
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-the-analyser-must-be-identical-at-index-and-query-time",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "The analyser must be identical at index and query time.",
        "why": "Accents and stemming, always, for Italian.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-start-with-fulltext",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Start with `FULLTEXT`,",
        "why": "escalate to Meilisearch, escalate to Elasticsearch only for a reason you can name.",
        "continues": true,
        "checkpoints": [
            "FULLTEXT"
        ],
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-index-only-what-is-searched-or-filtered",
        "kind": "complete",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Index only what is searched or filtered.",
        "why": "",
        "stem": "Index only what is",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-index-on-a-queue",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Index on a queue,",
        "why": "or their outage is your outage.",
        "continues": true,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-bulk-updates-skip-model-events",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Bulk updates skip model events.",
        "why": "Re-import after them.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-reindex-into-a-new-index-and-swap-the-alias",
        "kind": "complete",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Reindex into a new index and swap the alias.",
        "why": "",
        "stem": "Reindex into a new index",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-log-the-zero-result-searches",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — Search: Elasticsearch and Meilisearch",
        "href": "site/chapters/21-search.html",
        "claim": "Log the zero-result searches.",
        "why": "That is your synonym list.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m22-queue-what-the-response-does-not-depend-on",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Queue what the response does not depend on.",
        "why": "Not merely what is slow.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-every-job-is-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Every job is idempotent,",
        "why": "because delivery is at-least-once.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-bounded-retries-with-backoff",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Bounded retries with backoff;",
        "why": "fail permanent errors immediately.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-job-timeout-below-the-broker-s-visibility-timeout",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Job timeout below the broker's visibility timeout,",
        "why": "or it runs twice concurrently.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-queue-restart-on-every-deploy",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "`queue:restart` on every deploy.",
        "why": "Workers hold the old code.",
        "continues": false,
        "checkpoints": [
            "queue:restart"
        ],
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-separate-queues-by-latency",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Separate queues by latency",
        "why": "so a report cannot block an email.",
        "continues": true,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-alert-on-failed-jobs-and-on-queue-depth",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — Queues, workers and messaging",
        "href": "site/chapters/22-queues-and-messaging.html",
        "claim": "Alert on `failed_jobs` and on queue depth.",
        "why": "An unwatched failed table is silent data loss.",
        "continues": false,
        "checkpoints": [
            "failed_jobs"
        ],
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22b-independent-deployment-is-the-real-benefit",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Independent deployment is the real benefit,",
        "why": "and it is organisational.",
        "continues": true,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-distribution-never-makes-a-page-faster",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Distribution never makes a page faster.",
        "why": "It adds a network hop.",
        "continues": false,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-losing-the-transaction-is-the-biggest-cost",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Losing the transaction is the biggest cost.",
        "why": "A saga needs a business decision, not just code.",
        "continues": false,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-split-by-business-capability",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Split by business capability,",
        "why": "never by technical layer.",
        "continues": true,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-if-they-cannot-deploy-separately-it-is-a-distributed-monolith",
        "kind": "complete",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "If they cannot deploy separately, it is a distributed monolith.",
        "why": "",
        "stem": "If they cannot deploy separately,",
        "continues": false,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-modular-monolith-first",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Modular monolith first,",
        "why": "with boundaries enforced in CI.",
        "continues": true,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-one-force-one-service",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "One force, one service.",
        "why": "Extract for a named reason.",
        "continues": false,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m22b-never-call-their-architecture-wrong",
        "kind": "explain",
        "tier": "module",
        "module": "22b",
        "part": "Chapter 22b — Microservices — and when a monolith wins",
        "href": "site/chapters/22b-microservices.html",
        "claim": "Never call their architecture wrong.",
        "why": "Ask how they handle consistency instead.",
        "continues": false,
        "refs": [
            "22b"
        ]
    },
    {
        "id": "m23-dependencies-point-inward",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Dependencies point inward.",
        "why": "The domain compiles without the framework.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-getters-and-setters-plus-a-900-line-service-is-an-anaemic-model",
        "kind": "complete",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Getters and setters plus a 900-line service is an anaemic model.",
        "why": "",
        "stem": "Getters and setters plus a 900-line",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-value-objects-first",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Value objects first.",
        "why": "Highest return of anything in this chapter.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-one-transaction-one-aggregate",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "One transaction, one aggregate.",
        "why": "Needing two means the boundary is wrong.",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-speak-the-business-s-words",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Speak the business's words",
        "why": "in the code, untranslated.",
        "continues": true,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-commands-through-the-domain-queries-straight-to-sql",
        "kind": "complete",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Commands through the domain, queries straight to SQL.",
        "why": "",
        "stem": "Commands through the domain,",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-event-sourcing-is-not-cqrs",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Event sourcing is not CQRS,",
        "why": "and it is not a first-project decision.",
        "continues": true,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-enforce-boundaries-in-ci",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — Architecture: layers, hexagonal, CQRS, DDD",
        "href": "site/chapters/23-architecture.html",
        "claim": "Enforce boundaries in CI,",
        "why": "or they are decoration.",
        "continues": true,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m24-mock-the-boundaries-you-do-not-own",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Mock the boundaries you do not own.",
        "why": "Use real objects inside your own domain.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-test-against-the-database-you-deploy",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Test against the database you deploy.",
        "why": "SQLite-instead-of-MySQL hides the bugs you were hunting.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-transaction-per-test-rolled-back",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Transaction per test, rolled back.",
        "why": "Fast, and it keeps tests independent.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-coverage-measures-execution-not-verification",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Coverage measures execution, not verification.",
        "why": "Mutation score is the honest number.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-assert-behaviour-not-implementation",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Assert behaviour, not implementation,",
        "why": "or every refactor breaks the suite.",
        "continues": true,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-a-bug-fix-starts-with-a-failing-test",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "A bug fix starts with a failing test.",
        "why": "It proves the bug and stops it returning.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-test-names-are-documentation",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Testing: PHPUnit, Pest and test doubles",
        "href": "site/chapters/24-testing.html",
        "claim": "Test names are documentation.",
        "why": "`test_a_shipped_order_cannot_be_cancelled` tells you the rule.",
        "continues": false,
        "checkpoints": [
            "test_a_shipped_order_cannot_be_cancelled"
        ],
        "refs": [
            "24"
        ]
    },
    {
        "id": "m25-stable-message-variables-in-the-context-array",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Stable message, variables in the context array.",
        "why": "That is what makes logs queryable.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-json-to-stdout",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "JSON to stdout",
        "why": "in production; the platform collects it.",
        "continues": true,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-alert-on-error-and-mean-it",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Alert on `error` and mean it.",
        "why": "Everything-is-an-error trains people to ignore it.",
        "continues": false,
        "checkpoints": [
            "error"
        ],
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-never-log-credentials-tokens-or-personal-data",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Never log credentials, tokens or personal data.",
        "why": "Redact at the logger.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-a-correlation-id-on-every-line",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "A correlation id on every line,",
        "why": "propagated into jobs and returned to the user.",
        "continues": true,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-percentiles-not-averages",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Percentiles, not averages.",
        "why": "The p99 is the person telephoning.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-readiness-checks-dependencies",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Readiness checks dependencies;",
        "why": "liveness does not.",
        "continues": true,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-log-state-changes-and-failures",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Logging, metrics and tracing",
        "href": "site/chapters/25-observability.html",
        "claim": "Log state changes and failures,",
        "why": "not successful reads.",
        "continues": true,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25b-severity-is-impact-scope",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Severity is impact × scope,",
        "why": "not the volume of the complaint.",
        "continues": true,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-acknowledge-in-minutes",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Acknowledge in minutes.",
        "why": "Silence causes escalation, not the bug.",
        "continues": false,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-ask-what-changed",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Ask what changed",
        "why": "before reading any code.",
        "continues": true,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-reproduce-then-write-the-failing-test",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Reproduce, then write the failing test,",
        "why": "then fix.",
        "continues": true,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-default-to-rollback",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Default to rollback",
        "why": "unless a migration made it impossible.",
        "continues": true,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-expand-contract-keeps-rollback-available",
        "kind": "complete",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Expand/contract keeps rollback available.",
        "why": "",
        "stem": "Expand/contract keeps",
        "continues": false,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-hotfix-from-the-production-tag",
        "kind": "explain",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Hotfix from the production tag,",
        "why": "never from `main`.",
        "continues": true,
        "checkpoints": [
            "main"
        ],
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m25b-blameless-post-mortem-and-measure-time-to-detect",
        "kind": "complete",
        "tier": "module",
        "module": "25b",
        "part": "Chapter 25b — Production support as a process",
        "href": "site/chapters/25b-production-support.html",
        "claim": "Blameless post-mortem, and measure time-to-detect.",
        "why": "",
        "stem": "Blameless post-mortem,",
        "continues": false,
        "refs": [
            "25b"
        ]
    },
    {
        "id": "m26-a-commit-is-a-snapshot-a-branch-is-a-pointer",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "A commit is a snapshot; a branch is a pointer.",
        "why": "Everything follows.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-rebase-your-own-work-never-shared-history",
        "kind": "complete",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "Rebase your own work, never shared history.",
        "why": "",
        "stem": "Rebase your own work,",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26--force-with-lease-never-bare-force",
        "kind": "complete",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "`--force-with-lease`, never bare `--force`.",
        "why": "",
        "stem": "`--force-with-lease`, never",
        "continues": false,
        "checkpoints": [
            "--force-with-lease",
            "--force"
        ],
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-revert-in-public-reset-in-private",
        "kind": "complete",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "`revert` in public, `reset` in private.",
        "why": "",
        "stem": "`revert` in public,",
        "continues": false,
        "checkpoints": [
            "revert",
            "reset"
        ],
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-reflog-first",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "`reflog` first",
        "why": "when something looks lost. It usually is not.",
        "continues": true,
        "checkpoints": [
            "reflog"
        ],
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26--abort-always-exists",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "`--abort` always exists.",
        "why": "A conflict is never a trap.",
        "continues": false,
        "checkpoints": [
            "--abort"
        ],
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-the-message-explains-why",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "The message explains why;",
        "why": "the diff already shows what.",
        "continues": true,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-a-committed-secret-is-a-leaked-secret",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — Git",
        "href": "site/chapters/26-git.html",
        "claim": "A committed secret is a leaked secret.",
        "why": "Rotate it, do not just rewrite.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m27-configure-xdebug-once",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Configure Xdebug once.",
        "why": "It repays the twenty minutes in the first week.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-a-silent-breakpoint-is-a-path-mapping",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "A silent breakpoint is a path mapping,",
        "why": "not a broken extension.",
        "continues": true,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-conditional-breakpoints-and-break-on-exception",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Conditional breakpoints and break-on-exception",
        "why": "are where the real speed is.",
        "continues": true,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-never-xdebug-in-production",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Never Xdebug in production.",
        "why": "Cost and remote-execution risk.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-automate-formatting",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Automate formatting",
        "why": "so review is about design, not spacing.",
        "continues": true,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-profile-before-optimising",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Profile before optimising.",
        "why": "Measured, not guessed.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-grep-for-dd-in-ci",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — The toolchain and the debugger nobody sets up",
        "href": "site/chapters/27-tooling-and-xdebug.html",
        "claim": "Grep for `dd(` in CI.",
        "why": "It leaks more than it embarrasses.",
        "continues": false,
        "checkpoints": [
            "dd("
        ],
        "refs": [
            "27"
        ]
    },
    {
        "id": "m28-psr-4-is-case-sensitive-where-it-matters",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "PSR-4 is case-sensitive where it matters.",
        "why": "Filename equals class name.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-update-locally-install-everywhere-else",
        "kind": "complete",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "`update` locally, `install` everywhere else.",
        "why": "",
        "stem": "`update` locally,",
        "continues": false,
        "checkpoints": [
            "update",
            "install"
        ],
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-commit-the-lock-file-for-an-application",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "Commit the lock file for an application,",
        "why": "never for a library.",
        "continues": true,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28--for-constraints",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "`^` for constraints;",
        "why": "`>=` is an invitation to a breaking change.",
        "continues": true,
        "checkpoints": [
            "^",
            ">="
        ],
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-update-one-package-with-with-dependencies",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "Update one package with `--with-dependencies`,",
        "why": "not the world.",
        "continues": true,
        "checkpoints": [
            "--with-dependencies"
        ],
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-manifests-before-source-in-the-dockerfile",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "Manifests before source in the Dockerfile.",
        "why": "That is the build cache.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-multi-stage-no-compiler-in-the-runtime-image",
        "kind": "complete",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "Multi-stage: no compiler in the runtime image.",
        "why": "",
        "stem": "Multi-stage: no compiler in",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-no-secrets-in-layers",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "No secrets in layers.",
        "why": "They survive deletion.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-two-commands-in-the-readme",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — Composer, autoloading and Docker",
        "href": "site/chapters/28-containers-and-composer.html",
        "claim": "Two commands in the README,",
        "why": "or it is not really containerised.",
        "continues": true,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m29-app-debug-false-in-production",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "`APP_DEBUG=false` in production.",
        "why": "The debug page prints your secrets.",
        "continues": false,
        "checkpoints": [
            "APP_DEBUG=false"
        ],
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-never-env-outside-config",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Never `env()` outside config.",
        "why": "Caching makes it null.",
        "continues": false,
        "checkpoints": [
            "env()"
        ],
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-commit-env-example-never-env",
        "kind": "complete",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Commit `.env.example`, never `.env`.",
        "why": "",
        "stem": "Commit `.env.example`,",
        "continues": false,
        "checkpoints": [
            ".env.example",
            ".env"
        ],
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-atomic-deploys-via-symlink",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Atomic deploys via symlink,",
        "why": "with shared storage outside the release.",
        "continues": true,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-reload-fpm-and-restart-queues",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Reload FPM and restart queues",
        "why": "on every deploy.",
        "continues": true,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-expand-contract-for-migrations",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "Expand/contract for migrations,",
        "why": "so rollback stays possible.",
        "continues": true,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-an-untested-backup-is-not-a-backup",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Cloud hosting and deployment",
        "href": "site/chapters/29-cloud-hosting.html",
        "claim": "An untested backup is not a backup.",
        "why": "Know your RPO and RTO.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29b-ask-for-a-subdomain-pointed-at-public",
        "kind": "explain",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Ask for a subdomain pointed at `public/`",
        "why": "before anything else.",
        "continues": true,
        "checkpoints": [
            "public/"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-application-above-the-web-root-public-contents-inside-it",
        "kind": "complete",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Application above the web root, `public/` contents inside it.",
        "why": "",
        "stem": "Application above the web root,",
        "continues": false,
        "checkpoints": [
            "public/"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-fetch-env-yourself-after-every-deploy",
        "kind": "explain",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Fetch `/.env` yourself after every deploy.",
        "why": "Scanners will.",
        "continues": false,
        "checkpoints": [
            "/.env"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-never-deploy-git-or-leave-a-dump-in-the-web-root",
        "kind": "complete",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Never deploy `.git` or leave a dump in the web root.",
        "why": "",
        "stem": "Never deploy `.git` or leave a",
        "continues": false,
        "checkpoints": [
            ".git"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-vendor-is-built-locally-and-uploaded-as-an-archive",
        "kind": "complete",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "`vendor/` is built locally and uploaded as an archive.",
        "why": "",
        "stem": "`vendor/` is built locally and",
        "continues": false,
        "checkpoints": [
            "vendor/"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-cron-plus-flock-plus-stop-when-empty",
        "kind": "explain",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Cron plus `flock` plus `--stop-when-empty`",
        "why": "replaces the worker.",
        "continues": true,
        "checkpoints": [
            "flock",
            "--stop-when-empty"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-smtp-with-spf-dkim-and-dmarc",
        "kind": "explain",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "SMTP with SPF, DKIM and DMARC,",
        "why": "never the host's `mail()`.",
        "continues": true,
        "checkpoints": [
            "mail()"
        ],
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m29b-argue-for-a-vps-with-limits-and-euros",
        "kind": "explain",
        "tier": "module",
        "module": "29b",
        "part": "Chapter 29b — Shared hosting, cPanel and FTP",
        "href": "site/chapters/29b-shared-hosting.html",
        "claim": "Argue for a VPS with limits and euros,",
        "why": "never with taste.",
        "continues": true,
        "refs": [
            "29b"
        ]
    },
    {
        "id": "m30-order-stages-fail-fast",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Order stages fail-fast.",
        "why": "Lint, analyse, unit, integration, deploy.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-build-once-deploy-many",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Build once, deploy many.",
        "why": "The tested artefact is the shipped artefact.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-cache-composer-on-the-lock-file-hash",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Cache Composer on the lock file hash.",
        "why": "Cheapest speed-up available.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-service-containers-need-health-checks",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Service containers need health checks,",
        "why": "or migrations race the database.",
        "continues": true,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-secrets-never-reach-a-fork-s-pull-request",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Secrets never reach a fork's pull request.",
        "why": "Gate the deploy on the branch.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-only-additive-migrations-in-the-deploy",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Only additive migrations in the deploy.",
        "why": "Destructive ones ship later.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-fix-a-flaky-test-the-same-day",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Fix a flaky test the same day.",
        "why": "It disables the whole gate.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-rehearse-the-rollback",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — CI/CD pipelines",
        "href": "site/chapters/30-ci-cd.html",
        "claim": "Rehearse the rollback",
        "why": "before you need it.",
        "continues": true,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m31-filters-must-return",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Filters must return.",
        "why": "Actions must not.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-never-edit-core-themes-or-plugins-in-place",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Never edit core, themes or plugins in place.",
        "why": "Child theme or your own plugin.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-taxonomy-for-filtering-meta-for-storing",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Taxonomy for filtering, meta for storing.",
        "why": "`meta_query` does not scale.",
        "continues": false,
        "checkpoints": [
            "meta_query"
        ],
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31--wpdb-prepare-always",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "`$wpdb->prepare()` always.",
        "why": "Never build SQL by concatenation.",
        "continues": false,
        "checkpoints": [
            "$wpdb->prepare()"
        ],
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-nonce-plus-capability",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Nonce plus capability.",
        "why": "Two checks, two purposes.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-escape-late-per-context",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Escape late, per context.",
        "why": "`esc_html`, `esc_attr`, `esc_url`.",
        "continues": false,
        "checkpoints": [
            "esc_html",
            "esc_attr",
            "esc_url"
        ],
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-wp-search-replace-for-migrations",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "`wp search-replace` for migrations,",
        "why": "because of serialised data.",
        "continues": true,
        "checkpoints": [
            "wp search-replace"
        ],
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-replace-wp-cron-with-real-cron",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — WordPress, done professionally",
        "href": "site/chapters/31-wordpress.html",
        "claim": "Replace `wp-cron` with real cron",
        "why": "on any site that matters.",
        "continues": true,
        "checkpoints": [
            "wp-cron"
        ],
        "refs": [
            "31"
        ]
    },
    {
        "id": "m32-integer-cents-never-floats",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Integer cents, never floats.",
        "why": "One cent reaches the accountant.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-vat-per-line-rounded-per-line-then-summed",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "VAT per line, rounded per line, then summed.",
        "why": "Rates differ within one cart.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-decide-net-or-gross-once",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Decide net or gross once,",
        "why": "write it down, never mix.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-snapshot-price-and-vat-onto-the-order-line",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Snapshot price and VAT onto the order line.",
        "why": "Never re-derive history.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-stock-changes-with-a-conditional-update",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Stock changes with a conditional UPDATE.",
        "why": "Check-then-act oversells.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-checkout-is-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Checkout is idempotent,",
        "why": "with a unique key the database enforces.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-the-webhook-is-the-truth-about-payment",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "The webhook is the truth about payment,",
        "why": "not the browser redirect.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-never-store-card-data",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — E-commerce: Magento, PrestaShop, WooCommerce",
        "href": "site/chapters/32-ecommerce.html",
        "claim": "Never store card data.",
        "why": "Hosted fields or redirect.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m33-handle-ns-mc-and-ne-explicitly",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "Handle `NS`, `MC` and `NE` explicitly,",
        "why": "and show the error code to the user.",
        "continues": true,
        "checkpoints": [
            "NS",
            "MC",
            "NE"
        ],
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-numbering-is-sequential-with-no-gaps",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "Numbering is sequential with no gaps.",
        "why": "Reserve it in the transaction, never `MAX+1`.",
        "continues": false,
        "checkpoints": [
            "MAX+1"
        ],
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-an-accepted-invoice-is-immutable",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "An accepted invoice is immutable.",
        "why": "Correct with a nota di credito.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-codicedestinatario-7-6-or-0000000",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "`CodiceDestinatario`: 7, 6, or `0000000`.",
        "why": "Wrong means a rejection days later.",
        "continues": false,
        "checkpoints": [
            "CodiceDestinatario",
            "0000000"
        ],
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-write-down-who-owns-each-field",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "Write down who owns each field.",
        "why": "Two-way sync on one field is a trap.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-never-delete-on-absence",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "Never delete on absence",
        "why": "from an import file.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-codes-are-strings",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Gestionali, ERP and fatturazione elettronica",
        "href": "site/chapters/33-gestionali-and-sdi.html",
        "claim": "Codes are strings.",
        "why": "Leading zeros are meaningful.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33b-the-call-goes-on-a-queue",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "The call goes on a queue,",
        "why": "or it holds an FPM worker for ten seconds.",
        "continues": true,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-log-tokens-from-day-one",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Log tokens from day one.",
        "why": "Cost you do not measure is cost you cannot forecast.",
        "continues": false,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-user-text-in-a-prompt-is-untrusted-input",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "User text in a prompt is untrusted input,",
        "why": "and there is no escaping for it.",
        "continues": true,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-authorise-in-your-code-never-in-the-prompt",
        "kind": "complete",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Authorise in your code, never in the prompt.",
        "why": "",
        "stem": "Authorise in your code,",
        "continues": false,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-validate-the-output-against-an-allow-list",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Validate the output against an allow-list.",
        "why": "It is a text generator, not an API.",
        "continues": false,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-escape-model-output-before-rendering",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Escape model output before rendering.",
        "why": "It is XSS like any other string.",
        "continues": false,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-never-ask-it-to-do-arithmetic",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Never ask it to do arithmetic",
        "why": "or apply a business rule.",
        "continues": true,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m33b-sending-customer-data-is-a-gdpr-transfer",
        "kind": "explain",
        "tier": "module",
        "module": "33b",
        "part": "Chapter 33b — AI inside a PHP application",
        "href": "site/chapters/33b-ai-in-php.html",
        "claim": "Sending customer data is a GDPR transfer.",
        "why": "Ask before you build.",
        "continues": false,
        "refs": [
            "33b"
        ]
    },
    {
        "id": "m34-stand-up-asks-is-anything-blocked",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Stand-up asks \"is anything blocked\".",
        "why": "It is not a status report.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-refinement-is-the-meeting-to-protect",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Refinement is the meeting to protect.",
        "why": "It is where vague becomes doable.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-points-are-size-and-uncertainty",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Points are size and uncertainty,",
        "why": "never hours, never a target.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-estimate-as-a-range-and-name-the-risk",
        "kind": "complete",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Estimate as a range and name the risk.",
        "why": "",
        "stem": "Estimate as a range",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-raise-the-slip-the-day-you-know-it",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Raise the slip the day you know it.",
        "why": "The single highest-trust habit.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-never-pad-silently",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Never pad silently.",
        "why": "The buffer belongs to the plan, not the ticket.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-testable-acceptance-criteria",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Testable acceptance criteria,",
        "why": "agreed before starting.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-finish-before-you-start",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — Agile, Scrum and the daily rhythm",
        "href": "site/chapters/34-agile.html",
        "claim": "Finish before you start.",
        "why": "WIP limits over multitasking.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m35-requests-arrive-as-solutions",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Requests arrive as solutions.",
        "why": "Ask what they are trying to achieve.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-the-manual-workaround-is-the-specification",
        "kind": "complete",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "The manual workaround is the specification.",
        "why": "",
        "stem": "The manual workaround",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-write-the-understanding-back-before-building",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Write the understanding back before building.",
        "why": "Five minutes, catches everything.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-timebox-before-asking",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Timebox before asking,",
        "why": "then ask with what you tried and what you think.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-write-the-answer-down",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Write the answer down",
        "why": "where the next person will look.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-review-the-code-not-the-person",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Review the code, not the person,",
        "why": "and label severity.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-small-prs-and-say-what-you-are-unsure-about",
        "kind": "complete",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Small PRs, and say what you are unsure about.",
        "why": "",
        "stem": "Small PRs,",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-never-impossible-when-you-mean-expensive",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Analysis, autonomy and code review",
        "href": "site/chapters/35-teamwork.html",
        "claim": "Never \"impossible\" when you mean expensive.",
        "why": "Offer the trade.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m36-action-means-result",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "Action → means → result.",
        "why": "Presence words cannot be the whole bullet.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-a-number-wherever-one-honestly-exists",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "A number wherever one honestly exists,",
        "why": "and nowhere it does not.",
        "continues": true,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-one-column-selectable-text-no-headers-or-tables",
        "kind": "complete",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "One column, selectable text, no headers or tables.",
        "why": "",
        "stem": "One column,",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-the-gdpr-line-on-the-italian-version",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "The GDPR line on the Italian version.",
        "why": "One line, filtered on.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-one-page-as-a-junior",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "One page as a junior.",
        "why": "Cut the oldest, never the newest.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-city-on-the-cv",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "City on the CV.",
        "why": "This market filters on distance.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-cefr-levels",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "CEFR levels.",
        "why": "\"Buono\" is unverifiable; B2 is testable.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-mirror-the-advert-s-true-words",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — Your CV, LinkedIn and this project",
        "href": "site/chapters/36-cv-and-linkedin.html",
        "claim": "Mirror the advert's true words",
        "why": "\"Laravel\", not \"framework PHP\".",
        "continues": true,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m37-it-must-run-from-a-clean-clone",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "It must run from a clean clone.",
        "why": "Test that yourself, in a fresh directory.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-respect-the-timebox",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "Respect the timebox,",
        "why": "and say what you would do with more.",
        "continues": true,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-the-readme-is-the-highest-value-twenty-minutes",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "The README is the highest-value twenty minutes.",
        "why": "Decisions, not features.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-say-where-you-deliberately-stopped",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "Say where you deliberately stopped.",
        "why": "Restraint reads as judgement.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-a-few-real-tests",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "A few real tests,",
        "why": "on the part with actual rules.",
        "continues": true,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-handle-the-edge-cases",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "Handle the edge cases.",
        "why": "Most submissions do not.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-narrate-in-live-sessions",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "Narrate in live sessions.",
        "why": "Silence is the only real failure.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-working-first-clever-never",
        "kind": "complete",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — The screening test",
        "href": "site/chapters/37-screening-test.html",
        "claim": "Working first, clever never.",
        "why": "",
        "stem": "Working first,",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m38-ninety-seconds-for-mi-parli-di-lei",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Ninety seconds for \"mi parli di lei\",",
        "why": "with hooks you want to be asked about.",
        "continues": true,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-answer-mechanism-then-your-own-example",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Answer, mechanism, then your own example.",
        "why": "The example is the differentiator.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38--i-don-t-know-and-here-is-how-i-d-find-out",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "\"I don't know, and here is how I'd find out\"",
        "why": "beats bluffing, always.",
        "continues": true,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-never-criticise-their-stack",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Never criticise their stack.",
        "why": "Same knowledge, asked as curiosity.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-ral-is-gross-over-13-or-14-months",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "RAL is gross, over 13 or 14 months.",
        "why": "Ask which, and ask the CCNL and livello.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-give-a-range-with-a-reason",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Give a range with a reason,",
        "why": "never a single low number.",
        "continues": true,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-ask-what-reservations-they-have",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Ask what reservations they have.",
        "why": "It is the question that saves offers.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-write-down-what-you-could-not-answer",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — The interview",
        "href": "site/chapters/38-the-interview.html",
        "claim": "Write down what you could not answer.",
        "why": "That is your study plan.",
        "continues": false,
        "refs": [
            "38"
        ]
    }
];

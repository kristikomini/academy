/* ==========================================================================
   rules.js — the viva deck. GENERATED FILE, DO NOT EDIT.

   Source:      course/GOLDEN-RULES.md
   Regenerate:  php tools/viva-extract.php java && php tools/viva-deck.php java

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
        "id": "t12-override-equals-and-hashcode-together",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/03-types-and-objects.html",
        "claim": "Override `equals` and `hashCode` together,",
        "why": "or hash-based collections silently lose elements.",
        "continues": true,
        "checkpoints": [
            "equals",
            "hashCode"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "t12-generics-are-erased",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/05-generics.html",
        "claim": "Generics are erased.",
        "why": "Compile-time safety, no runtime type argument.",
        "continues": false,
        "refs": [
            "05"
        ]
    },
    {
        "id": "t12-streams-are-lazy-and-single-use",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "Streams are lazy and single-use.",
        "why": "Nothing runs until a terminal operation.",
        "continues": false,
        "refs": [
            "06"
        ]
    },
    {
        "id": "t12-visibility-is-not-atomicity",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/09-concurrency.html",
        "claim": "Visibility is not atomicity.",
        "why": "`volatile` gives the first, not the second.",
        "continues": false,
        "checkpoints": [
            "volatile"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "t12-what-you-get-injected-is-usually-a-proxy",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/11-spring-container.html",
        "claim": "What you get injected is usually a proxy,",
        "why": "not your object. Everything AOP-based depends on that.",
        "continues": true,
        "refs": [
            "11"
        ]
    },
    {
        "id": "t12-constructor-injection",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/12-dependency-injection.html",
        "claim": "Constructor injection",
        "why": "final fields, no half-built objects, no reflection needed to test.",
        "continues": true,
        "refs": [
            "12"
        ]
    },
    {
        "id": "t12-dirty-checking-means-mutation-is-persistence",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "Dirty checking means mutation is persistence.",
        "why": "There is no `save()` to look for.",
        "continues": false,
        "checkpoints": [
            "save()"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "t12-rollback-on-unchecked-only",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/25-transactions.html",
        "claim": "Rollback on unchecked only.",
        "why": "A checked exception commits unless you set `rollbackFor`.",
        "continues": false,
        "checkpoints": [
            "rollbackFor"
        ],
        "refs": [
            "25"
        ]
    },
    {
        "id": "t12-join-fetch-or-entitygraph-per-query",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "`join fetch` or `@EntityGraph` per query;",
        "why": "`default_batch_fetch_size` as a safety net.",
        "continues": true,
        "checkpoints": [
            "join fetch",
            "@EntityGraph",
            "default_batch_fetch_size"
        ],
        "refs": [
            "26"
        ]
    },
    {
        "id": "t12-never-return-an-entity",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/16-rest-controllers.html",
        "claim": "Never return an entity.",
        "why": "DTO records: one line, and the schema stops being the contract.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "t12-status-codes-are-the-api",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/17-rest-design.html",
        "claim": "Status codes are the API.",
        "why": "200-with-an-error-body forces every client to parse to find out.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "t12-validate-in-production-never-update",
        "kind": "explain",
        "tier": "twelve",
        "module": "",
        "part": "The twelve that decide interviews",
        "href": "site/chapters/29-migrations.html",
        "claim": "`validate` in production, never `update`.",
        "why": "`create-drop` is for tests.",
        "continues": false,
        "checkpoints": [
            "validate",
            "update",
            "create-drop"
        ],
        "refs": [
            "29"
        ]
    },
    {
        "id": "s6-the-heap-is-not-the-whole-footprint",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "The heap is not the whole footprint.",
        "why": "Metaspace, stacks, code cache and direct buffers sit outside it.",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "s6-every-replica-has-its-own-pool",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "Every replica has its own pool.",
        "why": "Multiply before you deploy.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "s6-retries-multiply-through-a-chain",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/32-resilience.html",
        "claim": "Retries multiply through a chain.",
        "why": "Budget them; prefer retrying at one layer.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "s6-alert-on-symptoms-errors-p95-p99-latency-saturation",
        "kind": "complete",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/35-observability.html",
        "claim": "Alert on symptoms: errors, p95/p99 latency, saturation.",
        "why": "",
        "stem": "Alert on symptoms:",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "s6-liveness-restarts-readiness-removes-from-traffic",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "Liveness restarts; readiness removes from traffic.",
        "why": "Never put a dependency check in liveness.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "s6-build-once-promote-the-artefact",
        "kind": "explain",
        "tier": "senior",
        "module": "",
        "part": "The six that separate a senior candidate",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "Build once, promote the artefact.",
        "why": "Rebuilding per environment tests something else.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m00-the-first-block-is-the-interview-agenda",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "The first block is the interview agenda.",
        "why": "Be able to talk for two minutes on every line of it.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-a-gap-in-the-second-block-is-not-a-blocker",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "A gap in the second block is not a blocker",
        "why": "it is a question you should have an answer prepared for.",
        "continues": true,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-java-spring-boot-jpa-and-rest-are-in-all-six-adverts",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Java, Spring Boot, JPA and REST are in all six adverts.",
        "why": "Everything else was in one or two.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-know-your-ral-before-the-first-call",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Know your RAL before the first call,",
        "why": "as a range, gross, annual.",
        "continues": true,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m00-answer-the-questions",
        "kind": "explain",
        "tier": "module",
        "module": "00",
        "part": "Chapter 00 — The job posting, decoded",
        "href": "site/chapters/00-the-job-posting.html",
        "claim": "Answer the questions.",
        "why": "The chapters are the setup; retrieval is the mechanism.",
        "continues": false,
        "refs": [
            "00"
        ]
    },
    {
        "id": "m01-javac-barely-optimises",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — The JVM, and what actually runs",
        "href": "site/chapters/01-jvm-and-runtime.html",
        "claim": "javac barely optimises.",
        "why": "The compiler that matters is the JIT, and it runs later, with profile data.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-java-gets-faster-as-it-runs",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — The JVM, and what actually runs",
        "href": "site/chapters/01-jvm-and-runtime.html",
        "claim": "Java gets faster as it runs.",
        "why": "Any benchmark without a warm-up phase is measuring the interpreter.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-classnotfoundexception-is-a-runtime-lookup-that-failed",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — The JVM, and what actually runs",
        "href": "site/chapters/01-jvm-and-runtime.html",
        "claim": "`ClassNotFoundException` is a runtime lookup that failed;",
        "why": "`NoClassDefFoundError` is a packaging problem — or a static initialiser that threw.",
        "continues": true,
        "checkpoints": [
            "ClassNotFoundException",
            "NoClassDefFoundError"
        ],
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-install-a-jdk-not-a-jre",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — The JVM, and what actually runs",
        "href": "site/chapters/01-jvm-and-runtime.html",
        "claim": "Install a JDK, not a JRE,",
        "why": "and know which vendor’s build you are running.",
        "continues": true,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m01-start-up-cost-is-the-price-of-the-jit",
        "kind": "explain",
        "tier": "module",
        "module": "01",
        "part": "Chapter 01 — The JVM, and what actually runs",
        "href": "site/chapters/01-jvm-and-runtime.html",
        "claim": "Start-up cost is the price of the JIT.",
        "why": "That is the trade Quarkus and native images reverse.",
        "continues": false,
        "refs": [
            "01"
        ]
    },
    {
        "id": "m02-the-lts-line-is-8-11-17-21",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "The LTS line is 8, 11, 17, 21.",
        "why": "The number in an advert is a hint about the codebase’s age.",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-java-8-is-lambdas-streams-optional-and-java-time",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "Java 8 is lambdas, streams, Optional and java.time",
        "why": "and default methods, which existed so `Collection` could grow `stream()`.",
        "continues": true,
        "checkpoints": [
            "Collection",
            "stream()"
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-the-8-11-pain-was-removals-and-strong-encapsulation",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "The 8→11 pain was removals and strong encapsulation,",
        "why": "not modules you had to adopt.",
        "continues": true,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-var-is-compile-time-inference",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "`var` is compile-time inference.",
        "why": "There is no runtime difference at all.",
        "continues": false,
        "checkpoints": [
            "var"
        ],
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-on-java-17-write-java-17",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "On Java 17, write Java 17.",
        "why": "A record instead of a thirty-line DTO is the cheapest signal you have.",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m02-virtual-threads-undercut-the-main-argument-for-reactive",
        "kind": "explain",
        "tier": "module",
        "module": "02",
        "part": "Chapter 02 — Java 8 → 17 → 21, version by version",
        "href": "site/chapters/02-java-versions.html",
        "claim": "Virtual threads undercut the main argument for reactive.",
        "why": "Know that, even if the job is on 17.",
        "continues": false,
        "refs": [
            "02"
        ]
    },
    {
        "id": "m03-never-on-wrappers",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Types, objects and equality",
        "href": "site/chapters/03-types-and-objects.html",
        "claim": "Never `==` on wrappers.",
        "why": "The −128…127 cache makes it look correct in tests.",
        "continues": false,
        "checkpoints": [
            "=="
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-keys-must-be-immutable",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Types, objects and equality",
        "href": "site/chapters/03-types-and-objects.html",
        "claim": "Keys must be immutable",
        "why": "in the fields that feed `hashCode`.",
        "continues": true,
        "checkpoints": [
            "hashCode"
        ],
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-unboxing-a-null-wrapper-throws-npe",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Types, objects and equality",
        "href": "site/chapters/03-types-and-objects.html",
        "claim": "Unboxing a null wrapper throws NPE",
        "why": "on a line with no visible dereference.",
        "continues": true,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m03-immutability-is-shallow",
        "kind": "explain",
        "tier": "module",
        "module": "03",
        "part": "Chapter 03 — Types, objects and equality",
        "href": "site/chapters/03-types-and-objects.html",
        "claim": "Immutability is shallow.",
        "why": "Copy mutable components in and out.",
        "continues": false,
        "refs": [
            "03"
        ]
    },
    {
        "id": "m04-arraylist-unless-proven-otherwise",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Collections, and choosing the right one",
        "href": "site/chapters/04-collections.html",
        "claim": "`ArrayList` unless proven otherwise.",
        "why": "Cache locality beats the complexity table more often than people expect.",
        "continues": false,
        "checkpoints": [
            "ArrayList"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-arraydeque-not-linkedlist",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Collections, and choosing the right one",
        "href": "site/chapters/04-collections.html",
        "claim": "`ArrayDeque`, not `LinkedList`,",
        "why": "when you need both ends.",
        "continues": true,
        "checkpoints": [
            "ArrayDeque",
            "LinkedList"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-contains-in-a-loop-over-a-list-is-o-n",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Collections, and choosing the right one",
        "href": "site/chapters/04-collections.html",
        "claim": "`contains` in a loop over a List is O(n²).",
        "why": "Use a Set.",
        "continues": false,
        "checkpoints": [
            "contains"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-concurrenthashmap-for-shared-maps",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Collections, and choosing the right one",
        "href": "site/chapters/04-collections.html",
        "claim": "`ConcurrentHashMap` for shared maps",
        "why": "not `Hashtable`, not a synchronized wrapper.",
        "continues": true,
        "checkpoints": [
            "ConcurrentHashMap",
            "Hashtable"
        ],
        "refs": [
            "04"
        ]
    },
    {
        "id": "m04-size-large-maps-up-front",
        "kind": "explain",
        "tier": "module",
        "module": "04",
        "part": "Chapter 04 — Collections, and choosing the right one",
        "href": "site/chapters/04-collections.html",
        "claim": "Size large maps up front.",
        "why": "Resizing rehashes everything.",
        "continues": false,
        "refs": [
            "04"
        ]
    },
    {
        "id": "m05-no-new-t-no-instanceof-list-string",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — Generics and erasure",
        "href": "site/chapters/05-generics.html",
        "claim": "No `new T[]`, no `instanceof List<String>`,",
        "why": "no overloading that differs only by type argument.",
        "continues": true,
        "checkpoints": [
            "new T[]",
            "instanceof List<String>"
        ],
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-pecs",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — Generics and erasure",
        "href": "site/chapters/05-generics.html",
        "claim": "PECS.",
        "why": "Producer `extends`, consumer `super`.",
        "continues": false,
        "checkpoints": [
            "extends",
            "super"
        ],
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05-generics-are-invariant",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — Generics and erasure",
        "href": "site/chapters/05-generics.html",
        "claim": "Generics are invariant",
        "why": "and that is what stops a cat entering your list of dogs.",
        "continues": true,
        "refs": [
            "05"
        ]
    },
    {
        "id": "m05--suppresswarnings-unchecked-is-a-request-to-think",
        "kind": "explain",
        "tier": "module",
        "module": "05",
        "part": "Chapter 05 — Generics and erasure",
        "href": "site/chapters/05-generics.html",
        "claim": "`@SuppressWarnings(\"unchecked\")` is a request to think,",
        "why": "not a way to silence the compiler.",
        "continues": true,
        "checkpoints": [
            "@SuppressWarnings(\"unchecked\")"
        ],
        "refs": [
            "05"
        ]
    },
    {
        "id": "m06-a-lambda-needs-a-functional-interface",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Lambdas, streams and Optional",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "A lambda needs a functional interface",
        "why": "exactly one abstract method.",
        "continues": true,
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-flatmap-when-each-element-yields-many",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Lambdas, streams and Optional",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "`flatMap` when each element yields many;",
        "why": "`map` when it yields one.",
        "continues": true,
        "checkpoints": [
            "flatMap",
            "map"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-parallelstream-shares-the-common-pool",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Lambdas, streams and Optional",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "`parallelStream()` shares the common pool.",
        "why": "Rarely right inside a web request.",
        "continues": false,
        "checkpoints": [
            "parallelStream()"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-optional-is-a-return-type",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Lambdas, streams and Optional",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "`Optional` is a return type.",
        "why": "Not a field, not a parameter, never null.",
        "continues": false,
        "checkpoints": [
            "Optional"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m06-orelseget-not-orelse",
        "kind": "explain",
        "tier": "module",
        "module": "06",
        "part": "Chapter 06 — Lambdas, streams and Optional",
        "href": "site/chapters/06-streams-lambdas.html",
        "claim": "`orElseGet`, not `orElse`,",
        "why": "when the fallback costs anything.",
        "continues": true,
        "checkpoints": [
            "orElseGet",
            "orElse"
        ],
        "refs": [
            "06"
        ]
    },
    {
        "id": "m07-a-record-is-a-transparent-data-carrier",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Records, sealed types and pattern matching",
        "href": "site/chapters/07-records-sealed-pattern.html",
        "claim": "A record is a transparent data carrier",
        "why": "with correct `equals` by construction.",
        "continues": true,
        "checkpoints": [
            "equals"
        ],
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-validate-in-the-compact-constructor",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Records, sealed types and pattern matching",
        "href": "site/chapters/07-records-sealed-pattern.html",
        "claim": "Validate in the compact constructor,",
        "why": "and copy mutable components while you are there.",
        "continues": true,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-sealed-switch-gives-exhaustiveness-checking",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Records, sealed types and pattern matching",
        "href": "site/chapters/07-records-sealed-pattern.html",
        "claim": "Sealed + switch gives exhaustiveness checking.",
        "why": "That is the reason to use it.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-enum-closed-set-of-constants-sealed-interface-closed-set-of-shapes",
        "kind": "complete",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Records, sealed types and pattern matching",
        "href": "site/chapters/07-records-sealed-pattern.html",
        "claim": "Enum = closed set of constants; sealed interface = closed set of shapes.",
        "why": "",
        "stem": "Enum = closed set of constants;",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m07-on-a-java-17-job-write-java-17",
        "kind": "explain",
        "tier": "module",
        "module": "07",
        "part": "Chapter 07 — Records, sealed types and pattern matching",
        "href": "site/chapters/07-records-sealed-pattern.html",
        "claim": "On a Java 17 job, write Java 17.",
        "why": "The DTO is where it shows first.",
        "continues": false,
        "refs": [
            "07"
        ]
    },
    {
        "id": "m08-unchecked-for-programming-errors-checked-only-when-the-caller-can-genuinely-recover",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Exceptions, checked and otherwise",
        "href": "site/chapters/08-exceptions.html",
        "claim": "Unchecked for programming errors, checked only when the caller can genuinely recover",
        "why": "and modern frameworks use unchecked throughout.",
        "continues": true,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-catch-only-what-you-can-act-on",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Exceptions, checked and otherwise",
        "href": "site/chapters/08-exceptions.html",
        "claim": "Catch only what you can act on,",
        "why": "at the level that can act on it.",
        "continues": true,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-always-pass-the-cause-when-wrapping",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Exceptions, checked and otherwise",
        "href": "site/chapters/08-exceptions.html",
        "claim": "Always pass the cause when wrapping.",
        "why": "Otherwise you delete the evidence.",
        "continues": false,
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-never-swallow-interruptedexception",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Exceptions, checked and otherwise",
        "href": "site/chapters/08-exceptions.html",
        "claim": "Never swallow `InterruptedException`.",
        "why": "Propagate, or restore the flag.",
        "continues": false,
        "checkpoints": [
            "InterruptedException"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m08-try-with-resources-always",
        "kind": "explain",
        "tier": "module",
        "module": "08",
        "part": "Chapter 08 — Exceptions, checked and otherwise",
        "href": "site/chapters/08-exceptions.html",
        "claim": "`try-with-resources` always,",
        "why": "and know that it preserves the original exception.",
        "continues": true,
        "checkpoints": [
            "try-with-resources"
        ],
        "refs": [
            "08"
        ]
    },
    {
        "id": "m09-count-is-read-modify-write",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Threads, executors and virtual threads",
        "href": "site/chapters/09-concurrency.html",
        "claim": "`count++` is read-modify-write.",
        "why": "Use an atomic, or a lock.",
        "continues": false,
        "checkpoints": [
            "count++"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-executors-not-new-thread",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Threads, executors and virtual threads",
        "href": "site/chapters/09-concurrency.html",
        "claim": "Executors, not `new Thread()`.",
        "why": "Execution policy belongs in one place.",
        "continues": false,
        "checkpoints": [
            "new Thread()"
        ],
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-bounded-queues-with-an-explicit-rejection-policy",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Threads, executors and virtual threads",
        "href": "site/chapters/09-concurrency.html",
        "claim": "Bounded queues with an explicit rejection policy.",
        "why": "Unbounded turns overload into OOM.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-virtual-threads-one-per-task-never-pooled",
        "kind": "complete",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Threads, executors and virtual threads",
        "href": "site/chapters/09-concurrency.html",
        "claim": "Virtual threads: one per task, never pooled.",
        "why": "",
        "stem": "Virtual threads:",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m09-singleton-beans-are-shared-across-request-threads",
        "kind": "explain",
        "tier": "module",
        "module": "09",
        "part": "Chapter 09 — Threads, executors and virtual threads",
        "href": "site/chapters/09-concurrency.html",
        "claim": "Singleton beans are shared across request threads.",
        "why": "Keep them stateless.",
        "continues": false,
        "refs": [
            "09"
        ]
    },
    {
        "id": "m10-most-objects-die-young",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — Memory, garbage collection and the heap",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "Most objects die young.",
        "why": "That is why the heap is generational.",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-use-the-default-collector-until-a-measurement-disagrees",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — Memory, garbage collection and the heap",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "Use the default collector until a measurement disagrees.",
        "why": "G1 is a good default.",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-exit-code-137-with-no-stack-trace-is-the-oomkiller",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — Memory, garbage collection and the heap",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "Exit code 137 with no stack trace is the OOMKiller,",
        "why": "not a Java error.",
        "continues": true,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-set-maxrampercentage-and-leave-headroom",
        "kind": "explain",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — Memory, garbage collection and the heap",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "Set `MaxRAMPercentage` and leave headroom",
        "why": "under the container limit.",
        "continues": true,
        "checkpoints": [
            "MaxRAMPercentage"
        ],
        "refs": [
            "10"
        ]
    },
    {
        "id": "m10-heap-dump-first-opinions-second",
        "kind": "complete",
        "tier": "module",
        "module": "10",
        "part": "Chapter 10 — Memory, garbage collection and the heap",
        "href": "site/chapters/10-memory-gc.html",
        "claim": "Heap dump first, opinions second.",
        "why": "",
        "stem": "Heap dump first,",
        "continues": false,
        "refs": [
            "10"
        ]
    },
    {
        "id": "m11-the-container-owns-construction",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — The container: beans, scopes, lifecycle",
        "href": "site/chapters/11-spring-container.html",
        "claim": "The container owns construction.",
        "why": "You describe beans; Spring builds the graph.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-singleton-is-the-default-scope",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — The container: beans, scopes, lifecycle",
        "href": "site/chapters/11-spring-container.html",
        "claim": "Singleton is the default scope.",
        "why": "Mutable fields on a service are shared across every request.",
        "continues": false,
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11-prototype-injected-into-a-singleton-is-resolved-once",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — The container: beans, scopes, lifecycle",
        "href": "site/chapters/11-spring-container.html",
        "claim": "Prototype injected into a singleton is resolved once.",
        "why": "Use `ObjectProvider` for per-call instances.",
        "continues": false,
        "checkpoints": [
            "ObjectProvider"
        ],
        "refs": [
            "11"
        ]
    },
    {
        "id": "m11--postconstruct-runs-before-proxying",
        "kind": "explain",
        "tier": "module",
        "module": "11",
        "part": "Chapter 11 — The container: beans, scopes, lifecycle",
        "href": "site/chapters/11-spring-container.html",
        "claim": "`@PostConstruct` runs before proxying.",
        "why": "Transactions there do not exist.",
        "continues": false,
        "checkpoints": [
            "@PostConstruct"
        ],
        "refs": [
            "11"
        ]
    },
    {
        "id": "m12-a-single-constructor-needs-no-autowired",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Dependency injection, done properly",
        "href": "site/chapters/12-dependency-injection.html",
        "claim": "A single constructor needs no `@Autowired`",
        "why": "since Spring 4.3.",
        "continues": true,
        "checkpoints": [
            "@Autowired"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-a-long-constructor-is-a-visible-design-smell",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Dependency injection, done properly",
        "href": "site/chapters/12-dependency-injection.html",
        "claim": "A long constructor is a visible design smell.",
        "why": "Field injection hides it.",
        "continues": false,
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12--primary-for-the-default-qualifier-for-the-exception",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Dependency injection, done properly",
        "href": "site/chapters/12-dependency-injection.html",
        "claim": "`@Primary` for the default, `@Qualifier` for the exception,",
        "why": "a `List<T>` when you want all of them.",
        "continues": true,
        "checkpoints": [
            "@Primary",
            "@Qualifier",
            "List<T>"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m12-a-circular-dependency-is-a-design-signal",
        "kind": "explain",
        "tier": "module",
        "module": "12",
        "part": "Chapter 12 — Dependency injection, done properly",
        "href": "site/chapters/12-dependency-injection.html",
        "claim": "A circular dependency is a design signal.",
        "why": "`@Lazy` silences the message.",
        "continues": false,
        "checkpoints": [
            "@Lazy"
        ],
        "refs": [
            "12"
        ]
    },
    {
        "id": "m13-one-artefact-many-environments",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Configuration, profiles and properties",
        "href": "site/chapters/13-configuration-profiles.html",
        "claim": "One artefact, many environments.",
        "why": "The environment supplies the differences.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-later-sources-win",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Configuration, profiles and properties",
        "href": "site/chapters/13-configuration-profiles.html",
        "claim": "Later sources win:",
        "why": "command line > env vars > external files > packaged files.",
        "continues": true,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13--configurationproperties-over-value",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Configuration, profiles and properties",
        "href": "site/chapters/13-configuration-profiles.html",
        "claim": "`@ConfigurationProperties` over `@Value`",
        "why": "it fails at start-up instead of at first use.",
        "continues": true,
        "checkpoints": [
            "@ConfigurationProperties",
            "@Value"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-bind-to-a-record",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Configuration, profiles and properties",
        "href": "site/chapters/13-configuration-profiles.html",
        "claim": "Bind to a record",
        "why": "and add `@Validated`.",
        "continues": true,
        "checkpoints": [
            "@Validated"
        ],
        "refs": [
            "13"
        ]
    },
    {
        "id": "m13-no-secrets-in-the-repository",
        "kind": "explain",
        "tier": "module",
        "module": "13",
        "part": "Chapter 13 — Configuration, profiles and properties",
        "href": "site/chapters/13-configuration-profiles.html",
        "claim": "No secrets in the repository.",
        "why": "Git history outlives the deletion.",
        "continues": false,
        "refs": [
            "13"
        ]
    },
    {
        "id": "m14-a-starter-is-a-version-opinion",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Spring Boot and auto-configuration",
        "href": "site/chapters/14-spring-boot-autoconfig.html",
        "claim": "A starter is a version opinion,",
        "why": "not code. That is most of Boot’s value.",
        "continues": true,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-auto-configuration-is-conditional-bean-definition",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Spring Boot and auto-configuration",
        "href": "site/chapters/14-spring-boot-autoconfig.html",
        "claim": "Auto-configuration is conditional bean definition.",
        "why": "Define your own bean and it backs off.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14--debug-prints-the-condition-evaluation-report",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Spring Boot and auto-configuration",
        "href": "site/chapters/14-spring-boot-autoconfig.html",
        "claim": "`--debug` prints the condition evaluation report.",
        "why": "Use it instead of guessing.",
        "continues": false,
        "checkpoints": [
            "--debug"
        ],
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-component-scan-starts-at-the-main-class-s-package",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Spring Boot and auto-configuration",
        "href": "site/chapters/14-spring-boot-autoconfig.html",
        "claim": "Component scan starts at the main class’s package.",
        "why": "Siblings are invisible.",
        "continues": false,
        "refs": [
            "14"
        ]
    },
    {
        "id": "m14-expose-actuator-endpoints-deliberately",
        "kind": "explain",
        "tier": "module",
        "module": "14",
        "part": "Chapter 14 — Spring Boot and auto-configuration",
        "href": "site/chapters/14-spring-boot-autoconfig.html",
        "claim": "Expose actuator endpoints deliberately.",
        "why": "`/env` and `/heapdump` are not public information.",
        "continues": false,
        "checkpoints": [
            "/env",
            "/heapdump"
        ],
        "refs": [
            "14"
        ]
    },
    {
        "id": "m15-quarkus-moves-wiring-to-build-time",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Quarkus, and when it is chosen instead",
        "href": "site/chapters/15-quarkus-vs-spring.html",
        "claim": "Quarkus moves wiring to build time.",
        "why": "Less reflection, less start-up work.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-faster-start-smaller-footprint-lower-peak-throughput",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Quarkus, and when it is chosen instead",
        "href": "site/chapters/15-quarkus-vs-spring.html",
        "claim": "Faster start, smaller footprint, lower peak throughput.",
        "why": "All three, honestly.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-it-is-a-start-up-versus-steady-state-question",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Quarkus, and when it is chosen instead",
        "href": "site/chapters/15-quarkus-vs-spring.html",
        "claim": "It is a start-up-versus-steady-state question,",
        "why": "not a tribal one.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-built-on-jakarta-standards",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Quarkus, and when it is chosen instead",
        "href": "site/chapters/15-quarkus-vs-spring.html",
        "claim": "Built on Jakarta standards",
        "why": "CDI, JAX-RS, JPA. A Spring developer reads it fine.",
        "continues": true,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m15-spring-boot-3-graalvm-narrowed-the-gap",
        "kind": "explain",
        "tier": "module",
        "module": "15",
        "part": "Chapter 15 — Quarkus, and when it is chosen instead",
        "href": "site/chapters/15-quarkus-vs-spring.html",
        "claim": "Spring Boot 3 + GraalVM narrowed the gap.",
        "why": "Say so; it shows you are current.",
        "continues": false,
        "refs": [
            "15"
        ]
    },
    {
        "id": "m16-security-is-a-filter-before-the-dispatcher",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — REST controllers and the request cycle",
        "href": "site/chapters/16-rest-controllers.html",
        "claim": "Security is a filter, before the dispatcher.",
        "why": "That is why `@ControllerAdvice` never sees auth failures.",
        "continues": false,
        "checkpoints": [
            "@ControllerAdvice"
        ],
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-thin-controllers",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — REST controllers and the request cycle",
        "href": "site/chapters/16-rest-controllers.html",
        "claim": "Thin controllers.",
        "why": "Map, validate, delegate, set the status code.",
        "continues": false,
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-lazyinitializationexception-during-serialisation-means-the-entity-escaped-the-transaction",
        "kind": "complete",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — REST controllers and the request cycle",
        "href": "site/chapters/16-rest-controllers.html",
        "claim": "`LazyInitializationException` during serialisation means the entity escaped the transaction.",
        "why": "",
        "stem": "`LazyInitializationException` during serialisation means the",
        "continues": false,
        "checkpoints": [
            "LazyInitializationException"
        ],
        "refs": [
            "16"
        ]
    },
    {
        "id": "m16-iso-8601-dates-bigdecimal-money",
        "kind": "explain",
        "tier": "module",
        "module": "16",
        "part": "Chapter 16 — REST controllers and the request cycle",
        "href": "site/chapters/16-rest-controllers.html",
        "claim": "ISO-8601 dates, `BigDecimal` money.",
        "why": "Configure once.",
        "continues": false,
        "checkpoints": [
            "BigDecimal"
        ],
        "refs": [
            "16"
        ]
    },
    {
        "id": "m17-nouns-in-the-path-verbs-from-http",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Designing a REST API people can use",
        "href": "site/chapters/17-rest-design.html",
        "claim": "Nouns in the path, verbs from HTTP.",
        "why": "`POST /orders`, never `/createOrder`.",
        "continues": false,
        "checkpoints": [
            "POST /orders",
            "/createOrder"
        ],
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-post-is-not-idempotent",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Designing a REST API people can use",
        "href": "site/chapters/17-rest-design.html",
        "claim": "POST is not idempotent.",
        "why": "Use an idempotency key and a unique constraint, not a pre-check.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-cap-page-size-server-side",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Designing a REST API people can use",
        "href": "site/chapters/17-rest-design.html",
        "claim": "Cap page size server-side,",
        "why": "and prefer keyset pagination for large collections.",
        "continues": true,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m17-adding-an-optional-field-is-not-a-breaking-change",
        "kind": "explain",
        "tier": "module",
        "module": "17",
        "part": "Chapter 17 — Designing a REST API people can use",
        "href": "site/chapters/17-rest-design.html",
        "claim": "Adding an optional field is not a breaking change.",
        "why": "Design so you rarely need v2.",
        "continues": false,
        "refs": [
            "17"
        ]
    },
    {
        "id": "m18-validate-the-dto-not-the-entity",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Validation and error responses",
        "href": "site/chapters/18-validation-errors.html",
        "claim": "Validate the DTO, not the entity.",
        "why": "Entity constraints fire at flush, in the wrong layer.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18--valid-on-the-request-body",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Validation and error responses",
        "href": "site/chapters/18-validation-errors.html",
        "claim": "`@Valid` on the request body",
        "why": "turns bad input into a 400 before your code runs.",
        "continues": true,
        "checkpoints": [
            "@Valid"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-one-restcontrolleradvice",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Validation and error responses",
        "href": "site/chapters/18-validation-errors.html",
        "claim": "One `@RestControllerAdvice`,",
        "why": "one error shape, stack traces logged and never returned.",
        "continues": true,
        "checkpoints": [
            "@RestControllerAdvice"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-malformed-json-and-type-mismatches-are-400s",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Validation and error responses",
        "href": "site/chapters/18-validation-errors.html",
        "claim": "Malformed JSON and type mismatches are 400s.",
        "why": "A blanket `Exception` handler hides that.",
        "continues": false,
        "checkpoints": [
            "Exception"
        ],
        "refs": [
            "18"
        ]
    },
    {
        "id": "m18-rfc-7807-plus-a-correlation-id",
        "kind": "explain",
        "tier": "module",
        "module": "18",
        "part": "Chapter 18 — Validation and error responses",
        "href": "site/chapters/18-validation-errors.html",
        "claim": "RFC 7807, plus a correlation id.",
        "why": "Standard shape, traceable incident.",
        "continues": false,
        "refs": [
            "18"
        ]
    },
    {
        "id": "m19-graphql-moves-shape-selection-to-the-client",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — GraphQL, and when it beats REST",
        "href": "site/chapters/19-graphql.html",
        "claim": "GraphQL moves shape selection to the client.",
        "why": "That is the whole idea.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-it-costs-you-http-caching-endpoint-rate-limiting-and-status-code-monitoring",
        "kind": "complete",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — GraphQL, and when it beats REST",
        "href": "site/chapters/19-graphql.html",
        "claim": "It costs you HTTP caching, endpoint rate limiting and status-code monitoring.",
        "why": "",
        "stem": "It costs you HTTP caching,",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-n-1-is-worse-not-better",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — GraphQL, and when it beats REST",
        "href": "site/chapters/19-graphql.html",
        "claim": "N+1 is worse, not better.",
        "why": "`DataLoader` batching is mandatory, not optional.",
        "continues": false,
        "checkpoints": [
            "DataLoader"
        ],
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-worth-it-for-many-differing-clients",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — GraphQL, and when it beats REST",
        "href": "site/chapters/19-graphql.html",
        "claim": "Worth it for many differing clients;",
        "why": "overkill for one front end or a fixed integration contract.",
        "continues": true,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m19-design-the-schema",
        "kind": "explain",
        "tier": "module",
        "module": "19",
        "part": "Chapter 19 — GraphQL, and when it beats REST",
        "href": "site/chapters/19-graphql.html",
        "claim": "Design the schema.",
        "why": "Do not expose the entity graph.",
        "continues": false,
        "refs": [
            "19"
        ]
    },
    {
        "id": "m20-it-is-a-filter-chain-before-the-dispatcher",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "It is a filter chain, before the dispatcher.",
        "why": "Security errors need their own handlers.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-401-is-who-are-you-403-is-not-allowed",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "401 is “who are you”, 403 is “not allowed”.",
        "why": "Clients branch on the difference.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-hasrole-admin-looks-for-role-admin",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "`hasRole(\"ADMIN\")` looks for `ROLE_ADMIN`.",
        "why": "The prefix is implicit.",
        "continues": false,
        "checkpoints": [
            "hasRole(\"ADMIN\")",
            "ROLE_ADMIN"
        ],
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-a-jwt-is-signed-not-secret-and-cannot-be-revoked",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "A JWT is signed, not secret, and cannot be revoked.",
        "why": "Short access token, revocable refresh token.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-disable-csrf-only-for-header-authenticated-stateless-apis",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "Disable CSRF only for header-authenticated stateless APIs.",
        "why": "Cookie auth needs it.",
        "continues": false,
        "refs": [
            "20"
        ]
    },
    {
        "id": "m20-the-securitycontext-is-thread-local",
        "kind": "explain",
        "tier": "module",
        "module": "20",
        "part": "Chapter 20 — Spring Security, JWT and OAuth2",
        "href": "site/chapters/20-security-auth.html",
        "claim": "The SecurityContext is thread-local.",
        "why": "It does not follow you into `@Async`.",
        "continues": false,
        "checkpoints": [
            "@Async"
        ],
        "refs": [
            "20"
        ]
    },
    {
        "id": "m21-generate-the-document-from-the-code",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — OpenAPI, contracts and generated clients",
        "href": "site/chapters/21-openapi.html",
        "claim": "Generate the document from the code",
        "why": "and it cannot drift from the code.",
        "continues": true,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-bean-validation-annotations-become-schema-constraints",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — OpenAPI, contracts and generated clients",
        "href": "site/chapters/21-openapi.html",
        "claim": "Bean Validation annotations become schema constraints.",
        "why": "One more reason to use them.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-contract-first-when-the-consumer-is-another-team-or-company",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — OpenAPI, contracts and generated clients",
        "href": "site/chapters/21-openapi.html",
        "claim": "Contract-first when the consumer is another team or company;",
        "why": "code-first for one internal client.",
        "continues": true,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-generated-clients-unblock-the-caller",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — OpenAPI, contracts and generated clients",
        "href": "site/chapters/21-openapi.html",
        "claim": "Generated clients unblock the caller",
        "why": "before your service exists.",
        "continues": true,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m21-a-published-bad-api-is-still-a-bad-api",
        "kind": "explain",
        "tier": "module",
        "module": "21",
        "part": "Chapter 21 — OpenAPI, contracts and generated clients",
        "href": "site/chapters/21-openapi.html",
        "claim": "A published bad API is still a bad API.",
        "why": "Swagger UI does not make it a design.",
        "continues": false,
        "refs": [
            "21"
        ]
    },
    {
        "id": "m22-always-parameterise",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — JDBC, connection pools and what leaks",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "Always parameterise.",
        "why": "Separate channels for SQL and values; injection becomes structurally impossible.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-small-pools-are-faster",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — JDBC, connection pools and what leaks",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "Small pools are faster.",
        "why": "10–20 is normal; 200 is a misunderstanding.",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-maxlifetime-below-the-database-and-firewall-idle-timeouts",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — JDBC, connection pools and what leaks",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "`maxLifetime` below the database and firewall idle timeouts,",
        "why": "or you hand out dead connections.",
        "continues": true,
        "checkpoints": [
            "maxLifetime"
        ],
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-a-leaked-connection-breaks-other-requests-not-the-one-that-leaked-it",
        "kind": "complete",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — JDBC, connection pools and what leaks",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "A leaked connection breaks other requests, not the one that leaked it.",
        "why": "",
        "stem": "A leaked connection breaks other requests,",
        "continues": false,
        "refs": [
            "22"
        ]
    },
    {
        "id": "m22-jpa-for-the-domain-sql-for-reporting",
        "kind": "explain",
        "tier": "module",
        "module": "22",
        "part": "Chapter 22 — JDBC, connection pools and what leaks",
        "href": "site/chapters/22-jdbc-and-pools.html",
        "claim": "JPA for the domain, SQL for reporting.",
        "why": "Mixing them is not a failure.",
        "continues": false,
        "refs": [
            "22",
            "24"
        ]
    },
    {
        "id": "m23-everything-lazy",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — JPA and Hibernate: the object-relational bargain",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "Everything LAZY,",
        "why": "and fetch explicitly per query.",
        "continues": true,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-lazyinitializationexception-means-the-entity-outlived-its-transaction",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — JPA and Hibernate: the object-relational bargain",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "`LazyInitializationException` means the entity outlived its transaction.",
        "why": "Return a DTO.",
        "continues": false,
        "checkpoints": [
            "LazyInitializationException"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-open-in-view-hides-the-problem-and-holds-a-connection",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — JPA and Hibernate: the object-relational bargain",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "`open-in-view` hides the problem and holds a connection",
        "why": "for the whole request.",
        "continues": true,
        "checkpoints": [
            "open-in-view"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-no-lombok-data-on-entities",
        "kind": "explain",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — JPA and Hibernate: the object-relational bargain",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "No Lombok `@Data` on entities.",
        "why": "It walks your associations.",
        "continues": false,
        "checkpoints": [
            "@Data"
        ],
        "refs": [
            "23"
        ]
    },
    {
        "id": "m23-never-mutate-a-managed-entity-you-did-not-intend-to-save",
        "kind": "complete",
        "tier": "module",
        "module": "23",
        "part": "Chapter 23 — JPA and Hibernate: the object-relational bargain",
        "href": "site/chapters/23-jpa-hibernate.html",
        "claim": "Never mutate a managed entity you did not intend to save.",
        "why": "",
        "stem": "Never mutate a managed entity you",
        "continues": false,
        "refs": [
            "23"
        ]
    },
    {
        "id": "m24-derived-queries-are-parsed-at-start-up",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Spring Data repositories",
        "href": "site/chapters/24-spring-data.html",
        "claim": "Derived queries are parsed at start-up.",
        "why": "A wrong property name fails the boot, not the request.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-past-three-conditions-write-query",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Spring Data repositories",
        "href": "site/chapters/24-spring-data.html",
        "claim": "Past three conditions, write `@Query`.",
        "why": "The method name has stopped being documentation.",
        "continues": false,
        "checkpoints": [
            "@Query"
        ],
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-projections-select-fewer-columns",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Spring Data repositories",
        "href": "site/chapters/24-spring-data.html",
        "claim": "Projections select fewer columns.",
        "why": "Often a bigger win than an index.",
        "continues": false,
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24-specification-for-optional-filters",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Spring Data repositories",
        "href": "site/chapters/24-spring-data.html",
        "claim": "`Specification` for optional filters,",
        "why": "never string concatenation.",
        "continues": true,
        "checkpoints": [
            "Specification"
        ],
        "refs": [
            "24"
        ]
    },
    {
        "id": "m24--modifying-leaves-the-persistence-context-stale",
        "kind": "explain",
        "tier": "module",
        "module": "24",
        "part": "Chapter 24 — Spring Data repositories",
        "href": "site/chapters/24-spring-data.html",
        "claim": "`@Modifying` leaves the persistence context stale.",
        "why": "Clear it.",
        "continues": false,
        "checkpoints": [
            "@Modifying"
        ],
        "refs": [
            "24"
        ]
    },
    {
        "id": "m25-it-is-a-proxy",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Transactions, propagation and isolation",
        "href": "site/chapters/25-transactions.html",
        "claim": "It is a proxy.",
        "why": "Self-invocation, `private` and `final` methods get no transaction, silently.",
        "continues": false,
        "checkpoints": [
            "private",
            "final"
        ],
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-catching-without-rethrowing-means-no-rollback",
        "kind": "complete",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Transactions, propagation and isolation",
        "href": "site/chapters/25-transactions.html",
        "claim": "Catching without rethrowing means no rollback.",
        "why": "",
        "stem": "Catching without rethrowing",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-requires-new-for-work-that-must-survive-the-caller-s-failure",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Transactions, propagation and isolation",
        "href": "site/chapters/25-transactions.html",
        "claim": "`REQUIRES_NEW` for work that must survive the caller’s failure",
        "why": "audit rows, outbox entries.",
        "continues": true,
        "checkpoints": [
            "REQUIRES_NEW"
        ],
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25-keep-transactions-short",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Transactions, propagation and isolation",
        "href": "site/chapters/25-transactions.html",
        "claim": "Keep transactions short.",
        "why": "They hold a connection (chapter 22) for their whole life.",
        "continues": false,
        "refs": [
            "25"
        ]
    },
    {
        "id": "m25--version-beats-a-higher-isolation-level",
        "kind": "explain",
        "tier": "module",
        "module": "25",
        "part": "Chapter 25 — Transactions, propagation and isolation",
        "href": "site/chapters/25-transactions.html",
        "claim": "`@Version` beats a higher isolation level",
        "why": "for concurrent updates.",
        "continues": true,
        "checkpoints": [
            "@Version"
        ],
        "refs": [
            "25"
        ]
    },
    {
        "id": "m26-turn-on-sql-logging-in-development",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — The N+1 problem and fetching strategies",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "Turn on SQL logging in development.",
        "why": "N+1 is invisible until you count queries.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-never-fix-it-with-eager",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — The N+1 problem and fetching strategies",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "Never fix it with EAGER.",
        "why": "That answers a per-query question globally, and gets worse.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-one-collection-fetch-per-query",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — The N+1 problem and fetching strategies",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "One collection fetch per query.",
        "why": "Two is a cartesian product.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-hhh000104-means-it-is-paginating-in-memory",
        "kind": "explain",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — The N+1 problem and fetching strategies",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "HHH000104 means it is paginating in memory.",
        "why": "Page the ids, then fetch.",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m26-a-projection-sidesteps-the-whole-problem",
        "kind": "complete",
        "tier": "module",
        "module": "26",
        "part": "Chapter 26 — The N+1 problem and fetching strategies",
        "href": "site/chapters/26-n-plus-one.html",
        "claim": "A projection sidesteps the whole problem.",
        "why": "",
        "stem": "A projection sidesteps",
        "continues": false,
        "refs": [
            "26"
        ]
    },
    {
        "id": "m27-oracle-is-null",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "Oracle: `''` is `NULL`.",
        "why": "Comparisons to empty string match nothing.",
        "continues": false,
        "checkpoints": [
            "''",
            "NULL"
        ],
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-sequences-not-auto-increment",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "Sequences, not auto-increment.",
        "why": "Match `allocationSize` to `INCREMENT BY`; expect gaps.",
        "continues": false,
        "checkpoints": [
            "allocationSize",
            "INCREMENT BY"
        ],
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-rownum-is-applied-before-order-by",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "`ROWNUM` is applied before `ORDER BY`.",
        "why": "The naive top-N query is wrong.",
        "continues": false,
        "checkpoints": [
            "ROWNUM",
            "ORDER BY"
        ],
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-a-function-on-an-indexed-column-disables-the-index",
        "kind": "complete",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "A function on an indexed column disables the index.",
        "why": "",
        "stem": "A function on an indexed",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-composite-indexes-work-left-to-right",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "Composite indexes work left-to-right.",
        "why": "Leftmost prefix.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m27-database-logic-is-not-automatically-wrong",
        "kind": "explain",
        "tier": "module",
        "module": "27",
        "part": "Chapter 27 — Oracle, and the SQL you will actually meet",
        "href": "site/chapters/27-oracle-and-sql.html",
        "claim": "Database logic is not automatically wrong.",
        "why": "Get it into git and under test.",
        "continues": false,
        "refs": [
            "27"
        ]
    },
    {
        "id": "m28-embed-what-is-owned-and-bounded-reference-what-is-shared",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — MongoDB, and when a document store earns its place",
        "href": "site/chapters/28-mongodb.html",
        "claim": "Embed what is owned and bounded; reference what is shared.",
        "why": "Model for the query you run most.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-schemaless-is-not-schema-free",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — MongoDB, and when a document store earns its place",
        "href": "site/chapters/28-mongodb.html",
        "claim": "Schemaless is not schema-free.",
        "why": "Validate, and version your documents.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-no-persistence-context-no-dirty-checking",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — MongoDB, and when a document store earns its place",
        "href": "site/chapters/28-mongodb.html",
        "claim": "No persistence context, no dirty checking.",
        "why": "Nothing saves until you save it.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-needing-multi-document-transactions-routinely-is-a-modelling-signal",
        "kind": "complete",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — MongoDB, and when a document store earns its place",
        "href": "site/chapters/28-mongodb.html",
        "claim": "Needing multi-document transactions routinely is a modelling signal.",
        "why": "",
        "stem": "Needing multi-document transactions routinely",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m28-relational-for-invariants-documents-for-aggregates",
        "kind": "explain",
        "tier": "module",
        "module": "28",
        "part": "Chapter 28 — MongoDB, and when a document store earns its place",
        "href": "site/chapters/28-mongodb.html",
        "claim": "Relational for invariants, documents for aggregates.",
        "why": "Both, on purpose.",
        "continues": false,
        "refs": [
            "28"
        ]
    },
    {
        "id": "m29-migrations-are-reviewed-artefacts",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Schema migrations with Flyway and Liquibase",
        "href": "site/chapters/29-migrations.html",
        "claim": "Migrations are reviewed artefacts.",
        "why": "A diff a human read before it touched production.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-flyway-s-checksum-refusal-is-a-feature",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Schema migrations with Flyway and Liquibase",
        "href": "site/chapters/29-migrations.html",
        "claim": "Flyway’s checksum refusal is a feature.",
        "why": "Never edit an applied migration; add a new one.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-migrate-in-the-pipeline-not-at-start-up",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Schema migrations with Flyway and Liquibase",
        "href": "site/chapters/29-migrations.html",
        "claim": "Migrate in the pipeline, not at start-up.",
        "why": "Instances race, and runtime accounts should not hold DDL rights.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m29-expand-and-contract",
        "kind": "explain",
        "tier": "module",
        "module": "29",
        "part": "Chapter 29 — Schema migrations with Flyway and Liquibase",
        "href": "site/chapters/29-migrations.html",
        "claim": "Expand and contract.",
        "why": "Every change survives one release of both versions.",
        "continues": false,
        "refs": [
            "29"
        ]
    },
    {
        "id": "m30-the-main-benefit-is-organisational",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "The main benefit is organisational.",
        "why": "Independent deployment by independent teams.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-a-monolith-is-the-right-default-for-a-small-team",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "A monolith is the right default for a small team.",
        "why": "Split in response to a named problem.",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-split-by-bounded-context",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "Split by bounded context,",
        "why": "never by technical layer.",
        "continues": true,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-shared-database-means-one-service-in-two-deployments",
        "kind": "complete",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "Shared database means one service in two deployments.",
        "why": "",
        "stem": "Shared database means one",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-you-trade-local-calls-and-transactions",
        "kind": "explain",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "You trade local calls and transactions",
        "why": "for partial failure and eventual consistency.",
        "continues": true,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m30-merging-two-services-back-together-is-a-valid-answer",
        "kind": "complete",
        "tier": "module",
        "module": "30",
        "part": "Chapter 30 — Microservices: the shape and the cost",
        "href": "site/chapters/30-microservices.html",
        "claim": "Merging two services back together is a valid answer.",
        "why": "",
        "stem": "Merging two services back together",
        "continues": false,
        "refs": [
            "30"
        ]
    },
    {
        "id": "m31-kubernetes-has-absorbed-config-and-discovery",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Spring Cloud: config, discovery, gateway",
        "href": "site/chapters/31-spring-cloud.html",
        "claim": "Kubernetes has absorbed config and discovery.",
        "why": "Do not add Eureka to a cluster that already does it.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-config-server-s-git-history-still-earns-its-place",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Spring Cloud: config, discovery, gateway",
        "href": "site/chapters/31-spring-cloud.html",
        "claim": "Config Server’s git history still earns its place",
        "why": "in audited environments.",
        "continues": true,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-the-gateway-is-the-piece-that-survives",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Spring Cloud: config, discovery, gateway",
        "href": "site/chapters/31-spring-cloud.html",
        "claim": "The gateway is the piece that survives",
        "why": "auth, rate limiting, aggregation.",
        "continues": true,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-a-gateway-making-business-decisions-is-a-coordination-point",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Spring Cloud: config, discovery, gateway",
        "href": "site/chapters/31-spring-cloud.html",
        "claim": "A gateway making business decisions is a coordination point.",
        "why": "Keep it dumb.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m31-every-inter-service-call-needs-a-timeout",
        "kind": "explain",
        "tier": "module",
        "module": "31",
        "part": "Chapter 31 — Spring Cloud: config, discovery, gateway",
        "href": "site/chapters/31-spring-cloud.html",
        "claim": "Every inter-service call needs a timeout.",
        "why": "The default is effectively forever.",
        "continues": false,
        "refs": [
            "31"
        ]
    },
    {
        "id": "m32-every-outbound-call-gets-a-timeout",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Timeouts, retries and circuit breakers",
        "href": "site/chapters/32-resilience.html",
        "claim": "Every outbound call gets a timeout,",
        "why": "shorter than your caller’s.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-retry-only-idempotent-operations-only-on-transient-failures",
        "kind": "complete",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Timeouts, retries and circuit breakers",
        "href": "site/chapters/32-resilience.html",
        "claim": "Retry only idempotent operations, only on transient failures.",
        "why": "",
        "stem": "Retry only idempotent operations,",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-exponential-backoff-with-jitter",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Timeouts, retries and circuit breakers",
        "href": "site/chapters/32-resilience.html",
        "claim": "Exponential backoff with jitter.",
        "why": "Without jitter you have built a herd.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-a-breaker-turns-a-slow-failure-into-a-fast-one",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Timeouts, retries and circuit breakers",
        "href": "site/chapters/32-resilience.html",
        "claim": "A breaker turns a slow failure into a fast one,",
        "why": "which is what protects you.",
        "continues": true,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m32-an-empty-list-fallback-is-worse-than-an-error",
        "kind": "explain",
        "tier": "module",
        "module": "32",
        "part": "Chapter 32 — Timeouts, retries and circuit breakers",
        "href": "site/chapters/32-resilience.html",
        "claim": "An empty-list fallback is worse than an error.",
        "why": "Wrong data outlives an outage.",
        "continues": false,
        "refs": [
            "32"
        ]
    },
    {
        "id": "m33-async-buys-latency-decoupling-and-load-levelling",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "Async buys latency, decoupling and load levelling,",
        "why": "and costs you eventual consistency.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-queue-for-work-distribution-log-for-event-streams",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "Queue for work distribution, log for event streams.",
        "why": "Replay is the deciding capability.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-delivery-is-at-least-once",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "Delivery is at-least-once.",
        "why": "Handlers must be idempotent.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-a-poison-message-blocks-its-partition",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "A poison message blocks its partition.",
        "why": "Configure a dead-letter route before you need one.",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-the-listener-thread-has-no-securitycontext-and-no-request-scope",
        "kind": "complete",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "The listener thread has no SecurityContext and no request scope.",
        "why": "",
        "stem": "The listener thread has no",
        "continues": false,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m33-the-message-key-chooses-the-partition",
        "kind": "explain",
        "tier": "module",
        "module": "33",
        "part": "Chapter 33 — Messaging from inside a Spring application",
        "href": "site/chapters/33-messaging.html",
        "claim": "The message key chooses the partition,",
        "why": "and therefore the ordering.",
        "continues": true,
        "refs": [
            "33"
        ]
    },
    {
        "id": "m34-modbus-is-registers-and-a-pdf",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "Modbus is registers and a PDF.",
        "why": "No types, no discovery, no security — and check the word order.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-mqtt-for-telemetry-over-bad-links",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "MQTT for telemetry over bad links;",
        "why": "QoS, retained messages, last will.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-opc-ua-for-new-work",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "OPC UA for new work",
        "why": "a typed address space with security, and a source timestamp.",
        "continues": true,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-never-expose-register-numbers-in-your-api",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "Never expose register numbers in your API.",
        "why": "Translate at the edge.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-timestamp-at-the-source",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "Timestamp at the source.",
        "why": "Arrival time lies after an outage.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m34-poll-rates-are-negotiated-not-chosen",
        "kind": "explain",
        "tier": "module",
        "module": "34",
        "part": "Chapter 34 — OPC UA, MQTT and Modbus",
        "href": "site/chapters/34-industrial-protocols.html",
        "claim": "Poll rates are negotiated, not chosen.",
        "why": "A PLC is not a web server.",
        "continues": false,
        "refs": [
            "34"
        ]
    },
    {
        "id": "m35-metrics-to-alert-logs-to-explain-one-case-traces-to-find-the-slow-hop",
        "kind": "complete",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Logs, metrics and traces",
        "href": "site/chapters/35-observability.html",
        "claim": "Metrics to alert, logs to explain one case, traces to find the slow hop.",
        "why": "",
        "stem": "Metrics to alert,",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-opentelemetry",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Logs, metrics and traces",
        "href": "site/chapters/35-observability.html",
        "claim": "OpenTelemetry",
        "why": "so the backend is replaceable without touching code.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-one-trace-id-propagated-everywhere",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Logs, metrics and traces",
        "href": "site/chapters/35-observability.html",
        "claim": "One trace id, propagated everywhere",
        "why": "including into message headers.",
        "continues": true,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-context-is-thread-local",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Logs, metrics and traces",
        "href": "site/chapters/35-observability.html",
        "claim": "Context is thread-local.",
        "why": "It does not follow you into an executor.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m35-never-alert-on-an-average",
        "kind": "explain",
        "tier": "module",
        "module": "35",
        "part": "Chapter 35 — Logs, metrics and traces",
        "href": "site/chapters/35-observability.html",
        "claim": "Never alert on an average.",
        "why": "It hides the users who are suffering.",
        "continues": false,
        "refs": [
            "35"
        ]
    },
    {
        "id": "m36-tests-are-for-the-person-who-changes-this-in-eight-months",
        "kind": "complete",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "Tests are for the person who changes this in eight months.",
        "why": "",
        "stem": "Tests are for the person who",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-hard-to-test-usually-means-hard-to-use",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "Hard to test usually means hard to use.",
        "why": "Listen to that.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-one-reason-to-fail-and-say-it-in-the-name",
        "kind": "complete",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "One reason to fail, and say it in the name.",
        "why": "",
        "stem": "One reason to fail,",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-test-behaviour-not-implementation",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "Test behaviour, not implementation.",
        "why": "Asserting on private calls breaks on refactor and catches nothing.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-edges-empty-null-zero-negative-boundary-duplicate",
        "kind": "complete",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "Edges: empty, null, zero, negative, boundary, duplicate.",
        "why": "",
        "stem": "Edges: empty,",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m36-coverage-is-a-floor-detector",
        "kind": "explain",
        "tier": "module",
        "module": "36",
        "part": "Chapter 36 — JUnit 5 and what a unit test is for",
        "href": "site/chapters/36-unit-testing.html",
        "claim": "Coverage is a floor detector.",
        "why": "Mutation testing is the real measure.",
        "continues": false,
        "refs": [
            "36"
        ]
    },
    {
        "id": "m37-prefer-state-verification",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "Prefer state verification.",
        "why": "`verify` only when the interaction is the behaviour.",
        "continues": false,
        "checkpoints": [
            "verify"
        ],
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-never-mock-a-type-you-do-not-own",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "Never mock a type you do not own.",
        "why": "Wrap it and mock your wrapper.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-mock-the-edges",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "Mock the edges",
        "why": "network, clock, filesystem, broker. Leave the domain real.",
        "continues": true,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-inject-a-clock",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "Inject a `Clock`.",
        "why": "Time is a dependency like any other.",
        "continues": false,
        "checkpoints": [
            "Clock"
        ],
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-an-unused-stub-is-a-message",
        "kind": "explain",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "An unused stub is a message.",
        "why": "The path it described is gone.",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m37-if-everything-is-mocked-the-test-verifies-the-mocks",
        "kind": "complete",
        "tier": "module",
        "module": "37",
        "part": "Chapter 37 — Mockito, test doubles and over-mocking",
        "href": "site/chapters/37-mocking.html",
        "claim": "If everything is mocked, the test verifies the mocks.",
        "why": "",
        "stem": "If everything is mocked,",
        "continues": false,
        "refs": [
            "37"
        ]
    },
    {
        "id": "m38-most-tests-need-no-spring-at-all",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Testing a Spring application",
        "href": "site/chapters/38-spring-testing.html",
        "claim": "Most tests need no Spring at all.",
        "why": "Constructor injection makes that true.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-slices-over-springboottest",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Testing a Spring application",
        "href": "site/chapters/38-spring-testing.html",
        "claim": "Slices over `@SpringBootTest`.",
        "why": "`@WebMvcTest`, `@DataJpaTest`, then everything else.",
        "continues": false,
        "checkpoints": [
            "@SpringBootTest",
            "@WebMvcTest",
            "@DataJpaTest"
        ],
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-context-caching-is-per-configuration",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Testing a Spring application",
        "href": "site/chapters/38-spring-testing.html",
        "claim": "Context caching is per configuration.",
        "why": "Every variation is another context.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-h2-is-not-oracle",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Testing a Spring application",
        "href": "site/chapters/38-spring-testing.html",
        "claim": "H2 is not Oracle.",
        "why": "Testing against it tests a database you do not ship.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m38-slow-suites-stop-being-run",
        "kind": "explain",
        "tier": "module",
        "module": "38",
        "part": "Chapter 38 — Testing a Spring application",
        "href": "site/chapters/38-spring-testing.html",
        "claim": "Slow suites stop being run.",
        "why": "That is how the net disappears.",
        "continues": false,
        "refs": [
            "38"
        ]
    },
    {
        "id": "m39-test-against-the-database-you-deploy-on",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "Test against the database you deploy on.",
        "why": "H2 is a different product.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-a-container-per-run-beats-a-shared-dev-database",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "A container per run beats a shared dev database.",
        "why": "Isolated, reproducible, disposable.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39--serviceconnection",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "`@ServiceConnection`",
        "why": "removes the property plumbing.",
        "continues": true,
        "checkpoints": [
            "@ServiceConnection"
        ],
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-run-your-real-migrations-against-the-container",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "Run your real migrations against the container.",
        "why": "Then they are tested too.",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-reuse-locally-never-in-ci",
        "kind": "complete",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "Reuse locally, never in CI.",
        "why": "",
        "stem": "Reuse locally,",
        "continues": false,
        "refs": [
            "39"
        ]
    },
    {
        "id": "m39-name-them-it-and-run-them-separately",
        "kind": "explain",
        "tier": "module",
        "module": "39",
        "part": "Chapter 39 — Testcontainers and integration tests worth trusting",
        "href": "site/chapters/39-testcontainers.html",
        "claim": "Name them `*IT` and run them separately.",
        "why": "Fast suite stays fast.",
        "continues": false,
        "checkpoints": [
            "*IT"
        ],
        "refs": [
            "39"
        ]
    },
    {
        "id": "m40-always-the-wrapper",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "Always the wrapper.",
        "why": "The build tool version belongs in the repository.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-maven-nearest-wins-gradle-highest-wins",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "Maven: nearest wins. Gradle: highest wins.",
        "why": "Neither is intuitive; know which you are in.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-nosuchmethoderror-at-runtime-is-a-version-conflict",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "`NoSuchMethodError` at runtime is a version conflict,",
        "why": "not a code bug.",
        "continues": true,
        "checkpoints": [
            "NoSuchMethodError"
        ],
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-pin-in-dependencymanagement",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "Pin in `dependencyManagement`",
        "why": "instead of scattering exclusions.",
        "continues": true,
        "checkpoints": [
            "dependencyManagement"
        ],
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-let-the-boot-bom-choose-versions",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "Let the Boot BOM choose versions.",
        "why": "Overriding one needs a reason.",
        "continues": false,
        "refs": [
            "40"
        ]
    },
    {
        "id": "m40-scopes-are-load-bearing",
        "kind": "explain",
        "tier": "module",
        "module": "40",
        "part": "Chapter 40 — Maven and Gradle",
        "href": "site/chapters/40-maven-gradle.html",
        "claim": "Scopes are load-bearing.",
        "why": "`provided` means somebody else must actually provide it.",
        "continues": false,
        "checkpoints": [
            "provided"
        ],
        "refs": [
            "40"
        ]
    },
    {
        "id": "m41-layer-the-jar",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "Layer the jar.",
        "why": "Dependencies and application code do not change at the same rate.",
        "continues": false,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-multi-stage-builds",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "Multi-stage builds",
        "why": "keep the JDK and source out of the shipped image.",
        "continues": true,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-maxrampercentage-not-xmx",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "`MaxRAMPercentage`, not `-Xmx`.",
        "why": "The flag must follow the limit.",
        "continues": false,
        "checkpoints": [
            "MaxRAMPercentage",
            "-Xmx"
        ],
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-exit-code-137-is-the-oomkiller",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "Exit code 137 is the OOMKiller.",
        "why": "Leave headroom outside the heap.",
        "continues": false,
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-non-root-user-always",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "Non-root `USER`, always",
        "why": "and OpenShift will enforce it for you.",
        "continues": true,
        "checkpoints": [
            "USER"
        ],
        "refs": [
            "41"
        ]
    },
    {
        "id": "m41-spring-boot-build-image",
        "kind": "explain",
        "tier": "module",
        "module": "41",
        "part": "Chapter 41 — Containers, and a JVM image that is not 700 MB",
        "href": "site/chapters/41-docker.html",
        "claim": "`spring-boot:build-image`",
        "why": "if you would rather not own a Dockerfile.",
        "continues": true,
        "checkpoints": [
            "spring-boot:build-image"
        ],
        "refs": [
            "41"
        ]
    },
    {
        "id": "m42-deployment-service-configmap-secret",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Kubernetes and OpenShift",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "Deployment, Service, ConfigMap, Secret.",
        "why": "That is most of what you touch.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-startup-probes-exist-because-jvms-boot-slowly",
        "kind": "complete",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Kubernetes and OpenShift",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "Startup probes exist because JVMs boot slowly.",
        "why": "",
        "stem": "Startup probes exist because",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-memory-limit-above-the-heap-with-headroom",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Kubernetes and OpenShift",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "Memory limit above the heap, with headroom.",
        "why": "Requests schedule, limits kill.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-graceful-shutdown-or-every-deploy-drops-in-flight-requests",
        "kind": "complete",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Kubernetes and OpenShift",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "Graceful shutdown, or every deploy drops in-flight requests.",
        "why": "",
        "stem": "Graceful shutdown,",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m42-openshift-runs-you-as-a-random-non-root-uid",
        "kind": "explain",
        "tier": "module",
        "module": "42",
        "part": "Chapter 42 — Kubernetes and OpenShift",
        "href": "site/chapters/42-kubernetes.html",
        "claim": "OpenShift runs you as a random non-root UID.",
        "why": "Build the image for that.",
        "continues": false,
        "refs": [
            "42"
        ]
    },
    {
        "id": "m43-s3-is-object-storage-not-a-filesystem",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "S3 is object storage, not a filesystem.",
        "why": "Presigned URLs keep bytes out of your JVM.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-roles-never-long-lived-keys",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "Roles, never long-lived keys.",
        "why": "The SDK finds temporary credentials by itself.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-least-privilege-with-specific-arns",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "Least privilege with specific ARNs.",
        "why": "`s3:*` on `*` is a finding.",
        "continues": false,
        "checkpoints": [
            "s3:*",
            "*"
        ],
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-secrets-manager-or-parameter-store",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "Secrets Manager or Parameter Store",
        "why": "for the database password.",
        "continues": true,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-egress-and-cross-az-traffic-cost-money",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "Egress and cross-AZ traffic cost money.",
        "why": "Inbound does not.",
        "continues": false,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m43-eu-south-1-is-milan",
        "kind": "explain",
        "tier": "module",
        "module": "43",
        "part": "Chapter 43 — AWS: EC2, S3 and Route 53",
        "href": "site/chapters/43-aws.html",
        "claim": "eu-south-1 is Milan",
        "why": "relevant when data residency is a requirement.",
        "continues": true,
        "refs": [
            "43"
        ]
    },
    {
        "id": "m44-tag-with-the-git-sha",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — Pipelines, and migrations in them",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "Tag with the git SHA.",
        "why": "`latest` is not a version.",
        "continues": false,
        "checkpoints": [
            "latest"
        ],
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-order-stages-by-cost",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — Pipelines, and migrations in them",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "Order stages by cost.",
        "why": "Slow feedback gets routed around.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-migrations-are-a-gated-pipeline-step",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — Pipelines, and migrations in them",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "Migrations are a gated pipeline step,",
        "why": "not application start-up.",
        "continues": true,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-the-runtime-account-should-not-hold-ddl-rights",
        "kind": "complete",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — Pipelines, and migrations in them",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "The runtime account should not hold DDL rights.",
        "why": "",
        "stem": "The runtime account should",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m44-rollback-reverses-code-not-schema",
        "kind": "explain",
        "tier": "module",
        "module": "44",
        "part": "Chapter 44 — Pipelines, and migrations in them",
        "href": "site/chapters/44-ci-cd.html",
        "claim": "Rollback reverses code, not schema.",
        "why": "Expand and contract, always.",
        "continues": false,
        "refs": [
            "44"
        ]
    },
    {
        "id": "m45-ejb-cdi-and-container-managed-transactions-are-the-same-concerns-spring-later-solved",
        "kind": "complete",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "EJB, CDI and container-managed transactions are the same concerns Spring later solved.",
        "why": "",
        "stem": "EJB, CDI and container-managed transactions are",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-jsf-is-stateful-server-side-and-nothing-like-an-spa",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "JSF is stateful, server-side and nothing like an SPA.",
        "why": "Do not reason about it as one.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-javax-jakarta-is-the-reason-many-systems-are-stuck",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "javax → jakarta is the reason many systems are stuck.",
        "why": "Boot 3 requires the new namespace.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-rename-tools-miss-strings",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "Rename tools miss strings",
        "why": "XML, persistence.xml, reflection.",
        "continues": true,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-strangler-not-rewrite",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "Strangler, not rewrite.",
        "why": "Facade in front, move one capability at a time.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m45-characterisation-tests-first",
        "kind": "explain",
        "tier": "module",
        "module": "45",
        "part": "Chapter 45 — Java EE, Jakarta and the code you will inherit",
        "href": "site/chapters/45-legacy-java-ee.html",
        "claim": "Characterisation tests first.",
        "why": "The behaviour is the specification.",
        "continues": false,
        "refs": [
            "45"
        ]
    },
    {
        "id": "m46-components-own-view-state-services-own-data",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "Components own view state, services own data.",
        "why": "DI works like Spring’s.",
        "continues": false,
        "refs": [
            "46"
        ]
    },
    {
        "id": "m46-standalone-components-and-signals",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "Standalone components and signals",
        "why": "know them, or you sound out of date.",
        "continues": true,
        "refs": [
            "46"
        ]
    },
    {
        "id": "m46-observables-are-lazy",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "Observables are lazy.",
        "why": "No subscription, no request.",
        "continues": false,
        "refs": [
            "46"
        ]
    },
    {
        "id": "m46-prefer-the-async-pipe",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "Prefer the `async` pipe",
        "why": "over manual subscribe-and-leak.",
        "continues": true,
        "checkpoints": [
            "async"
        ],
        "refs": [
            "46"
        ]
    },
    {
        "id": "m46-switchmap-for-typeaheads",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "`switchMap` for typeaheads.",
        "why": "`mergeMap` lets stale results win.",
        "continues": false,
        "checkpoints": [
            "switchMap",
            "mergeMap"
        ],
        "refs": [
            "46"
        ]
    },
    {
        "id": "m46-a-cors-error-is-often-a-401-on-the-preflight",
        "kind": "explain",
        "tier": "module",
        "module": "46",
        "part": "Chapter 46 — The Angular/TypeScript front end you will touch",
        "href": "site/chapters/46-angular-frontend.html",
        "claim": "A CORS error is often a 401 on the preflight.",
        "why": "Configure CORS in Spring.",
        "continues": false,
        "refs": [
            "46"
        ]
    },
    {
        "id": "m47-gestionale-describes-the-job",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "Gestionale describes the job.",
        "why": "Learn the domain vocabulary before the first call.",
        "continues": false,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m47-fatturazione-elettronica-is-xml-through-sdi",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "Fatturazione elettronica is XML through SDI,",
        "why": "asynchronous, with receipts and deadlines.",
        "continues": true,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m47-invoice-numbering-is-a-legal-constraint",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "Invoice numbering is a legal constraint,",
        "why": "not an application detail.",
        "continues": true,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m47-integrations-arrive-as-csv-sftp-or-a-database-view",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "Integrations arrive as CSV, SFTP or a database view.",
        "why": "Meet the other side where it is.",
        "continues": false,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m47-the-spreadsheet-is-the-specification",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "The spreadsheet is the specification.",
        "why": "Ask domain questions early, and write the answers down.",
        "continues": false,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m47-curiosity-about-the-domain-is-a-differentiator",
        "kind": "explain",
        "tier": "module",
        "module": "47",
        "part": "Chapter 47 — Gestionali, ERP integrations and the Italian software house",
        "href": "site/chapters/47-gestionali.html",
        "claim": "Curiosity about the domain is a differentiator.",
        "why": "Most candidates only ask about the stack.",
        "continues": false,
        "refs": [
            "47"
        ]
    },
    {
        "id": "m48-stand-up-is-synchronisation-not-a-status-report",
        "kind": "explain",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "Stand-up is synchronisation, not a status report.",
        "why": "Lead with blockers.",
        "continues": false,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m48-refinement-is-where-the-leverage-is",
        "kind": "explain",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "Refinement is where the leverage is.",
        "why": "Ask the question before anyone estimates.",
        "continues": false,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m48-points-are-relative-size",
        "kind": "explain",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "Points are relative size.",
        "why": "Velocity plans a team; it does not measure a person.",
        "continues": false,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m48--i-need-a-spike-beats-a-guess",
        "kind": "explain",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "“I need a spike” beats a guess.",
        "why": "And flag slippage early.",
        "continues": false,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m48-small-prs-and-commit-messages-that-say-why",
        "kind": "complete",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "Small PRs, and commit messages that say why.",
        "why": "",
        "stem": "Small PRs,",
        "continues": false,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m48-ask-after-half-an-hour-stuck",
        "kind": "explain",
        "tier": "module",
        "module": "48",
        "part": "Chapter 48 — Agile, Scrum and the ceremonies",
        "href": "site/chapters/48-agile-scrum.html",
        "claim": "Ask after half an hour stuck",
        "why": "not immediately, not the next day.",
        "continues": true,
        "refs": [
            "48"
        ]
    },
    {
        "id": "m49-b2-is-the-bar-follow-be-understood-write-clearly",
        "kind": "explain",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "B2 is the bar: follow, be understood, write clearly.",
        "why": "The accent is not the problem.",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m49-ask-for-repetition-without-apologising",
        "kind": "explain",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "Ask for repetition without apologising.",
        "why": "Silence is the failure they screen for.",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m49-learn-fixed-phrases-for-disagreeing-buying-time-and-reporting-delay",
        "kind": "complete",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "Learn fixed phrases for disagreeing, buying time and reporting delay.",
        "why": "",
        "stem": "Learn fixed phrases for disagreeing,",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m49-eventually-eventualmente-actually-attualmente",
        "kind": "complete",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "Eventually ≠ eventualmente; actually ≠ attualmente.",
        "why": "",
        "stem": "Eventually ≠ eventualmente;",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m49-conclusion-first-then-detail",
        "kind": "explain",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "Conclusion first, then detail.",
        "why": "Short sentences are good technical English.",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m49-async-say-what-you-need-and-by-when",
        "kind": "complete",
        "tier": "module",
        "module": "49",
        "part": "Chapter 49 — The English the advert means",
        "href": "site/chapters/49-english.html",
        "claim": "Async: say what you need and by when.",
        "why": "",
        "stem": "Async: say what you",
        "continues": false,
        "refs": [
            "49"
        ]
    },
    {
        "id": "m50-single-column-real-text-standard-headings",
        "kind": "explain",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Single column, real text, standard headings.",
        "why": "The parser is not clever.",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m50-use-the-advert-s-exact-words-for-things-you-have-really-done",
        "kind": "explain",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Use the advert’s exact words for things you have really done.",
        "why": "Alignment, never stuffing.",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m50-verify-the-extracted-text-layer",
        "kind": "explain",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Verify the extracted text layer.",
        "why": "Layout changes can reorder it silently.",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m50-outcome-plus-evidence-not-responsibilities",
        "kind": "complete",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Outcome plus evidence, not responsibilities.",
        "why": "",
        "stem": "Outcome plus evidence,",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m50-every-number-invites-a-question",
        "kind": "explain",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Every number invites a question.",
        "why": "Only claim what you can defend.",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m50-photo-for-italian-smes-none-for-international",
        "kind": "explain",
        "tier": "module",
        "module": "50",
        "part": "Chapter 50 — The CV and the ATS",
        "href": "site/chapters/50-the-cv.html",
        "claim": "Photo for Italian SMEs, none for international.",
        "why": "Keep both versions maintained.",
        "continues": false,
        "refs": [
            "50"
        ]
    },
    {
        "id": "m51-two-minutes-for-mi-parli-di-lei",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "Two minutes for mi parli di lei,",
        "why": "ending on why this role.",
        "continues": true,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51-answer-with-a-structure",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "Answer with a structure",
        "why": "mechanism, consequence, example.",
        "continues": true,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51--i-do-not-know-but-beats-a-confident-guess",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "“I do not know, but…” beats a confident guess.",
        "why": "Every time.",
        "continues": false,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51-think-out-loud",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "Think out loud.",
        "why": "The process is what is being assessed.",
        "continues": false,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51-never-oversell",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "Never oversell.",
        "why": "An inflated claim makes your true ones suspect.",
        "continues": false,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51-ral-as-a-gross-annual-range",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "RAL as a gross annual range,",
        "why": "and ask about CCNL, level and mensilità.",
        "continues": true,
        "refs": [
            "51"
        ]
    },
    {
        "id": "m51-always-have-questions",
        "kind": "explain",
        "tier": "module",
        "module": "51",
        "part": "Chapter 51 — The interview",
        "href": "site/chapters/51-the-interview.html",
        "claim": "Always have questions.",
        "why": "Ask how a change reaches production.",
        "continues": false,
        "refs": [
            "51"
        ]
    }
];

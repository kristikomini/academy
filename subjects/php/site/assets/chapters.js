/* ==========================================================================
   chapters.js — the single source of truth for the whole site.
   The sidebar, the home-page cards and every prev/next button are generated
   from this array. Add a chapter here and it appears everywhere.

   Each entry:
     n     chapter number shown in the sidebar ("" for the home page)
     id    file name inside /chapters (without .html)
     title sidebar + card title
     part  section heading it sits under
     blurb one line, shown on the home-page card
     tags  extra words the sidebar search should match
     req   which line of the job posting this chapter answers
     extra set INSTEAD of req when the chapter is not in that advert at all,
           but the regional market asks for it anyway. The home page renders
           these as a second table so the advert coverage stays honest.

   THE ADVERTS. This manifest was derived from PHP postings for Emilia-Romagna
   and Milano collected in September 2026 — a Bologna web agency (Laravel), a
   Modena software house building gestionali, Zucchetti Axess (Bologna), and two
   consultancies staffing client teams. The recurring requirement lines are
   quoted verbatim in Italian in the `req` fields below. Where several adverts
   said the same thing in different words, the clearest phrasing was kept.

   The honesty rule: if no advert asked for it, it does not get a `req`. It gets
   an `extra` saying why it is here anyway. The home page renders the two lists
   separately so "nothing in the advert is uncovered" stays checkable.
   ========================================================================== */

const PARTS = [
  "Start here",
  "Part 1 — The platform and the language",
  "Part 2 — Data",
  "Part 3 — The web",
  "Part 4 — Fast at scale",
  "Part 5 — Building it properly",
  "Part 6 — Tools and shipping",
  "Part 7 — What the region actually runs",
  "Part 8 — The human requirements",
];

const CHAPTERS = [
  {
    n: "00", id: "00-the-job-posting", part: PARTS[0],
    title: "The job posting, decoded",
    blurb: "Every line of the adverts translated into what it actually asks you to know.",
    tags: "requisiti annuncio requirements roadmap start offerta",
    req: "the whole advert",
  },

  /* ---------- Part 1 — The platform and the language ---------- */
  {
    n: "01", id: "01-php-platform", part: PARTS[1],
    title: "PHP the platform",
    blurb: "Versions, SAPI, PHP-FPM, OPcache and Composer — what actually runs your code.",
    tags: "php-fpm fpm sapi opcache composer version 8.3 8.4 cli apache nginx zend",
    req: "Consolidata esperienza nello sviluppo PHP",
  },
  {
    n: "02", id: "02-php-fundamentals", part: PARTS[1],
    title: "Fundamentals: types, juggling, strings, arrays",
    blurb: "Type juggling, strict_types, the comparison table everyone gets wrong, and strings.",
    tags: "type juggling strict_types loose comparison spaceship string array null coalescing",
    req: "Consolidata esperienza nello sviluppo PHP",
  },
  {
    n: "03", id: "03-oop-in-php", part: PARTS[1],
    title: "OOP in PHP",
    blurb: "Visibility, interfaces, traits, abstract, static, enums, readonly and constructor promotion.",
    tags: "oop class interface trait abstract static enum readonly promotion final magic method",
    req: "Buona conoscenza della programmazione ad oggetti",
  },
  {
    n: "04", id: "04-closures-and-generators", part: PARTS[1],
    title: "Closures, callables and generators",
    blurb: "use() by value or reference, $this binding, first-class callables, and yield.",
    tags: "closure callable generator yield fn arrow function bind scope iterator lazy",
    extra: "No advert names closures, but every framework you will touch is built on them — and generators are how you process a 2 GB CSV without buying more RAM.",
  },
  {
    n: "05", id: "05-solid-and-patterns", part: PARTS[1],
    title: "SOLID and design patterns",
    blurb: "The five principles with PHP examples, plus the patterns Laravel already made you use.",
    tags: "solid srp ocp lsp isp dip pattern factory strategy observer repository decorator singleton",
    req: "Capacità di scrivere codice manutenibile e riutilizzabile",
  },
  {
    n: "06", id: "06-arrays-and-collections", part: PARTS[1],
    title: "Arrays, SPL and the array_* family",
    blurb: "The ordered hash map that PHP calls an array, SPL data structures, and copy-on-write.",
    tags: "array hash map spl splstack splqueue arrayobject array_map array_filter usort copy on write",
    extra: "The single most-used data structure in PHP and the one candidates explain worst. Knowing that an array is a hash map explains its performance and its surprises at once.",
  },
  {
    n: "07", id: "07-errors-and-async", part: PARTS[1],
    title: "Errors, exceptions and async",
    blurb: "Error vs Exception, the handler you must set, Fibers, and why PHP async is usually a queue.",
    tags: "exception error throwable try catch finally handler fiber async concurrency swoole reactphp",
    req: "Consolidata esperienza nello sviluppo PHP",
  },
  {
    n: "08", id: "08-memory-and-references", part: PARTS[1],
    title: "Memory, references and the request lifecycle",
    blurb: "Refcounting, the cycle collector, &$references, and why shared-nothing changes everything.",
    tags: "memory reference refcount garbage collection gc leak shared nothing lifecycle memory_limit",
    extra: "PHP's shared-nothing model is its biggest difference from Java and .NET, and interviewers from those worlds probe it. It also explains most 'works locally, dies in production' bugs.",
  },

  /* ---------- Part 2 — Data ---------- */
  {
    n: "09", id: "09-databases-and-mysql", part: PARTS[2],
    title: "Databases and MySQL/MariaDB",
    blurb: "InnoDB, storage engines, charsets, data types, and the utf8mb4 trap.",
    tags: "mysql mariadb innodb myisam charset collation utf8mb4 datatype schema engine",
    req: "Conoscenza di database relazionali (MySQL/MariaDB)",
  },
  {
    n: "10", id: "10-sql-querying", part: PARTS[2],
    title: "SQL: querying",
    blurb: "Joins, GROUP BY, window functions, CTEs — and the LEFT JOIN filter that silently becomes an INNER.",
    tags: "sql select join left inner group by having window function cte subquery exists union",
    req: "Conoscenza di database relazionali (MySQL/MariaDB)",
  },
  {
    n: "10b", id: "10b-views-and-procedures", part: PARTS[2],
    title: "Views, functions and stored procedures",
    blurb: "What belongs in the database, what does not, and how to live with a codebase that chose wrong.",
    tags: "view stored procedure function trigger routine determinism migration legacy",
    extra: "Italian gestionali are full of stored procedures written in 2009. You will not get to redesign them; you will have to read them.",
  },
  {
    n: "11", id: "11-indexes-and-transactions", part: PARTS[2],
    title: "Indexes, EXPLAIN, transactions and deadlocks",
    blurb: "B-tree indexes, composite column order, reading a plan, isolation levels and lock waits.",
    tags: "index btree composite covering explain plan transaction acid isolation deadlock lock sargable",
    req: "Ottimizzazione di query e strutture dati",
  },
  {
    n: "12", id: "12-orm-in-depth", part: PARTS[2],
    title: "The ORM in depth: Eloquent and Doctrine",
    blurb: "Active Record vs Data Mapper, hydration, lazy loading, the N+1 problem and migrations.",
    tags: "eloquent doctrine orm active record data mapper n+1 eager lazy hydration migration seeder",
    req: "Esperienza con Laravel e il suo ORM",
  },

  /* ---------- Part 3 — The web ---------- */
  {
    n: "13", id: "13-http-and-psr", part: PARTS[3],
    title: "HTTP, REST, PSR-7 and PSR-15",
    blurb: "Methods, status codes, idempotency, content negotiation, and the middleware interface.",
    tags: "http rest psr-7 psr-15 middleware status code idempotent cache header cors verb",
    req: "Sviluppo e integrazione di API REST",
  },
  {
    n: "14", id: "14-building-an-api", part: PARTS[3],
    title: "Building an API",
    blurb: "Routing, validation, serialisation, pagination, versioning and error shapes that clients can use.",
    tags: "api routing validation serialisation resource pagination versioning json problem details",
    req: "Sviluppo e integrazione di API REST",
  },
  {
    n: "14b", id: "14b-integrations", part: PARTS[3],
    title: "Integrations: webhooks, SOAP, CSV and XML",
    blurb: "Consuming other people's APIs, retries, idempotency keys — and the SOAP endpoint you cannot avoid.",
    tags: "integration webhook soap wsdl xml csv retry idempotency guzzle http client timeout",
    req: "Integrazione con sistemi e servizi di terze parti",
  },
  {
    n: "15", id: "15-api-security", part: PARTS[3],
    title: "Security: OWASP, injection, XSS, CSRF and auth",
    blurb: "Prepared statements, output escaping, password hashing, sessions vs JWT, and the OWASP Top 10.",
    tags: "security owasp sql injection xss csrf session jwt password_hash argon2 escaping ssrf",
    req: "Attenzione alla sicurezza applicativa",
  },
  {
    n: "16", id: "16-the-framework", part: PARTS[3],
    title: "The framework: Laravel and Symfony",
    blurb: "The request lifecycle, the service container, middleware, providers and facades.",
    tags: "laravel symfony framework container di service provider facade middleware lifecycle kernel",
    req: "Consolidata esperienza con il framework Laravel",
  },
  {
    n: "16b", id: "16b-legacy-php", part: PARTS[3],
    title: "Legacy PHP and how to migrate it",
    blurb: "PHP 5.x to 8.x, procedural codebases, the strangler pattern, and changing code with no tests.",
    tags: "legacy migration php5 php7 php8 rector strangler refactor deprecation procedural",
    extra: "A large share of Italian PHP work is maintaining something written a decade ago. Nobody advertises this and everybody does it.",
  },
  {
    n: "17", id: "17-frontend-basics", part: PARTS[3],
    title: "HTML, CSS and the DOM",
    blurb: "Semantic markup, the cascade, flex and grid, responsive layout and accessibility basics.",
    tags: "html css dom semantic flexbox grid responsive accessibility a11y specificity box model",
    req: "Conoscenza di HTML, CSS e JavaScript",
  },
  {
    n: "17b", id: "17b-javascript", part: PARTS[3],
    title: "JavaScript as a language",
    blurb: "The event loop, promises, async/await, closures, this, and modern syntax.",
    tags: "javascript event loop promise async await closure this prototype module esm fetch",
    req: "Conoscenza di HTML, CSS e JavaScript",
  },
  {
    n: "18", id: "18-spa-and-vue", part: PARTS[3],
    title: "SPAs, Vue and TypeScript",
    blurb: "Reactivity, components, state, and why Vue is disproportionately common in Italian PHP shops.",
    tags: "vue spa typescript react reactivity component props state pinia vite composition api",
    req: "Gradita conoscenza di framework JavaScript (Vue, React)",
  },
  {
    n: "19", id: "19-server-rendered-ui", part: PARTS[3],
    title: "Blade, Twig, Livewire and Inertia",
    blurb: "Server-rendered UI, template inheritance, escaping by default, and the no-API middle ground.",
    tags: "blade twig livewire inertia template escaping component partial server rendered hypermedia",
    req: "Consolidata esperienza con il framework Laravel",
  },

  /* ---------- Part 4 — Fast at scale ---------- */
  {
    n: "20", id: "20-caching", part: PARTS[4],
    title: "Caching: Redis, OPcache and HTTP",
    blurb: "Cache-aside, invalidation, stampedes, tags, and the three caches you already have.",
    tags: "cache redis opcache memcached http cache aside invalidation stampede ttl tag etag",
    req: "Ottimizzazione delle prestazioni applicative",
  },
  {
    n: "21", id: "21-search", part: PARTS[4],
    title: "Search: Elasticsearch and Meilisearch",
    blurb: "Why LIKE '%term%' stops working, inverted indexes, analysers, relevance and Laravel Scout.",
    tags: "search elasticsearch meilisearch algolia scout inverted index analyser relevance facet",
    extra: "Every e-commerce and gestionale project reaches the point where LIKE stops being acceptable. Knowing the shape of the answer separates you from a candidate who suggests a bigger index.",
  },
  {
    n: "22", id: "22-queues-and-messaging", part: PARTS[4],
    title: "Queues, workers and messaging",
    blurb: "Redis and RabbitMQ, jobs, retries, failed jobs, idempotency and Horizon.",
    tags: "queue worker job redis rabbitmq horizon retry backoff failed idempotency supervisor cron",
    req: "Ottimizzazione delle prestazioni applicative",
  },
  {
    n: "22b", id: "22b-microservices", part: PARTS[4],
    title: "Microservices — and when a monolith wins",
    blurb: "What distribution actually costs, and the honest answer to \"would you use microservices?\"",
    tags: "microservice monolith modular distributed saga consistency boundary coupling deployment",
    extra: "Asked in interviews far more often than it is built. The candidate who can say when NOT to distribute sounds senior; the one who says microservices to everything does not.",
  },
  {
    n: "23", id: "23-architecture", part: PARTS[4],
    title: "Architecture: layers, hexagonal, CQRS, DDD",
    blurb: "Keeping the domain free of the framework, and the vocabulary interviewers expect.",
    tags: "architecture layer hexagonal ports adapters cqrs ddd aggregate value object bounded context deptrac",
    req: "Capacità di scrivere codice manutenibile e riutilizzabile",
  },

  /* ---------- Part 5 — Building it properly ---------- */
  {
    n: "24", id: "24-testing", part: PARTS[5],
    title: "Testing: PHPUnit, Pest and test doubles",
    blurb: "Unit vs integration, fixtures, mocks and stubs, database testing, and what coverage does not tell you.",
    tags: "test phpunit pest mock stub fake spy fixture factory coverage mutation infection tdd",
    req: "Gradita esperienza con test automatici",
  },
  {
    n: "25", id: "25-observability", part: PARTS[5],
    title: "Logging, metrics and tracing",
    blurb: "PSR-3 and Monolog, structured logs, correlation ids, Sentry, and what to log when it breaks.",
    tags: "log psr-3 monolog structured correlation trace metric sentry apm observability debug production",
    extra: "Nobody asks for it at junior level and everybody needs it the first week. It is also the fastest way to look like you have worked on something real.",
  },
  {
    n: "25b", id: "25b-production-support", part: PARTS[5],
    title: "Production support as a process",
    blurb: "Triage, reproducing, hotfix vs fix, rollback, the post-mortem and the customer-facing half.",
    tags: "support incident triage hotfix rollback postmortem oncall sla escalation runbook",
    req: "Disponibilità ad attività di manutenzione ed assistenza",
  },

  /* ---------- Part 6 — Tools and shipping ---------- */
  {
    n: "26", id: "26-git", part: PARTS[6],
    title: "Git",
    blurb: "Merge vs rebase, resolving conflicts, branching strategy, and undoing what you just did.",
    tags: "git merge rebase branch conflict cherry-pick reflog stash pull request flow tag",
    req: "Utilizzo di sistemi di versionamento (Git)",
  },
  {
    n: "27", id: "27-tooling-and-xdebug", part: PARTS[6],
    title: "The toolchain and the debugger nobody sets up",
    blurb: "PhpStorm and VS Code, Xdebug step debugging, profiling, PHPStan, CS Fixer and Rector.",
    tags: "phpstorm vscode xdebug debugger breakpoint profiler phpstan psalm cs-fixer rector static analysis",
    extra: "Xdebug is the single biggest productivity difference between two otherwise equal PHP developers, and most candidates still debug with var_dump.",
  },
  {
    n: "28", id: "28-containers-and-composer", part: PARTS[6],
    title: "Composer, autoloading and Docker",
    blurb: "PSR-4, semantic versioning, the lock file, images and layers, and Compose for a PHP stack.",
    tags: "composer autoload psr-4 semver lock docker image layer compose volume network sail ddev",
    req: "Gradita conoscenza di Docker",
  },
  {
    n: "29", id: "29-cloud-hosting", part: PARTS[6],
    title: "Cloud hosting and deployment",
    blurb: "VPS, managed platforms, environment configuration, secrets, backups and zero-downtime deploys.",
    tags: "cloud vps hetzner aws forge ploi vapor deploy environment secret backup nginx supervisor",
    extra: "Not usually a junior requirement, but it is what turns a project you wrote into a URL somebody can open — and that is what gets discussed in interviews.",
  },
  {
    n: "29b", id: "29b-shared-hosting", part: PARTS[6],
    title: "Shared hosting, cPanel and FTP",
    blurb: "The constraints of the hosting a large share of Italian PHP actually runs on.",
    tags: "shared hosting cpanel plesk ftp aruba register.it htaccess cron php version constraint",
    extra: "Unglamorous and extremely real. Aruba and shared cPanel host an enormous amount of Italian PHP, and a developer who has only ever deployed to Docker is stuck on day one.",
  },
  {
    n: "30", id: "30-ci-cd", part: PARTS[6],
    title: "CI/CD pipelines",
    blurb: "GitHub Actions and GitLab CI, running tests on push, Deployer, and rolling back.",
    tags: "ci cd github actions gitlab pipeline deployer envoyer artifact rollback staging release",
    req: "Gradita conoscenza di Docker",
  },

  /* ---------- Part 7 — What the region actually runs ---------- */
  {
    n: "31", id: "31-wordpress", part: PARTS[7],
    title: "WordPress, done professionally",
    blurb: "Hooks, themes, plugins, the loop, custom post types — and how to work on it without shame.",
    tags: "wordpress hook filter action theme plugin custom post type acf gutenberg wp-cli woocommerce",
    req: "Gradita esperienza con CMS (WordPress)",
  },
  {
    n: "32", id: "32-ecommerce", part: PARTS[7],
    title: "E-commerce: Magento, PrestaShop, WooCommerce",
    blurb: "Catalogue, cart, checkout, payments, VAT and stock — the domain half of Italian PHP work.",
    tags: "ecommerce magento prestashop woocommerce shopware cart checkout payment iva vat stock catalogue",
    req: "Gradita esperienza su piattaforme e-commerce",
  },
  {
    n: "33", id: "33-gestionali-and-sdi", part: PARTS[7],
    title: "Gestionali, ERP and fatturazione elettronica",
    blurb: "The Italian invoicing system, the SDI, XML formats, and integrating with an ERP you cannot change.",
    tags: "gestionale erp fatturazione elettronica sdi xml fatturapa codice destinatario partita iva zucchetti",
    req: "Integrazione con sistemi e servizi di terze parti",
  },
  {
    n: "33b", id: "33b-ai-in-php", part: PARTS[7],
    title: "AI inside a PHP application",
    blurb: "Calling an LLM API, embeddings and vector search, prompt injection, cost and latency.",
    tags: "ai llm openai claude api embedding vector rag prompt injection token cost latency queue",
    extra: "Increasingly asked about, rarely taught. Knowing that an LLM call belongs on a queue and that user text in a prompt is an injection risk is enough to be the person in the room who has thought about it.",
  },

  /* ---------- Part 8 — The human requirements ---------- */
  {
    n: "34", id: "34-agile", part: PARTS[8],
    title: "Agile, Scrum and the daily rhythm",
    blurb: "Stand-ups, sprints, estimation, refinement — and what the ceremonies are actually for.",
    tags: "agile scrum sprint standup retrospective refinement estimation story point kanban jira",
    req: "Capacità di lavorare in team con metodologie Agile",
  },
  {
    n: "35", id: "35-teamwork", part: PARTS[8],
    title: "Analysis, autonomy and code review",
    blurb: "Turning a vague request into a task, asking good questions, and reviewing without friction.",
    tags: "analysis autonomy requirement question code review feedback communication estimate stakeholder",
    req: "Capacità di analisi, autonomia e problem solving",
  },
  {
    n: "36", id: "36-cv-and-linkedin", part: PARTS[8],
    title: "Your CV, LinkedIn and this project",
    blurb: "An ATS-readable Italian CV, the GDPR line, and how to talk about what you built here.",
    tags: "cv curriculum linkedin ats gdpr consenso lettera presentazione portfolio github profilo",
    extra: "The advert never asks for it and it decides whether anyone reads the rest. The CV builder on this site lints against the rules in this chapter.",
  },
  {
    n: "37", id: "37-screening-test", part: PARTS[8],
    title: "The screening test",
    blurb: "Take-home exercises and live coding: what they are really measuring, and how to hand one in.",
    tags: "screening test take home live coding exercise assessment hackerrank codility submission readme",
    extra: "Almost every Italian software house screens before the technical interview, and candidates lose here for reasons that have nothing to do with the code.",
  },
  {
    n: "38", id: "38-the-interview", part: PARTS[8],
    title: "The interview",
    blurb: "Mi parli di lei, the technical round, RAL and contracts, and the questions you must ask them.",
    tags: "interview colloquio ral ccnl apprendistato contratto domande negoziazione stipendio netto",
    req: "the whole advert",
  },
];

/* Make available to plain <script> pages (no modules — this must run on file://).

   `self`, not `window`. They are the same object in a page, and in a SERVICE WORKER
   there is no `window` at all — so writing `window.CHAPTERS` here would throw the
   moment sw.js does importScripts() on this file. It does exactly that, so the
   offline precache list is generated from this array rather than being a second
   copy of it that goes stale. */
self.PARTS = PARTS;
self.CHAPTERS = CHAPTERS;

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

   THE ADVERTS. This manifest was derived from Java postings for Emilia-Romagna
   and Milano collected in September 2026:

     1. Java Developer (industry), Bologna — microservices for industrial
        systems, Java 11+, Spring Boot, Spring Cloud, REST/GraphQL, OPC UA.
     2. Java Developer (AI / document lifecycle), Bologna — Java, Spring,
        Spring Boot, AWS.
     3. Middle Software Developer, Modena — Java/Spring/Spring Boot with an
        Angular/TypeScript front end.
     4. Senior Java Developer, Bologna — Java 8+, Spring/Spring Boot, REST,
        dependency injection, Spring Data JPA.
     5. Backend Developer mid-senior, Milano (hybrid) — Java 17, Spring Boot,
        OpenShift/Kubernetes, Kafka/RabbitMQ, MongoDB, Oracle.
     6. Middle Backend Developer (public administration, remote) — Java 11+,
        Quarkus and Spring Boot.

   The recurring requirement lines are quoted verbatim in Italian in the `req`
   fields below. Where several adverts said the same thing in different words,
   the clearest phrasing was kept.

   The honesty rule: if no advert asked for it, it does not get a `req`. It gets
   an `extra` saying why it is here anyway. The home page renders the two lists
   separately so "nothing in the advert is uncovered" stays checkable.

   ON THE OVERLAP WITH THE KAFKA SUBJECT. Chapter 33 covers messaging from
   inside a Spring application — producers, consumers, `@KafkaListener`, and the
   choice between Kafka and RabbitMQ. It deliberately stops there. The broker's
   own model (partitions, offsets, delivery semantics, rebalancing) belongs to
   the Kafka academy, and duplicating it here would create two copies to keep
   in step. A reader doing both meets Spring twice; that was the accepted cost
   of splitting the subjects.
   ========================================================================== */

const PARTS = [
  "Start here",
  "Part 1 — The language and the platform",
  "Part 2 — Spring, from the container up",
  "Part 3 — The web tier",
  "Part 4 — Data",
  "Part 5 — Many services",
  "Part 6 — Proving it works",
  "Part 7 — Build, ship, run",
  "Part 8 — What the region actually runs",
  "Part 9 — The human requirements",
];

const CHAPTERS = [
  {
    n: "00", id: "00-the-job-posting", part: PARTS[0],
    title: "The job posting, decoded",
    blurb: "Every line of the six adverts translated into what it actually asks you to know.",
    tags: "requisiti annuncio requirements roadmap start offerta mercato bologna modena milano",
    req: "the whole advert",
  },

  /* ---------- Part 1 — The language and the platform ---------- */
  {
    n: "01", id: "01-jvm-and-runtime", part: PARTS[1],
    title: "The JVM, and what actually runs",
    blurb: "Bytecode, the class loader, JIT compilation, and why 'write once' has an asterisk.",
    tags: "jvm bytecode classloader jit hotspot graalvm jre jdk runtime compilation",
    req: "Solida esperienza con Java 8+",
  },
  {
    n: "02", id: "02-java-versions", part: PARTS[1],
    title: "Java 8 → 17 → 21, version by version",
    blurb: "What each LTS added, what the adverts mean by '11+', and what still ships on 8.",
    tags: "java8 java11 java17 java21 lts versioni release migration modules jigsaw",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "03", id: "03-types-and-objects", part: PARTS[1],
    title: "Types, objects and equality",
    blurb: "Primitives and boxing, equals/hashCode, immutability, and the contracts nobody reads.",
    tags: "equals hashcode boxing autoboxing immutable comparable contract identity tipi",
    extra: "No advert names equals/hashCode, and every Java interview asks about it — because getting it wrong breaks every HashMap and HashSet in the codebase silently.",
  },
  {
    n: "04", id: "04-collections", part: PARTS[1],
    title: "Collections, and choosing the right one",
    blurb: "List, Set, Map, their implementations, and the performance you are choosing.",
    tags: "collections arraylist linkedlist hashmap treemap hashset complexity big-o iterator",
    extra: "The most-used part of the standard library and the one candidates explain worst. Knowing that a HashMap is a bucket array explains its performance and its surprises at once.",
  },
  {
    n: "05", id: "05-generics", part: PARTS[1],
    title: "Generics and erasure",
    blurb: "Type parameters, wildcards, PECS, and what the compiler throws away before runtime.",
    tags: "generics erasure wildcard extends super pecs bounded type-parameter reified",
    extra: "Erasure is the reason half of the 'why can't I do this' questions in Java have the answer they do. Interviewers use it to separate people who have read the language from people who have copied from it.",
  },
  {
    n: "06", id: "06-streams-lambdas", part: PARTS[1],
    title: "Lambdas, streams and Optional",
    blurb: "Functional interfaces, the stream pipeline, and when a for-loop is still the right answer.",
    tags: "lambda stream optional functional map filter collect reduce parallel method-reference",
    req: "Solida esperienza con Java 8+",
  },
  {
    n: "07", id: "07-records-sealed-pattern", part: PARTS[1],
    title: "Records, sealed types and pattern matching",
    blurb: "The modern Java that adverts asking for 17 expect you to reach for.",
    tags: "record sealed pattern-matching switch instanceof text-block var modern",
    extra: "An advert asking for Java 17 is asking for someone who writes Java 17, not Java 8 that compiles on 17. This is the difference, and it is visible in a code test in about ten lines.",
  },
  {
    n: "08", id: "08-exceptions", part: PARTS[1],
    title: "Exceptions, checked and otherwise",
    blurb: "The checked/unchecked split, try-with-resources, and how not to swallow a failure.",
    tags: "exception checked unchecked runtime try-with-resources finally throws stacktrace",
    extra: "Not in any advert, and the single most common source of production mysteries in Java codebases: an empty catch block written years ago that turns a failure into a wrong answer.",
  },
  {
    n: "09", id: "09-concurrency", part: PARTS[1],
    title: "Threads, executors and virtual threads",
    blurb: "The memory model, the executor framework, and what Loom changed in Java 21.",
    tags: "thread concurrency executor synchronized volatile atomic completablefuture loom virtual",
    extra: "Every Spring application is concurrent whether or not you thought about it — the container hands each request its own thread. Shared mutable state in a @Service is the bug this chapter prevents.",
  },
  {
    n: "10", id: "10-memory-gc", part: PARTS[1],
    title: "Memory, garbage collection and the heap",
    blurb: "Generations, the collectors, and reading a heap dump when the container keeps restarting.",
    tags: "gc garbage-collection heap stack g1 zgc oom memory-leak jvm-flags xmx heap-dump",
    extra: "Nobody advertises this and everybody hits it: a JVM in a container with a memory limit and no heap flag is an OOMKill waiting to happen. Chapter 41 is where it bites.",
  },

  /* ---------- Part 2 — Spring, from the container up ---------- */
  {
    n: "11", id: "11-spring-container", part: PARTS[2],
    title: "The container: beans, scopes, lifecycle",
    blurb: "What the ApplicationContext actually is, and what happens before your code runs.",
    tags: "spring container bean applicationcontext scope singleton prototype lifecycle postconstruct",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "12", id: "12-dependency-injection", part: PARTS[2],
    title: "Dependency injection, done properly",
    blurb: "Constructor vs field injection, circular dependencies, and why @Autowired on a field is a smell.",
    tags: "dependency-injection di autowired constructor qualifier primary circular inversion-of-control",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "13", id: "13-configuration-profiles", part: PARTS[2],
    title: "Configuration, profiles and properties",
    blurb: "application.yml, @ConfigurationProperties, profiles, and where secrets must not live.",
    tags: "configuration profile properties yaml configurationproperties environment secrets vault",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "14", id: "14-spring-boot-autoconfig", part: PARTS[2],
    title: "Spring Boot and auto-configuration",
    blurb: "Starters, conditional beans, and how to find out why a bean you never declared exists.",
    tags: "spring-boot autoconfiguration starter conditional actuator debug bean-definition",
    req: "Esperienza consolidata in Java, Spring, Spring Boot",
  },
  {
    n: "15", id: "15-quarkus-vs-spring", part: PARTS[2],
    title: "Quarkus, and when it is chosen instead",
    blurb: "Build-time wiring, native images, cold starts — and the honest comparison.",
    tags: "quarkus graalvm native-image cold-start microprofile jakarta alternative spring-comparison",
    req: "framework come Quarkus e Spring Boot",
  },

  /* ---------- Part 3 — The web tier ---------- */
  {
    n: "16", id: "16-rest-controllers", part: PARTS[3],
    title: "REST controllers and the request cycle",
    blurb: "From socket to @RestController and back — filters, mapping, serialisation.",
    tags: "restcontroller requestmapping dispatcherservlet filter interceptor jackson serialization",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "17", id: "17-rest-design", part: PARTS[3],
    title: "Designing a REST API people can use",
    blurb: "Resources, status codes, idempotency, pagination and versioning that survives contact.",
    tags: "rest api design status-code idempotent pagination versioning hateoas richardson",
    req: "progettazione e implementazione di API REST/GraphQL per l'integrazione con sistemi industriali (OPC UA, MQTT, Modbus)",
  },
  {
    n: "18", id: "18-validation-errors", part: PARTS[3],
    title: "Validation and error responses",
    blurb: "Bean Validation, @ControllerAdvice, and RFC 7807 problem details instead of a stack trace.",
    tags: "validation bean-validation jakarta constraint controlleradvice problem-details rfc7807 error",
    extra: "No advert asks for it, and every code review does. An API that returns a 500 with a stack trace for a missing field is the fastest way to fail a technical test.",
  },
  {
    n: "19", id: "19-graphql", part: PARTS[3],
    title: "GraphQL, and when it beats REST",
    blurb: "Schema-first, resolvers, the N+1 that GraphQL makes worse, and honest trade-offs.",
    tags: "graphql schema resolver dataloader n-plus-one query mutation subscription federation",
    req: "progettazione e implementazione di API REST/GraphQL per l'integrazione con sistemi industriali (OPC UA, MQTT, Modbus)",
  },
  {
    n: "20", id: "20-security-auth", part: PARTS[3],
    title: "Spring Security, JWT and OAuth2",
    blurb: "The filter chain, authentication vs authorisation, tokens, and password storage.",
    tags: "spring-security jwt oauth2 authentication authorization filter-chain csrf bcrypt cors",
    extra: "Absent from every advert collected and present in every application any of them would have you build. It is also the area where a wrong answer in an interview is remembered.",
  },
  {
    n: "21", id: "21-openapi", part: PARTS[3],
    title: "OpenAPI, contracts and generated clients",
    blurb: "springdoc, the contract-first argument, and keeping documentation from rotting.",
    tags: "openapi swagger springdoc contract-first codegen documentation schema client",
    extra: "The integration work in advert 1 is only tractable when the contract is written down. Nobody lists this as a requirement and every integration project needs it.",
  },

  /* ---------- Part 4 — Data ---------- */
  {
    n: "22", id: "22-jdbc-and-pools", part: PARTS[4],
    title: "JDBC, connection pools and what leaks",
    blurb: "The layer under everything: statements, HikariCP, pool sizing and exhaustion.",
    tags: "jdbc datasource hikari connection-pool preparedstatement leak timeout pool-size",
    extra: "Every ORM question eventually becomes a JDBC question. Pool exhaustion under load is the classic Friday-afternoon incident, and it is diagnosable in minutes if you know this layer exists.",
  },
  {
    n: "23", id: "23-jpa-hibernate", part: PARTS[4],
    title: "JPA and Hibernate: the object-relational bargain",
    blurb: "Entities, the persistence context, dirty checking, and what the ORM is doing behind you.",
    tags: "jpa hibernate entity persistence-context session dirty-checking lazy eager cascade orm",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "24", id: "24-spring-data", part: PARTS[4],
    title: "Spring Data repositories",
    blurb: "Derived queries, @Query, projections, Specifications — and where the magic stops.",
    tags: "spring-data repository crudrepository jparepository derived-query projection specification pageable",
    req: "ottima conoscenza di Spring/Spring Boot (API REST, dependency injection, configurazioni, Spring Data JPA)",
  },
  {
    n: "25", id: "25-transactions", part: PARTS[4],
    title: "Transactions, propagation and isolation",
    blurb: "@Transactional, the proxy that makes it work, propagation modes and the self-invocation trap.",
    tags: "transaction transactional propagation isolation rollback proxy self-invocation aop readonly",
    extra: "The self-invocation trap — calling a @Transactional method from inside the same class, so the proxy is bypassed and there is no transaction — is the highest-value fifteen minutes in this course. It fails silently.",
  },
  {
    n: "26", id: "26-n-plus-one", part: PARTS[4],
    title: "The N+1 problem and fetching strategies",
    blurb: "How one list page becomes four hundred queries, and the four ways to stop it.",
    tags: "n-plus-one fetch join entity-graph batch-size lazy-loading performance query-count",
    extra: "Not in any advert; visible in every Hibernate codebase in the region. Being able to name it, show it in the logs and fix it three ways is a strong interview moment.",
  },
  {
    n: "27", id: "27-oracle-and-sql", part: PARTS[4],
    title: "Oracle, and the SQL you will actually meet",
    blurb: "Dialect differences, sequences, hints, and reading a plan you did not write.",
    tags: "oracle sql dialect sequence rownum plsql explain-plan index hint legacy",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "28", id: "28-mongodb", part: PARTS[4],
    title: "MongoDB, and when a document store earns its place",
    blurb: "Documents, indexes, aggregation, and the modelling decisions that cannot be undone.",
    tags: "mongodb document nosql aggregation index embedding referencing spring-data-mongo schema",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "29", id: "29-migrations", part: PARTS[4],
    title: "Schema migrations with Flyway and Liquibase",
    blurb: "Versioned schema, why ddl-auto is not a strategy, and migrations in the pipeline.",
    tags: "flyway liquibase migration ddl-auto schema versioning rollback baseline pipeline",
    extra: "hibernate.ddl-auto=update in production is the defect this chapter exists to prevent. It is also the question that separates people who have deployed from people who have only run locally.",
  },

  /* ---------- Part 5 — Many services ---------- */
  {
    n: "30", id: "30-microservices", part: PARTS[5],
    title: "Microservices: the shape and the cost",
    blurb: "What splitting buys, what it charges, and the distributed monolith you are trying not to build.",
    tags: "microservices monolith bounded-context distributed coupling saga consistency trade-off",
    req: "Sviluppare microservizi in Java 11+ utilizzando Spring Boot e Spring Cloud",
  },
  {
    n: "31", id: "31-spring-cloud", part: PARTS[5],
    title: "Spring Cloud: config, discovery, gateway",
    blurb: "Centralised configuration, service discovery, the gateway, and what Kubernetes replaces.",
    tags: "spring-cloud config-server eureka discovery gateway load-balancer feign ribbon",
    req: "Sviluppare microservizi in Java 11+ utilizzando Spring Boot e Spring Cloud",
  },
  {
    n: "32", id: "32-resilience", part: PARTS[5],
    title: "Timeouts, retries and circuit breakers",
    blurb: "Resilience4j, the retry that causes the outage, and backpressure.",
    tags: "resilience4j circuit-breaker retry timeout bulkhead fallback backpressure cascading-failure",
    extra: "A retry without a budget turns one slow dependency into an outage across every service that calls it. No advert names this and every distributed system needs somebody who has thought about it.",
  },
  {
    n: "33", id: "33-messaging", part: PARTS[5],
    title: "Messaging from inside a Spring application",
    blurb: "Producers, consumers, @KafkaListener, and the honest choice between Kafka and RabbitMQ.",
    tags: "kafka rabbitmq messaging spring-kafka kafkalistener amqp queue topic async event",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "34", id: "34-industrial-protocols", part: PARTS[5],
    title: "OPC UA, MQTT and Modbus",
    blurb: "The protocols an Emilia-Romagna machine talks, and bridging them to an HTTP API.",
    tags: "opc-ua mqtt modbus industrial iiot plc scada packaging automation bridge telemetry",
    req: "progettazione e implementazione di API REST/GraphQL per l'integrazione con sistemi industriali (OPC UA, MQTT, Modbus)",
  },
  {
    n: "35", id: "35-observability", part: PARTS[5],
    title: "Logs, metrics and traces",
    blurb: "Actuator, Micrometer, OpenTelemetry, and correlating one request across five services.",
    tags: "observability actuator micrometer opentelemetry prometheus grafana tracing correlation-id logging",
    extra: "Once there is more than one service, 'it is slow' is unanswerable without this. It is also the fastest way to look senior in a system-design conversation.",
  },

  /* ---------- Part 6 — Proving it works ---------- */
  {
    n: "36", id: "36-unit-testing", part: PARTS[6],
    title: "JUnit 5 and what a unit test is for",
    blurb: "Assertions, parameterised tests, lifecycle, and tests that fail for one reason.",
    tags: "junit5 test assertion parameterized lifecycle assertj naming arrange-act-assert",
    extra: "No advert asks for tests. Every technical assessment counts them, and a submission without any is read as a statement about how you work.",
  },
  {
    n: "37", id: "37-mocking", part: PARTS[6],
    title: "Mockito, test doubles and over-mocking",
    blurb: "Stubs, mocks, verification — and the test that only proves the mock was configured.",
    tags: "mockito mock stub spy verify argument-captor test-double over-mocking brittle",
    extra: "A suite that mocks everything passes forever and catches nothing. Knowing which collaborators deserve a double is the difference between tests that help and tests that cost.",
  },
  {
    n: "38", id: "38-spring-testing", part: PARTS[6],
    title: "Testing a Spring application",
    blurb: "@SpringBootTest, slices, MockMvc, and keeping the context from being rebuilt 200 times.",
    tags: "springboottest webmvctest datajpatest mockmvc slice context-caching testconfiguration",
    extra: "Spring makes it easy to write an integration test by accident and pay for it on every build. Slices are the fix, and almost nobody knows they exist.",
  },
  {
    n: "39", id: "39-testcontainers", part: PARTS[6],
    title: "Testcontainers and integration tests worth trusting",
    blurb: "The real Oracle, the real Kafka, in Docker, per test run — instead of H2 and hope.",
    tags: "testcontainers docker integration-test h2 postgres oracle kafka reuse ryuk",
    extra: "Testing against H2 when production is Oracle tests a database you do not ship. Testcontainers removes the whole class of 'passed in CI, failed in production' defect.",
  },

  /* ---------- Part 7 — Build, ship, run ---------- */
  {
    n: "40", id: "40-maven-gradle", part: PARTS[7],
    title: "Maven and Gradle",
    blurb: "The lifecycle, dependency resolution, BOMs, and diagnosing a version conflict.",
    tags: "maven gradle pom dependency-management bom transitive conflict shade wrapper lifecycle",
    extra: "Every Java project is built by one of these and most candidates have only ever run the button in the IDE. Reading a dependency tree is a five-minute skill with a very long tail.",
  },
  {
    n: "41", id: "41-docker", part: PARTS[7],
    title: "Containers, and a JVM image that is not 700 MB",
    blurb: "Layered builds, jlink, base images, and the container memory flags the JVM needs.",
    tags: "docker container image layer multi-stage jlink distroless memory-limit xmx ergonomics",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "42", id: "42-kubernetes", part: PARTS[7],
    title: "Kubernetes and OpenShift",
    blurb: "Pods, services, probes, config and secrets — and what OpenShift adds on top.",
    tags: "kubernetes openshift pod deployment service ingress probe configmap secret helm route scc",
    req: "Java 17 (Spring Boot), OpenShift/Kubernetes, Apache Kafka/RabbitMQ, MongoDB e Oracle DB",
  },
  {
    n: "43", id: "43-aws", part: PARTS[7],
    title: "AWS: EC2, S3 and Route 53",
    blurb: "Exactly the three services the advert names, plus the IAM model underneath them.",
    tags: "aws ec2 s3 route53 iam vpc sdk credentials region bucket dns",
    req: "conoscenza dei principali servizi AWS (almeno EC2, S3, Route53)",
  },
  {
    n: "44", id: "44-ci-cd", part: PARTS[7],
    title: "Pipelines, and migrations in them",
    blurb: "Build, test, scan, deploy — and why schema changes belong in the pipeline, not at startup.",
    tags: "ci cd pipeline jenkins github-actions gitlab artifact promotion migration rollback blue-green",
    extra: "The migration-at-startup race is a real defect the C# academy documents in its own §11. Two instances starting together will both run migrations, and only one will win.",
  },

  /* ---------- Part 8 — What the region actually runs ---------- */
  {
    n: "45", id: "45-legacy-java-ee", part: PARTS[8],
    title: "Java EE, Jakarta and the code you will inherit",
    blurb: "EJB, JSF, application servers, and the javax→jakarta rename that broke everything.",
    tags: "java-ee jakarta ejb jsf jax-rs weblogic wildfly jboss javax migration legacy",
    extra: "A large share of Italian Java work is maintaining something written for an application server a decade ago. Nobody advertises this and everybody does it.",
  },
  {
    n: "46", id: "46-angular-frontend", part: PARTS[8],
    title: "The Angular/TypeScript front end you will touch",
    blurb: "Enough Angular to be useful in a full-stack team without pretending to be a frontend dev.",
    tags: "angular typescript component service rxjs observable http-client cors full-stack modena",
    req: "Minimo due anni di esperienza nello sviluppo software, di cui uno con il framework Angular/TypeScript",
  },
  {
    n: "47", id: "47-gestionali", part: PARTS[8],
    title: "Gestionali, ERP integrations and the Italian software house",
    blurb: "What the work is actually like: fatturazione elettronica, ERP exports, and the client's Excel.",
    tags: "gestionale erp sap fatturazione-elettronica sdi integration csv excel commessa consulenza",
    extra: "This is the shape of the majority of the jobs behind these adverts. Understanding the domain vocabulary before the interview is worth more than another framework.",
  },

  /* ---------- Part 9 — The human requirements ---------- */
  {
    n: "48", id: "48-agile-scrum", part: PARTS[9],
    title: "Agile, Scrum and the ceremonies",
    blurb: "Sprint, standup, refinement, retro — and what a team actually expects of you in each.",
    tags: "agile scrum sprint standup retrospective refinement story-point kanban jira ceremony",
    req: "Full-time participation in projects working collaboratively with development teams in Agile Scrum methodology",
  },
  {
    n: "49", id: "49-english", part: PARTS[9],
    title: "The English the advert means",
    blurb: "Standup English, code review English, and the twenty phrases that carry a technical call.",
    tags: "english inglese b2 standup call meeting review phrases vocabulary international",
    req: "Excellent knowledge of English language for international work environments",
  },
  {
    n: "50", id: "50-the-cv", part: PARTS[9],
    title: "The CV and the ATS",
    blurb: "What the screening software reads, what the human reads, and the honest way to pass both.",
    tags: "cv curriculum ats screening keyword linkedin portfolio pdf formato lettera",
    extra: "Almost every Italian software house screens before the technical interview, and candidates lose here for reasons that have nothing to do with the code.",
  },
  {
    n: "51", id: "51-the-interview", part: PARTS[9],
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

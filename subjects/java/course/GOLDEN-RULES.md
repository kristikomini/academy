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

1. **Override `equals` and `hashCode` together,** or hash-based collections silently lose elements. — [03](../site/chapters/03-types-and-objects.html)
2. **Generics are erased.** Compile-time safety, no runtime type argument. — [05](../site/chapters/05-generics.html)
3. **Streams are lazy and single-use.** Nothing runs until a terminal operation. — [06](../site/chapters/06-streams-lambdas.html)
4. **Visibility is not atomicity.** `volatile` gives the first, not the second. — [09](../site/chapters/09-concurrency.html)
5. **What you get injected is usually a proxy,** not your object. Everything AOP-based depends on that. — [11](../site/chapters/11-spring-container.html)
6. **Constructor injection** final fields, no half-built objects, no reflection needed to test. — [12](../site/chapters/12-dependency-injection.html)
7. **Dirty checking means mutation is persistence.** There is no `save()` to look for. — [23](../site/chapters/23-jpa-hibernate.html)
8. **Rollback on unchecked only.** A checked exception commits unless you set `rollbackFor`. — [25](../site/chapters/25-transactions.html)
9. **`join fetch` or `@EntityGraph` per query;** `default_batch_fetch_size` as a safety net. — [26](../site/chapters/26-n-plus-one.html)
10. **Never return an entity.** DTO records: one line, and the schema stops being the contract. — [16](../site/chapters/16-rest-controllers.html)
11. **Status codes are the API.** 200-with-an-error-body forces every client to parse to find out. — [17](../site/chapters/17-rest-design.html)
12. **`validate` in production, never `update`.** `create-drop` is for tests. — [29](../site/chapters/29-migrations.html)

## The six that separate a senior candidate

Not harder, but the ones that show you have operated something rather than only built it.

1. **The heap is not the whole footprint.** Metaspace, stacks, code cache and direct buffers sit outside it. — [10](../site/chapters/10-memory-gc.html)
2. **Every replica has its own pool.** Multiply before you deploy. — [22](../site/chapters/22-jdbc-and-pools.html)
3. **Retries multiply through a chain.** Budget them; prefer retrying at one layer. — [32](../site/chapters/32-resilience.html)
4. **Alert on symptoms: errors, p95/p99 latency, saturation.** — [35](../site/chapters/35-observability.html)
5. **Liveness restarts; readiness removes from traffic.** Never put a dependency check in liveness. — [42](../site/chapters/42-kubernetes.html)
6. **Build once, promote the artefact.** Rebuilding per environment tests something else. — [44](../site/chapters/44-ci-cd.html)

## [Chapter 00 — The job posting, decoded](../site/chapters/00-the-job-posting.html)

*Start here*

1. **The first block is the interview agenda.** Be able to talk for two minutes on every line of it. — [00](../site/chapters/00-the-job-posting.html)
2. **A gap in the second block is not a blocker** it is a question you should have an answer prepared for. — [00](../site/chapters/00-the-job-posting.html)
3. **Java, Spring Boot, JPA and REST are in all six adverts.** Everything else was in one or two. — [00](../site/chapters/00-the-job-posting.html)
4. **Know your RAL before the first call,** as a range, gross, annual. — [00](../site/chapters/00-the-job-posting.html)
5. **Answer the questions.** The chapters are the setup; retrieval is the mechanism. — [00](../site/chapters/00-the-job-posting.html)

## [Chapter 01 — The JVM, and what actually runs](../site/chapters/01-jvm-and-runtime.html)

*Part 1 — The language and the platform*

1. **javac barely optimises.** The compiler that matters is the JIT, and it runs later, with profile data. — [01](../site/chapters/01-jvm-and-runtime.html)
2. **Java gets faster as it runs.** Any benchmark without a warm-up phase is measuring the interpreter. — [01](../site/chapters/01-jvm-and-runtime.html)
3. **`ClassNotFoundException` is a runtime lookup that failed;** `NoClassDefFoundError` is a packaging problem — or a static initialiser that threw. — [01](../site/chapters/01-jvm-and-runtime.html)
4. **Install a JDK, not a JRE,** and know which vendor’s build you are running. — [01](../site/chapters/01-jvm-and-runtime.html)
5. **Start-up cost is the price of the JIT.** That is the trade Quarkus and native images reverse. — [01](../site/chapters/01-jvm-and-runtime.html)

## [Chapter 02 — Java 8 → 17 → 21, version by version](../site/chapters/02-java-versions.html)

*Part 1 — The language and the platform*

1. **The LTS line is 8, 11, 17, 21.** The number in an advert is a hint about the codebase’s age. — [02](../site/chapters/02-java-versions.html)
2. **Java 8 is lambdas, streams, Optional and java.time** and default methods, which existed so `Collection` could grow `stream()`. — [02](../site/chapters/02-java-versions.html)
3. **The 8→11 pain was removals and strong encapsulation,** not modules you had to adopt. — [02](../site/chapters/02-java-versions.html)
4. **`var` is compile-time inference.** There is no runtime difference at all. — [02](../site/chapters/02-java-versions.html)
5. **On Java 17, write Java 17.** A record instead of a thirty-line DTO is the cheapest signal you have. — [02](../site/chapters/02-java-versions.html)
6. **Virtual threads undercut the main argument for reactive.** Know that, even if the job is on 17. — [02](../site/chapters/02-java-versions.html)

## [Chapter 03 — Types, objects and equality](../site/chapters/03-types-and-objects.html)

*Part 1 — The language and the platform*

1. **Never `==` on wrappers.** The −128…127 cache makes it look correct in tests. — [03](../site/chapters/03-types-and-objects.html)
2. **Keys must be immutable** in the fields that feed `hashCode`. — [03](../site/chapters/03-types-and-objects.html)
3. **Unboxing a null wrapper throws NPE** on a line with no visible dereference. — [03](../site/chapters/03-types-and-objects.html)
4. **Immutability is shallow.** Copy mutable components in and out. — [03](../site/chapters/03-types-and-objects.html)

## [Chapter 04 — Collections, and choosing the right one](../site/chapters/04-collections.html)

*Part 1 — The language and the platform*

1. **`ArrayList` unless proven otherwise.** Cache locality beats the complexity table more often than people expect. — [04](../site/chapters/04-collections.html)
2. **`ArrayDeque`, not `LinkedList`,** when you need both ends. — [04](../site/chapters/04-collections.html)
3. **`contains` in a loop over a List is O(n²).** Use a Set. — [04](../site/chapters/04-collections.html)
4. **`ConcurrentHashMap` for shared maps** not `Hashtable`, not a synchronized wrapper. — [04](../site/chapters/04-collections.html)
5. **Size large maps up front.** Resizing rehashes everything. — [04](../site/chapters/04-collections.html)

## [Chapter 05 — Generics and erasure](../site/chapters/05-generics.html)

*Part 1 — The language and the platform*

1. **No `new T[]`, no `instanceof List<String>`,** no overloading that differs only by type argument. — [05](../site/chapters/05-generics.html)
2. **PECS.** Producer `extends`, consumer `super`. — [05](../site/chapters/05-generics.html)
3. **Generics are invariant** and that is what stops a cat entering your list of dogs. — [05](../site/chapters/05-generics.html)
4. **`@SuppressWarnings("unchecked")` is a request to think,** not a way to silence the compiler. — [05](../site/chapters/05-generics.html)

## [Chapter 06 — Lambdas, streams and Optional](../site/chapters/06-streams-lambdas.html)

*Part 1 — The language and the platform*

1. **A lambda needs a functional interface** exactly one abstract method. — [06](../site/chapters/06-streams-lambdas.html)
2. **`flatMap` when each element yields many;** `map` when it yields one. — [06](../site/chapters/06-streams-lambdas.html)
3. **`parallelStream()` shares the common pool.** Rarely right inside a web request. — [06](../site/chapters/06-streams-lambdas.html)
4. **`Optional` is a return type.** Not a field, not a parameter, never null. — [06](../site/chapters/06-streams-lambdas.html)
5. **`orElseGet`, not `orElse`,** when the fallback costs anything. — [06](../site/chapters/06-streams-lambdas.html)

## [Chapter 07 — Records, sealed types and pattern matching](../site/chapters/07-records-sealed-pattern.html)

*Part 1 — The language and the platform*

1. **A record is a transparent data carrier** with correct `equals` by construction. — [07](../site/chapters/07-records-sealed-pattern.html)
2. **Validate in the compact constructor,** and copy mutable components while you are there. — [07](../site/chapters/07-records-sealed-pattern.html)
3. **Sealed + switch gives exhaustiveness checking.** That is the reason to use it. — [07](../site/chapters/07-records-sealed-pattern.html)
4. **Enum = closed set of constants; sealed interface = closed set of shapes.** — [07](../site/chapters/07-records-sealed-pattern.html)
5. **On a Java 17 job, write Java 17.** The DTO is where it shows first. — [07](../site/chapters/07-records-sealed-pattern.html)

## [Chapter 08 — Exceptions, checked and otherwise](../site/chapters/08-exceptions.html)

*Part 1 — The language and the platform*

1. **Unchecked for programming errors, checked only when the caller can genuinely recover** and modern frameworks use unchecked throughout. — [08](../site/chapters/08-exceptions.html)
2. **Catch only what you can act on,** at the level that can act on it. — [08](../site/chapters/08-exceptions.html)
3. **Always pass the cause when wrapping.** Otherwise you delete the evidence. — [08](../site/chapters/08-exceptions.html)
4. **Never swallow `InterruptedException`.** Propagate, or restore the flag. — [08](../site/chapters/08-exceptions.html)
5. **`try-with-resources` always,** and know that it preserves the original exception. — [08](../site/chapters/08-exceptions.html)

## [Chapter 09 — Threads, executors and virtual threads](../site/chapters/09-concurrency.html)

*Part 1 — The language and the platform*

1. **`count++` is read-modify-write.** Use an atomic, or a lock. — [09](../site/chapters/09-concurrency.html)
2. **Executors, not `new Thread()`.** Execution policy belongs in one place. — [09](../site/chapters/09-concurrency.html)
3. **Bounded queues with an explicit rejection policy.** Unbounded turns overload into OOM. — [09](../site/chapters/09-concurrency.html)
4. **Virtual threads: one per task, never pooled.** — [09](../site/chapters/09-concurrency.html)
5. **Singleton beans are shared across request threads.** Keep them stateless. — [09](../site/chapters/09-concurrency.html)

## [Chapter 10 — Memory, garbage collection and the heap](../site/chapters/10-memory-gc.html)

*Part 1 — The language and the platform*

1. **Most objects die young.** That is why the heap is generational. — [10](../site/chapters/10-memory-gc.html)
2. **Use the default collector until a measurement disagrees.** G1 is a good default. — [10](../site/chapters/10-memory-gc.html)
3. **Exit code 137 with no stack trace is the OOMKiller,** not a Java error. — [10](../site/chapters/10-memory-gc.html)
4. **Set `MaxRAMPercentage` and leave headroom** under the container limit. — [10](../site/chapters/10-memory-gc.html)
5. **Heap dump first, opinions second.** — [10](../site/chapters/10-memory-gc.html)

## [Chapter 11 — The container: beans, scopes, lifecycle](../site/chapters/11-spring-container.html)

*Part 2 — Spring, from the container up*

1. **The container owns construction.** You describe beans; Spring builds the graph. — [11](../site/chapters/11-spring-container.html)
2. **Singleton is the default scope.** Mutable fields on a service are shared across every request. — [11](../site/chapters/11-spring-container.html)
3. **Prototype injected into a singleton is resolved once.** Use `ObjectProvider` for per-call instances. — [11](../site/chapters/11-spring-container.html)
4. **`@PostConstruct` runs before proxying.** Transactions there do not exist. — [11](../site/chapters/11-spring-container.html)

## [Chapter 12 — Dependency injection, done properly](../site/chapters/12-dependency-injection.html)

*Part 2 — Spring, from the container up*

1. **A single constructor needs no `@Autowired`** since Spring 4.3. — [12](../site/chapters/12-dependency-injection.html)
2. **A long constructor is a visible design smell.** Field injection hides it. — [12](../site/chapters/12-dependency-injection.html)
3. **`@Primary` for the default, `@Qualifier` for the exception,** a `List<T>` when you want all of them. — [12](../site/chapters/12-dependency-injection.html)
4. **A circular dependency is a design signal.** `@Lazy` silences the message. — [12](../site/chapters/12-dependency-injection.html)

## [Chapter 13 — Configuration, profiles and properties](../site/chapters/13-configuration-profiles.html)

*Part 2 — Spring, from the container up*

1. **One artefact, many environments.** The environment supplies the differences. — [13](../site/chapters/13-configuration-profiles.html)
2. **Later sources win:** command line > env vars > external files > packaged files. — [13](../site/chapters/13-configuration-profiles.html)
3. **`@ConfigurationProperties` over `@Value`** it fails at start-up instead of at first use. — [13](../site/chapters/13-configuration-profiles.html)
4. **Bind to a record** and add `@Validated`. — [13](../site/chapters/13-configuration-profiles.html)
5. **No secrets in the repository.** Git history outlives the deletion. — [13](../site/chapters/13-configuration-profiles.html)

## [Chapter 14 — Spring Boot and auto-configuration](../site/chapters/14-spring-boot-autoconfig.html)

*Part 2 — Spring, from the container up*

1. **A starter is a version opinion,** not code. That is most of Boot’s value. — [14](../site/chapters/14-spring-boot-autoconfig.html)
2. **Auto-configuration is conditional bean definition.** Define your own bean and it backs off. — [14](../site/chapters/14-spring-boot-autoconfig.html)
3. **`--debug` prints the condition evaluation report.** Use it instead of guessing. — [14](../site/chapters/14-spring-boot-autoconfig.html)
4. **Component scan starts at the main class’s package.** Siblings are invisible. — [14](../site/chapters/14-spring-boot-autoconfig.html)
5. **Expose actuator endpoints deliberately.** `/env` and `/heapdump` are not public information. — [14](../site/chapters/14-spring-boot-autoconfig.html)

## [Chapter 15 — Quarkus, and when it is chosen instead](../site/chapters/15-quarkus-vs-spring.html)

*Part 2 — Spring, from the container up*

1. **Quarkus moves wiring to build time.** Less reflection, less start-up work. — [15](../site/chapters/15-quarkus-vs-spring.html)
2. **Faster start, smaller footprint, lower peak throughput.** All three, honestly. — [15](../site/chapters/15-quarkus-vs-spring.html)
3. **It is a start-up-versus-steady-state question,** not a tribal one. — [15](../site/chapters/15-quarkus-vs-spring.html)
4. **Built on Jakarta standards** CDI, JAX-RS, JPA. A Spring developer reads it fine. — [15](../site/chapters/15-quarkus-vs-spring.html)
5. **Spring Boot 3 + GraalVM narrowed the gap.** Say so; it shows you are current. — [15](../site/chapters/15-quarkus-vs-spring.html)

## [Chapter 16 — REST controllers and the request cycle](../site/chapters/16-rest-controllers.html)

*Part 3 — The web tier*

1. **Security is a filter, before the dispatcher.** That is why `@ControllerAdvice` never sees auth failures. — [16](../site/chapters/16-rest-controllers.html)
2. **Thin controllers.** Map, validate, delegate, set the status code. — [16](../site/chapters/16-rest-controllers.html)
3. **`LazyInitializationException` during serialisation means the entity escaped the transaction.** — [16](../site/chapters/16-rest-controllers.html)
4. **ISO-8601 dates, `BigDecimal` money.** Configure once. — [16](../site/chapters/16-rest-controllers.html)

## [Chapter 17 — Designing a REST API people can use](../site/chapters/17-rest-design.html)

*Part 3 — The web tier*

1. **Nouns in the path, verbs from HTTP.** `POST /orders`, never `/createOrder`. — [17](../site/chapters/17-rest-design.html)
2. **POST is not idempotent.** Use an idempotency key and a unique constraint, not a pre-check. — [17](../site/chapters/17-rest-design.html)
3. **Cap page size server-side,** and prefer keyset pagination for large collections. — [17](../site/chapters/17-rest-design.html)
4. **Adding an optional field is not a breaking change.** Design so you rarely need v2. — [17](../site/chapters/17-rest-design.html)

## [Chapter 18 — Validation and error responses](../site/chapters/18-validation-errors.html)

*Part 3 — The web tier*

1. **Validate the DTO, not the entity.** Entity constraints fire at flush, in the wrong layer. — [18](../site/chapters/18-validation-errors.html)
2. **`@Valid` on the request body** turns bad input into a 400 before your code runs. — [18](../site/chapters/18-validation-errors.html)
3. **One `@RestControllerAdvice`,** one error shape, stack traces logged and never returned. — [18](../site/chapters/18-validation-errors.html)
4. **Malformed JSON and type mismatches are 400s.** A blanket `Exception` handler hides that. — [18](../site/chapters/18-validation-errors.html)
5. **RFC 7807, plus a correlation id.** Standard shape, traceable incident. — [18](../site/chapters/18-validation-errors.html)

## [Chapter 19 — GraphQL, and when it beats REST](../site/chapters/19-graphql.html)

*Part 3 — The web tier*

1. **GraphQL moves shape selection to the client.** That is the whole idea. — [19](../site/chapters/19-graphql.html)
2. **It costs you HTTP caching, endpoint rate limiting and status-code monitoring.** — [19](../site/chapters/19-graphql.html)
3. **N+1 is worse, not better.** `DataLoader` batching is mandatory, not optional. — [19](../site/chapters/19-graphql.html)
4. **Worth it for many differing clients;** overkill for one front end or a fixed integration contract. — [19](../site/chapters/19-graphql.html)
5. **Design the schema.** Do not expose the entity graph. — [19](../site/chapters/19-graphql.html)

## [Chapter 20 — Spring Security, JWT and OAuth2](../site/chapters/20-security-auth.html)

*Part 3 — The web tier*

1. **It is a filter chain, before the dispatcher.** Security errors need their own handlers. — [20](../site/chapters/20-security-auth.html)
2. **401 is “who are you”, 403 is “not allowed”.** Clients branch on the difference. — [20](../site/chapters/20-security-auth.html)
3. **`hasRole("ADMIN")` looks for `ROLE_ADMIN`.** The prefix is implicit. — [20](../site/chapters/20-security-auth.html)
4. **A JWT is signed, not secret, and cannot be revoked.** Short access token, revocable refresh token. — [20](../site/chapters/20-security-auth.html)
5. **Disable CSRF only for header-authenticated stateless APIs.** Cookie auth needs it. — [20](../site/chapters/20-security-auth.html)
6. **The SecurityContext is thread-local.** It does not follow you into `@Async`. — [20](../site/chapters/20-security-auth.html)

## [Chapter 21 — OpenAPI, contracts and generated clients](../site/chapters/21-openapi.html)

*Part 3 — The web tier*

1. **Generate the document from the code** and it cannot drift from the code. — [21](../site/chapters/21-openapi.html)
2. **Bean Validation annotations become schema constraints.** One more reason to use them. — [21](../site/chapters/21-openapi.html)
3. **Contract-first when the consumer is another team or company;** code-first for one internal client. — [21](../site/chapters/21-openapi.html)
4. **Generated clients unblock the caller** before your service exists. — [21](../site/chapters/21-openapi.html)
5. **A published bad API is still a bad API.** Swagger UI does not make it a design. — [21](../site/chapters/21-openapi.html)

## [Chapter 22 — JDBC, connection pools and what leaks](../site/chapters/22-jdbc-and-pools.html)

*Part 4 — Data*

1. **Always parameterise.** Separate channels for SQL and values; injection becomes structurally impossible. — [22](../site/chapters/22-jdbc-and-pools.html)
2. **Small pools are faster.** 10–20 is normal; 200 is a misunderstanding. — [22](../site/chapters/22-jdbc-and-pools.html)
3. **`maxLifetime` below the database and firewall idle timeouts,** or you hand out dead connections. — [22](../site/chapters/22-jdbc-and-pools.html)
4. **A leaked connection breaks other requests, not the one that leaked it.** — [22](../site/chapters/22-jdbc-and-pools.html)
5. **JPA for the domain, SQL for reporting.** Mixing them is not a failure. — [22](../site/chapters/22-jdbc-and-pools.html) · [24](../site/chapters/24-spring-data.html)

## [Chapter 23 — JPA and Hibernate: the object-relational bargain](../site/chapters/23-jpa-hibernate.html)

*Part 4 — Data*

1. **Everything LAZY,** and fetch explicitly per query. — [23](../site/chapters/23-jpa-hibernate.html)
2. **`LazyInitializationException` means the entity outlived its transaction.** Return a DTO. — [23](../site/chapters/23-jpa-hibernate.html)
3. **`open-in-view` hides the problem and holds a connection** for the whole request. — [23](../site/chapters/23-jpa-hibernate.html)
4. **No Lombok `@Data` on entities.** It walks your associations. — [23](../site/chapters/23-jpa-hibernate.html)
5. **Never mutate a managed entity you did not intend to save.** — [23](../site/chapters/23-jpa-hibernate.html)

## [Chapter 24 — Spring Data repositories](../site/chapters/24-spring-data.html)

*Part 4 — Data*

1. **Derived queries are parsed at start-up.** A wrong property name fails the boot, not the request. — [24](../site/chapters/24-spring-data.html)
2. **Past three conditions, write `@Query`.** The method name has stopped being documentation. — [24](../site/chapters/24-spring-data.html)
3. **Projections select fewer columns.** Often a bigger win than an index. — [24](../site/chapters/24-spring-data.html)
4. **`Specification` for optional filters,** never string concatenation. — [24](../site/chapters/24-spring-data.html)
5. **`@Modifying` leaves the persistence context stale.** Clear it. — [24](../site/chapters/24-spring-data.html)

## [Chapter 25 — Transactions, propagation and isolation](../site/chapters/25-transactions.html)

*Part 4 — Data*

1. **It is a proxy.** Self-invocation, `private` and `final` methods get no transaction, silently. — [25](../site/chapters/25-transactions.html)
2. **Catching without rethrowing means no rollback.** — [25](../site/chapters/25-transactions.html)
3. **`REQUIRES_NEW` for work that must survive the caller’s failure** audit rows, outbox entries. — [25](../site/chapters/25-transactions.html)
4. **Keep transactions short.** They hold a connection (chapter 22) for their whole life. — [25](../site/chapters/25-transactions.html)
5. **`@Version` beats a higher isolation level** for concurrent updates. — [25](../site/chapters/25-transactions.html)

## [Chapter 26 — The N+1 problem and fetching strategies](../site/chapters/26-n-plus-one.html)

*Part 4 — Data*

1. **Turn on SQL logging in development.** N+1 is invisible until you count queries. — [26](../site/chapters/26-n-plus-one.html)
2. **Never fix it with EAGER.** That answers a per-query question globally, and gets worse. — [26](../site/chapters/26-n-plus-one.html)
3. **One collection fetch per query.** Two is a cartesian product. — [26](../site/chapters/26-n-plus-one.html)
4. **HHH000104 means it is paginating in memory.** Page the ids, then fetch. — [26](../site/chapters/26-n-plus-one.html)
5. **A projection sidesteps the whole problem.** — [26](../site/chapters/26-n-plus-one.html)

## [Chapter 27 — Oracle, and the SQL you will actually meet](../site/chapters/27-oracle-and-sql.html)

*Part 4 — Data*

1. **Oracle: `''` is `NULL`.** Comparisons to empty string match nothing. — [27](../site/chapters/27-oracle-and-sql.html)
2. **Sequences, not auto-increment.** Match `allocationSize` to `INCREMENT BY`; expect gaps. — [27](../site/chapters/27-oracle-and-sql.html)
3. **`ROWNUM` is applied before `ORDER BY`.** The naive top-N query is wrong. — [27](../site/chapters/27-oracle-and-sql.html)
4. **A function on an indexed column disables the index.** — [27](../site/chapters/27-oracle-and-sql.html)
5. **Composite indexes work left-to-right.** Leftmost prefix. — [27](../site/chapters/27-oracle-and-sql.html)
6. **Database logic is not automatically wrong.** Get it into git and under test. — [27](../site/chapters/27-oracle-and-sql.html)

## [Chapter 28 — MongoDB, and when a document store earns its place](../site/chapters/28-mongodb.html)

*Part 4 — Data*

1. **Embed what is owned and bounded; reference what is shared.** Model for the query you run most. — [28](../site/chapters/28-mongodb.html)
2. **Schemaless is not schema-free.** Validate, and version your documents. — [28](../site/chapters/28-mongodb.html)
3. **No persistence context, no dirty checking.** Nothing saves until you save it. — [28](../site/chapters/28-mongodb.html)
4. **Needing multi-document transactions routinely is a modelling signal.** — [28](../site/chapters/28-mongodb.html)
5. **Relational for invariants, documents for aggregates.** Both, on purpose. — [28](../site/chapters/28-mongodb.html)

## [Chapter 29 — Schema migrations with Flyway and Liquibase](../site/chapters/29-migrations.html)

*Part 4 — Data*

1. **Migrations are reviewed artefacts.** A diff a human read before it touched production. — [29](../site/chapters/29-migrations.html)
2. **Flyway’s checksum refusal is a feature.** Never edit an applied migration; add a new one. — [29](../site/chapters/29-migrations.html)
3. **Migrate in the pipeline, not at start-up.** Instances race, and runtime accounts should not hold DDL rights. — [29](../site/chapters/29-migrations.html)
4. **Expand and contract.** Every change survives one release of both versions. — [29](../site/chapters/29-migrations.html)

## [Chapter 30 — Microservices: the shape and the cost](../site/chapters/30-microservices.html)

*Part 5 — Many services*

1. **The main benefit is organisational.** Independent deployment by independent teams. — [30](../site/chapters/30-microservices.html)
2. **A monolith is the right default for a small team.** Split in response to a named problem. — [30](../site/chapters/30-microservices.html)
3. **Split by bounded context,** never by technical layer. — [30](../site/chapters/30-microservices.html)
4. **Shared database means one service in two deployments.** — [30](../site/chapters/30-microservices.html)
5. **You trade local calls and transactions** for partial failure and eventual consistency. — [30](../site/chapters/30-microservices.html)
6. **Merging two services back together is a valid answer.** — [30](../site/chapters/30-microservices.html)

## [Chapter 31 — Spring Cloud: config, discovery, gateway](../site/chapters/31-spring-cloud.html)

*Part 5 — Many services*

1. **Kubernetes has absorbed config and discovery.** Do not add Eureka to a cluster that already does it. — [31](../site/chapters/31-spring-cloud.html)
2. **Config Server’s git history still earns its place** in audited environments. — [31](../site/chapters/31-spring-cloud.html)
3. **The gateway is the piece that survives** auth, rate limiting, aggregation. — [31](../site/chapters/31-spring-cloud.html)
4. **A gateway making business decisions is a coordination point.** Keep it dumb. — [31](../site/chapters/31-spring-cloud.html)
5. **Every inter-service call needs a timeout.** The default is effectively forever. — [31](../site/chapters/31-spring-cloud.html)

## [Chapter 32 — Timeouts, retries and circuit breakers](../site/chapters/32-resilience.html)

*Part 5 — Many services*

1. **Every outbound call gets a timeout,** shorter than your caller’s. — [32](../site/chapters/32-resilience.html)
2. **Retry only idempotent operations, only on transient failures.** — [32](../site/chapters/32-resilience.html)
3. **Exponential backoff with jitter.** Without jitter you have built a herd. — [32](../site/chapters/32-resilience.html)
4. **A breaker turns a slow failure into a fast one,** which is what protects you. — [32](../site/chapters/32-resilience.html)
5. **An empty-list fallback is worse than an error.** Wrong data outlives an outage. — [32](../site/chapters/32-resilience.html)

## [Chapter 33 — Messaging from inside a Spring application](../site/chapters/33-messaging.html)

*Part 5 — Many services*

1. **Async buys latency, decoupling and load levelling,** and costs you eventual consistency. — [33](../site/chapters/33-messaging.html)
2. **Queue for work distribution, log for event streams.** Replay is the deciding capability. — [33](../site/chapters/33-messaging.html)
3. **Delivery is at-least-once.** Handlers must be idempotent. — [33](../site/chapters/33-messaging.html)
4. **A poison message blocks its partition.** Configure a dead-letter route before you need one. — [33](../site/chapters/33-messaging.html)
5. **The listener thread has no SecurityContext and no request scope.** — [33](../site/chapters/33-messaging.html)
6. **The message key chooses the partition,** and therefore the ordering. — [33](../site/chapters/33-messaging.html)

## [Chapter 34 — OPC UA, MQTT and Modbus](../site/chapters/34-industrial-protocols.html)

*Part 5 — Many services*

1. **Modbus is registers and a PDF.** No types, no discovery, no security — and check the word order. — [34](../site/chapters/34-industrial-protocols.html)
2. **MQTT for telemetry over bad links;** QoS, retained messages, last will. — [34](../site/chapters/34-industrial-protocols.html)
3. **OPC UA for new work** a typed address space with security, and a source timestamp. — [34](../site/chapters/34-industrial-protocols.html)
4. **Never expose register numbers in your API.** Translate at the edge. — [34](../site/chapters/34-industrial-protocols.html)
5. **Timestamp at the source.** Arrival time lies after an outage. — [34](../site/chapters/34-industrial-protocols.html)
6. **Poll rates are negotiated, not chosen.** A PLC is not a web server. — [34](../site/chapters/34-industrial-protocols.html)

## [Chapter 35 — Logs, metrics and traces](../site/chapters/35-observability.html)

*Part 5 — Many services*

1. **Metrics to alert, logs to explain one case, traces to find the slow hop.** — [35](../site/chapters/35-observability.html)
2. **OpenTelemetry** so the backend is replaceable without touching code. — [35](../site/chapters/35-observability.html)
3. **One trace id, propagated everywhere** including into message headers. — [35](../site/chapters/35-observability.html)
4. **Context is thread-local.** It does not follow you into an executor. — [35](../site/chapters/35-observability.html)
5. **Never alert on an average.** It hides the users who are suffering. — [35](../site/chapters/35-observability.html)

## [Chapter 36 — JUnit 5 and what a unit test is for](../site/chapters/36-unit-testing.html)

*Part 6 — Proving it works*

1. **Tests are for the person who changes this in eight months.** — [36](../site/chapters/36-unit-testing.html)
2. **Hard to test usually means hard to use.** Listen to that. — [36](../site/chapters/36-unit-testing.html)
3. **One reason to fail, and say it in the name.** — [36](../site/chapters/36-unit-testing.html)
4. **Test behaviour, not implementation.** Asserting on private calls breaks on refactor and catches nothing. — [36](../site/chapters/36-unit-testing.html)
5. **Edges: empty, null, zero, negative, boundary, duplicate.** — [36](../site/chapters/36-unit-testing.html)
6. **Coverage is a floor detector.** Mutation testing is the real measure. — [36](../site/chapters/36-unit-testing.html)

## [Chapter 37 — Mockito, test doubles and over-mocking](../site/chapters/37-mocking.html)

*Part 6 — Proving it works*

1. **Prefer state verification.** `verify` only when the interaction is the behaviour. — [37](../site/chapters/37-mocking.html)
2. **Never mock a type you do not own.** Wrap it and mock your wrapper. — [37](../site/chapters/37-mocking.html)
3. **Mock the edges** network, clock, filesystem, broker. Leave the domain real. — [37](../site/chapters/37-mocking.html)
4. **Inject a `Clock`.** Time is a dependency like any other. — [37](../site/chapters/37-mocking.html)
5. **An unused stub is a message.** The path it described is gone. — [37](../site/chapters/37-mocking.html)
6. **If everything is mocked, the test verifies the mocks.** — [37](../site/chapters/37-mocking.html)

## [Chapter 38 — Testing a Spring application](../site/chapters/38-spring-testing.html)

*Part 6 — Proving it works*

1. **Most tests need no Spring at all.** Constructor injection makes that true. — [38](../site/chapters/38-spring-testing.html)
2. **Slices over `@SpringBootTest`.** `@WebMvcTest`, `@DataJpaTest`, then everything else. — [38](../site/chapters/38-spring-testing.html)
3. **Context caching is per configuration.** Every variation is another context. — [38](../site/chapters/38-spring-testing.html)
4. **H2 is not Oracle.** Testing against it tests a database you do not ship. — [38](../site/chapters/38-spring-testing.html)
5. **Slow suites stop being run.** That is how the net disappears. — [38](../site/chapters/38-spring-testing.html)

## [Chapter 39 — Testcontainers and integration tests worth trusting](../site/chapters/39-testcontainers.html)

*Part 6 — Proving it works*

1. **Test against the database you deploy on.** H2 is a different product. — [39](../site/chapters/39-testcontainers.html)
2. **A container per run beats a shared dev database.** Isolated, reproducible, disposable. — [39](../site/chapters/39-testcontainers.html)
3. **`@ServiceConnection`** removes the property plumbing. — [39](../site/chapters/39-testcontainers.html)
4. **Run your real migrations against the container.** Then they are tested too. — [39](../site/chapters/39-testcontainers.html)
5. **Reuse locally, never in CI.** — [39](../site/chapters/39-testcontainers.html)
6. **Name them `*IT` and run them separately.** Fast suite stays fast. — [39](../site/chapters/39-testcontainers.html)

## [Chapter 40 — Maven and Gradle](../site/chapters/40-maven-gradle.html)

*Part 7 — Build, ship, run*

1. **Always the wrapper.** The build tool version belongs in the repository. — [40](../site/chapters/40-maven-gradle.html)
2. **Maven: nearest wins. Gradle: highest wins.** Neither is intuitive; know which you are in. — [40](../site/chapters/40-maven-gradle.html)
3. **`NoSuchMethodError` at runtime is a version conflict,** not a code bug. — [40](../site/chapters/40-maven-gradle.html)
4. **Pin in `dependencyManagement`** instead of scattering exclusions. — [40](../site/chapters/40-maven-gradle.html)
5. **Let the Boot BOM choose versions.** Overriding one needs a reason. — [40](../site/chapters/40-maven-gradle.html)
6. **Scopes are load-bearing.** `provided` means somebody else must actually provide it. — [40](../site/chapters/40-maven-gradle.html)

## [Chapter 41 — Containers, and a JVM image that is not 700 MB](../site/chapters/41-docker.html)

*Part 7 — Build, ship, run*

1. **Layer the jar.** Dependencies and application code do not change at the same rate. — [41](../site/chapters/41-docker.html)
2. **Multi-stage builds** keep the JDK and source out of the shipped image. — [41](../site/chapters/41-docker.html)
3. **`MaxRAMPercentage`, not `-Xmx`.** The flag must follow the limit. — [41](../site/chapters/41-docker.html)
4. **Exit code 137 is the OOMKiller.** Leave headroom outside the heap. — [41](../site/chapters/41-docker.html)
5. **Non-root `USER`, always** and OpenShift will enforce it for you. — [41](../site/chapters/41-docker.html)
6. **`spring-boot:build-image`** if you would rather not own a Dockerfile. — [41](../site/chapters/41-docker.html)

## [Chapter 42 — Kubernetes and OpenShift](../site/chapters/42-kubernetes.html)

*Part 7 — Build, ship, run*

1. **Deployment, Service, ConfigMap, Secret.** That is most of what you touch. — [42](../site/chapters/42-kubernetes.html)
2. **Startup probes exist because JVMs boot slowly.** — [42](../site/chapters/42-kubernetes.html)
3. **Memory limit above the heap, with headroom.** Requests schedule, limits kill. — [42](../site/chapters/42-kubernetes.html)
4. **Graceful shutdown, or every deploy drops in-flight requests.** — [42](../site/chapters/42-kubernetes.html)
5. **OpenShift runs you as a random non-root UID.** Build the image for that. — [42](../site/chapters/42-kubernetes.html)

## [Chapter 43 — AWS: EC2, S3 and Route 53](../site/chapters/43-aws.html)

*Part 7 — Build, ship, run*

1. **S3 is object storage, not a filesystem.** Presigned URLs keep bytes out of your JVM. — [43](../site/chapters/43-aws.html)
2. **Roles, never long-lived keys.** The SDK finds temporary credentials by itself. — [43](../site/chapters/43-aws.html)
3. **Least privilege with specific ARNs.** `s3:*` on `*` is a finding. — [43](../site/chapters/43-aws.html)
4. **Secrets Manager or Parameter Store** for the database password. — [43](../site/chapters/43-aws.html)
5. **Egress and cross-AZ traffic cost money.** Inbound does not. — [43](../site/chapters/43-aws.html)
6. **eu-south-1 is Milan** relevant when data residency is a requirement. — [43](../site/chapters/43-aws.html)

## [Chapter 44 — Pipelines, and migrations in them](../site/chapters/44-ci-cd.html)

*Part 7 — Build, ship, run*

1. **Tag with the git SHA.** `latest` is not a version. — [44](../site/chapters/44-ci-cd.html)
2. **Order stages by cost.** Slow feedback gets routed around. — [44](../site/chapters/44-ci-cd.html)
3. **Migrations are a gated pipeline step,** not application start-up. — [44](../site/chapters/44-ci-cd.html)
4. **The runtime account should not hold DDL rights.** — [44](../site/chapters/44-ci-cd.html)
5. **Rollback reverses code, not schema.** Expand and contract, always. — [44](../site/chapters/44-ci-cd.html)

## [Chapter 45 — Java EE, Jakarta and the code you will inherit](../site/chapters/45-legacy-java-ee.html)

*Part 8 — What the region actually runs*

1. **EJB, CDI and container-managed transactions are the same concerns Spring later solved.** — [45](../site/chapters/45-legacy-java-ee.html)
2. **JSF is stateful, server-side and nothing like an SPA.** Do not reason about it as one. — [45](../site/chapters/45-legacy-java-ee.html)
3. **javax → jakarta is the reason many systems are stuck.** Boot 3 requires the new namespace. — [45](../site/chapters/45-legacy-java-ee.html)
4. **Rename tools miss strings** XML, persistence.xml, reflection. — [45](../site/chapters/45-legacy-java-ee.html)
5. **Strangler, not rewrite.** Facade in front, move one capability at a time. — [45](../site/chapters/45-legacy-java-ee.html)
6. **Characterisation tests first.** The behaviour is the specification. — [45](../site/chapters/45-legacy-java-ee.html)

## [Chapter 46 — The Angular/TypeScript front end you will touch](../site/chapters/46-angular-frontend.html)

*Part 8 — What the region actually runs*

1. **Components own view state, services own data.** DI works like Spring’s. — [46](../site/chapters/46-angular-frontend.html)
2. **Standalone components and signals** know them, or you sound out of date. — [46](../site/chapters/46-angular-frontend.html)
3. **Observables are lazy.** No subscription, no request. — [46](../site/chapters/46-angular-frontend.html)
4. **Prefer the `async` pipe** over manual subscribe-and-leak. — [46](../site/chapters/46-angular-frontend.html)
5. **`switchMap` for typeaheads.** `mergeMap` lets stale results win. — [46](../site/chapters/46-angular-frontend.html)
6. **A CORS error is often a 401 on the preflight.** Configure CORS in Spring. — [46](../site/chapters/46-angular-frontend.html)

## [Chapter 47 — Gestionali, ERP integrations and the Italian software house](../site/chapters/47-gestionali.html)

*Part 8 — What the region actually runs*

1. **Gestionale describes the job.** Learn the domain vocabulary before the first call. — [47](../site/chapters/47-gestionali.html)
2. **Fatturazione elettronica is XML through SDI,** asynchronous, with receipts and deadlines. — [47](../site/chapters/47-gestionali.html)
3. **Invoice numbering is a legal constraint,** not an application detail. — [47](../site/chapters/47-gestionali.html)
4. **Integrations arrive as CSV, SFTP or a database view.** Meet the other side where it is. — [47](../site/chapters/47-gestionali.html)
5. **The spreadsheet is the specification.** Ask domain questions early, and write the answers down. — [47](../site/chapters/47-gestionali.html)
6. **Curiosity about the domain is a differentiator.** Most candidates only ask about the stack. — [47](../site/chapters/47-gestionali.html)

## [Chapter 48 — Agile, Scrum and the ceremonies](../site/chapters/48-agile-scrum.html)

*Part 9 — The human requirements*

1. **Stand-up is synchronisation, not a status report.** Lead with blockers. — [48](../site/chapters/48-agile-scrum.html)
2. **Refinement is where the leverage is.** Ask the question before anyone estimates. — [48](../site/chapters/48-agile-scrum.html)
3. **Points are relative size.** Velocity plans a team; it does not measure a person. — [48](../site/chapters/48-agile-scrum.html)
4. **“I need a spike” beats a guess.** And flag slippage early. — [48](../site/chapters/48-agile-scrum.html)
5. **Small PRs, and commit messages that say why.** — [48](../site/chapters/48-agile-scrum.html)
6. **Ask after half an hour stuck** not immediately, not the next day. — [48](../site/chapters/48-agile-scrum.html)

## [Chapter 49 — The English the advert means](../site/chapters/49-english.html)

*Part 9 — The human requirements*

1. **B2 is the bar: follow, be understood, write clearly.** The accent is not the problem. — [49](../site/chapters/49-english.html)
2. **Ask for repetition without apologising.** Silence is the failure they screen for. — [49](../site/chapters/49-english.html)
3. **Learn fixed phrases for disagreeing, buying time and reporting delay.** — [49](../site/chapters/49-english.html)
4. **Eventually ≠ eventualmente; actually ≠ attualmente.** — [49](../site/chapters/49-english.html)
5. **Conclusion first, then detail.** Short sentences are good technical English. — [49](../site/chapters/49-english.html)
6. **Async: say what you need and by when.** — [49](../site/chapters/49-english.html)

## [Chapter 50 — The CV and the ATS](../site/chapters/50-the-cv.html)

*Part 9 — The human requirements*

1. **Single column, real text, standard headings.** The parser is not clever. — [50](../site/chapters/50-the-cv.html)
2. **Use the advert’s exact words for things you have really done.** Alignment, never stuffing. — [50](../site/chapters/50-the-cv.html)
3. **Verify the extracted text layer.** Layout changes can reorder it silently. — [50](../site/chapters/50-the-cv.html)
4. **Outcome plus evidence, not responsibilities.** — [50](../site/chapters/50-the-cv.html)
5. **Every number invites a question.** Only claim what you can defend. — [50](../site/chapters/50-the-cv.html)
6. **Photo for Italian SMEs, none for international.** Keep both versions maintained. — [50](../site/chapters/50-the-cv.html)

## [Chapter 51 — The interview](../site/chapters/51-the-interview.html)

*Part 9 — The human requirements*

1. **Two minutes for mi parli di lei,** ending on why this role. — [51](../site/chapters/51-the-interview.html)
2. **Answer with a structure** mechanism, consequence, example. — [51](../site/chapters/51-the-interview.html)
3. **“I do not know, but…” beats a confident guess.** Every time. — [51](../site/chapters/51-the-interview.html)
4. **Think out loud.** The process is what is being assessed. — [51](../site/chapters/51-the-interview.html)
5. **Never oversell.** An inflated claim makes your true ones suspect. — [51](../site/chapters/51-the-interview.html)
6. **RAL as a gross annual range,** and ask about CCNL, level and mensilità. — [51](../site/chapters/51-the-interview.html)
7. **Always have questions.** Ask how a change reaches production. — [51](../site/chapters/51-the-interview.html)

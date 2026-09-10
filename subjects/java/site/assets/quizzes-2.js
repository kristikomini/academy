/* ==========================================================================
   quizzes-2.js — the question bank, part 2.

   Split across three files only so each stays editable. All three merge into
   one map keyed by chapter id.

   THE RULE THAT IS NOT NEGOTIABLE:
   A question's id is "<chapter-id>#<index>", and the index is its position in
   this array. That id is the key a learner's spaced-repetition schedule is
   stored under. APPEND ONLY. Never reorder, never delete. Reordering silently
   reassigns somebody's review history to the wrong questions, and nothing will
   tell you it happened. quiz-ids.lock exists to catch exactly this.

   `why` is shown on CORRECT answers too. Feedback that only appears on failure
   teaches people to guess and check.

   Every stem must stand alone two weeks later, out of context — each question
   doubles as a flashcard. "Which of these is true?" is a bad stem for that
   reason; name the subject.
   ========================================================================== */

window.QUIZZES = Object.assign(window.QUIZZES || {}, {

  /* ------------------------------------------------------- 18-validation-errors --- */
  "18-validation-errors": [
    { q: "Where should Bean Validation constraints be placed in a Spring application?",
      a: ["On the JPA entity, so nothing invalid can be persisted", "On the request DTO, so invalid input becomes a 400 before the method body runs", "In the repository interface", "In a filter, before the DispatcherServlet"],
      c: 1,
      why: "Entity-level constraints run at flush time, deep inside a transaction, which turns a user input problem into a persistence exception at the wrong layer with a much worse message." },

    { q: "What does adding @Valid to a @RequestBody parameter cause?",
      a: ["The body is sanitised before binding", "A constraint violation becomes a MethodArgumentNotValidException before your method body runs", "The request is rejected if the content type is wrong", "Jackson validates the JSON against a schema"],
      c: 1,
      why: "@Validated on the class enables the same for path and request parameters. The point is that the failure happens before your code, with a structured cause you can map to a response." },

    { q: "Which Spring component centralises the mapping from exception type to HTTP response?",
      a: ["@ControllerAdvice or @RestControllerAdvice with @ExceptionHandler methods", "A servlet Filter", "The DispatcherServlet's error page mapping", "@ResponseStatus on each exception class"],
      c: 0,
      why: "One place, one error shape. @ResponseStatus works for simple cases but cannot build a body, and scattering try/catch through controllers produces five different error formats." },

    { q: "Why does a @RestControllerAdvice not handle authentication failures?",
      a: ["Authentication exceptions are Errors, not Exceptions", "They occur in the security filter chain, before the DispatcherServlet, so the advice never sees them", "Spring Security disables the advice", "They are handled by the servlet container"],
      c: 1,
      why: "You need an AuthenticationEntryPoint for 401 and an AccessDeniedHandler for 403. Forgetting this is why an API returns tidy JSON errors for everything except a bad token." },

    { q: "A blanket @ExceptionHandler for Exception returning 500 causes which specific problem?",
      a: ["It prevents logging", "It swallows Spring's meaningful exceptions, so malformed JSON and type mismatches become 500s instead of 400s", "It breaks content negotiation", "It disables validation"],
      c: 1,
      why: "HttpMessageNotReadableException and MethodArgumentTypeMismatchException are client mistakes. Reporting them as server faults destroys your ability to alert on real ones." },

    { q: "What is RFC 7807 in the context of a REST API?",
      a: ["The HTTP caching specification", "A standard problem-details format, with type, title, status, detail and instance", "The OAuth2 device flow", "A JSON schema dialect"],
      c: 1,
      why: "Spring 6 and Boot 3 support it natively through ProblemDetail. Using a standard shape means clients and other teams already know how to read your errors." },

    { q: "Why should a stack trace never appear in an HTTP error response?",
      a: ["It makes the response too large", "It discloses framework versions and package layout to an attacker", "It is not valid JSON", "It breaks the RFC 7807 schema"],
      c: 1,
      why: "Log it server-side, where it is useful, and return a correlation id instead. That gives support everything they need without publishing your internals." },

    { q: "What should be included in every error response so an incident becomes traceable?",
      a: ["The exception class name", "A correlation id that also appears in the logs", "The database query that failed", "The name of the server that handled the request"],
      c: 1,
      why: "It costs one field and turns 'it failed this morning' into an exact log query. It is worth more than most dashboards and is trivially cheap." },
  ],

  /* ------------------------------------------------------- 19-graphql --- */
  "19-graphql": [
    { q: "What problem does GraphQL primarily address compared with REST?",
      a: ["Authentication and authorisation", "Over-fetching and under-fetching, by letting the client select the shape it needs", "Transport efficiency, by using a binary protocol", "Schema evolution"],
      c: 1,
      why: "One endpoint, a typed schema, and a query language for selection. It removes the round trips a screen needs to assemble one view, at costs that are equally real." },

    { q: "Why does HTTP caching stop working with GraphQL?",
      a: ["Responses are compressed", "Everything is a POST to a single URL, so CDN and browser caching have nothing to key on", "The schema changes too often", "GraphQL forbids cache headers"],
      c: 1,
      why: "You replace it with application-level caching, which you now own. It is the first of four costs worth naming, alongside rate limiting, N+1 and status-code monitoring." },

    { q: "Why does the N+1 problem get worse under GraphQL rather than better?",
      a: ["GraphQL disables ORM caching", "Resolvers are called per field per item, so a nested selection multiplies queries", "The schema forces eager loading", "It does not; GraphQL batches automatically"],
      c: 1,
      why: "A DataLoader that batches within a request is the standard remedy, and it is mandatory rather than optional. Without it a nested query walks your database one row at a time." },

    { q: "How do GraphQL errors typically appear, and why does that matter operationally?",
      a: ["As 500 responses, which monitoring already handles", "As HTTP 200 with an errors array, so monitoring built on status codes goes blind", "As 400 responses with a problem-details body", "They are not returned; the query simply yields null"],
      c: 1,
      why: "Alerting and dashboards keyed on status codes report a healthy service while every request is failing. You have to instrument the errors array explicitly." },

    { q: "When does GraphQL genuinely pay for its costs?",
      a: ["Whenever the API is public", "With many heterogeneous clients whose data needs differ and change, such as mobile plus web plus partners", "For machine-to-machine integration with a fixed contract", "For any API with more than ten endpoints"],
      c: 1,
      why: "For one front end talking to one backend, or a fixed integration contract, REST is simpler and the operational tooling already exists. Naming the costs is what makes the recommendation credible." },

    { q: "Why is exposing your entity graph directly as the GraphQL schema a mistake?",
      a: ["It is slower to resolve", "It recreates the coupling DTOs were meant to break, and lets clients traverse relationships you never meant to publish", "GraphQL cannot represent JPA relationships", "The schema would be too large to introspect"],
      c: 1,
      why: "The schema is a contract you design, not a projection of your tables. It is the same argument as never returning an entity from a REST controller." },

    { q: "In Spring, which annotations map schema fields to methods in spring-boot-starter-graphql?",
      a: ["@GetMapping and @PostMapping", "@QueryMapping and @SchemaMapping", "@GraphQLQuery and @GraphQLField", "@Resolver and @Field"],
      c: 1,
      why: "The mental shift is that you implement resolvers per field rather than handlers per URL, which is also why the N+1 behaviour differs so much from REST." },

    { q: "Why is per-endpoint rate limiting meaningless for a GraphQL API?",
      a: ["Because GraphQL requests are always small", "Because there is one endpoint, so you need query cost analysis and depth limiting instead", "Because rate limiting happens in the schema layer", "Because clients are authenticated per query"],
      c: 1,
      why: "Without cost analysis, one client can submit a deeply nested query that walks your whole database in a single request that looks, to any per-endpoint limiter, exactly like every other one." },
  ],

  /* ------------------------------------------------------- 20-security-auth --- */
  "20-security-auth": [
    { q: "What does hasRole(\"ADMIN\") actually check for in Spring Security?",
      a: ["An authority named ADMIN", "An authority named ROLE_ADMIN, because the prefix is added for you", "A user whose username is ADMIN", "A claim named role with value ADMIN"],
      c: 1,
      why: "Forgetting the implicit prefix is the single most common reason a correctly written rule denies everyone. Use hasAuthority if you would rather be explicit about the string." },

    { q: "What is the difference between HTTP 401 and 403?",
      a: ["401 means the resource does not exist; 403 means it is deleted", "401 means not authenticated; 403 means authenticated but not permitted", "401 is for APIs; 403 is for browsers", "They are interchangeable"],
      c: 1,
      why: "A client can act on the difference: 401 means obtain credentials and retry, 403 means do not bother. Spring Security signals them through AuthenticationEntryPoint and AccessDeniedHandler respectively." },

    { q: "Why can a JWT not be revoked before it expires?",
      a: ["Because the signature cannot be recomputed", "Because validation is local: the server checks the signature and never consults shared state", "Because the token is encrypted", "It can be revoked, using the jti claim"],
      c: 1,
      why: "That is the price of statelessness. The standard mitigation is a short-lived access token plus a long-lived refresh token that is stateful and revocable, which is what the accounts service in this repository does." },

    { q: "What is true about the payload of a JWT?",
      a: ["It is encrypted and unreadable without the key", "It is signed but not encrypted, so anyone holding the token can read it", "It is hashed, so it cannot be reversed", "It is compressed and base64-encoded, which obscures it"],
      c: 1,
      why: "Signing proves integrity and origin, not confidentiality. Never put anything in a JWT that you would not publish." },

    { q: "When is disabling CSRF protection correct in Spring Security?",
      a: ["Always, for any REST API", "For a stateless API authenticated by an Authorization header, and not when authentication rides on a cookie", "Never", "Only in development profiles"],
      c: 1,
      why: "The browser attaches cookies automatically, which is exactly what CSRF exploits. csrf().disable() appears in nearly every tutorial and is wrong the moment a cookie carries the session." },

    { q: "Where should method-level authorisation rules such as 'the owner of this order, or an admin' be expressed?",
      a: ["In URL rules with requestMatchers", "With @PreAuthorize, because the rule is about a domain object rather than a path", "In a servlet filter", "In the controller, with an if statement"],
      c: 1,
      why: "URL rules are coarse and cheap and belong at the edge. Anything referring to the object being acted on cannot be expressed as a path pattern." },

    { q: "Why is the SecurityContext not available inside an @Async method by default?",
      a: ["Async methods run before the filter chain", "The SecurityContext is thread-local, so it does not propagate to another thread unless the strategy is configured to inherit", "Spring clears it after the controller returns", "@Async disables security"],
      c: 1,
      why: "It is the classic cause of 'works in the controller, anonymous in the background job'. The same thread-local caveat applies to the tracing context in chapter 35." },

    { q: "Storing a JWT in browser localStorage exposes it to which attack, and what is the alternative trade-off?",
      a: ["CSRF; the alternative is a header, which avoids it", "XSS; an HttpOnly cookie avoids that and reintroduces CSRF", "Clickjacking; the alternative is a frame-ancestors policy", "Session fixation; the alternative is rotating the token"],
      c: 1,
      why: "There is no option with neither risk, only a choice about which one you defend against and how. Saying that plainly is what shows you have actually deployed something." },
  ],

  /* ------------------------------------------------------- 21-openapi --- */
  "21-openapi": [
    { q: "What is the main advantage of generating an OpenAPI document from the code rather than writing it by hand?",
      a: ["It produces a smaller document", "It cannot drift from the implementation, because it is derived from the same code that serves the requests", "It is required by the specification", "It allows the API to be versioned automatically"],
      c: 1,
      why: "Hand-written API documentation in a wiki is wrong within weeks and nobody notices. springdoc inspects controllers, DTOs and validation annotations to produce it." },

    { q: "What do your Bean Validation annotations contribute to a generated OpenAPI document?",
      a: ["Nothing; they are runtime only", "They become schema constraints, so the published contract states the same rules the server enforces", "They generate example values", "They define the security schemes"],
      c: 1,
      why: "It is a small, real reason to prefer @NotBlank over a hand-written null check: the constraint is then documented and enforced from one declaration." },

    { q: "When is contract-first the better choice over code-first?",
      a: ["Always, because the contract is the source of truth", "When the consumer is another team or company on a different release cycle, so the contract can be agreed before either side implements", "Only for internal APIs", "When the API has more than twenty endpoints"],
      c: 1,
      why: "Code-first is faster for a service with one internal consumer. Contract-first unblocks the calling team, which is exactly advert 1's industrial-integration situation." },

    { q: "What does generating a typed client from an OpenAPI document buy the consuming team?",
      a: ["Faster HTTP calls", "A renamed field breaks their build rather than their page, and they are not blocked waiting for your service to exist", "Automatic retries and circuit breaking", "Server-side validation"],
      c: 1,
      why: "Moving an integration failure from runtime to compile time is the whole value. It is the same argument as the Angular chapter's generated TypeScript client." },

    { q: "Does publishing a Swagger UI make an API well designed?",
      a: ["Yes, since the contract is now explicit", "No: generation removes the drift problem, not the design problem", "Yes, provided all endpoints are documented", "Only if the document validates against the specification"],
      c: 1,
      why: "springdoc will faithfully publish an endpoint called getOrdersList returning entities with lazy proxies, and the page will make it look official. Chapter 17 is the design part." },

    { q: "Which library produces an OpenAPI document and Swagger UI for a Spring Boot application?",
      a: ["springfox", "springdoc-openapi", "swagger-core alone", "spring-restdocs"],
      c: 1,
      why: "springfox is effectively unmaintained for modern Boot versions. spring-restdocs is a different and complementary idea: documentation generated from passing tests rather than from annotations." },

    { q: "Why does integration work fail on contracts more often than on code?",
      a: ["Because integration code is harder to write", "Because two systems that disagree about the shape of the data both work in isolation and fail together", "Because contracts are usually written in a foreign language", "Because HTTP is unreliable"],
      c: 1,
      why: "Each side tests against its own assumption and passes. The failure appears only when they meet, which is late, expensive and mutually surprising." },

    { q: "Advert 1 asks for API design for integration with OPC UA, MQTT and Modbus systems. Why does an explicit contract matter more there than usual?",
      a: ["Because industrial protocols are slower", "Because the other side is a different company or vendor on a different schedule, so agreement must precede implementation", "Because those protocols cannot be tested", "Because the data volumes are larger"],
      c: 1,
      why: "You will not be able to iterate quickly with a machine vendor. Getting the document agreed first is what makes the project tractable rather than a sequence of surprises." },
  ],

  /* ------------------------------------------------------- 22-jdbc-and-pools --- */
  "22-jdbc-and-pools": [
    { q: "Why does a PreparedStatement make SQL injection structurally impossible rather than merely unlikely?",
      a: ["It escapes special characters in the values", "The SQL and the parameters travel over separate channels, so a value can never be parsed as SQL", "It validates values against the column type", "It rejects strings containing quotes"],
      c: 1,
      why: "There is no escaping to get wrong. It also lets the database cache the execution plan, which matters on Oracle where a flood of textually distinct queries causes hard parses." },

    { q: "Why is a larger connection pool often slower than a smaller one?",
      a: ["Each connection consumes a thread on the client", "The database can only do so much concurrent work, so beyond that point extra connections add contention and context switching rather than throughput", "The pool serialises access to connections", "Larger pools disable statement caching"],
      c: 1,
      why: "Pools of 10 to 20 are normal for services people imagine need 200. Something near twice the core count plus effective spindles is the classic starting point." },

    { q: "Ten replicas each configured with a pool of 20 connections produce what load on the database?",
      a: ["20 connections, shared across replicas", "200 connections, because every pod has its own pool", "20 connections per node, not per pod", "It depends on the ingress configuration"],
      c: 1,
      why: "Multiply before you deploy. This is how a routine Kubernetes rollout takes down a shared Oracle instance that has a hard connection limit." },

    { q: "Why must HikariCP's maxLifetime be shorter than any database or firewall idle timeout?",
      a: ["To avoid exceeding the licence limit", "Otherwise the pool hands out connections that the network has already dropped", "Because Hikari refuses to start otherwise", "To force statement cache eviction"],
      c: 1,
      why: "A connection closed by a firewall still looks alive to the pool. The application then receives a broken connection at the worst possible moment, on a real request." },

    { q: "What does setting a connectionTimeout on the pool achieve?",
      a: ["It limits how long a query may run", "A request waiting for a free connection fails fast instead of hanging indefinitely", "It closes idle connections sooner", "It bounds the TCP connect phase only"],
      c: 1,
      why: "Failing fast is a feature: it converts an invisible pile-up into a visible error you can count and alert on, rather than threads accumulating silently." },

    { q: "What does Spring's JdbcTemplate do with a vendor-specific SQLException?",
      a: ["Rethrows it unchanged", "Translates it into the unchecked DataAccessException hierarchy, so a duplicate key becomes DuplicateKeyException regardless of vendor", "Logs it and returns an empty result", "Wraps it in a PersistenceException"],
      c: 1,
      why: "It removes vendor error codes from your business logic, which is the same translation that makes chapter 08's checked-versus-unchecked argument concrete." },

    { q: "A reporting query joins five tables and aggregates. What is the pragmatic choice in a Spring application?",
      a: ["Map it to entities with JPA for consistency", "Write SQL and use JdbcClient or a native query, keeping JPA for the domain", "Load the entities and aggregate in Java", "Create a dedicated microservice for reporting"],
      c: 1,
      why: "'JPA for the domain, SQL for reporting' is a mature answer, and it protects you from the classic mistake of pulling ten thousand entities into memory to compute a sum the database could have produced." },

    { q: "Where does a leaked connection show up as a symptom?",
      a: ["At the line that leaked it, as an exception", "In every other request, timing out later while waiting for the exhausted pool", "In the database's error log only", "As increased garbage collection"],
      c: 1,
      why: "That displacement is why the bug is hard to find. try-with-resources, or letting Spring own the connection, removes the possibility rather than mitigating it." },
  ],

  /* ------------------------------------------------------- 23-jpa-hibernate --- */
  "23-jpa-hibernate": [
    { q: "What is the persistence context in JPA?",
      a: ["A connection pool for the entity manager", "A first-level cache and unit of work, scoped to the transaction, holding managed entities and their loaded state", "The second-level cache shared across sessions", "A thread-local holding the current user"],
      c: 1,
      why: "It also guarantees identity: loading the same row twice in one context returns the same instance. The four states worth naming are transient, managed, detached and removed." },

    { q: "What is dirty checking in Hibernate?",
      a: ["Validating entities before persisting them", "Comparing a managed entity against its loaded snapshot at flush and issuing UPDATEs for what differs", "Detecting concurrent modification by other transactions", "Rejecting entities with null required fields"],
      c: 1,
      why: "It is why a setter call inside a transactional method is a database write, with no save() to grep for. Mutating a managed entity for a temporary purpose therefore persists that change." },

    { q: "Which JPA association types default to EAGER fetching?",
      a: ["@OneToMany and @ManyToMany", "@ManyToOne and @OneToOne", "All of them", "None of them"],
      c: 1,
      why: "The to-one defaults are the wrong way round for most applications. Set fetch = FetchType.LAZY everywhere and fetch what you need explicitly per query." },

    { q: "What does open-in-view do, and why is it a problem?",
      a: ["It caches views for faster rendering; it uses memory", "It holds the Hibernate session open for the whole request, hiding LazyInitializationException while holding a database connection through serialisation", "It opens a second transaction for reads; it causes deadlocks", "It disables lazy loading; it makes queries slower"],
      c: 1,
      why: "Boot enables it by default and warns about it. The connection held during view rendering is exactly the pool pressure chapter 22 describes." },

    { q: "Why is @Data from Lombok a poor choice on a JPA entity?",
      a: ["It does not generate a no-argument constructor", "It generates equals, hashCode and toString over every field, which triggers lazy loading and can recurse through bidirectional associations", "It makes fields final", "It conflicts with @Entity"],
      c: 1,
      why: "A toString that walks the object graph can load half the database, and can produce a stack overflow on a bidirectional relationship. The generated equals also reintroduces the identity problem below." },

    { q: "Why is equals/hashCode genuinely hard for JPA entities?",
      a: ["Entities are proxied, so equals is never called", "The id is null before persist, so an id-based hashCode changes identity mid-life and strands the entity in a collection", "Hibernate overrides both methods", "Entities cannot be placed in collections"],
      c: 1,
      why: "The usual resolutions are a business key where one exists, or a constant hashCode with equality on id, which is correct if unattractive and far better than a hash that changes after insertion." },

    { q: "On Oracle, which JPA id generation strategy is appropriate, and what must match?",
      a: ["IDENTITY, matching the column's default", "SEQUENCE, with allocationSize matching the sequence's INCREMENT BY", "TABLE, matching the row count", "AUTO, which handles it automatically"],
      c: 1,
      why: "A mismatch produces either wasted id ranges or collisions. Gaps in generated ids are normal and not a defect; anyone treating an id as a count has already made a mistake." },

    { q: "You modify a managed entity purely to mask a field before returning it. What happens?",
      a: ["Nothing, because you did not call save", "Dirty checking writes that change to the database at flush", "Hibernate detects the intent and skips the update", "The change is rolled back automatically"],
      c: 1,
      why: "There is no save() to look for, which is what makes it dangerous. If you need a throwaway shape, map to a DTO and never mutate an entity you did not intend to persist." },
  ],

  /* ------------------------------------------------------- 24-spring-data --- */
  "24-spring-data": [
    { q: "When is a Spring Data derived query method name parsed into a query?",
      a: ["On the first call, and cached afterwards", "At application start-up, so a wrong property name fails the boot rather than a request", "At compile time, by an annotation processor", "On every call"],
      c: 1,
      why: "Failing at start-up is a real benefit worth saying out loud: a typo in a property name is found by the build or the first deployment, not by whichever user hits that endpoint." },

    { q: "At roughly what point does a derived query method name stop being a good idea?",
      a: ["Past one condition", "Past about three conditions, where the name stops being readable and is a @Query in disguise", "Past five conditions", "Never; derived names scale indefinitely"],
      c: 1,
      why: "findByCustomerIdAndStatusAndCreatedAtBetweenOrderByCreatedAtDesc is not documentation. At that point write the JPQL and give the method a name that says what it is for." },

    { q: "What is the practical advantage of a Spring Data projection?",
      a: ["It caches the result automatically", "It selects only the columns you declared, which is often a bigger win than adding an index", "It bypasses the persistence context lock", "It returns entities in a detached state"],
      c: 1,
      why: "It also sidesteps the N+1 problem entirely, because you never load the entity graph. It is the most underused feature in Spring Data." },

    { q: "What should you use for a search screen where six filters are all optional?",
      a: ["Six overloaded repository methods", "A Specification, composed from the filters that are present", "A native query with string concatenation", "Loading all rows and filtering in Java"],
      c: 1,
      why: "String concatenation reintroduces injection risk and is unreadable; eight query methods is a combinatorial mess. Specifications compose predicates safely." },

    { q: "Why does a @Modifying JPQL update need clearAutomatically, or careful handling?",
      a: ["Because it runs outside a transaction", "Because it changes rows in the database while the persistence context still holds the old values, leaving loaded entities stale", "Because it cannot use named parameters", "Because it returns void"],
      c: 1,
      why: "The bulk update bypasses dirty checking entirely. Anything read afterwards in the same transaction sees the pre-update state unless the context is cleared." },

    { q: "Which is validated at application start-up: JPQL in a @Query, or native SQL?",
      a: ["Both", "JPQL only", "Native SQL only", "Neither"],
      c: 1,
      why: "That is the trade for native SQL: you get the database's full dialect, which chapter 27 needs, and you give up the start-up check. Worth knowing which safety net you have dropped." },

    { q: "Which interface gives CRUD plus paging and sorting in Spring Data JPA?",
      a: ["CrudRepository", "JpaRepository", "Repository", "PagingRepository"],
      c: 1,
      why: "JpaRepository extends both CrudRepository and PagingAndSortingRepository and adds JPA-specific operations such as flush and saveAndFlush." },

    { q: "A service loads ten thousand entities to compute a sum. What is wrong with that?",
      a: ["Nothing, provided pagination is used", "The database could have produced the number, so you have moved work to the application and paid for the entity graph", "The entities will not fit in the persistence context", "It requires a read-only transaction"],
      c: 1,
      why: "It is the classic mistake the 'JPA for the domain, SQL for reporting' rule prevents. Aggregation belongs where the data is." },
  ],

  /* ------------------------------------------------------- 25-transactions --- */
  "25-transactions": [
    { q: "Why does calling a @Transactional method from another method in the same class do nothing?",
      a: ["The annotation is only valid on public methods", "The call is a plain Java call that bypasses the proxy, and the transactional behaviour lives entirely in the proxy", "Spring caches the first transaction and reuses it", "The second method inherits the caller's transaction, which is not started"],
      c: 1,
      why: "The self-invocation trap fails silently: nothing throws, and the data is committed under whatever transaction happened to be open, or none. Move the method to another bean so the call crosses a proxy boundary." },

    { q: "On which exceptions does Spring roll back a transaction by default?",
      a: ["All exceptions", "Unchecked exceptions and Error only; checked exceptions commit unless rollbackFor is set", "Checked exceptions only", "Only exceptions annotated @Transactional"],
      c: 1,
      why: "A method declaring throws IOException that throws one will commit the work it did. That default surprises almost everyone the first time it costs them data." },

    { q: "You catch an exception inside a @Transactional method and do not rethrow it. What happens to the transaction?",
      a: ["It rolls back, because the exception occurred", "It commits, because as far as Spring is concerned nothing failed", "It is marked rollback-only automatically", "It stays open until the timeout"],
      c: 1,
      why: "It is the second of the three usual causes of 'my rollback did not happen'. The third is the self-invocation trap, and naming all three is the strong interview answer." },

    { q: "Which propagation mode suspends the current transaction and starts an independent one?",
      a: ["REQUIRED", "REQUIRES_NEW", "MANDATORY", "SUPPORTS"],
      c: 1,
      why: "It is the right choice for an audit record or an outbox entry that must survive the caller rolling back. REQUIRED, the default, joins the existing transaction instead." },

    { q: "Why can @Transactional be silently ignored on a private or final method?",
      a: ["Those methods cannot throw", "A subclass-based proxy cannot override them, so the advice cannot be applied", "Spring only scans public methods for annotations", "The compiler removes annotations from private methods"],
      c: 1,
      why: "It is the same proxy mechanism as the self-invocation trap, and it fails the same way: no error, no transaction. CGLIB creates a subclass, and a final method cannot be overridden." },

    { q: "What causes an UnexpectedRollbackException at commit time?",
      a: ["Two transactions deadlocking", "An inner REQUIRED call already marked the shared transaction rollback-only, so the outer commit cannot proceed", "The transaction timeout expired", "A checked exception was thrown and caught"],
      c: 1,
      why: "The inner method's failure was swallowed, but the mark on the shared transaction was not. The exception appears at the end with no obvious cause, which is why it is worth recognising." },

    { q: "Which isolation level is the default on Oracle, PostgreSQL and SQL Server?",
      a: ["READ_UNCOMMITTED", "READ_COMMITTED", "REPEATABLE_READ", "SERIALIZABLE"],
      c: 1,
      why: "It prevents dirty reads and permits non-repeatable reads and phantoms. MySQL with InnoDB defaults to REPEATABLE_READ, which is a difference worth knowing when a query behaves differently across environments." },

    { q: "What is usually a better answer than raising the isolation level to handle concurrent updates?",
      a: ["Locking the row with SELECT FOR UPDATE on every read", "Optimistic locking with a @Version column, so a stale overwrite throws instead of silently winning", "Serialising all writes through a single thread", "Retrying the transaction until it succeeds"],
      c: 1,
      why: "It scales far better than locking rows, and it is exactly the mechanism the accounts service uses to reject a profile write built on a stale revision." },
  ],

  /* ------------------------------------------------------- 26-n-plus-one --- */
  "26-n-plus-one": [
    { q: "What is the N+1 problem in Hibernate?",
      a: ["One query returning N times too many rows", "One query for a collection, then N more as each element's lazy association is initialised", "N queries running in parallel and exhausting the pool", "A query executed once per transaction rather than once per request"],
      c: 1,
      why: "It is triggered by anything that touches the association: a loop, a mapping to DTOs, or Jackson serialising an entity in the controller. In development with three rows nobody notices." },

    { q: "Why is changing an association to FetchType.EAGER the wrong fix for N+1?",
      a: ["EAGER is deprecated", "It answers a per-query question globally, so every query that touches the entity now fetches the association whether it needs it or not", "It causes LazyInitializationException", "It only works for to-one associations"],
      c: 1,
      why: "Eager collections on the same entity also multiply into a cartesian product. The fix belongs to the query that needs the data, not to the mapping." },

    { q: "Which of these fixes N+1 for one specific query?",
      a: ["Setting hibernate.default_batch_fetch_size", "A join fetch in the JPQL, or @EntityGraph on the repository method", "Marking the association EAGER", "Increasing the connection pool size"],
      c: 1,
      why: "Batch fetching is the global safety net that turns N queries into N divided by the batch size. Join fetch and entity graphs act per query, which is the right granularity." },

    { q: "Why can you not join fetch two collections in a single JPQL query?",
      a: ["JPQL forbids more than one join", "It produces a cartesian product, and Hibernate 6 refuses it", "The persistence context cannot hold two collections", "You can, and it is the recommended approach"],
      c: 1,
      why: "Fetch one collection per query and use batch fetching for the second. Multiplying two collections together inflates the row count and the memory with it." },

    { q: "What does the Hibernate warning HHH000104 about firstResult/maxResults with collection fetch mean?",
      a: ["The query returned no rows", "Hibernate cannot apply the limit in SQL without cutting a collection in half, so it is fetching everything and paginating in memory", "The page size exceeds the maximum", "The collection is not initialised"],
      c: 1,
      why: "On a large table that is an OutOfMemoryError waiting for enough rows. The standard remedy is two queries: page the ids first, then fetch the full graph for that page with an IN clause." },

    { q: "What is the first thing to do about N+1, before fixing any particular case?",
      a: ["Add a second-level cache", "Make it visible: turn on org.hibernate.SQL logging in development, and consider a query counter in tests", "Switch to native SQL everywhere", "Increase the batch size to its maximum"],
      c: 1,
      why: "A defect you can see is a defect that gets fixed. Without instrumentation it is invisible until production, because the query count does not appear anywhere by default." },

    { q: "Which approach avoids the N+1 problem entirely rather than mitigating it?",
      a: ["A projection that selects only the fields you need, so the entity graph is never loaded", "Marking the association EAGER", "Wrapping the loop in a transaction", "Using findAll instead of a derived query"],
      c: 1,
      why: "If you never materialise the associated entities, there is nothing to initialise lazily. It is often also the fastest option, because fewer columns cross the wire." },

    { q: "What is a sensible project-wide default to set as a safety net against N+1?",
      a: ["spring.jpa.open-in-view=true", "hibernate.default_batch_fetch_size, for example 50", "hibernate.ddl-auto=update", "A second-level cache with a long TTL"],
      c: 1,
      why: "It converts an unnoticed N queries into N divided by fifty, using an IN clause. It does not remove the need to fetch deliberately, but it bounds the damage of the cases you miss." },
  ],

  /* ------------------------------------------------------- 27-oracle-and-sql --- */
  "27-oracle-and-sql": [
    { q: "What does Oracle do with an empty string in a VARCHAR2 column?",
      a: ["Stores it as a zero-length string", "Treats it as NULL, so a comparison to an empty string never matches", "Rejects it with a constraint violation", "Pads it to the column length"],
      c: 1,
      why: "A @NotBlank field can therefore come back as null. It is the Oracle quirk most likely to produce a bug that no other database reproduces." },

    { q: "How does Oracle generate primary keys, in contrast to MySQL's auto-increment?",
      a: ["With an identity column only", "With sequences, which JPA uses through SEQUENCE generation", "With a trigger on every insert, always", "With UUIDs by default"],
      c: 1,
      why: "Match Hibernate's allocationSize to the sequence's INCREMENT BY, or you get wasted ranges or collisions. Gaps in ids are normal and are not a defect." },

    { q: "Why is WHERE ROWNUM <= 10 ORDER BY created_at DESC wrong on Oracle?",
      a: ["ROWNUM cannot be used with ORDER BY", "ROWNUM is assigned before ORDER BY, so it returns ten arbitrary rows and then sorts them", "ROWNUM starts at zero", "It is correct, but slower than FETCH FIRST"],
      c: 1,
      why: "It looks right and is wrong, which is the worst combination. Oracle 12c and later support OFFSET and FETCH FIRST, and older code wraps the query in a subquery to get the ordering applied first." },

    { q: "Why does WHERE TRUNC(created_at) = :day usually defeat an index on created_at?",
      a: ["TRUNC is not supported on indexed columns", "Applying a function to the column means the stored index values no longer match what is being compared", "The index is only used for equality on the whole row", "TRUNC forces a full table scan by design"],
      c: 1,
      why: "Either rewrite as a range predicate on the raw column, or create a function-based index. It is the most common single cause of an unexpected full table scan." },

    { q: "An index exists on (status, created_at). Which query can use it?",
      a: ["A filter on created_at alone", "A filter on status alone, or on both columns", "Any query touching either column", "Only a query filtering on both and ordering by neither"],
      c: 1,
      why: "A composite index is usable left to right, the leftmost-prefix rule. It is the single most useful indexing fact and is asked regularly." },

    { q: "What do wildly wrong row estimates in an execution plan usually indicate?",
      a: ["A missing index", "Stale optimiser statistics", "An incorrect join order specified by the developer", "Insufficient memory for the query"],
      c: 1,
      why: "The optimiser chooses a plan from its estimates, so bad estimates produce a bad plan even when the indexes are right. Look for that before adding indexes." },

    { q: "A PL/SQL procedure your code calls commits internally. What does that mean for your transaction?",
      a: ["Nothing; the outer transaction still controls the commit", "The transaction boundary you thought you had is broken, so a later rollback will not undo the procedure's work", "The procedure will fail with an error", "Spring will detect it and mark the transaction rollback-only"],
      c: 1,
      why: "Worth checking before you rely on rollback. It is a common shape in older PL/SQL and it silently breaks the atomicity your service assumes." },

    { q: "What is the professional stance on business logic living in PL/SQL packages?",
      a: ["It is always wrong and should be migrated to Java", "It is often there because several applications share the rule; the real problems are testability and version control", "It should be duplicated in Java to be safe", "It should be wrapped in a view and ignored"],
      c: 1,
      why: "The useful contribution is usually getting the packages into git and under some test, not campaigning for a rewrite that nobody will fund." },
  ],

  /* ------------------------------------------------------- 28-mongodb --- */
  "28-mongodb": [
    { q: "In MongoDB, when should a child document be embedded rather than referenced?",
      a: ["Whenever it belongs to the parent in the domain model", "When it is owned by the parent, read with it, and bounded in size", "When it will be updated frequently", "When it is shared by many parents"],
      c: 1,
      why: "Order lines embed; a customer referenced by ten thousand orders does not. The decision follows the access pattern rather than the domain diagram." },

    { q: "What is the maximum size of a single MongoDB document?",
      a: ["1 MB", "16 MB", "256 MB", "There is no limit"],
      c: 1,
      why: "Unbounded embedding eventually hits it, which is why 'bounded in size' is part of the embedding rule. An array that grows forever is a modelling error waiting for enough traffic." },

    { q: "What does schemaless actually mean for a MongoDB collection?",
      a: ["The data has no structure", "The database does not enforce a schema, but your data still has one and will drift without discipline", "Every document must have identical fields", "The schema is inferred and enforced from the first document"],
      c: 1,
      why: "Two years of drift produces documents in four shapes and code with a null check per shape. Use schema validation, or a strict mapping layer, and version your documents from the start." },

    { q: "What is the key behavioural difference between Spring Data MongoDB and Spring Data JPA?",
      a: ["MongoDB repositories cannot use derived queries", "There is no persistence context and no dirty checking, so changing an object does nothing until you explicitly save it", "MongoDB does not support transactions at all", "Mongo repositories are not proxied"],
      c: 1,
      why: "It is the exact opposite of chapter 23, and it is a genuine source of bugs when developers move between the two inside one codebase." },

    { q: "What does needing multi-document transactions routinely in MongoDB usually indicate?",
      a: ["That the replica set is misconfigured", "That the aggregate boundaries are wrong, or that this data belonged in a relational database", "That the driver version is out of date", "That the write concern is too weak"],
      c: 1,
      why: "They exist since 4.0 on a replica set and are not free. Designing so that one document is one atomic unit is what the document model is for." },

    { q: "Which framing best captures when to choose a document store over a relational database?",
      a: ["Documents for large data, relational for small", "Relational for invariants such as foreign keys and cross-table transactions; documents for aggregates read as a unit with an evolving shape", "Documents for reads, relational for writes", "Relational for structured data, documents for unstructured"],
      c: 1,
      why: "Orders and invoices have invariants and an accountant; event payloads, audit trails and catalogues with per-category attributes do not. The polyglot answer the advert implies is normal." },

    { q: "Which Spring Data MongoDB API is used for aggregation pipelines?",
      a: ["MongoRepository derived queries", "MongoTemplate", "JpaRepository", "EntityManager"],
      c: 1,
      why: "MongoRepository covers derived queries and @Query with JSON filters; MongoTemplate is the lower-level API where aggregation, bulk operations and index management live." },

    { q: "What is the risk of referencing rather than embedding when the access pattern reads both together?",
      a: ["Document size grows unbounded", "You reinvent joins in application code, at which point you wanted a relational database", "Writes become non-atomic", "Indexes cannot be created on referenced fields"],
      c: 1,
      why: "Getting it wrong in either direction has a cost: embedding too much causes duplication and growth, referencing too much causes application-side joins. Model for the query you run most." },
  ],

  /* ------------------------------------------------------- 29-migrations --- */
  "29-migrations": [
    { q: "Why is hibernate.ddl-auto=update unsuitable for production?",
      a: ["It is slower than a migration tool", "It cannot rename, will not delete, applies no data migration, and produces a change nobody can review before it happens", "It only works with H2", "It requires a restart of every instance"],
      c: 1,
      why: "A rename looks like a drop plus an add, so it never happens. The deeper problem is that no human can read a diff of what will be done to production." },

    { q: "What is the right ddl-auto setting for a production Spring application?",
      a: ["update", "validate", "create", "none, always"],
      c: 1,
      why: "validate fails fast when the schema and the entities disagree, which is exactly the check you want. create-drop belongs in tests and nowhere else." },

    { q: "What is the most dangerous form of ddl-auto=update in practice?",
      a: ["Dropping a table", "Adding a column with all nulls and no default, so historical rows are silently wrong in reports", "Locking the table during migration", "Failing to start when the schema differs"],
      c: 1,
      why: "Nothing fails. The application works in testing because the test data is new, and the defect appears as a report that quietly disagrees with reality." },

    { q: "What happens if you edit a Flyway migration file that has already been applied?",
      a: ["Flyway re-runs it", "Flyway refuses to start, because the recorded checksum no longer matches", "Flyway ignores the change", "Flyway warns and continues"],
      c: 1,
      why: "That refusal is the feature, not an annoyance: it means the history in the database is a true record of what ran. Add a new migration instead." },

    { q: "When should database migrations run, in a system with several instances?",
      a: ["At application start-up, guarded by a lock", "As a separate gated pipeline step before the new version is deployed", "Manually, by a DBA, after deployment", "On the first request that needs the new schema"],
      c: 1,
      why: "Instances starting together race, and the runtime database account would otherwise need schema-altering rights it should never hold. Flyway's lock resolves the race but turns a deploy into instances waiting on each other." },

    { q: "What does the expand-and-contract pattern mean when renaming a database column?",
      a: ["Rename it, then update the code in the same release", "Add the new column, write to both, backfill, move readers across, and drop the old column in a later release", "Create a view exposing both names permanently", "Rename it during a maintenance window with the service stopped"],
      c: 1,
      why: "Every intermediate state is readable by both the old and the new version of the application, which is what makes a rollback safe at any point in the rollout." },

    { q: "Why does a rollback of a deployment not undo a schema change?",
      a: ["Migrations run in a separate transaction", "Rollback reverses the code, not the schema, so a dropped column the previous version reads makes rollback impossible", "Flyway automatically reverses the last migration", "It does undo it, if the migration is annotated as reversible"],
      c: 1,
      why: "That is the whole argument for expand-and-contract, stated in exactly those terms. Fixing forward under pressure is the alternative." },

    { q: "When is Liquibase a better fit than Flyway?",
      a: ["When the team prefers XML", "When you must support several database vendors, since its changelog is database-agnostic and it can generate rollbacks", "When migrations must run at start-up", "When the schema is very large"],
      c: 1,
      why: "For a team on one database, Flyway's plain SQL is usually the right call: everyone can read it, it reviews like any other code, and it is the same language you would type into a client at three in the morning." },
  ],

  /* ------------------------------------------------------- 30-microservices --- */
  "30-microservices": [
    { q: "What is the primary benefit of splitting a system into microservices?",
      a: ["Better runtime performance", "Independent deployability, which mainly pays off when the number of teams is the bottleneck", "Lower infrastructure cost", "Simpler debugging"],
      c: 1,
      why: "Three of the four commonly cited benefits are organisational. Saying that calmly reads as more senior than advocating microservices, because the interviewer has usually lived through a split that did not pay for itself." },

    { q: "What are the two things a monolith gave you for free that microservices take away?",
      a: ["Logging and monitoring", "The local call, which never partially failed, and the transaction, which made several writes atomic", "Type safety and compile-time checks", "Horizontal scaling and caching"],
      c: 1,
      why: "In exchange you inherit partial failure, eventual consistency, distributed tracing as a requirement, versioned contracts and a deployment topology somebody has to operate." },

    { q: "What is the correct unit for splitting a system into services?",
      a: ["A technical layer, such as a database service", "A bounded context: a piece of the domain with its own language and its own data", "A team, one service per developer", "A deployment artefact of similar size to the others"],
      c: 1,
      why: "Splitting by technical layer produces services that cannot change without each other, which is the worst of both worlds: all the network cost and none of the independence." },

    { q: "Two services read and write the same database tables. What have you actually built?",
      a: ["A well-integrated pair of microservices", "One service in two deployments: neither can change its schema and both must be released together", "A shared-nothing architecture", "A CQRS read and write side"],
      c: 1,
      why: "The shared database is the clearest tell of a distributed monolith. Each service owns its data, and others go through its API." },

    { q: "Which symptom most clearly indicates a distributed monolith?",
      a: ["Services written in different languages", "A release train where everything must ship together", "More than ten services", "Use of a message broker"],
      c: 1,
      why: "Alongside a shared database, a shared DTO library upgraded in lockstep and a five-deep synchronous call chain are the others. If you cannot deploy one service alone, you do not have microservices." },

    { q: "What is the honest default architecture for a small team?",
      a: ["Microservices, to be ready for growth", "A modular monolith, splitting later in response to a problem you can name", "Serverless functions", "A monolith with a shared database across teams"],
      c: 1,
      why: "You pay every cost of distribution without the organisational benefit that justifies it. Splitting should answer a specific problem, such as teams blocking each other on releases." },

    { q: "Merging two microservices back into one is best described as:",
      a: ["An admission that the architecture failed", "A legitimate correction, when two things always change together", "Impossible once they have separate databases", "A step that requires rewriting both"],
      c: 1,
      why: "Saying so is a good signal in an interview, because it shows you treat the boundary as a design decision that can be revisited rather than a commitment." },

    { q: "Which remedy addresses a chain of five synchronous service calls?",
      a: ["Increasing every timeout", "Asynchronous messaging where the caller does not need an answer now", "Adding a cache in front of each service", "Combining them behind a single gateway route"],
      c: 1,
      why: "In a synchronous chain the slowest hop sets everyone's latency and any failure cascades. Removing the need for an immediate answer removes the coupling rather than mitigating it." },
  ],

  /* ------------------------------------------------------- 31-spring-cloud --- */
  "31-spring-cloud": [
    { q: "Which Spring Cloud responsibilities has Kubernetes largely absorbed?",
      a: ["The gateway and circuit breaking", "Service discovery and distributed configuration, through Services, DNS, ConfigMaps and Secrets", "Distributed tracing", "Client-side load balancing only"],
      c: 1,
      why: "Adding Eureka on top of a Kubernetes cluster is usually duplicated machinery. The exception worth naming is Config Server's git-backed history, which is genuinely nicer for audited environments." },

    { q: "Which Spring Cloud component still earns its place on Kubernetes?",
      a: ["Eureka", "Spring Cloud Gateway, for token validation, rate limiting and response aggregation", "Ribbon", "Config Server, for service discovery"],
      c: 1,
      why: "An Ingress routes but does not validate tokens or rate-limit per client. The trap is a gateway that starts making business decisions, which turns it into a coordination point." },

    { q: "What is the single most important thing to configure on every inter-service HTTP call?",
      a: ["A retry policy", "Connect and read timeouts", "A circuit breaker", "Compression"],
      c: 1,
      why: "The default for several clients is effectively infinite. A call with no timeout converts a slow dependency into an exhausted thread pool, which is how one team's incident becomes four teams' incident." },

    { q: "Which HTTP client is in maintenance mode in current Spring versions?",
      a: ["WebClient", "RestTemplate", "RestClient", "OpenFeign"],
      c: 1,
      why: "The current choices are WebClient, the synchronous RestClient, and declarative @HttpExchange interfaces. OpenFeign remains common in existing Spring Cloud codebases." },

    { q: "What does Spring Cloud Config Server provide that a Kubernetes ConfigMap does not?",
      a: ["Encryption of values at rest", "Git-backed history, so configuration changes are versioned and auditable", "Type-safe binding", "Per-pod overrides"],
      c: 1,
      why: "That audit trail is why banks and public administration keep it even on Kubernetes. It is a genuine capability rather than nostalgia." },

    { q: "Why is it worth knowing that Spring Cloud Gateway is reactive?",
      a: ["It cannot be used with Spring MVC applications behind it", "Blocking inside a gateway filter occupies an event-loop thread and degrades the whole gateway", "It requires a reactive database driver", "It cannot terminate TLS"],
      c: 1,
      why: "A blocking call in a filter on a small event-loop pool is a much bigger problem than the same call in a servlet application with a thread per request." },

    { q: "What does a service registry such as Eureka provide?",
      a: ["A shared cache between services", "Instances register themselves and clients ask where a service is, so addresses are not hard-coded", "Automatic retry and failover", "Centralised logging"],
      c: 1,
      why: "Kubernetes provides the same thing through a Service name resolved by DNS, which is why running both is usually redundant machinery rather than defence in depth." },

    { q: "What should a gateway NOT do?",
      a: ["Validate tokens", "Apply rate limits", "Decide which customers get which discount", "Handle CORS"],
      c: 1,
      why: "Once the gateway knows business rules it becomes the single point every change must pass through, which is the coordination bottleneck a distributed system was meant to avoid." },
  ],

  /* ------------------------------------------------------- 32-resilience --- */
  "32-resilience": [
    { q: "Why is a missing timeout on an outbound call the most common cause of cascading failure?",
      a: ["It causes the remote service to retry", "Your request threads wait indefinitely, holding threads and often pooled connections, until your own service stops responding", "It triggers the circuit breaker prematurely", "It prevents the load balancer from removing the instance"],
      c: 1,
      why: "Nothing in your service is broken, and it stops responding anyway. It is also the cheapest thing to fix, which is why it is the first question to ask about any inter-service call." },

    { q: "How should an outbound call's timeout relate to the timeout of the caller above you?",
      a: ["Longer, so you can complete the work", "Shorter, so you are not still working on a request nobody is waiting for", "Identical, so failures are consistent", "Unrelated; each service sets its own"],
      c: 1,
      why: "Think in terms of a latency budget: an endpoint promising two seconds that calls three services cannot allow each of them two seconds. Failing fast is a feature." },

    { q: "Which failures are worth retrying?",
      a: ["All of them, with enough attempts", "Transient ones such as a connection reset or a 503, and only for idempotent operations", "Any 4xx response", "Only timeouts"],
      c: 1,
      why: "A 400 or 422 will fail identically forever, so retrying it is pure cost. And retrying a non-idempotent POST after a timeout is how duplicates are created." },

    { q: "Why must exponential backoff include jitter?",
      a: ["To avoid overflowing the retry counter", "Without it every client retries at the same instant, rebuilding the thundering herd you were avoiding", "Because the specification requires it", "To keep the retry interval below the timeout"],
      c: 1,
      why: "Synchronised retries turn a brief blip into a repeating spike. Randomising the delay spreads the load, which is the entire point of backing off." },

    { q: "Three retries at each of three hops produces how many requests for one user action?",
      a: ["9", "27", "3", "6"],
      c: 1,
      why: "Retries multiply through a call chain, which is why the pattern needs a budget rather than a number, and why retrying at only one layer, usually the outermost, is often the right design." },

    { q: "What does a circuit breaker actually buy you?",
      a: ["It retries failed calls automatically", "It converts a slow, resource-consuming failure into a fast, cheap one, and stops loading a struggling dependency", "It routes traffic to a backup service", "It caches the last successful response"],
      c: 1,
      why: "Resilience4j moves between closed, open and half-open, where a few probes decide whether to close again. The benefit is as much for the dependency as for you." },

    { q: "What is a bulkhead in the resilience sense?",
      a: ["A replica of the service in another zone", "A separate, bounded pool of concurrent calls per dependency, so one misbehaving downstream cannot consume every thread", "A rate limit applied at the gateway", "A read-only fallback database"],
      c: 1,
      why: "Without it, a single slow dependency drains the shared thread pool and takes down calls to every other dependency with it." },

    { q: "Why is a fallback that silently returns an empty list worse than an error?",
      a: ["It is slower to compute", "It turns an outage into wrong data, which outlives the outage and nobody knows to check", "It breaks the circuit breaker's statistics", "It cannot be logged"],
      c: 1,
      why: "Design the fallback deliberately: cached data, a partial response, or a clear error. An empty result that looks like a valid answer is the failure mode you cannot detect afterwards." },
  ],

  /* ------------------------------------------------------- 33-messaging --- */
  "33-messaging": [
    { q: "What are the three things asynchronous messaging buys you?",
      a: ["Type safety, ordering and exactly-once delivery", "Latency, decoupling and load levelling", "Consistency, availability and partition tolerance", "Compression, batching and encryption"],
      c: 1,
      why: "The caller returns without waiting; the producer does not know its consumers; a burst becomes a backlog rather than a failure. The cost is eventual consistency and a much harder debugging story." },

    { q: "What is the deciding capability when choosing Kafka over RabbitMQ?",
      a: ["Higher throughput", "Replay: several independent consumers reading the same retained stream, and the ability to reprocess history", "Better routing rules", "Per-message acknowledgement"],
      c: 1,
      why: "Rebuilding a projection by reprocessing is something a queue simply cannot do. Per-message routing and per-message acknowledgement are what RabbitMQ does better." },

    { q: "Which workload is RabbitMQ the honest choice for?",
      a: ["An event stream read by six independent services", "A work queue where each job goes to exactly one worker, with retries and a dead-letter queue", "Very high throughput telemetry ingestion", "Rebuilding a search index from history"],
      c: 1,
      why: "Choosing Kafka and then using one topic per consumer with a single partition gives you an expensive RabbitMQ with worse ergonomics. Knowing when not to use Kafka is part of the answer." },

    { q: "Why must a Spring @KafkaListener handler be idempotent?",
      a: ["Because Spring retries every message once by design", "Because delivery is at-least-once, so a message can be redelivered after a crash or a rebalance", "Because the broker may reorder messages", "Because the listener runs on several threads"],
      c: 1,
      why: "It is not a Spring detail but a property of the delivery model. Anything that must happen exactly once has to be made safe to repeat." },

    { q: "What happens in Kafka when a consumer cannot process a message and there is no dead-letter route?",
      a: ["The message is skipped after three attempts", "The consumer cannot advance past that offset, so everything behind it on that partition stops", "The broker deletes the message", "The message is redelivered to another consumer group"],
      c: 1,
      why: "The poison message blocks its partition, which has no equivalent in a queue where a single message can be rejected. Configure a DefaultErrorHandler with backoff and a dead-letter topic before you need one." },

    { q: "What is true of the thread a @KafkaListener method runs on?",
      a: ["It is a request thread with the full web context", "It is the listener container's thread: no SecurityContext and no request-scoped beans", "It is a virtual thread by default", "It is the same thread that produced the message"],
      c: 1,
      why: "Injecting a request-scoped bean into a listener fails at runtime, and code that assumes an authenticated principal finds none. The transaction boundary is also yours to declare." },

    { q: "What does the message key determine when producing to Kafka from Spring?",
      a: ["The consumer group that receives it", "The partition, and therefore the ordering guarantee for records sharing that key", "The retention period", "The serialisation format"],
      c: 1,
      why: "Ordering is per partition and the key chooses the partition, so the key is the unit of ordering. Chapter 07 of the Kafka course covers the failure modes." },

    { q: "What does introducing a broker make necessary that was optional before?",
      a: ["A schema registry", "Correlation ids and distributed tracing, because the failure now happens elsewhere, later, on another thread", "A second database", "Synchronous acknowledgements"],
      c: 1,
      why: "Debugging an asynchronous flow without a propagated trace context is guesswork. That is why chapter 35 stops being a nicety the moment messaging arrives." },
  ],

  /* ------------------------------------------------------- 34-industrial-protocols --- */
  "34-industrial-protocols": [
    { q: "What does Modbus expose to a client?",
      a: ["A typed object model with discovery", "Numbered coils and registers, with meaning defined only in the vendor's documentation", "A publish/subscribe topic hierarchy", "A REST interface over TCP"],
      c: 1,
      why: "There are no types beyond 16-bit words, no discovery and no security whatsoever. The register map is a PDF you must obtain, and endianness varies by device." },

    { q: "Why does a float read over Modbus often arrive as nonsense at first?",
      a: ["The device sends it as a string", "Byte and word order vary by device, so the two registers must be combined in the right order", "Modbus cannot represent floating point", "The value must be divided by 100"],
      c: 1,
      why: "A 32-bit float spans two 16-bit registers and vendors disagree about the order. It is the first thing to check when a reading looks absurd rather than merely wrong." },

    { q: "Which industrial protocol is designed for telemetry over unreliable networks?",
      a: ["Modbus", "MQTT", "OPC UA", "Profibus"],
      c: 1,
      why: "Broker-based publish/subscribe with three QoS levels, retained messages, and a last-will message that announces a client's death. It is the usual transport for many devices on links that drop." },

    { q: "What does OPC UA provide that Modbus does not?",
      a: ["Lower latency", "An address space of typed nodes with units, historical access, subscriptions and security", "Support for serial connections", "A smaller wire format"],
      c: 1,
      why: "It is the one to prefer for new work and the heaviest of the three. Critically it also supplies a source timestamp, which matters when data was buffered during an outage." },

    { q: "Why should a gateway timestamp readings at the source where the protocol allows it?",
      a: ["To reduce clock drift between servers", "Because using arrival time silently mislabels data that was buffered during a network outage", "Because the broker requires a timestamp", "To allow deduplication by timestamp"],
      c: 1,
      why: "After a link is restored, a burst of old readings arrives at once. Stamped with arrival time, an hour of production history is recorded as having happened in one second." },

    { q: "Why should register numbers never appear in the HTTP API a gateway exposes?",
      a: ["They are too large for JSON", "Every consumer would inherit the vendor's PDF as part of your contract", "They change on every device restart", "They conflict with REST path conventions"],
      c: 1,
      why: "Translate to domain terms at the edge. It is the same principle as not exposing database columns as your API, and it is what makes the gateway worth building at all." },

    { q: "Why are poll rates against a PLC negotiated with automation engineers rather than chosen by the backend developer?",
      a: ["Because the PLC vendor licenses by request count", "Because a PLC may allow only a few concurrent connections and can be destabilised by aggressive polling, and on a production line that means a stopped machine", "Because polling requires a firewall change each time", "Because the protocol has no rate limiting"],
      c: 1,
      why: "Industrial networks are not IT networks. The blast radius of a mistake is physical rather than a slow dashboard." },

    { q: "A hundred machines at ten readings per second is roughly what kind of workload?",
      a: ["A trivial relational insert load", "A thousand events per second, which is a time-series and streaming problem rather than a relational one", "A batch workload suited to a nightly job", "Too small to require design consideration"],
      c: 1,
      why: "Volume is almost always larger than estimated, which is why time-series storage and the Kafka retention questions arrive at the same time as the integration itself." },
  ],

  /* ------------------------------------------------------- 35-observability --- */
  "35-observability": [
    { q: "Which of the three signals answers 'which of these six services made the request slow'?",
      a: ["Logs", "Metrics", "Traces", "Health checks"],
      c: 2,
      why: "Metrics are cheap aggregates for alerting and useless for one specific request; logs explain a single case at high cost; only a trace shows one request's path across services with timing per hop." },

    { q: "Why is OpenTelemetry the word worth knowing rather than a specific vendor's agent?",
      a: ["It is faster", "It is vendor-neutral, so the backend can change without touching application code", "It is the only option supported by Spring", "It produces smaller payloads"],
      c: 1,
      why: "The same instrumentation can go to Grafana, Jaeger, Honeycomb or a cloud provider. That portability is the entire argument, and it is why Micrometer Tracing exports to it." },

    { q: "Which header carries the trace context between services in the W3C standard?",
      a: ["X-Request-Id", "traceparent", "X-B3-TraceId", "Correlation-Id"],
      c: 1,
      why: "X-B3 headers are the older Zipkin convention still seen in existing systems. The point of the standard is that services from different teams and vendors agree without configuration." },

    { q: "What must you do so a distributed trace survives a message going through a broker?",
      a: ["Nothing; the broker propagates it", "Carry the trace context in the message headers, or the trail stops at the broker", "Use the same consumer group id as the trace id", "Enable tracing on the broker itself"],
      c: 1,
      why: "It is the piece people forget, and it breaks tracing exactly where asynchronous debugging is hardest. Kafka record headers are the right place for it." },

    { q: "Why does a trace id disappear when work is handed to a plain ExecutorService?",
      a: ["The executor clears MDC deliberately", "The context is thread-local, so it does not follow the task onto another thread", "Traces are only propagated over HTTP", "The span is closed when the controller returns"],
      c: 1,
      why: "It is the same thread-local caveat as the SecurityContext in chapter 20, and the logs you cannot correlate are precisely the background-task ones you needed. Use the framework's context-propagating wrappers." },

    { q: "What should you alert on?",
      a: ["CPU utilisation and memory usage", "Symptoms: error rate, latency at the 95th and 99th percentiles, and saturation of a bounded resource", "Every exception logged", "Deployment events"],
      c: 1,
      why: "High CPU with healthy latency is not an incident; low CPU with a growing queue is. Alert on what a user would notice, and on resources that are about to run out." },

    { q: "Why should you never alert on average latency?",
      a: ["Averages are expensive to compute", "An average of 200 ms can hide 5 per cent of users waiting eight seconds, and those are the ones who complain", "Averages are not supported by Prometheus", "The average changes too slowly to be useful"],
      c: 1,
      why: "Percentiles are the whole point. Saying this is a small, reliable signal of having operated something rather than only built it." },

    { q: "Where should a correlation id appear, beyond the logs?",
      a: ["In the URL of every request", "In error responses, so a user complaint becomes an exact log query", "In the database, on every row", "In the metric labels"],
      c: 1,
      why: "It costs one field in the problem-details body from chapter 18 and is worth more than most dashboards. Putting it in metric labels is the opposite: high-cardinality labels are how you break a metrics backend." },
  ],

});

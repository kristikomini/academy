/* ==========================================================================
   quizzes-3.js — the question bank, part 3.

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

  /* ------------------------------------------------------- 36-unit-testing --- */
  "36-unit-testing": [
    { q: "What is a unit test primarily for?",
      a: ["Proving the code works today", "Telling the person who changes this in eight months that they broke something", "Measuring code coverage", "Documenting the API for consumers"],
      c: 1,
      why: "You already know it works today: you just wrote it. Tests are a regression net and a design pressure, and the design pressure is the underrated half." },

    { q: "What does it usually mean when a class is hard to test?",
      a: ["The test framework is inadequate", "The class is probably hard to use: hidden dependencies, static state, or three jobs in one place", "The class needs more mocks", "The class should be made package-private"],
      c: 1,
      why: "Constructor injection exists partly for this reason. Difficulty writing the test is information about the design rather than an obstacle to work around." },

    { q: "How many reasons should a single test have to fail?",
      a: ["As many as the method has branches", "Exactly one, named in the test's title", "At least three, for efficiency", "It does not matter if the assertions are clear"],
      c: 1,
      why: "throwsWhenQuantityIsZero is a sentence; test1 is not. A test that can fail for several reasons tells you something broke without telling you what." },

    { q: "Why is asserting that a private method was called a poor test?",
      a: ["Private methods cannot be mocked", "It couples the test to the implementation, so it breaks on every refactor and never catches a bug", "It requires reflection, which is slow", "The compiler forbids it"],
      c: 1,
      why: "Test behaviour, not implementation. A test that fails when you rename something, and passes when the behaviour is wrong, is worse than no test." },

    { q: "Which inputs are most worth testing?",
      a: ["The typical case, repeated with different values", "The edges: empty, null, zero, negative, boundary and duplicate", "Only the inputs the requirements mention", "Randomly generated values"],
      c: 1,
      why: "That is where the defects are, and where reviewers look. The happy path is the case the implementation was written against and is least likely to be wrong." },

    { q: "What does code coverage actually measure?",
      a: ["Whether the code behaves correctly", "Which lines ran during the tests, not whether anything was verified", "How many assertions each test makes", "The proportion of requirements tested"],
      c: 1,
      why: "A test that executes a method and asserts nothing produces full coverage and zero information. Coverage is a floor detector: 20 per cent tells you something is wrong, 90 per cent tells you very little." },

    { q: "What does mutation testing with a tool such as PIT do?",
      a: ["Generates additional test inputs automatically", "Changes the code deliberately and checks that some test fails, so a surviving mutant marks a line nothing verifies", "Detects flaky tests by rerunning them", "Measures branch coverage more accurately"],
      c: 1,
      why: "It answers whether the suite is worth anything, rather than how large it is. Mentioning it in an interview is unusual and lands well." },

    { q: "Why does JUnit 5 create a new test instance for each test method?",
      a: ["To parallelise execution", "To discourage shared mutable state, which makes tests pass alone and fail in a different order", "To reduce memory usage", "Because instances are cheaper than static fields"],
      c: 1,
      why: "Do not defeat it with static fields. Order-dependent tests are the ones that fail in CI, pass locally, and cost an afternoon each time." },
  ],

  /* ------------------------------------------------------- 37-mocking --- */
  "37-mocking": [
    { q: "What is the difference between state verification and interaction verification?",
      a: ["State asserts on the result; interaction asserts that a call happened", "State is for unit tests; interaction is for integration tests", "State uses mocks; interaction uses stubs", "They are two names for the same technique"],
      c: 0,
      why: "Prefer state. Interaction assertions couple the test to the implementation, so they break on refactoring even when the behaviour is unchanged." },

    { q: "When is Mockito's verify genuinely the right tool?",
      a: ["Whenever a collaborator is involved", "When the interaction is the behaviour, such as 'an email was sent' or 'the payment was charged exactly once'", "When the method returns void", "Never; verify is always a smell"],
      c: 1,
      why: "Those are observable effects with no return value to assert on, so there is nothing else to check. Everywhere else, assert on the outcome." },

    { q: "Why should you never mock a type you do not own?",
      a: ["The library may be final", "The mock encodes your assumption about how it behaves, so the test keeps passing when that assumption is wrong", "It violates the library's licence", "Mockito cannot mock external classes"],
      c: 1,
      why: "That is precisely the case you needed to catch. Wrap it in your own interface, mock that, and verify the real thing with an integration test." },

    { q: "Which collaborators deserve a test double?",
      a: ["All of them, for isolation", "The edges: network calls, the clock, the file system, message brokers", "Only those that are slow", "Only interfaces, never classes"],
      c: 1,
      why: "Leave your own value objects and domain logic real. Mocking them tests nothing and makes every refactor expensive." },

    { q: "Why should a Clock be injected rather than calling Instant.now directly?",
      a: ["Instant.now is slow", "Time becomes a dependency you can control, so expiry, retention and streak logic are testable without waiting", "Instant.now is not thread-safe", "The JVM caches the value"],
      c: 1,
      why: "A test that must wait fifteen real minutes to prove a token expired is a test nobody runs. The accounts service in this repository injects a clock for exactly that reason." },

    { q: "Mockito's strict stubs fail a test with an unused stub. Why is that a feature?",
      a: ["It keeps tests short", "An unused stub means the test is describing a path that no longer exists", "It prevents mocking final classes", "It enforces the arrange-act-assert order"],
      c: 1,
      why: "Silent dead configuration in a test is how a suite drifts away from the code it is supposed to describe." },

    { q: "What does a test suite that mocks every collaborator actually verify?",
      a: ["The integration between components", "That the mocks were configured the way the test expected", "The public contract of the class", "Nothing at all, since mocks never fail"],
      c: 1,
      why: "Change the implementation and the test still passes, which is the opposite of what a regression net is for. The shape of your doubles says more about your judgement than the assertions do." },

    { q: "What does an ArgumentCaptor let you do that verify alone does not?",
      a: ["Verify the number of invocations", "Assert on what was actually passed, rather than only that something was", "Stub a return value conditionally", "Mock a static method"],
      c: 1,
      why: "Useful when the interaction is the behaviour and the details matter, for example that the email went to the right address with the right order number." },
  ],

  /* ------------------------------------------------------- 38-spring-testing --- */
  "38-spring-testing": [
    { q: "Which tests need a Spring application context at all?",
      a: ["All of them, for realism", "Those where the behaviour under test belongs to the framework: serialisation, validation, security, transactions, repository queries", "Only those touching the database", "Only controller tests"],
      c: 1,
      why: "A @Service with constructor injection is testable with new and two mocks, in a millisecond. That should be the bulk of the suite." },

    { q: "What does @WebMvcTest load?",
      a: ["The whole application context", "Controllers, converters and the security filter chain, with collaborators supplied as mocks", "Only the controller class named", "The web layer plus the persistence layer"],
      c: 1,
      why: "It is the right tool for status codes, validation responses and JSON shape. The service underneath is tested separately, without a context." },

    { q: "Why is a suite where every test is annotated @SpringBootTest a problem?",
      a: ["It cannot use mocks", "It loads everything for each distinct configuration, so the build becomes slow enough that people stop running it locally", "It cannot run in parallel", "It requires a running database"],
      c: 1,
      why: "Slow suites stop being run, and that is how the regression net disappears. Reach for @SpringBootTest last, for the handful of genuine end-to-end paths." },

    { q: "How does Spring cache the application context between tests?",
      a: ["One context per test class", "One per unique configuration, so every variation creates another context to build and hold", "One per test method", "It does not cache; each test starts fresh"],
      c: 1,
      why: "A stray @TestPropertySource or a one-off @MockitoBean creates a new configuration and therefore a new context. That is usually the real reason a suite is slow." },

    { q: "Why is testing repository queries against H2 when production is Oracle a poor idea?",
      a: ["H2 is slower to start", "H2 accepts SQL Oracle rejects and differs on sequences, empty strings and dialect functions, so you are testing a database you do not ship", "H2 cannot be used with Spring Data", "H2 does not support transactions"],
      c: 1,
      why: "It is the standard source of 'passed in CI, failed in production'. Testcontainers against the real image removes the whole class of defect." },

    { q: "What does @DataJpaTest provide by default?",
      a: ["The full context with an embedded web server", "JPA and repositories, transactional and rolled back per test, with an embedded database unless told otherwise", "Only the entity classes", "A mocked EntityManager"],
      c: 1,
      why: "The rollback per test is convenient and slightly misleading: it means your test never exercises a real commit, which is where some constraint violations surface." },

    { q: "In a @WebMvcTest, how is the service the controller depends on supplied?",
      a: ["It is loaded from the real context", "As a mock registered with @MockitoBean", "By constructing the controller manually", "It is auto-configured from the classpath"],
      c: 1,
      why: "The slice deliberately excludes services. Supplying a mock is what keeps the test about the web layer's behaviour rather than about the business logic underneath it." },

    { q: "What is the practical shape of a healthy Spring test suite?",
      a: ["Mostly end-to-end tests, with a few unit tests", "Many fast unit tests, a layer of slices, and a small number of container-backed integration tests at the boundaries", "An equal number of each kind", "Only integration tests, since they are the most realistic"],
      c: 1,
      why: "Separating the slow ones by naming convention, IT for integration, keeps the fast suite fast on every save and the slower one on push. Both then keep being run." },
  ],

  /* ------------------------------------------------------- 39-testcontainers --- */
  "39-testcontainers": [
    { q: "What does Testcontainers do for an integration test?",
      a: ["Mocks the database with an in-memory equivalent", "Starts the real database, broker or cache image in Docker for the test run and gives Spring the connection details", "Runs the tests inside a container", "Provisions a shared test environment in the cloud"],
      c: 1,
      why: "The cost is seconds of start-up; the benefit is that 'passed in CI, failed in production' stops being a category of defect rather than being caught case by case." },

    { q: "What does @ServiceConnection add in Spring Boot 3.1 and later?",
      a: ["Connection pooling for the container", "Spring derives the datasource or broker properties from the container, removing the @DynamicPropertySource boilerplate", "Automatic container reuse between runs", "Health checks on the container"],
      c: 1,
      why: "It removes the most error-prone part of the setup, which was wiring the randomly assigned port into the right property names by hand." },

    { q: "Why should you apply your real migrations against the Testcontainers database rather than letting Hibernate create the schema?",
      a: ["Hibernate cannot create schemas in containers", "Then the test also verifies that the migration chain applies cleanly, which is a second bug caught for free", "Migrations are faster than DDL generation", "Hibernate's generated schema is invalid for Oracle"],
      c: 1,
      why: "It also means you are testing against the schema you actually deploy, rather than one derived from the entities, which is the whole reason ddl-auto is set to validate in production." },

    { q: "When should Testcontainers reuse be enabled?",
      a: ["Always, for speed", "Locally, to keep the feedback loop fast, but never in CI where isolation matters more", "Only in CI, to save runner minutes", "Never; it makes tests unreliable"],
      c: 1,
      why: "A container surviving between local runs saves real time. In CI, a container carrying state from a previous run is exactly the flakiness you are trying to avoid." },

    { q: "Why is pointing integration tests at a shared development database a worse option than a container?",
      a: ["It is slower", "Tests pass or fail depending on data somebody else left, cannot run in parallel, and cannot run without network access to it", "It requires more configuration", "It cannot be used with Spring Data"],
      c: 1,
      why: "A container per run is isolated, reproducible and disposable. Those three properties are the whole argument." },

    { q: "What is the point of naming integration tests with an IT suffix?",
      a: ["It is required by JUnit", "It separates them so the fast suite runs on every save and the slower one on push", "It enables Testcontainers automatically", "It excludes them from coverage reports"],
      c: 1,
      why: "Maven's failsafe plugin uses the convention. The purpose is that neither suite gets abandoned because it is inconvenient at the wrong moment." },

    { q: "Which parts of a system are most worth covering with container-backed tests?",
      a: ["Business rules in the service layer", "The boundaries: repository queries against the real dialect, the migration chain, and a produce-and-consume round trip through a real broker", "Controllers and their JSON shape", "Utility classes and mappers"],
      c: 1,
      why: "Those are the places two systems meet, which is where things actually break. Everything else is faster and just as reliable as a plain unit test." },

    { q: "Why is @EmbeddedKafka a weaker choice than a Kafka container for integration tests?",
      a: ["It cannot handle multiple partitions", "It is not the broker you deploy, so behaviour and configuration can differ from production", "It requires a running ZooKeeper", "It does not support consumer groups"],
      c: 1,
      why: "It is the same argument as H2 versus Oracle. Convenient, and testing something adjacent to what you ship rather than what you ship." },
  ],

  /* ------------------------------------------------------- 40-maven-gradle --- */
  "40-maven-gradle": [
    { q: "How does Maven resolve a conflict when two dependencies require different versions of the same library?",
      a: ["It picks the highest version", "Nearest wins: the shortest path in the dependency tree, which is not necessarily the highest version", "It fails the build and asks you to choose", "It includes both, isolated by classloader"],
      c: 1,
      why: "Gradle picks the highest by default, which surprises people moving the other way. Adding an unrelated dependency can therefore silently downgrade something." },

    { q: "Code compiles but throws NoSuchMethodError at runtime. What has happened?",
      a: ["The method is private", "You compiled against one version of a library and are running against another", "The JVM version is too old", "The class was loaded twice"],
      c: 1,
      why: "It is a dependency conflict, not a code bug. dependency:tree shows which path won; the fix is pinning the version in dependencyManagement rather than scattering exclusions." },

    { q: "Why should you always use the Maven or Gradle wrapper script committed to the repository?",
      a: ["It downloads dependencies faster", "It pins the build-tool version, so CI and every developer build with the same one", "It is required for reproducible builds by the specification", "It caches the local repository in the project"],
      c: 1,
      why: "'It builds on my machine' caused by two different Maven versions is a real and stupid way to lose an afternoon." },

    { q: "What does the provided scope mean in Maven?",
      a: ["The dependency is bundled into the artefact", "Something else supplies it at runtime, so it is on the compile classpath but not packaged", "It is only used by tests", "It is optional and may be absent at compile time"],
      c: 1,
      why: "Correct for a servlet API in a WAR, and the cause of NoClassDefFoundError when nothing actually provides it. Scopes are load-bearing rather than decorative." },

    { q: "What is a BOM in Maven?",
      a: ["A build output manifest", "A published list of dependency versions known to work together, imported so you stop choosing versions yourself", "A binary object model for the artefact", "A bill of materials listing licences"],
      c: 1,
      why: "spring-boot-dependencies is the BOM behind the starters. Declaring a dependency without a version and letting the BOM decide is the correct default; overriding one should have a reason." },

    { q: "Which command shows why a particular version of a library is on the classpath?",
      a: ["mvn dependency:list", "mvn dependency:tree, optionally with -Dincludes to filter", "mvn versions:display-dependency-updates", "mvn help:effective-pom"],
      c: 1,
      why: "The 'omitted for conflict' lines are the interesting ones: each is a version you are not getting. Gradle's equivalent is dependencyInsight." },

    { q: "What does Maven's fixed lifecycle give you that a task graph does not?",
      a: ["Faster builds", "A predictable, uniform sequence that any developer can read without learning the project's own build", "Incremental compilation", "Parallel module execution"],
      c: 1,
      why: "Gradle is faster on large projects and more flexible in ways that can become a bespoke build nobody understands. Both trades are real." },

    { q: "In a multi-module project, what stops a utility module quietly depending on the web layer?",
      a: ["The compiler", "Each module declaring only what it needs, so the dependency graph is a design document rather than an accident", "The BOM", "Package-private visibility"],
      c: 1,
      why: "Shared configuration goes in the parent pom; dependencies stay per module. Without that discipline, module boundaries stop meaning anything within a year." },
  ],

  /* ------------------------------------------------------- 41-docker --- */
  "41-docker": [
    { q: "Why is copying a Spring Boot fat jar as a single COPY layer inefficient?",
      a: ["The jar is compressed twice", "Dependencies and application code change at very different rates, so a one-line code change invalidates 60 MB of unchanged layers", "Docker cannot cache jar files", "The jar must be extracted to run"],
      c: 1,
      why: "Spring Boot's layered jars split the artefact into dependencies, snapshot dependencies, loader and application, so a code-only change pushes kilobytes." },

    { q: "What is the purpose of a multi-stage Docker build for a Java application?",
      a: ["To build for several architectures", "To keep the JDK, the source and the build cache out of the final image, which ships only a JRE and the application", "To run tests in a separate container", "To allow rollback to a previous stage"],
      c: 1,
      why: "The alternative is shipping your build environment to production, which is larger, slower to pull and a wider attack surface." },

    { q: "A pod running a Spring service is killed with exit code 137. What should you change first?",
      a: ["Increase the number of replicas", "Set MaxRAMPercentage deliberately and make the container memory limit exceed the heap by a real margin", "Switch garbage collector to ZGC", "Reduce the thread pool size"],
      c: 1,
      why: "The heap is not the whole footprint: metaspace, thread stacks, code cache and direct buffers live outside it. It is the most common Java-on-Kubernetes production problem and a one-line fix." },

    { q: "Why is MaxRAMPercentage preferable to a hardcoded -Xmx in an image?",
      a: ["It allows the heap to exceed the limit when needed", "The heap follows whatever limit the container is given, so changing the Kubernetes limit cannot silently desynchronise the two", "It is required by the JVM in containers", "-Xmx is ignored inside containers"],
      c: 1,
      why: "Two numbers that must be kept in step by hand eventually will not be. Percentage sizing couples them." },

    { q: "Why must a container image intended for OpenShift not assume it runs as root?",
      a: ["Root is slower in containers", "OpenShift runs containers with an arbitrary non-root UID from a per-namespace range, so images that chown or write to a fixed home directory fail", "OpenShift blocks the USER instruction", "Root images cannot be pushed to the internal registry"],
      c: 1,
      why: "Security Context Constraints are the specific detail here, and very few candidates know it. Build with a group-writable working directory and no assumption about the UID." },

    { q: "What does ./mvnw spring-boot:build-image produce?",
      a: ["A fat jar only", "A sensibly layered container image using buildpacks, with no Dockerfile to maintain", "A native executable", "A Kubernetes manifest"],
      c: 1,
      why: "It is a good answer to 'how do you containerise', particularly for a team that would rather not own Dockerfile expertise." },

    { q: "What does jlink allow you to do for a container image?",
      a: ["Link native libraries into the JVM", "Build a custom runtime containing only the modules your application uses", "Combine several jars into one", "Link the image layers together"],
      c: 1,
      why: "It is the practical use most teams get from the module system, even though almost nobody declares a module-info for their own code." },

    { q: "What is the trade-off of an Alpine-based Java image?",
      a: ["Smaller but slower to start", "Smaller, but it uses musl rather than glibc, which occasionally matters for native libraries", "Smaller but incompatible with the JVM", "Larger but more secure"],
      c: 1,
      why: "Distroless goes further by removing the shell entirely: excellent for security, inconvenient the day you want to exec into a pod to look at something." },
  ],

  /* ------------------------------------------------------- 42-kubernetes --- */
  "42-kubernetes": [
    { q: "What is the difference between a liveness probe and a readiness probe?",
      a: ["Liveness removes the pod from the Service; readiness restarts it", "Liveness failing restarts the pod; readiness failing removes it from the Service without restarting", "They are identical, with different intervals", "Liveness runs at start-up only; readiness runs continuously"],
      c: 1,
      why: "Getting them the wrong way round is how a deploy takes the service down. Boot exposes /actuator/health/liveness and /actuator/health/readiness separately for exactly this." },

    { q: "Why should a liveness probe not include a database check?",
      a: ["Database checks are too slow for a probe", "A database blip makes every pod fail liveness at once, so Kubernetes restarts all of them and a recoverable problem becomes a full outage", "The probe cannot open a database connection", "It would require credentials in the probe configuration"],
      c: 1,
      why: "Liveness should ask only whether the process is wedged. Dependencies belong in readiness, where failing simply means no traffic until they recover." },

    { q: "Why do JVM applications frequently need a startup probe?",
      a: ["Because they open many file descriptors", "Because they boot slowly, and without one the liveness probe starts failing before the application is ready", "Because the JIT needs warming up first", "Because Spring registers beans asynchronously"],
      c: 1,
      why: "A startup probe with a generous failure threshold gives the application time to boot, after which liveness takes over with a short interval." },

    { q: "What do Kubernetes resource requests and limits each control?",
      a: ["Requests cap usage; limits reserve capacity", "Requests decide scheduling; limits decide when you are throttled on CPU or killed on memory", "Both are advisory only", "Requests apply to CPU and limits to memory"],
      c: 1,
      why: "A pod with no memory limit can be evicted under node pressure; one with a limit below what the JVM will use gets exit code 137." },

    { q: "What happens to in-flight requests during a deploy without graceful shutdown?",
      a: ["They complete, because Kubernetes waits", "They are cut off when the process exits", "They are retried automatically by the Service", "They are queued until the new pod is ready"],
      c: 1,
      why: "Set server.shutdown=graceful and a terminationGracePeriodSeconds longer than your longest request, and give the endpoints controller a moment to stop sending traffic first." },

    { q: "Which Kubernetes object supplies a Spring application's configuration and secrets?",
      a: ["ConfigMap and Secret, usually mounted as environment variables", "A PersistentVolumeClaim", "The Deployment's annotations", "A ServiceAccount"],
      c: 0,
      why: "Relaxed binding is what makes this tidy: SPRING_DATASOURCE_URL as an environment variable maps onto spring.datasource.url with no translation layer." },

    { q: "What does OpenShift provide instead of, or alongside, an Ingress?",
      a: ["A Gateway", "A Route", "An Endpoint", "A NodePort"],
      c: 1,
      why: "Along with an integrated registry and BuildConfigs or Source-to-Image if the cluster builds your images. Naming Routes and SCCs is what distinguishes real OpenShift experience." },

    { q: "Why does a Deployment keep the number of pods you asked for?",
      a: ["The scheduler polls the pods directly", "It manages a ReplicaSet, which reconciles actual state towards the declared replica count", "The kubelet restarts them locally", "The Service maintains the count"],
      c: 1,
      why: "The rolling update strategy starts new pods before removing old ones, which is why probes matter so much: a pod reporting ready too early takes traffic it cannot serve." },
  ],

  /* ------------------------------------------------------- 43-aws --- */
  "43-aws": [
    { q: "How should an application running on EC2 or EKS obtain AWS credentials?",
      a: ["Long-lived access keys in environment variables", "An assumed IAM role, giving temporary rotating credentials that the SDK finds through the default provider chain", "A key file baked into the container image", "A username and password in Secrets Manager"],
      c: 1,
      why: "An instance profile on EC2, or IRSA on EKS. Long-lived keys are the most common finding in any AWS review, and roles exist precisely so there is no key to commit." },

    { q: "What is S3, precisely?",
      a: ["A network file system with directories", "Object storage: immutable objects under keys, with prefixes rather than real directories", "A block device attached to an instance", "A managed relational database"],
      c: 1,
      why: "Listing is expensive relative to fetching a known key, and there is no cheap rename. Treating it as a filesystem is the source of most surprises." },

    { q: "Why use presigned S3 URLs for uploads and downloads?",
      a: ["They are cheaper than direct access", "Clients transfer directly to and from S3, so the bytes never stream through your JVM", "They avoid the need for IAM roles", "They allow cross-region replication"],
      c: 1,
      why: "That single decision removes most of the memory pressure document-heavy applications suffer, and it removes your service from the critical path of a large transfer." },

    { q: "Which IAM policy is a review finding waiting to happen?",
      a: ["s3:GetObject on a specific bucket prefix", "s3:* on *", "Read access scoped to one bucket", "A role assumed by one service account"],
      c: 1,
      why: "Least privilege with specific resource ARNs is the standard. Wildcards on both the action and the resource are the definition of over-permissioned." },

    { q: "Where should a database password be read from in an AWS-deployed Spring application?",
      a: ["An environment variable set in the Dockerfile", "Secrets Manager or SSM Parameter Store, read at start-up through the assumed role", "A file committed alongside application-prod.yml", "The EC2 instance metadata service"],
      c: 1,
      why: "It keeps the secret out of the image and out of git, and rotation becomes possible without rebuilding anything." },

    { q: "Which AWS traffic costs money?",
      a: ["Inbound traffic only", "Outbound traffic, and traffic between availability zones", "All traffic, at the same rate", "Only traffic to the public internet"],
      c: 1,
      why: "Inbound is free. A chatty pair of services in different zones produces a surprising line on the bill, which is the sort of detail worth raising unprompted." },

    { q: "Which AWS region is Milan, and why might it matter for these adverts?",
      a: ["eu-west-1, for latency", "eu-south-1, for latency and Italian data-residency requirements", "eu-central-1, for GDPR compliance", "eu-north-1, for cost"],
      c: 1,
      why: "Data residency is a real constraint in Italian public-sector and regulated work, and naming the region shows you have thought about deployment rather than only about code." },

    { q: "Why can a job doing millions of small S3 GET requests cost more than the storage it reads?",
      a: ["Small objects are billed at a higher storage rate", "S3 bills per request as well as per gigabyte stored, and requests dominate for many small reads", "Each GET triggers a replication event", "Small objects are stored redundantly across more zones"],
      c: 1,
      why: "Storage is cheap and requests are not. Batching reads, or storing fewer larger objects, is usually the fix." },
  ],

  /* ------------------------------------------------------- 44-ci-cd --- */
  "44-ci-cd": [
    { q: "Why should a pipeline build once and promote the same artefact through environments?",
      a: ["It uses less CI time", "Rebuilding per environment reintroduces the chance that a dependency resolved differently, so the thing you tested is not the thing you shipped", "Registries charge per build", "It is required for reproducible builds"],
      c: 1,
      why: "Configuration is injected per environment instead, which is what the property-source ordering in chapter 13 exists to support." },

    { q: "Why should container images be tagged with the git SHA rather than latest?",
      a: ["latest is reserved by the registry", "latest is not a version: it makes rollback ambiguous and defeats layer caching", "SHA tags compress better", "Kubernetes rejects the latest tag"],
      c: 1,
      why: "A deployment referencing latest cannot tell you what is actually running, which is the first question during an incident." },

    { q: "How should pipeline stages be ordered?",
      a: ["Alphabetically, for predictability", "By cost: unit tests before integration tests, scanning before the image build, deployment last", "Deployment first, so feedback is realistic", "In parallel, all at once"],
      c: 1,
      why: "A pipeline that takes forty minutes to tell you about a typo is a pipeline people route around, and a routed-around pipeline protects nothing." },

    { q: "Where should database migrations run in a deployment process?",
      a: ["At application start-up, guarded by a lock", "As a distinct gated pipeline step before the new version is deployed", "Manually, after the deployment succeeds", "In a sidecar container alongside each pod"],
      c: 1,
      why: "Instances starting together race, and the runtime database account would otherwise need schema-altering rights it should never hold." },

    { q: "Why should the application's runtime database account not hold DDL rights?",
      a: ["It slows down connection establishment", "Because a compromised or buggy application could then alter or drop schema objects", "Because Flyway requires a separate account", "Because DDL rights prevent connection pooling"],
      c: 1,
      why: "Separating who may change the schema from who may read and write rows is a standard least-privilege boundary, and running migrations in the pipeline is what makes it practical." },

    { q: "What does a dependency vulnerability scan in CI need in order to be useful rather than ignored?",
      a: ["A zero-tolerance gate that fails any finding", "A policy stating what actually blocks a release, so results are a triage list rather than noise", "Weekly rather than per-build execution", "Integration with the issue tracker"],
      c: 1,
      why: "Either extreme fails: a gate that blocks everything gets bypassed, and a report nobody owns gets ignored. 'We scan, and we have a policy' is the answer that survives scrutiny." },

    { q: "Why does rolling back a deployment not undo a database migration?",
      a: ["Migrations run outside the pipeline", "Rollback reverses the code only, so a dropped column the previous version reads makes rollback impossible", "Flyway reverses the last migration automatically", "Migrations are applied lazily on first use"],
      c: 1,
      why: "That is the whole argument for expand-and-contract, and it is worth stating in exactly those terms: fixing forward under pressure is the alternative." },

    { q: "What does promoting an image by digest rather than by tag guarantee?",
      a: ["A smaller download", "That the bytes deployed to production are exactly the bytes that passed the pipeline, since a tag can be moved", "Faster pulls from the registry", "Automatic vulnerability rescanning"],
      c: 1,
      why: "Tags are mutable pointers. A digest is content-addressed, which removes an entire class of 'that is not what we tested' incident." },
  ],

  /* ------------------------------------------------------- 45-legacy-java-ee --- */
  "45-legacy-java-ee": [
    { q: "In a classic Java EE application, what supplied database connections, transactions and security?",
      a: ["A framework packaged inside the WAR", "The application server, through JNDI, container-managed transactions and its own security realm", "The operating system", "A sidecar process"],
      c: 1,
      why: "Those are the same concerns Spring later provided in-process. Recognising them as the same concerns is what makes an EJB codebase readable rather than alien." },

    { q: "Which Spring annotation is @Stateless roughly equivalent to?",
      a: ["@Component", "@Service", "@Repository", "@Configuration"],
      c: 1,
      why: "Container-managed transactions map roughly onto @Transactional, and JPA is JPA in both worlds. The vocabulary differs far more than the concepts." },

    { q: "What is JSF, and why is it unlike a modern single-page application?",
      a: ["A JSON serialisation framework", "A stateful, server-side component model that keeps a view tree in the session", "A dependency injection container", "A build tool for enterprise applications"],
      c: 1,
      why: "Reasoning about it as though it were an SPA leads nowhere. The state lives on the server and the browser holds a token pointing at it." },

    { q: "Why did Java EE become Jakarta EE, and what changed in code?",
      a: ["A version renumbering; nothing changed", "Oracle donated the platform but not the trademark, so every javax package became jakarta from Jakarta EE 9", "The APIs were rewritten from scratch", "The specification moved to a binary format"],
      c: 1,
      why: "Nothing else needed to change, and everything broke: every library had to be recompiled and no application could mix the two namespaces." },

    { q: "Why does Spring Boot 3 require Java 17 and Jakarta EE 9 or later?",
      a: ["To use virtual threads", "Because it adopted the jakarta namespace, so the Boot 2 to 3 upgrade is largely that rename plus libraries that had not migrated", "To support GraalVM only", "Because Java 11 reached end of life"],
      c: 1,
      why: "The honest difficulty in that migration is never your own code. It is a transitive dependency that never shipped a jakarta build." },

    { q: "Which failures do automated javax-to-jakarta rename tools typically miss?",
      a: ["Import statements", "Class names inside strings: XML configuration, persistence.xml, reflection lookups and property files", "Method signatures", "Annotation attributes"],
      c: 1,
      why: "Those fail at runtime rather than at compile time, which is the worst possible place to discover them." },

    { q: "What is the strangler pattern for modernising a legacy system?",
      a: ["Rewrite the system in parallel and switch over on one date", "Put a facade in front, move one capability at a time into a new service, and let the old system shrink", "Freeze the old system and build only new features elsewhere", "Refactor the legacy code in place, module by module"],
      c: 1,
      why: "It is the answer interviewers want because it is the one that survives contact with a budget, and it keeps the business running throughout." },

    { q: "What should you do before changing behaviour in a legacy system with no specification?",
      a: ["Rewrite the module cleanly first", "Write characterisation tests around the existing behaviour, since the behaviour is the specification", "Ask the original authors to document it", "Add logging and observe production for a month"],
      c: 1,
      why: "A system that has run the business for ten years contains a great deal of undocumented correctness, and a rewrite discards it. Tests are how you make change safe rather than brave." },
  ],

  /* ------------------------------------------------------- 46-angular-frontend --- */
  "46-angular-frontend": [
    { q: "How does Angular's dependency injection compare with Spring's?",
      a: ["It is unrelated; Angular uses global singletons", "It is constructor injection with a hierarchical injector, so a Spring developer will recognise it", "It injects by name rather than by type", "It only supports field injection"],
      c: 1,
      why: "Components own view state; services own data access and shared logic and are usually singletons at the root injector. The concepts transfer directly." },

    { q: "What has largely replaced NgModules in modern Angular?",
      a: ["Web components", "Standalone components", "Directives", "Pipes"],
      c: 1,
      why: "Signals are the other recent change, sitting alongside RxJS as a reactive primitive. Knowing both is what stops you sounding five years out of date." },

    { q: "Why does an Angular HTTP call sometimes appear not to happen at all?",
      a: ["The interceptor swallowed it", "Observables are lazy and cold: no request is sent until something subscribes", "Angular batches requests until change detection runs", "The URL was resolved relative to the wrong base"],
      c: 1,
      why: "It is the first thing that confuses a backend developer. The async pipe in a template subscribes and unsubscribes with the component's lifetime, which also removes the leak." },

    { q: "Why is switchMap the correct operator for a typeahead search, rather than mergeMap?",
      a: ["It is faster", "It cancels the previous inner request, so an earlier slow response cannot arrive later and overwrite a newer one", "It guarantees ordering of responses", "mergeMap does not work with HTTP"],
      c: 1,
      why: "With mergeMap the user sees results for a query they have already changed. It is a correctness difference rather than a style preference." },

    { q: "What is the most common Angular code-review comment about manual subscribe calls?",
      a: ["Use a promise instead", "There is no unsubscribe, so the component leaks; prefer the async pipe or takeUntilDestroyed", "Subscriptions must be typed explicitly", "Subscribe must be called inside ngOnInit"],
      c: 1,
      why: "Now that you know it, you can make it. It is the single most useful thing a backend developer can contribute to an Angular pull request." },

    { q: "A browser console shows a CORS error. What is the cause surprisingly often?",
      a: ["The server does not send Access-Control-Allow-Origin", "The preflight OPTIONS request returned 401, because the security filter chain required authentication for it", "The client used the wrong HTTP method", "The response body was too large"],
      c: 1,
      why: "Preflight must succeed without authentication. Configure CORS in Spring rather than adding headers by hand, so the filter chain and the CORS rules agree." },

    { q: "Why should a REST API send ISO-8601 dates rather than pre-formatted local strings?",
      a: ["ISO-8601 is shorter", "Only the browser knows the user's timezone and locale, so formatting belongs on the client", "Angular cannot parse other formats", "It avoids daylight-saving bugs on the server"],
      c: 1,
      why: "It also keeps the contract unambiguous. A pre-formatted string forces every consumer to reverse-engineer the format before it can do anything else with the value." },

    { q: "What does generating the TypeScript client from OpenAPI buy the front end?",
      a: ["Smaller bundle size", "A renamed field breaks the build rather than the page", "Automatic retry on failure", "Server-side rendering"],
      c: 1,
      why: "It moves an integration failure from runtime to compile time, which is the same argument as contract-first in chapter 21." },
  ],

  /* ------------------------------------------------------- 47-gestionali --- */
  "47-gestionali": [
    { q: "What is a gestionale?",
      a: ["A build management tool", "A business-management application: orders, stock, invoicing and production, with decades of accumulated rules", "An Italian project-management methodology", "A reporting layer over an ERP"],
      c: 1,
      why: "If a recruiter says gestionale, they are describing the job. The hard part is rarely the technology; it is that the domain terms each mean something precise." },

    { q: "What does DDT mean in the Italian business domain?",
      a: ["A tax declaration", "Documento di trasporto: a delivery note accompanying goods", "A payment term", "A data transfer template"],
      c: 1,
      why: "Alongside fattura, anagrafica, commessa and partita IVA, it is vocabulary worth having before the first phone call. Getting one wrong produces a legal problem rather than a bug report." },

    { q: "What form does an Italian B2B invoice take under fatturazione elettronica?",
      a: ["A signed PDF sent by certified email", "A FatturaPA XML document, digitally signed and transmitted through the Sistema di Interscambio", "A CSV upload to the tax authority's portal", "A REST call to the customer's accounting system"],
      c: 1,
      why: "SDI validates it and returns receipts asynchronously: delivered, not delivered, or rejected with an error code. It has been mandatory for B2B since 2019." },

    { q: "Why is the SDI integration technically interesting rather than routine?",
      a: ["It uses a proprietary binary protocol", "It is an asynchronous integration with a stateful workflow and legal deadlines, so receipts arrive later and rejections must be corrected in time", "It requires a dedicated leased line", "It only accepts submissions during business hours"],
      c: 1,
      why: "It is exactly the shape that chapter 33's messaging and chapter 17's idempotency exist for. Most companies use an intermediary rather than talking to SDI directly." },

    { q: "Why can invoice numbering not be left to a database sequence with gaps?",
      a: ["Sequences are too slow", "Numbering must be sequential without gaps per year and per sezionale, which is a legal requirement rather than a design preference", "Sequences are not supported on Oracle", "The XML schema forbids numeric ids"],
      c: 1,
      why: "A @GeneratedValue sequence with gaps is not acceptable, and neither is allocating a number before the invoice is certain to exist." },

    { q: "How do integrations with an existing gestionale or ERP usually arrive?",
      a: ["As a documented REST API with an OpenAPI specification", "As CSV, SFTP or a database view, because that is what the other side supports", "As a message queue subscription", "As a GraphQL endpoint"],
      c: 1,
      why: "Meeting the other side where it is, rather than where you would prefer it to be, is most of what makes integration projects deliverable." },

    { q: "In a commessa, what is the specification most likely to be in practice?",
      a: ["A formal requirements document", "A spreadsheet from the client's domain expert, which turns out to be incomplete", "A set of user stories in the tracker", "An OpenAPI document"],
      c: 1,
      why: "The people who do well are the ones who ask domain questions early and write down the answers, because the gaps are discovered by asking rather than by reading." },

    { q: "What differentiates a candidate in an interview at an Italian software house building gestionali?",
      a: ["Knowing the newest framework versions", "Curiosity about the domain: asking what a DDT is for, rather than only asking about the stack", "Having contributed to open source", "Certification in the database vendor's products"],
      c: 1,
      why: "These companies have met plenty of developers who wanted to talk about frameworks and few who wanted to understand the business the software runs." },
  ],

  /* ------------------------------------------------------- 48-agile-scrum --- */
  "48-agile-scrum": [
    { q: "What is a stand-up actually for?",
      a: ["Reporting status to a manager", "Synchronising between peers, which is why blockers matter more than a list of activity", "Assigning the day's tasks", "Reviewing the previous day's commits"],
      c: 1,
      why: "'Yesterday I worked on the ticket' is a wasted turn. 'I am blocked on the test environment, who has access?' is a useful one, because somebody in the room can act on it." },

    { q: "Which ceremony gives a developer the most leverage over the sprint's outcome?",
      a: ["Planning", "Refinement", "The retrospective", "The demo"],
      c: 1,
      why: "The question that prevents a week of wrong work gets asked before anyone estimates. By planning, the shape of the work is already fixed." },

    { q: "What do story points express?",
      a: ["Hours of work", "Relative size: complexity, uncertainty and effort together", "Business value delivered", "The number of developers required"],
      c: 1,
      why: "People are far better at comparison than at absolute duration. Velocity is a planning input for a team, not a productivity measure for a person." },

    { q: "What is the better response when you cannot estimate a task?",
      a: ["Give a generous number to be safe", "Say you need a spike first, and time-box it", "Split it arbitrarily into smaller tasks", "Take the average of the team's guesses"],
      c: 1,
      why: "A guess dressed as an estimate becomes a commitment. Saying you do not know enough yet reads as experience rather than as evasion." },

    { q: "When should you flag that a task is running late?",
      a: ["At the end of the sprint, with the reason", "As soon as you know, because nobody minds a task taking longer; they mind finding out too late to react", "Only if it will miss the sprint entirely", "In the retrospective"],
      c: 1,
      why: "Early notice preserves options: rescope, add help, or move the deadline. Late notice removes all three." },

    { q: "How should you present your process experience in an interview at an Italian software house?",
      a: ["As strict Scrum, since that is the standard", "Describe how you actually worked, then ask how they work", "Say that process does not matter if the code is good", "Emphasise certifications in Agile frameworks"],
      c: 1,
      why: "Most run something between Scrum and fixed-date commessa work. A candidate who insists on doctrine reads as someone who will be difficult about reality." },

    { q: "Why should a pull request be small?",
      a: ["Large ones fail the build more often", "Because a large one cannot be reviewed properly, so it is approved rather than read", "Because git performs better", "Because CI runs faster"],
      c: 1,
      why: "A review that rubber-stamps is worse than no review, because it creates the appearance of a check that did not happen." },

    { q: "How long should you stay stuck before asking for help?",
      a: ["Ask immediately, to save time", "Roughly half an hour to an hour: long enough to have tried, short enough that somebody could have unblocked you in two minutes", "A full day, to demonstrate independence", "Until the end of the sprint"],
      c: 1,
      why: "Both failure modes are real. Asking instantly signals you have not tried; silence for a day wastes a day somebody else could have saved." },
  ],

  /* ------------------------------------------------------- 49-english --- */
  "49-english": [
    { q: "What English level do these adverts practically require?",
      a: ["Native fluency", "About B2: follow a technical discussion at natural speed, disagree clearly, and write documentation someone can act on", "Reading comprehension only", "C2, for international teams"],
      c: 1,
      why: "The failure companies screen for is not imperfect grammar. It is a candidate who goes silent in a call because they did not understand and did not say so." },

    { q: "What is the most useful habit in an English-language technical call?",
      a: ["Speaking slowly to avoid mistakes", "Asking for repetition without apologising: 'Sorry, could you repeat that?'", "Writing everything down and replying later", "Avoiding idioms entirely"],
      c: 1,
      why: "Native speakers use those sentences with each other constantly. Using them reads as competence rather than weakness." },

    { q: "What does the English word 'eventually' mean?",
      a: ["Possibly, or if needed", "In the end, or finally", "Occasionally", "Immediately"],
      c: 1,
      why: "It is a false friend for eventualmente. The word you want is possibly or if needed, and the confusion changes the meaning of a commitment." },

    { q: "What does 'actually' mean in English?",
      a: ["Currently, at the moment", "In reality, or in fact", "Eventually", "Frequently"],
      c: 1,
      why: "Another false friend, for attualmente. 'Actually we are using Java 11' sounds like a correction rather than a status report, which changes the tone of an answer." },

    { q: "Which phrase is the professional way to disagree in a technical discussion?",
      a: ["That is wrong", "I see it differently, my concern is...", "I do not think so", "Are you sure about that?"],
      c: 1,
      why: "It states a position and gives a reason to engage with, rather than a verdict. Learn it as a fixed phrase so it costs nothing under pressure." },

    { q: "What is the right structure for written technical English in an international team?",
      a: ["Full background first, then the conclusion", "Conclusion first, then the detail, in short sentences", "One long paragraph, so nothing is missed", "Bullet points only, with no prose"],
      c: 1,
      why: "People skim. Short sentences and simple tenses are what good technical writing looks like in any language, not a limitation of yours." },

    { q: "What should an asynchronous message across time zones always include?",
      a: ["An apology for the delay", "What you need and by when, since a reply may be twelve hours away", "A summary of the whole project", "A proposed meeting time"],
      c: 1,
      why: "'Could you confirm X, so I can continue tomorrow morning?' saves a full day compared with 'What do you think?'" },

    { q: "How should you answer 'how would you describe your English level' in an interview?",
      a: ["Claim C1 to avoid doubt", "Answer in English, briefly, with evidence, and name the weaker skill and how you handle it", "Give the certificate you hold", "Say it is sufficient for the role"],
      c: 1,
      why: "Naming the weaker skill and your strategy for it is more convincing than a level claim, and it demonstrates the ability while describing it." },
  ],

  /* ------------------------------------------------------- 50-the-cv --- */
  "50-the-cv": [
    { q: "What does an applicant tracking system actually read from your CV?",
      a: ["The rendered layout", "The extracted text layer, which is why a multi-column layout can be read in the wrong order", "The document metadata only", "An AI summary of the whole file"],
      c: 1,
      why: "Single column, real text rather than an image, standard section headings. If the text cannot be extracted cleanly, a human may never see it." },

    { q: "If an advert says 'Spring Boot' and your CV says 'SpringBoot', what have you done?",
      a: ["Nothing; matching is fuzzy", "Thrown away a keyword match for no reason", "Improved readability", "Triggered a spelling penalty"],
      c: 1,
      why: "Alignment means using the advert's exact vocabulary for things you have genuinely done. It costs nothing and is entirely legitimate." },

    { q: "Which ATS technique is legitimate?",
      a: ["White text containing extra keywords", "Using the advert's own wording for skills you actually have", "A hidden layer of technology names", "Repeating a keyword many times in the footer"],
      c: 1,
      why: "Hidden text is detectable, and a company that catches it does not proceed. The cost is disqualification rather than a lower score." },

    { q: "Why should you verify the extracted text layer of your CV PDF?",
      a: ["To check the file size", "Because a layout change, such as adding a container to position a photo, can silently reorder the text so the document no longer starts with your name", "Because PDFs expire", "To confirm the fonts embedded correctly"],
      c: 1,
      why: "It is a real failure mode rather than a hypothetical one. Extract the text after any edit and read what actually comes out." },

    { q: "Which CV bullet is stronger?",
      a: ["Responsible for backend development", "Built a REST API in Spring Boot: 34 endpoints, JWT auth, 210 tests, deployed on Kubernetes", "Extensive experience with Java and related technologies", "Worked in an Agile team on enterprise applications"],
      c: 1,
      why: "Outcome plus evidence, not responsibilities. Every noun in it is something you can be asked about, which is the point." },

    { q: "What is the test for whether a claim belongs on your CV?",
      a: ["Whether it appears in the advert", "Whether you would be happy discussing it for five minutes", "Whether you used it in the last year", "Whether it fits on one line"],
      c: 1,
      why: "Every number is a question you have invited. A shorter CV you can defend beats a longer one you cannot." },

    { q: "What is the convention on photos for Italian CVs?",
      a: ["Always include one", "Conventional for Italian SMEs; leave it off for international and product companies", "Never include one", "Only for client-facing roles"],
      c: 1,
      why: "Which is why maintaining an Italian version and an English version is worth the effort, rather than translating one at the last minute." },

    { q: "When experience is thin, what is the strongest thing on the page?",
      a: ["A list of completed courses", "A deployed, working project with a readable README that someone can open", "A skills matrix with proficiency ratings", "A personal statement about motivation"],
      c: 1,
      why: "It is evidence of the thing an employer cannot otherwise verify: that you finish things. Make sure the link works, because a dead link is worse than no link." },
  ],

  /* ------------------------------------------------------- 51-the-interview --- */
  "51-the-interview": [
    { q: "How long should the answer to 'mi parli di lei' be, and what should it end on?",
      a: ["Five minutes, ending on your education", "About two minutes, ending on why you applied for this role", "Thirty seconds, to leave time for questions", "As long as needed to cover every job"],
      c: 1,
      why: "Where you are now, one or two relevant things you have built, and why this role. Rehearse it aloud so the shape is automatic and two minutes does not become six." },

    { q: "What is the right structure for a behavioural question?",
      a: ["Chronological narrative from the beginning", "Situation, task, action, result", "Problem and solution only", "A general description of how you usually work"],
      c: 1,
      why: "For technical questions the equivalent shape is mechanism, then consequence, then an example, which is exactly what every 'Al colloquio' box in this course does." },

    { q: "What should you say when you do not know the answer to a technical question?",
      a: ["Give your best guess confidently", "Say so, then say what you understand and how you would find out", "Change the subject to something you know", "Ask to come back to it at the end"],
      c: 1,
      why: "A confident wrong answer makes everything else you said suspect. 'I have not used that; from what I understand it does X, is that how you use it?' keeps the conversation going." },

    { q: "In a live coding or design exercise, what is actually being assessed?",
      a: ["Whether you reach the correct answer", "The process: restating the problem, asking about constraints, naming assumptions and checking your own work", "Typing speed and IDE fluency", "Knowledge of standard library methods"],
      c: 1,
      why: "Silence is the worst outcome. A wrong idea narrated aloud gives them something to engage with; five quiet minutes gives them nothing." },

    { q: "What makes an inflated claim on a CV expensive in an interview?",
      a: ["It is unprofessional", "It survives until the follow-up question, and the damage is that everything else you said now needs verifying", "It is usually detected by the screening software", "It leads to a lower salary offer"],
      c: 1,
      why: "If Kafka is on your CV because you did a course and ran a local cluster, say precisely that. It is a good answer, and it is one they can trust." },

    { q: "How should you answer the salary question?",
      a: ["With a net monthly figure", "With a gross annual RAL range, noting it is negotiable on the overall package", "By asking for their budget first and nothing else", "By deferring until an offer is made"],
      c: 1,
      why: "Also ask which CCNL and level, whether it is indeterminato or apprendistato, and how many mensilita. Those change the real figure and asking is completely normal." },

    { q: "Which question tells you most about what the job is actually like?",
      a: ["What technologies do you use?", "How does a change reach production?", "How large is the team?", "Do you offer remote work?"],
      c: 1,
      why: "The answer reveals the pipeline, the release cadence, the testing culture and how much ceremony surrounds a deploy, all at once." },

    { q: "What is the effect of answering 'no' to 'do you have any questions for us'?",
      a: ["It is neutral and saves time", "It reads as not being interested, and wastes the one part of the interview you control", "It signals confidence in the role", "It is expected for junior positions"],
      c: 1,
      why: "'What would a good first three months look like?' is particularly good: it makes them articulate what success means, and their answer tells you whether they have thought about it at all." },
  ],

});

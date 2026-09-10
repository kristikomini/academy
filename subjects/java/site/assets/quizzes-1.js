/* ==========================================================================
   quizzes-1.js — the question bank, part 1.

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

  /* ------------------------------------------------------- 00-the-job-posting --- */
  "00-the-job-posting": [
    { q: "In an Italian job advert, what is the practical difference between the 'requisiti' block and the 'a completamento del profilo' block?",
      a: ["They are the same list, split for readability", "Requisiti is the screening filter and usually the interview agenda; the second block is negotiating room", "A completamento del profilo lists the mandatory items and requisiti the optional ones", "The second block is a legal formality with no bearing on hiring"],
      c: 1,
      why: "The first block is what an interviewer with no preparation time walks down, so you should be able to speak for two minutes on every line of it. The second exists so the company can hire someone who has four of the eight, which is why a gap there is a question to prepare rather than a reason not to apply." },

    { q: "Which four technologies appeared in every one of the six Java postings this course was built from?",
      a: ["Java, Spring Boot, Spring Data JPA, REST", "Java, Kubernetes, Kafka, Oracle", "Java, Angular, AWS, Docker", "Java, Quarkus, GraphQL, MongoDB"],
      c: 0,
      why: "That intersection is Parts 2 and 3 of this course, and it is where preparation time has the highest expected value because no advert lets you skip it. Kubernetes, AWS, Kafka, Angular, Quarkus and GraphQL each appeared in only one or two." },

    { q: "What does RAL mean in an Italian salary conversation?",
      a: ["Net monthly pay after deductions", "Gross annual pay, across 13 or 14 mensilita", "The maximum the company has budgeted", "Gross monthly pay including bonuses"],
      c: 1,
      why: "Retribuzione annua lorda: gross annual, not monthly and not net. Net lands around 55 to 65 per cent of it. Answering with a monthly net figure invites the recruiter to convert it silently, usually to your disadvantage." },

    { q: "On this platform, what does it mean when a chapter carries an 'extra' field instead of a 'req'?",
      a: ["The chapter is optional and can be skipped", "No advert asked for it, and the field says why it is in the course anyway", "The chapter has not been written yet", "It is a duplicate of a chapter in another subject"],
      c: 1,
      why: "The honesty rule: a chapter only gets a req if a real advert line asked for that. Everything else must justify itself in an extra, and the home page renders the two lists separately so 'nothing in the advert is uncovered' stays checkable." },

    { q: "Why does this platform score answering questions roughly ten times higher than opening a chapter?",
      a: ["To discourage people from reading ahead", "Because retrieval beats review, and a progress bar you can fill by scrolling teaches scrolling", "Because questions take longer to complete", "To make the mock exam feel more significant"],
      c: 1,
      why: "The strongest replicated finding in the learning literature is that being tested on material beats re-reading it. The scoring is deliberately biased so the number cannot be moved by passive reading." },

    { q: "Which three Java chapters does this course recommend reading early, because they make the framework chapters stop looking like magic?",
      a: ["Collections, generics and streams", "Concurrency, connection pools and transactions", "Maven, Docker and Kubernetes", "REST design, validation and OpenAPI"],
      c: 1,
      why: "Chapters 09, 22 and 25. Spring's singleton beans are shared across request threads, every transaction holds a pooled connection, and @Transactional works by a proxy. Without those three, Spring is a set of annotations to memorise." },

    { q: "Six adverts ask for Java. Two ask for Kubernetes, one for AWS, one for Kafka, one for Angular. What does that distribution tell you about where to spend preparation time?",
      a: ["Spread it evenly, since any of them could come up", "On the intersection first, because it cannot be skipped by any of the six, then breadth on the rest", "On the rarest technologies, since they are differentiators", "On whichever you find most interesting"],
      c: 1,
      why: "The intersection is Java, Spring Boot, Spring Data JPA and REST. Each single-advert technology gets one chapter here deliberately: enough to hold a conversation and be honest about the boundary, which is what a mid-level interview checks." },

    { q: "An advert lists a technology you have never used, in the 'a completamento del profilo' block. What is the best-prepared response?",
      a: ["Do not apply", "Apply, and prepare a specific answer: not yet, here is the nearest thing I have done, here is how long I would need", "List it on your CV and hope it does not come up", "Mention that you learn quickly and move on"],
      c: 1,
      why: "That block is negotiating room rather than a filter. A prepared, specific answer about a gap is far stronger than either avoidance or a vague claim, and it is the shape chapter 51 recommends for every unknown." },
  ],

  /* ------------------------------------------------------- 01-jvm-and-runtime --- */
  "01-jvm-and-runtime": [
    { q: "What does javac actually produce, and how much optimisation does it perform?",
      a: ["Native machine code, fully optimised", "Bytecode, with almost no optimisation, because the compiler that matters runs later", "Bytecode, aggressively optimised for the target CPU", "An intermediate C representation that is then compiled"],
      c: 1,
      why: "javac does type checking, erasure and desugaring, then emits stack-based bytecode. Optimisation is deliberately left to the JIT, which has profile data javac could never have." },

    { q: "Why is the first request to a freshly started Java service slower than later ones?",
      a: ["The database connection pool has not warmed up", "The JVM interprets bytecode at first and only JIT-compiles methods once they are observed to be hot", "Garbage collection runs more often at start-up", "Class files are decompressed on first use"],
      c: 1,
      why: "HotSpot interprets while profiling, then hands hot methods to C1 and eventually C2. That is why a load test without a warm-up phase measures the interpreter, and why serverless Java is a different performance problem from a long-running service." },

    { q: "In Java, what does NoClassDefFoundError usually indicate, as distinct from ClassNotFoundException?",
      a: ["A class was requested by name at runtime and was not found", "The class was present at compile time and is absent at runtime, so it is a packaging or dependency-scope problem", "The class file is corrupted", "Two versions of the same class are on the classpath"],
      c: 1,
      why: "ClassNotFoundException is a runtime lookup that failed: reflection, a driver, a bean by name. NoClassDefFoundError means it linked at compile time and is missing now, classically a jar with provided scope that nothing provided." },

    { q: "A stack trace shows NoClassDefFoundError for a class that is demonstrably on the classpath. What is the most likely cause?",
      a: ["The classpath entries are in the wrong order", "The class loaded but its static initialiser threw, so look for an earlier ExceptionInInitializerError", "The class is package-private", "The JVM version is too old to load it"],
      c: 1,
      why: "A failed static initialiser leaves the class permanently unusable, and every later reference throws NoClassDefFoundError. The real failure is the earlier ExceptionInInitializerError, usually a config value read in a static block." },

    { q: "What optimisation can a JIT compiler perform that an ahead-of-time compiler fundamentally cannot?",
      a: ["Inlining small methods", "Dead code elimination", "Speculative optimisation based on observed runtime behaviour, guarded so it can deoptimise", "Constant folding"],
      c: 2,
      why: "Because it profiles first, HotSpot can inline a virtual call that has only ever seen one implementing type, keeping a guard in case a second appears. That is the honest answer to 'is Java slower than C++': in steady state it is competitive, paid for with start-up time and memory." },

    { q: "What is the difference between the JDK, the JRE and the JVM?",
      a: ["They are three names for the same thing", "The JVM runs bytecode, the JRE is the JVM plus the standard library, and the JDK is the JRE plus the development tools", "The JDK is the runtime and the JRE is the compiler", "The JVM is Oracle's product and the JRE is OpenJDK's"],
      c: 1,
      why: "Install a JDK on any machine you write code on: javac, javap, jcmd and the heap-dump tools live there. Since Java 11 most vendors no longer ship a standalone JRE, and you trim a runtime with jlink instead." },

    { q: "Eclipse Temurin, Amazon Corretto, Azul Zulu and Oracle JDK are best described as:",
      a: ["Four independent implementations of the Java language", "Builds of the same OpenJDK source, differing in licence and support", "Successive versions of the same product", "Three JVMs and one compiler"],
      c: 1,
      why: "They are all builds of OpenJDK. The differences are licensing terms, support windows and packaging, which matters commercially and almost never technically. Saying this calmly is a small but real signal of having shipped something." },

    { q: "Why is class loading in the JVM lazy, and what practical consequence does that have?",
      a: ["To reduce jar size, and it means classes must be listed in a manifest", "Classes are loaded on first use, so some failures appear minutes after start-up on one code path only", "To allow classes to be modified at runtime", "It is not lazy: all classes load at start-up"],
      c: 1,
      why: "Loading is lazy and delegating: a loader asks its parent first, so platform classes cannot be shadowed. The consequence is that a missing or broken class can stay hidden until the one request that touches it." },
  ],

  /* ------------------------------------------------------- 02-java-versions --- */
  "02-java-versions": [
    { q: "Which Java versions are the long-term support releases?",
      a: ["6, 7, 8, 9", "8, 11, 17, 21", "8, 10, 14, 18", "11, 14, 17, 20"],
      c: 1,
      why: "8, 11, 17 and 21. A version number in an advert is a good proxy for the codebase's age, its tooling and its appetite for change. An advert asking for 17 while describing a fifteen-year-old gestionale is telling you a migration is in progress." },

    { q: "Which set of features arrived in Java 8?",
      a: ["Records, sealed classes and pattern matching", "Lambdas, the Stream API, Optional, default methods and java.time", "Virtual threads and structured concurrency", "The module system and var"],
      c: 1,
      why: "Default methods are the subtle one: they exist so Collection could gain stream() without breaking every implementation in the world. That motivation is a much better interview answer than listing the feature." },

    { q: "What was the main practical difficulty in migrating an application from Java 8 to Java 11?",
      a: ["Rewriting code to use the module system", "Strong encapsulation of internal APIs, plus removals such as JAXB and JAX-WS", "Lambdas changed semantics", "The bytecode format became incompatible"],
      c: 1,
      why: "Most applications never declare a module-info.java. The pain was libraries reaching into sun.misc.Unsafe, and packages that left the JDK, so builds failed on classes that had always been there." },

    { q: "In Java, what is var?",
      a: ["A dynamic type resolved at runtime", "Compile-time type inference for a local variable, with no runtime difference whatsoever", "A synonym for Object", "A marker that disables type checking for that variable"],
      c: 1,
      why: "The type is fixed at compile time and inferred from the initialiser. Saying var makes Java dynamically typed is a fast way to lose the room in an interview." },

    { q: "What does a record give you that a hand-written class does not?",
      a: ["Faster field access", "A constructor, accessors, and component-wise equals, hashCode and toString, correct by construction", "Automatic serialisation to JSON", "Inheritance from a common base class"],
      c: 1,
      why: "'Less boilerplate' is the answer everyone gives. The stronger one is correctness: equals is generated over the components, so it cannot drift when you add a field, which is exactly the silent hash-collection bug from chapter 03." },

    { q: "Which Java 17 feature lets the compiler verify that a switch has covered every possible case?",
      a: ["Text blocks", "Sealed types, whose permitted implementations are known at compile time", "var in lambda parameters", "Enhanced instanceof"],
      c: 1,
      why: "A sealed interface that permits Card, Transfer and Cash closes the hierarchy, so a switch with no default is checked for exhaustiveness. Adding a fourth implementation then fails to compile: the rule moves from code review into the compiler." },

    { q: "What did virtual threads in Java 21 change about the case for reactive programming?",
      a: ["Nothing: reactive is still required for high concurrency", "Blocking a virtual thread parks a continuation rather than occupying an OS thread, so thread-per-request scales, undercutting the main argument for reactive", "They made reactive frameworks faster", "They replaced the executor framework entirely"],
      c: 1,
      why: "Loom decouples the Java thread from the OS thread, so straightforward blocking code now scales like non-blocking code. It is the most interesting thing to have happened to Java in a decade, worth knowing even if the job is on 17." },

    { q: "On a Java 17 code test, what does writing a thirty-line DTO with getters and a hand-written equals signal?",
      a: ["Careful, explicit engineering", "That you write Java 8 which happens to compile on 17", "Nothing, because the reviewer only checks whether it works", "That you avoid features with poor tooling support"],
      c: 1,
      why: "An advert asking for Java 17 is asking for someone who writes Java 17. A record is one line, immutable, and has correct equals by construction. The difference is visible in about ten lines of a code test." },
  ],

  /* ------------------------------------------------------- 03-types-and-objects --- */
  "03-types-and-objects": [
    { q: "In Java, why does comparing two Integer variables holding 127 with == give true, while the same code with 128 gives false?",
      code: "Integer a = 127, b = 127;  System.out.println(a == b);   // true\nInteger x = 128, y = 128;  System.out.println(x == y);   // false",
      a: ["== compares values for small integers only", "Autoboxing calls Integer.valueOf, which is specified to cache instances for -128 to 127, so the two references coincide", "128 exceeds the byte range and is boxed differently", "It is undefined behaviour and varies by JVM"],
      c: 1,
      why: "You are comparing references either way; the cache just makes them happen to match below 128. This shows up in real code as a Long id comparison that works in tests with small ids and fails in production." },

    { q: "What is the equals/hashCode contract in Java?",
      a: ["Equal objects must have equal hash codes; unequal objects may share one", "Equal objects must have different hash codes", "Objects with equal hash codes must be equal", "Hash codes must be unique across all instances"],
      c: 0,
      why: "A HashMap picks a bucket from the hash and then scans it with equals. Break the contract and it files an object in one bucket and looks in another, so the collection silently loses elements with no error anywhere." },

    { q: "You override equals on a class and forget hashCode. What happens when you put instances in a HashSet?",
      a: ["A compile error", "contains can return false for an object the set demonstrably holds", "The set silently deduplicates everything into one element", "An exception is thrown on insertion"],
      c: 1,
      why: "It fails silently, which is what makes it a favourite interview question. Nothing detects it: the object is in one bucket and the lookup goes to another." },

    { q: "Why must an object used as a HashMap key be immutable in the fields that feed hashCode?",
      a: ["To reduce memory usage", "Mutating such a field after insertion strands the entry in the wrong bucket, so it can no longer be found", "Because HashMap rejects mutable keys at runtime", "To allow the map to be shared between threads"],
      c: 1,
      why: "The bucket is chosen at insertion time. Change the hash afterwards and the entry is unreachable: present in the map, invisible to every lookup. It is also why JPA entities are the hard case, since the id is null before persist." },

    { q: "Why can unboxing throw a NullPointerException on a line that contains no visible dereference?",
      a: ["The compiler inserts a null check that fails", "Converting a null Integer to int requires calling intValue() on null", "Primitives cannot represent null, so the JVM aborts", "It cannot: unboxing null yields zero"],
      c: 1,
      why: "Assigning a nullable Integer to an int compiles to an intValue() call, and null throws. Classic in code that reads a nullable database column into a primitive." },

    { q: "What does it mean to say that immutability in Java is shallow?",
      a: ["Only the first field is protected", "The reference is frozen but the object it points at is not, so a record holding a List is only as immutable as that list", "Immutability applies only to primitives", "The object becomes immutable only after the constructor returns"],
      c: 1,
      why: "List.copyOf in the compact constructor is the fix. Without it, every caller who was handed the list can still modify it, and the immutability is decorative." },

    { q: "Which of these is required for a class to be genuinely immutable in Java?",
      a: ["Marking the class static", "Final fields, no setters, defensive copies of mutable components in and out, and no leaking of this from the constructor", "Implementing Cloneable", "Declaring all fields volatile"],
      c: 1,
      why: "Immutability buys thread safety without synchronisation, safe publication, and usable hash keys. Since Java 17 a record gives you most of it by default, except the defensive copies." },

    { q: "Which comparison is correct for two Long order ids in Java?",
      a: ["a == b", "a.equals(b), or comparing the primitive long values", "a.compareTo(b) == 1", "a.hashCode() == b.hashCode()"],
      c: 1,
      why: "== on wrappers compares references, and the -128 to 127 cache makes it look correct until an id exceeds 127. Equal hash codes do not imply equality either, since unequal objects are permitted to collide." },
  ],

  /* ------------------------------------------------------- 04-collections --- */
  "04-collections": [
    { q: "In Java, why does ArrayList usually outperform LinkedList even for workloads the complexity table says favour LinkedList?",
      a: ["ArrayList has a smaller constant factor in its indexed access", "Contiguous memory is cache-friendly, while a linked list is a pointer chase with an object header per element", "LinkedList is synchronised and therefore slower", "ArrayList caches its last accessed element"],
      c: 1,
      why: "Big-O ignores memory locality. Reach for ArrayDeque rather than LinkedList when you genuinely need efficient insertion at both ends; LinkedList is rarely the right answer in modern Java." },

    { q: "What is the average and worst-case lookup complexity of a Java HashMap, and what causes the worst case?",
      a: ["O(1) average, O(n) worst case caused by hash collisions", "O(log n) average, O(n) worst case caused by resizing", "O(1) always, because hashing is constant time", "O(n) average, O(1) worst case with a perfect hash"],
      c: 0,
      why: "It is an array of buckets indexed by a spread function of hashCode. Since Java 8 a heavily collided bucket converts to a red-black tree, giving O(log n) instead of O(n), which limits the damage without removing the cause." },

    { q: "Calling list.contains() inside a loop over another list produces what complexity, and what is the fix?",
      a: ["O(n log n); sort the list first", "O(n squared); use a HashSet for the membership test", "O(n); no fix is needed", "O(1); contains is constant time on a List"],
      c: 1,
      why: "contains on a List is a linear scan, so doing it per element is quadratic. This is the most common accidental quadratic in business code, and a HashSet turns it into O(n)." },

    { q: "Which Map implementation should be used when several threads read and write it?",
      a: ["Hashtable", "ConcurrentHashMap", "A HashMap wrapped with Collections.synchronizedMap", "TreeMap, because it is sorted"],
      c: 1,
      why: "Hashtable and synchronizedMap serialise every operation on one lock, so they scale badly. ConcurrentHashMap uses finer-grained locking and is the correct default. A plain HashMap written from several threads can corrupt its own state, historically even spinning forever during a resize." },

    { q: "What does LinkedHashMap give you that HashMap does not?",
      a: ["Sorted keys", "Predictable iteration order, either insertion order or access order", "Thread safety", "O(log n) lookup"],
      c: 1,
      why: "Access-order mode makes it a two-line LRU cache when combined with removeEldestEntry. TreeMap is the one that sorts, at O(log n) and needing a Comparable key or a Comparator." },

    { q: "Why is it worth sizing a large HashMap when you construct it?",
      a: ["It reduces the hash collision rate to zero", "Growth doubles the table and rehashes every entry, so pre-sizing avoids repeated rehashing", "It makes iteration order deterministic", "Unsized maps are limited to 65536 entries"],
      c: 1,
      why: "Each resize allocates a new bucket array and redistributes everything. For a map you know will hold a million entries, pre-sizing is a real and free optimisation." },

    { q: "What do List.of and Map.of return, and what is the behaviour that surprises people?",
      a: ["Mutable copies; they allow null values", "Immutable collections that reject null elements and throw on modification", "Views over the original array that reflect later changes", "Synchronised collections"],
      c: 1,
      why: "They are genuinely immutable and null-hostile, which is a feature rather than an oversight: a null in a collection is almost always a bug you would rather find at insertion than at use." },

    { q: "You need a collection that answers 'have I seen this before' for several million items. Which do you choose?",
      a: ["ArrayList, checking with contains", "HashSet", "TreeSet, so the items stay sorted", "LinkedList, appending each item"],
      c: 1,
      why: "Membership is what a Set is for, and HashSet gives O(1) average. TreeSet costs O(log n) and only earns that if you also need ordering; a List makes each check a linear scan." },
  ],

  /* ------------------------------------------------------- 05-generics --- */
  "05-generics": [
    { q: "What is type erasure in Java generics?",
      a: ["Generic types are checked at runtime and discarded on error", "Type parameters are checked at compile time and then erased to their bound, with casts inserted by the compiler", "The JVM stores generic types in a side table", "Generic classes are duplicated per type argument, as in C++ templates"],
      c: 1,
      why: "It was a backwards-compatibility decision: generic code had to interoperate with the pre-generic collections that already existed. Every restriction below follows from it." },

    { q: "Which of these is impossible in Java because of type erasure?",
      a: ["Declaring a generic method", "Writing new T[] inside a generic class", "Bounding a type parameter with extends", "Passing a generic type to another generic method"],
      c: 1,
      why: "At runtime T does not exist, so the array's component type is unknown. The same reason forbids testing x instanceof List of String, and forbids overloading on List of String versus List of Integer since both erase to the same signature." },

    { q: "What does PECS stand for, and what does it mean?",
      a: ["Producer Extends, Consumer Super: read from an extends wildcard, write to a super wildcard", "Parameterised Erasure, Constrained Supertype", "Public Extends, Class Super: an access-modifier rule", "Primitive Except Char and String"],
      c: 0,
      why: "A List of ? extends Animal produces Animals you can read and accepts nothing you write, because it might be a List of Cat. A List of ? super Dog consumes Dogs and yields only Object on read. Collections.copy has exactly this signature." },

    { q: "Why is a List of Dog not assignable to a List of Animal in Java?",
      a: ["Because Dog does not extend Animal at the collection level", "Because generics are invariant: if it were allowed, someone could insert a Cat into your list of Dogs", "Because of erasure, which removes the relationship", "It is assignable; the compiler only warns"],
      c: 1,
      why: "Invariance is what makes the assignment illegal and correct. Wildcards reintroduce flexibility in one direction at a time, which is exactly what PECS describes." },

    { q: "What is heap pollution in Java generics?",
      a: ["Excessive garbage from generic collections", "A value of the wrong type reaching a generic collection because erasure removed the check, discovered only when something reads it", "Boxing too many primitives into wrappers", "Retaining references to generic objects after use"],
      c: 1,
      why: "An untyped legacy call can insert a String into your List of Integer, and nothing complains until a read casts it. That is why @SuppressWarnings(\"unchecked\") should make you look rather than reach for the keyboard." },

    { q: "When do you need a type parameter rather than a wildcard?",
      a: ["Whenever the method takes a collection", "When the type appears more than once in the signature, for example when the return type depends on the argument type", "Only for static methods", "Never; they are interchangeable"],
      c: 1,
      why: "A wildcard names no type, so it cannot be referred to elsewhere in the signature. If the method returns something of the same type it received, you need a named parameter." },

    { q: "What does declaring a bounded type parameter such as T extends Comparable of T achieve?",
      a: ["It forces callers to pass a Comparable at runtime", "It lets the compiler permit compareTo on T, and erases T to Comparable instead of Object", "It makes the class thread-safe", "It prevents subclassing"],
      c: 1,
      why: "Erasure goes to the bound, not always to Object. Multiple bounds are allowed, class first, as in T extends Number and Comparable of T." },

    { q: "Why can you not overload a method on List of String and List of Integer in Java?",
      a: ["Because the compiler forbids overloading on collections", "Because after erasure both parameters are List, so the two methods have the same signature", "Because String and Integer are both final", "You can; it requires a cast at the call site"],
      c: 1,
      why: "Erasure removes the type argument, so the two declarations collide. It is one of the clearest consequences to cite when explaining what erasure actually does." },
  ],

  /* ------------------------------------------------------- 06-streams-lambdas --- */
  "06-streams-lambdas": [
    { q: "What must the target type of a Java lambda be?",
      a: ["Any interface", "A functional interface: one with exactly one abstract method", "An abstract class with a no-argument constructor", "A class implementing Runnable"],
      c: 1,
      why: "Function, Predicate, Consumer, Supplier and BiFunction cover most needs. A lambda compiles to an invokedynamic resolved by LambdaMetafactory rather than to an anonymous class, which is why it is cheaper than the construct it replaced." },

    { q: "Inside a Java lambda, what does 'this' refer to?",
      a: ["The lambda instance", "The enclosing instance", "Null, since lambdas are static", "The functional interface being implemented"],
      c: 1,
      why: "This is a genuine behavioural difference from an anonymous inner class, where 'this' refers to the anonymous instance. It occasionally matters when registering callbacks." },

    { q: "What happens when you call filter and map on a Java stream but never call a terminal operation?",
      a: ["The elements are processed and discarded", "Nothing runs at all, because intermediate operations are lazy", "A compile error", "The stream processes the first element only"],
      c: 1,
      why: "Intermediate operations build a pipeline and return a new stream; only a terminal operation triggers evaluation. Elements are then pulled through the whole pipeline one at a time, which is what makes findFirst and anyMatch cheap on a long source." },

    { q: "What is the difference between map and flatMap on a Java stream?",
      a: ["map is lazy and flatMap is eager", "map turns one element into one element; flatMap turns one element into a stream and flattens the result", "flatMap only works on collections of primitives", "map preserves order and flatMap does not"],
      c: 1,
      why: "If each order holds a list of lines, map gives you a stream of streams while flatMap gives you all the lines. It is the single most asked stream question." },

    { q: "Why is parallelStream often the wrong choice inside a web request?",
      a: ["It is not thread-safe", "It uses the shared common ForkJoinPool, and you already have a thread per request, so it usually reduces overall throughput", "It cannot be used with collectors", "It requires a minimum of 10000 elements"],
      c: 1,
      why: "One slow parallel stream can starve every other one in the JVM. Reserve it for large, CPU-bound, side-effect-free work, and measure rather than assume." },

    { q: "What was Optional designed to be used as?",
      a: ["A field type, to make null-safety explicit in the model", "A return type, to say in the signature that there may be no value", "A parameter type, so callers must consider absence", "A replacement for exceptions"],
      c: 1,
      why: "It is not serialisable and adds an allocation, which is why fields are a poor fit; parameters force every caller to wrap. And a method returning Optional must never return null, which is a special kind of cruelty." },

    { q: "What is the difference between Optional.orElse and Optional.orElseGet?",
      a: ["orElse is null-safe and orElseGet is not", "orElse evaluates its argument eagerly even when a value is present; orElseGet takes a supplier and only calls it when empty", "orElseGet throws if the Optional is empty", "They are identical; orElseGet is deprecated"],
      c: 1,
      why: "If the fallback is a database call or an expensive computation, orElse runs it on every invocation regardless. That is a silent performance bug rather than a correctness one, which is why it survives review." },

    { q: "Why is chaining map and filter on an Optional preferable to isPresent followed by get?",
      a: ["It is faster at runtime", "It expresses the intent without a branch, and avoids the get call that throws when misused", "isPresent is deprecated", "get returns null rather than throwing"],
      c: 1,
      why: "isPresent plus get is a null check with more typing, and it reintroduces exactly the mistake Optional exists to prevent. Reserve get for cases where absence is genuinely impossible, and prefer orElseThrow with a meaningful exception." },
  ],

  /* ------------------------------------------------------- 07-records-sealed-pattern --- */
  "07-records-sealed-pattern": [
    { q: "Which members does the Java compiler generate for a record?",
      a: ["Only a constructor", "A canonical constructor, accessors, equals, hashCode and toString", "Getters and setters for every component", "A builder class"],
      c: 1,
      why: "equals is component-wise by construction, which means it stays correct when you add a field. That is the argument that beats 'less boilerplate'." },

    { q: "What is a compact constructor in a Java record for?",
      a: ["Constructing the record with fewer arguments", "Validating and normalising the components, without assigning the fields yourself", "Providing a no-argument default", "Making the record serialisable"],
      c: 1,
      why: "You write the checks and any normalisation; the compiler assigns the fields afterwards. It is also the right place to copy mutable components, since record immutability is shallow." },

    { q: "A record holds a List component. Is the record immutable?",
      a: ["Yes, records are deeply immutable by definition", "Only shallowly: the reference is final but the list itself can still be modified by anyone holding it", "No, records cannot hold collections", "Yes, because the compiler copies collection arguments automatically"],
      c: 1,
      why: "Assigning List.copyOf in the compact constructor is the fix. Without it, the caller who passed the list can still mutate what the record exposes." },

    { q: "What does declaring an interface sealed achieve in Java?",
      a: ["It prevents the interface from being implemented at all", "It closes the set of permitted implementations, so the compiler can check a switch for exhaustiveness", "It makes all implementations immutable", "It restricts the interface to one package"],
      c: 1,
      why: "An enum models a closed set of constants; a sealed interface models a closed set of shapes, each with its own fields. Adding a fourth implementation then breaks the build rather than slipping past review." },

    { q: "What is the practical benefit of pattern matching for instanceof in Java?",
      a: ["It performs the type test faster", "It binds a correctly typed variable in the scope where the test succeeded, removing the separate cast", "It allows testing against generic types", "It replaces the need for polymorphism"],
      c: 1,
      why: "The test and the cast were always the same operation written twice, and the second one was the place errors crept in. Java 21 extends this to switch, including record patterns that destructure in the case label." },

    { q: "In a Spring Boot application on Java 17, what is the natural use for records?",
      a: ["Replacing JPA entities", "Request and response DTOs, and ConfigurationProperties targets", "Replacing service classes", "Implementing repositories"],
      c: 1,
      why: "DTOs are where records replaced Lombok for most teams: immutable, correct equals, one line. Entities are the wrong fit because JPA needs a no-argument constructor and mutable state." },

    { q: "What does exhaustiveness checking over a sealed hierarchy give you that a default branch does not?",
      a: ["Faster dispatch at runtime", "A compile error when a new implementation is added and some switch has not handled it", "Automatic null handling", "Smaller bytecode"],
      c: 1,
      why: "A default branch silently absorbs the new case, which is exactly the bug you wanted to catch. Omitting default over a sealed set turns 'remember to update the switch' into a compiler responsibility." },

    { q: "Can a Java record extend another class?",
      a: ["Yes, any class", "No: records are implicitly final and cannot extend a class, though they may implement interfaces", "Yes, but only abstract classes", "Only if the parent is also a record"],
      c: 1,
      why: "Records are transparent carriers for their components, and inheritance would break that transparency. They can implement interfaces freely, which is what makes them work with sealed hierarchies." },
  ],

  /* ------------------------------------------------------- 08-exceptions --- */
  "08-exceptions": [
    { q: "In Java, which exceptions are checked?",
      a: ["All subclasses of Throwable", "Subclasses of Exception, except RuntimeException and its subclasses", "Only subclasses of Error", "Only exceptions declared in an interface"],
      c: 1,
      why: "Error is unchecked and signals conditions you are not meant to handle, such as OutOfMemoryError. The intended distinction was recoverable versus programming error; in practice the checked experiment is widely regarded as a mistake." },

    { q: "How does Spring treat JDBC's checked SQLException?",
      a: ["It propagates it unchanged", "It translates it into the unchecked DataAccessException hierarchy", "It wraps it in a checked PersistenceException", "It logs it and returns null"],
      c: 1,
      why: "A duplicate key becomes DuplicateKeyException regardless of database vendor. Being able to name that translation shows you have noticed how the framework you are being hired for actually behaves." },

    { q: "Why should you always pass the cause when wrapping an exception in Java?",
      a: ["To satisfy the compiler", "Because a wrapped exception without a cause deletes the stack trace that would have explained the failure", "To make the exception serialisable", "Because the cause is used to decide rollback"],
      c: 1,
      why: "Throwing a new domain exception without the original leaves you with a message and no evidence. It is one line and it is the difference between a five-minute diagnosis and an afternoon." },

    { q: "What is wrong with catching an exception, logging it, and returning null?",
      a: ["Nothing, provided the log level is correct", "It is an empty catch block in disguise: the caller gets an unexpected null and the NullPointerException surfaces far from the real cause", "Logging is too slow for an exception path", "Returning null from a catch block does not compile"],
      c: 1,
      why: "It converts a loud failure into a quiet wrong answer, which is the most expensive kind. Either handle it meaningfully or let it travel to something that can." },

    { q: "What must you never do with an InterruptedException?",
      a: ["Rethrow it", "Swallow it without restoring the interrupt flag", "Log it", "Wrap it in a RuntimeException"],
      c: 1,
      why: "Either propagate it, or call Thread.currentThread().interrupt() to restore the flag. Swallowing it breaks cancellation for everything above you, which matters more now that virtual threads make interruption the normal shutdown path." },

    { q: "What problem does try-with-resources solve that the old try/finally idiom did not?",
      a: ["It closes resources faster", "If the body throws and close() also throws, the close exception is attached as suppressed and the original survives", "It allows resources to be reused", "It removes the need to declare throws"],
      c: 1,
      why: "In the old idiom the close exception replaced the real one, so you lost the failure you actually needed. Resources are also closed in reverse order, before any catch or finally block runs." },

    { q: "Why should you not catch Throwable in application code?",
      a: ["It is a compile error", "It catches Errors such as OutOfMemoryError and StackOverflowError, which you cannot meaningfully handle and should not suppress", "Throwable is deprecated", "It prevents the finally block from running"],
      c: 1,
      why: "Catching it turns a fatal, well-signalled condition into an unpredictable one. Catch narrowly, at the level that can actually act." },

    { q: "A connection borrowed from a pool is not closed on an exception path. What is the symptom?",
      a: ["An immediate error at the leak site", "Every other request timing out minutes later while waiting for a connection from the exhausted pool", "A memory leak reported by the garbage collector", "The database rejects new logins"],
      c: 1,
      why: "The failure never appears where the leak is, which is why it is so hard to find. try-with-resources, or letting Spring manage the connection, removes the whole class of problem." },
  ],

  /* ------------------------------------------------------- 09-concurrency --- */
  "09-concurrency": [
    { q: "What does the volatile keyword guarantee in Java?",
      a: ["Atomicity of compound operations such as increment", "Visibility and ordering of reads and writes, but not atomicity", "Exclusive access, like a lock", "That the field is stored in main memory only, making access slower but safe"],
      c: 1,
      why: "A volatile counter++ is still read-modify-write and still loses updates. Use AtomicLong or LongAdder for counters, and a lock for anything compound." },

    { q: "Why can a plain boolean flag polled in a loop cause that loop never to terminate?",
      a: ["The JIT removes the loop as dead code", "Without a happens-before relationship the write from another thread may never become visible, and the read can be hoisted out of the loop", "Booleans are cached by the JVM", "The scheduler starves the polling thread"],
      c: 1,
      why: "The Java Memory Model gives no visibility guarantee without synchronized or volatile. It is the classic demonstration that thread safety is about visibility as much as about mutual exclusion." },

    { q: "Why is double-checked locking without volatile broken?",
      a: ["It deadlocks under contention", "Another thread can observe a non-null reference to an object whose constructor has not finished", "The second check is optimised away", "It is not broken; the idiom is safe in all Java versions"],
      c: 1,
      why: "Construction and reference assignment can be reordered without the volatile barrier. It works in testing and fails under load on a different CPU architecture, which is the worst possible failure profile." },

    { q: "How should you size a thread pool for CPU-bound work?",
      a: ["As many threads as possible", "Roughly one thread per core, because more only adds context switching", "Twice the number of database connections", "One thread per task submitted"],
      c: 1,
      why: "I/O-bound work is the opposite case and wants many more threads, since they spend their time waiting. Sizing by workload rather than by a fixed number is the point." },

    { q: "Why should an ExecutorService use a bounded queue with an explicit rejection policy?",
      a: ["Bounded queues are faster", "An unbounded queue turns overload into an OutOfMemoryError instead of a fast, visible failure", "The executor requires a capacity at construction", "It guarantees FIFO ordering"],
      c: 1,
      why: "That is the difference between shedding load and falling over. A rejection you can see and count is a far better outcome than a heap that fills silently." },

    { q: "How should virtual threads in Java 21 be used?",
      a: ["Pooled, like platform threads", "One per task, never pooled, because creating one is cheap", "Only for CPU-bound work", "Only inside a ForkJoinPool"],
      c: 1,
      why: "Pooling exists to amortise the cost of an expensive resource. Virtual threads are not expensive, so pooling them reintroduces a limit for no benefit." },

    { q: "Is a Spring @Service bean thread-safe?",
      a: ["Yes, Spring synchronises bean methods", "It is if it holds no mutable state, because the default singleton scope shares one instance across all request threads", "No, a new instance is created per request", "Only if annotated @Scope(\"thread\")"],
      c: 1,
      why: "Keep beans stateless and pass state as arguments. A mutable field on a service is a data race rather than a style question, and it is the bug most often introduced by developers arriving from a shared-nothing model like PHP." },

    { q: "Which of these is a correct way to maintain a shared counter across threads in Java?",
      a: ["A volatile long field incremented with ++", "An AtomicLong, or a LongAdder under high contention", "A plain long field, since long assignment is atomic", "A static int field with synchronized reads only"],
      c: 1,
      why: "Increment is read-modify-write, so volatile is not enough. LongAdder trades exact intermediate reads for much better throughput when many threads contend." },
  ],

  /* ------------------------------------------------------- 10-memory-gc --- */
  "10-memory-gc": [
    { q: "What does the generational hypothesis, which shapes the JVM heap, state?",
      a: ["Objects are allocated in generations of equal size", "Most objects die young, so a small area can be collected frequently and cheaply", "Old objects are more likely to be referenced", "Each thread gets its own generation"],
      c: 1,
      why: "Minor collections trace only the small live set in eden, which is why they are cheap. Objects surviving enough of them are promoted to the old generation, which is collected rarely." },

    { q: "A container running a Java application is killed with exit code 137 and no Java stack trace. What happened?",
      a: ["The JVM threw OutOfMemoryError", "The kernel OOM killer terminated the process for exceeding the container memory limit", "The application called System.exit(137)", "The garbage collector deadlocked"],
      c: 1,
      why: "No stack trace means the JVM never got to report anything. The heap is not the whole footprint: metaspace, thread stacks, code cache and direct buffers all live outside it, so the limit must exceed the heap by a real margin." },

    { q: "Which JVM error indicates unbounded recursion rather than a memory problem?",
      a: ["OutOfMemoryError: Java heap space", "StackOverflowError", "OutOfMemoryError: Metaspace", "OutOfMemoryError: Direct buffer memory"],
      c: 1,
      why: "The stack is per thread and holds call frames. Metaspace exhaustion is a third thing again, usually class loaders leaking in an application server that redeploys without restarting." },

    { q: "Which garbage collector is the default in modern Java, and when should you change it?",
      a: ["Serial, and change it whenever the heap exceeds 1 GB", "G1, and change it only when a measurement says otherwise", "ZGC, and change it for small containers", "Parallel, and change it for low-latency services"],
      c: 1,
      why: "Tuning GC before you have a GC log or a heap dump is guessing, and G1 with a sensible heap size beats a badly tuned exotic collector every time. ZGC and Shenandoah earn their place on very large heaps with strict pause requirements." },

    { q: "Why is -XX:MaxRAMPercentage preferable to a hardcoded -Xmx in a container image?",
      a: ["It allows the heap to grow beyond the container limit", "The heap then follows whatever memory limit the container is given, so the same image behaves correctly everywhere", "It disables the container awareness checks", "-Xmx is deprecated"],
      c: 1,
      why: "A hardcoded -Xmx and a Kubernetes memory limit are two numbers that must be kept in step by hand, and eventually will not be. Percentage sizing keeps them coupled." },

    { q: "Which command produces a heap dump from a running JVM?",
      a: ["java -Xdump", "jcmd PID GC.heap_dump /tmp/heap.hprof", "jstack PID --heap", "kill -HUP PID"],
      c: 1,
      why: "jcmd ships with the JDK, which is one reason to install a JDK rather than a JRE. Eclipse MAT's Leak Suspects report answers most cases from that file in one click." },

    { q: "Roughly what proportion of the container limit is a reasonable MaxRAMPercentage for a Spring service?",
      a: ["95 to 100 per cent", "60 to 75 per cent, leaving headroom for non-heap memory", "25 per cent, the conservative default", "Exactly 50 per cent in all cases"],
      c: 1,
      why: "Metaspace, thread stacks, code cache and direct buffers sit outside the heap. The default is deliberately conservative; setting it deliberately, with headroom, is what avoids the exit-code-137 restart loop." },

    { q: "What does a garbage collection pause actually cost you?",
      a: ["CPU only; application threads keep running", "Application threads are stopped for part of the work, which is why pause-time targets exist", "Nothing measurable on modern JVMs", "Disk I/O while objects are written to swap"],
      c: 1,
      why: "Collectors trade pause length against total throughput. Concurrent collectors like ZGC push pauses below a millisecond at some throughput cost, which is a choice rather than a free improvement." },
  ],

  /* ------------------------------------------------------- 11-spring-container --- */
  "11-spring-container": [
    { q: "What is the default scope of a Spring bean?",
      a: ["Prototype: a new instance per injection point", "Singleton: one instance per container, shared by every request", "Request: one instance per HTTP request", "Thread: one instance per thread"],
      c: 1,
      why: "One instance per container, not per JVM and not per request. The practical consequence is that mutable state in a service field is shared across every request thread, which makes it a data race." },

    { q: "What does Spring actually inject when a bean is annotated @Transactional?",
      a: ["Your object, with the transaction handled by bytecode rewriting", "A proxy wrapping your object, which opens and closes the transaction around the call", "A new instance per transaction", "A thread-local copy of the bean"],
      c: 1,
      why: "JDK dynamic proxy for interfaces, CGLIB subclass otherwise. Every surprising thing about @Transactional, @Cacheable, @Async and method security follows from the fact that the behaviour lives in the proxy and not in your class." },

    { q: "What happens when you inject a prototype-scoped bean into a singleton?",
      a: ["A new instance is created for every method call", "The prototype is resolved once at wiring time, and the singleton holds that one instance forever", "Spring refuses to start", "The singleton becomes prototype-scoped"],
      c: 1,
      why: "Injection happens once, when the singleton is built. If you genuinely need a fresh instance per call, inject an ObjectProvider and ask it each time." },

    { q: "Why does a @Transactional method called from @PostConstruct run without a transaction?",
      a: ["@PostConstruct runs on a different thread", "Proxying happens after @PostConstruct in the bean lifecycle, so the proxy does not exist yet", "Transactions are disabled during start-up", "@PostConstruct methods are always static"],
      c: 1,
      why: "Instantiate, populate, aware callbacks, before-init, @PostConstruct, then post-init where proxies are created. For work that needs the fully wired application, prefer ApplicationReadyEvent." },

    { q: "What is an ApplicationContext in Spring?",
      a: ["A thread-local holding the current request", "A registry of bean definitions, which it uses to instantiate, wire and manage a graph of beans", "A configuration file format", "The servlet container's session store"],
      c: 1,
      why: "Definitions are recipes, not objects. Inversion of control means the framework owns construction, which is what makes the proxying and the lifecycle hooks possible at all." },

    { q: "Where should work that needs other beans to be fully initialised go?",
      a: ["The constructor", "@PostConstruct, or ApplicationReadyEvent if it needs the whole application ready", "A static initialiser", "The finalize method"],
      c: 1,
      why: "A constructor runs before dependencies are guaranteed to be fully initialised themselves. @PostConstruct runs after population; ApplicationReadyEvent runs after everything, including proxying." },

    { q: "Which bean scopes exist only in a web application context?",
      a: ["singleton and prototype", "request and session", "thread and global", "transaction and job"],
      c: 1,
      why: "singleton and prototype are always available. request and session need a web-aware context, and injecting a request-scoped bean into a singleton requires a scoped proxy, which is a common source of confusion." },

    { q: "Why does keeping Spring beans stateless matter more in Java than in a shared-nothing model like PHP?",
      a: ["Java objects are larger", "The JVM process is long-lived and beans are singletons, so state in a field survives between requests and is shared across threads", "Because Java has no session storage", "Because the garbage collector cannot reclaim bean state"],
      c: 1,
      why: "In a shared-nothing model every request starts from nothing, so a field cannot leak between users. In Spring it can, and does, and nothing reports it." },
  ],

  /* ------------------------------------------------------- 12-dependency-injection --- */
  "12-dependency-injection": [
    { q: "Why is constructor injection preferred over field injection in Spring?",
      a: ["It is faster at start-up", "It allows final fields, yields a fully valid object, and makes the dependency count visible", "Field injection is deprecated and will be removed", "Constructor injection avoids the need for a proxy"],
      c: 1,
      why: "The visibility argument is the strongest: a constructor with nine parameters is obviously wrong, while a class with nine @Autowired fields looks tidy and is not. Field injection also cannot be constructed in a plain unit test without reflection." },

    { q: "Since which Spring version is @Autowired unnecessary on a class with a single constructor?",
      a: ["Spring 3.0", "Spring 4.3", "Spring 5.2", "It is always required"],
      c: 1,
      why: "One constructor means there is nothing to disambiguate, so Spring uses it automatically. Leaving the annotation off is the modern idiom and removes a line of noise." },

    { q: "Two classes implement the same interface and you inject the interface. What happens at start-up?",
      a: ["Spring picks the first one alphabetically", "NoUniqueBeanDefinitionException, unless one is @Primary or the injection point has a @Qualifier", "Both are injected as a list", "Spring creates a composite proxy delegating to both"],
      c: 1,
      why: "Resolution is by type first, then by name. Failing loudly at start-up is the right time to find out, which is a small argument for the container doing this work rather than your code." },

    { q: "What does injecting a List of an interface type give you in Spring?",
      a: ["A compile error", "Every bean implementing that interface, which is the idiomatic way to remove a long switch from a service", "Only the @Primary bean, wrapped in a list", "An empty list unless a @Qualifier is present"],
      c: 1,
      why: "Injecting all implementations of a strategy interface and selecting by a method on each is a very good answer to 'how would you make this extensible'. Adding a strategy then means adding a class, not editing a switch." },

    { q: "Why does Spring Boot fail on circular dependencies by default since 2.6?",
      a: ["Because the container cannot resolve them at all", "Because a cycle is almost always a design signal: two beans that need each other are one concept, or a third is trying to get out", "Because they cause memory leaks", "Because proxies cannot be created for cyclic graphs"],
      c: 1,
      why: "Field and setter injection could sometimes resolve a cycle through partial initialisation; constructor injection cannot. @Lazy and allow-circular-references will silence it, and both are a note to come back rather than a fix." },

    { q: "What is the correct use of @Primary in Spring?",
      a: ["To mark the bean that should be created first", "To nominate the default candidate when several beans match a type", "To make a bean eagerly initialised", "To give a bean the highest security privileges"],
      c: 1,
      why: "@Primary is the usual default; @Qualifier at the injection point is the exception to that default. Ordering of creation is a separate concern handled by @DependsOn." },

    { q: "Why can a class with field injection not be constructed in a plain unit test?",
      a: ["The fields are final", "There is no constructor taking the dependencies, so the test must use reflection or start a Spring context", "Spring forbids it at runtime", "The fields are package-private"],
      c: 1,
      why: "This is the practical cost that gets paid on every test, and it is why field injection makes a codebase slower to work in even when it looks tidier." },

    { q: "Field injection is still the dominant style in many older Italian codebases. What is the professional response?",
      a: ["Rewrite every class to constructor injection before doing anything else", "Read it fluently, be able to say precisely why it is discouraged, and not rewrite it for its own sake", "Refuse to work on such code", "Convert it silently as you touch each file"],
      c: 1,
      why: "Being able to name the three concrete costs, untestable without reflection, no final fields, hidden dependency count, is a much better interview answer than asserting that constructor injection is 'best practice'." },
  ],

  /* ------------------------------------------------------- 13-configuration-profiles --- */
  "13-configuration-profiles": [
    { q: "In Spring Boot, which property source wins when the same key is defined in several places?",
      a: ["The packaged application.yml, because it ships with the code", "The more specific one: roughly, command line beats environment variables, which beat external files, which beat packaged files", "The first one loaded", "It is undefined and depends on the classpath order"],
      c: 1,
      why: "That ordering is what makes one artefact run in every environment, with the environment supplying the differences. Building one artefact per environment is the anti-pattern the ordering exists to prevent." },

    { q: "Which environment variable maps to the Spring property spring.datasource.url?",
      a: ["spring.datasource.url", "SPRING_DATASOURCE_URL", "SPRING-DATASOURCE-URL", "springDatasourceUrl"],
      c: 1,
      why: "Relaxed binding maps upper-case underscore names onto dotted properties, which is what makes container deployment tidy: a Kubernetes Secret mounted as an environment variable needs no translation layer." },

    { q: "What is the main advantage of @ConfigurationProperties over scattering @Value annotations?",
      a: ["It is faster to read", "A missing or malformed value fails at start-up with the property named, instead of producing a null discovered at first use", "It supports more data types", "It avoids the need for a properties file"],
      c: 1,
      why: "Add @Validated and Bean Validation constraints and the application refuses to start when configuration is wrong. Since Java 17 the binding target can be a record, giving immutable configuration for free." },

    { q: "Where should a database password live for a Spring service deployed to Kubernetes?",
      a: ["In application-prod.yml, committed to the repository", "In a Secret, mounted as an environment variable, or in a secret manager", "Hardcoded in the Dockerfile so it cannot be changed accidentally", "In a comment in application.yml for the operations team"],
      c: 1,
      why: "Credentials leak through git history long after they are deleted from the working tree, so 'we removed it in the next commit' does not help. Not even application-dev.yml is a safe place." },

    { q: "What should Spring profiles be used for?",
      a: ["Any conditional behaviour, including per-customer logic", "Environment shape: which beans and property files apply in dev, test and prod", "Feature flags visible to end users", "Selecting between database vendors at runtime"],
      c: 1,
      why: "A @Profile on a class that behaves differently for a particular customer is a maintenance problem in disguise, because the difference is invisible in the code path and only appears in the deployment configuration." },

    { q: "What does @Validated add to a @ConfigurationProperties class?",
      a: ["Type conversion for the bound values", "Bean Validation of the bound values, so the context fails to start when a constraint is violated", "Encryption of sensitive properties", "Automatic reloading when the file changes"],
      c: 1,
      why: "Failing at start-up rather than at first request is the whole point: the failure has a clear cause and a clear owner, instead of surfacing as a NullPointerException three layers away during a request." },

    { q: "Why is it valuable to run the same build artefact in every environment?",
      a: ["It reduces storage costs in the registry", "Because the artefact you tested is then literally the artefact you shipped", "Because Spring requires it", "It makes rollbacks faster"],
      c: 1,
      why: "Rebuilding per environment reintroduces the possibility that a dependency resolved differently, which is precisely the class of problem a pipeline exists to eliminate." },

    { q: "Which Spring Boot mechanism reads a whole block of related properties into a typed object?",
      a: ["@Value with a SpEL expression", "@ConfigurationProperties with a prefix", "@PropertySource", "Environment.getProperty in a @PostConstruct"],
      c: 1,
      why: "Bind to a record with @Validated and you get immutability, type conversion, and start-up validation in one declaration, replacing a scatter of @Value annotations across several classes." },
  ],

  /* ------------------------------------------------------- 14-spring-boot-autoconfig --- */
  "14-spring-boot-autoconfig": [
    { q: "What is a Spring Boot starter?",
      a: ["A class that bootstraps the application context", "A pom with no code, declaring a coherent set of dependencies whose versions come from the Boot BOM", "A script that generates project scaffolding", "An annotation that enables auto-configuration"],
      c: 1,
      why: "Most of Boot's value is an opinion about which library versions work together, maintained by someone else. The other half is auto-configuration." },

    { q: "Which annotation makes Spring Boot's auto-configuration overridable rather than magic?",
      a: ["@ConditionalOnProperty", "@ConditionalOnMissingBean", "@Primary", "@EnableAutoConfiguration"],
      c: 1,
      why: "Auto-configuration declares beans only if the user has not defined one, so overriding a default means simply declaring your own bean. That is the whole mechanism, and it is the answer to 'what if I do not want Boot's default'." },

    { q: "How do you find out why an unexpected bean exists in a Spring Boot application?",
      a: ["Read the starter's source code", "Run with --debug and read the condition evaluation report", "Enable TRACE logging on the whole application", "Take a heap dump and inspect the context"],
      c: 1,
      why: "The report lists every auto-configuration that matched, every one that did not, and the condition that decided. It is the difference between debugging Boot and guessing at it." },

    { q: "Where does @SpringBootApplication component-scan from?",
      a: ["The classpath root", "Its own package and everything below it", "Every package containing an @Component", "Only the package explicitly listed in scanBasePackages"],
      c: 1,
      why: "A bean in a sibling package is silently not found. Keeping the main class at the root of your package tree avoids a class of problem that produces no error, just a missing listener nobody noticed." },

    { q: "Which actuator endpoints are safe to expose publicly in production?",
      a: ["All of them, since they are read-only", "Health and metrics; env, configprops and heapdump must stay behind authentication", "None; actuator should be disabled in production", "Only heapdump, for support purposes"],
      c: 1,
      why: "/actuator/env prints your configuration and /actuator/heapdump hands over a file containing everything in memory. The conservative defaults exist for a reason, and widening them should be deliberate." },

    { q: "Which actuator endpoints do Kubernetes probes use?",
      a: ["/actuator/info and /actuator/metrics", "/actuator/health/liveness and /actuator/health/readiness", "/actuator/env and /actuator/configprops", "/actuator/prometheus only"],
      c: 1,
      why: "Boot exposes the two health groups separately precisely so liveness can answer 'is this process wedged' while readiness answers 'can it serve traffic', which are different questions with different consequences." },

    { q: "What does @ConditionalOnClass check?",
      a: ["That a bean of that class already exists", "That the class is present on the classpath", "That the class is annotated @Component", "That the class can be proxied"],
      c: 1,
      why: "Together with @ConditionalOnMissingBean it produces the rule 'if Hibernate is on the classpath and the user has not defined an EntityManagerFactory, define one', which is auto-configuration in one sentence." },

    { q: "Why does adding a dependency to a Spring Boot project sometimes change application behaviour with no code change?",
      a: ["Because Maven reorders the classpath", "Because auto-configuration is conditional on what is present on the classpath", "Because Boot re-runs component scanning", "Because the BOM overrides your own beans"],
      c: 1,
      why: "This is Boot's convenience and its opacity in one property. The condition evaluation report is how you find out what changed, which is why --debug is worth knowing before you need it." },
  ],

  /* ------------------------------------------------------- 15-quarkus-vs-spring --- */
  "15-quarkus-vs-spring": [
    { q: "What does Quarkus move to build time that Spring does at start-up?",
      a: ["Bytecode verification", "Annotation scanning and dependency-injection wiring, resolved by build-time extensions", "Garbage collection tuning", "SQL query parsing"],
      c: 1,
      why: "Less reflection at runtime also makes the application amenable to GraalVM ahead-of-time compilation into a native binary, which is the second half of the story." },

    { q: "What is the honest trade-off of a GraalVM native image compared with a warm JVM?",
      a: ["Faster in every dimension", "Faster start-up and smaller memory footprint, typically lower peak throughput", "Slower start-up but higher throughput", "Identical performance with a smaller binary"],
      c: 1,
      why: "You give up the JIT's profile-guided optimisation. Claiming both faster start-up and higher throughput is the tell that you have read a marketing page rather than measured one." },

    { q: "For which workload does Quarkus or a native image pay off most clearly?",
      a: ["A handful of long-lived instances serving steady traffic", "Short-lived or dense instances: serverless functions, aggressive autoscaling, many small pods", "Batch jobs processing large files", "Any workload using a relational database"],
      c: 1,
      why: "If your service starts once and runs for weeks, start-up time does not matter. It is a start-up-versus-steady-state question rather than a Spring-versus-Quarkus one." },

    { q: "Which standards is Quarkus built on?",
      a: ["Spring's own annotations, reimplemented", "Jakarta EE standards: CDI, JAX-RS via RESTEasy, JPA via Hibernate", "A proprietary API with no relation to existing standards", "OSGi"],
      c: 1,
      why: "A Spring developer reads Quarkus code easily: the annotations differ, the concepts do not. Saying that shows you understand the ecosystem rather than treating frameworks as tribes." },

    { q: "What has narrowed the gap between Spring Boot and Quarkus on start-up and footprint?",
      a: ["Project Loom", "Spring Boot 3's GraalVM native image support", "The removal of the module system", "Records and sealed types"],
      c: 1,
      why: "Boot 3 with AOT processing and native compilation closes much of the distance. Mentioning it signals you are current rather than repeating a comparison from several years ago." },

    { q: "If you have never used Quarkus and are asked about it, what is the strongest answer?",
      a: ["Claim familiarity and keep the answer vague", "Say you have not used it in production, then explain what it moves and what that buys and costs", "Say it is not relevant to the role", "Describe it as a faster Spring"],
      c: 1,
      why: "Naming your own boundary and then demonstrating that you understand the design is far more convincing than a vague yes, and it survives the follow-up question, which a bluff does not." },

    { q: "Why does reduced reflection matter for native compilation?",
      a: ["Reflection is slower than direct calls", "Ahead-of-time compilation must know at build time which classes and methods are reachable, and reflection hides that", "Native images cannot load classes at all", "GraalVM does not implement the reflection API"],
      c: 1,
      why: "Reflective access has to be registered explicitly for a native image, which is why frameworks that resolve wiring at build time are a much better fit for it." },

    { q: "One of the six adverts pairs Quarkus with Spring Boot. What does that most likely indicate?",
      a: ["The team has abandoned Spring", "A public-administration or greenfield context where start-up time and footprint are being evaluated alongside the familiar option", "That Quarkus is required for all new services", "That the advert was written without technical input"],
      c: 1,
      why: "The posting is a remote public-administration contract asking for Java 11 plus 'framework come Quarkus e Spring Boot'. Being able to discuss both, and why one might be chosen, is what the line is testing." },
  ],

  /* ------------------------------------------------------- 16-rest-controllers --- */
  "16-rest-controllers": [
    { q: "In a Spring Boot application, where in the request pipeline does Spring Security run?",
      a: ["Inside the DispatcherServlet, after handler mapping", "In the servlet filter chain, before the DispatcherServlet", "In an interceptor, after argument resolution", "In the controller method itself"],
      c: 1,
      why: "That ordering is why an authentication failure never reaches your @RestControllerAdvice and needs its own AuthenticationEntryPoint. It is also why a CORS misconfiguration produces a rejection no controller ever sees." },

    { q: "What is @RestController equivalent to?",
      a: ["@Controller plus @ResponseBody", "@Component plus @RequestMapping", "@Service plus @ResponseStatus", "@Controller plus @Transactional"],
      c: 0,
      why: "The @ResponseBody part is what makes the return value pass through an HttpMessageConverter rather than being resolved as a view name." },

    { q: "Why should a Spring controller never return a JPA entity directly?",
      a: ["Entities are not serialisable", "It couples the API to the schema, drags lazy associations into serialisation, and leaks fields you did not mean to publish", "Jackson cannot serialise entities", "It causes a compile error"],
      c: 1,
      why: "A record DTO costs one line since Java 17 and makes the contract explicit. Returning the entity is also the standard cause of LazyInitializationException during serialisation." },

    { q: "A LazyInitializationException is thrown while Jackson serialises a response. What is the actual cause?",
      a: ["Jackson is misconfigured", "The entity escaped its transaction, so the Hibernate session was closed when the lazy association was touched", "The database connection was lost", "The association was mapped EAGER"],
      c: 1,
      why: "The error names Hibernate and the cause is the controller. Fetch what you need inside the transaction and return a DTO; open-in-view hides the problem while holding a connection for the whole request." },

    { q: "Which component turns a controller's return value into JSON in Spring MVC?",
      a: ["The DispatcherServlet", "An HttpMessageConverter, selected by content negotiation", "The servlet container", "A ViewResolver"],
      c: 1,
      why: "The same converters handle the inbound direction for @RequestBody. Content negotiation picks by the Accept and Content-Type headers, which in practice is nearly always JSON via Jackson." },

    { q: "Why should money be represented as BigDecimal rather than double in a REST response?",
      a: ["double cannot represent values above one million", "Binary floating point cannot represent most decimal fractions exactly, so a client eventually receives a value like 0.30000000000000004", "Jackson cannot serialise double", "BigDecimal is faster"],
      c: 1,
      why: "The failure is not theoretical and it reaches the customer's invoice. The same reasoning applies inside the domain, not only at the boundary." },

    { q: "What should a thin Spring controller be responsible for?",
      a: ["Business rules, so they are close to the endpoint", "Mapping, validation, status codes and delegation to a service", "Database access, to avoid an extra layer", "Transaction management"],
      c: 1,
      why: "Business rules in a controller cannot be reused by a scheduled job or a message consumer, and cannot be tested without the web layer. Both costs are paid repeatedly." },

    { q: "Which Spring Boot setting makes Jackson serialise dates as ISO-8601 rather than epoch numbers?",
      a: ["spring.jackson.date-format=iso", "spring.jackson.serialization.write-dates-as-timestamps=false", "spring.mvc.format.date=iso", "It is not configurable; a custom serialiser is required"],
      c: 1,
      why: "Boot registers JavaTimeModule for you, but the timestamp default remains until you turn it off. Send ISO-8601 and let the client format for the user's timezone, since only the browser knows it." },
  ],

  /* ------------------------------------------------------- 17-rest-design --- */
  "17-rest-design": [
    { q: "Which URL and method correctly express creating an order in a REST API?",
      a: ["POST /createOrder", "POST /orders", "GET /orders?action=create", "PUT /order/new"],
      c: 1,
      why: "Nouns in the path, plural, with the verb coming from HTTP. A verb in the path is a remote procedure call wearing REST's clothes, and it loses the uniform semantics clients rely on." },

    { q: "What should a REST API return after successfully creating a resource?",
      a: ["200 with the resource in the body", "201 with a Location header pointing at the new resource", "204 with an empty body", "202 with a job id"],
      c: 1,
      why: "201 Created plus Location is the specified behaviour and tells the client where the thing now lives. 202 Accepted is correct only when the work is genuinely asynchronous." },

    { q: "Which HTTP methods are specified as idempotent?",
      a: ["GET, PUT and DELETE", "POST and PUT", "GET and POST", "All of them"],
      c: 0,
      why: "POST is the one that is not, which is why creation is the dangerous operation to retry. Idempotency is what makes a retry after a lost response safe." },

    { q: "How does an idempotency key make POST safe to retry?",
      a: ["It makes the server ignore duplicate requests by IP address", "The client sends a unique id per logical operation; the server stores it with the result and replays the stored response if it sees the key again", "It signs the request so replays are rejected", "It causes the server to switch the request to PUT semantics"],
      c: 1,
      why: "A machine on a factory floor with a flaky link will retry, and 'we created forty duplicate production orders' is a real incident rather than a hypothetical one." },

    { q: "Why is checking whether a row already exists not a substitute for idempotency?",
      a: ["The check is too slow under load", "It is a race: two retries arriving together both check, both find nothing, and both insert", "The check cannot be done inside a transaction", "It requires an extra database round trip"],
      c: 1,
      why: "You need a unique constraint on a natural or supplied key, and to treat the constraint violation as success. The database is the only component that can arbitrate between two concurrent attempts." },

    { q: "What is the drawback of offset pagination compared with cursor pagination?",
      a: ["It cannot be combined with sorting", "Rows inserted between requests shift the window, so items are skipped or repeated, and deep offsets are slow", "It is not supported by Spring Data", "It requires the total count to be known"],
      c: 1,
      why: "Cursor pagination asks for the twenty after a given id, so the database seeks rather than counting past the offset, and the window is stable. Always cap the page size server-side either way." },

    { q: "Which change to a REST response is NOT a breaking change for well-behaved clients?",
      a: ["Renaming a field", "Adding a new optional field", "Changing a field's type from string to number", "Removing a field"],
      c: 1,
      why: "Designing responses so clients ignore what they do not know is what lets you avoid a v2 for years. The best versioning strategy is not needing a new version." },

    { q: "Which status code distinguishes 'authenticated but not allowed' from 'not authenticated'?",
      a: ["401 for not allowed, 403 for not authenticated", "403 for not allowed, 401 for not authenticated", "400 for both", "404 for both, to avoid disclosing existence"],
      c: 1,
      why: "Clients branch on the difference: a 401 means try to authenticate again, a 403 means do not bother. Returning 200 with an error body forces every client to parse the body to find out whether it worked." },
  ],

});

# Module 01 — The JVM, and what actually runs

> Site chapters: [01 — The JVM, and what actually runs](../../site/chapters/01-jvm-and-runtime.html),
> [02 — Java 8 → 17 → 21, version by version](../../site/chapters/02-java-versions.html)
>
> Code: [`src/pom.xml`](../../src/pom.xml)

---

## 1. The idea

### `javac` barely optimises

This surprises people. The compiler does almost nothing clever: it checks types, erases
generics, desugars a few constructs and writes bytecode that is a fairly literal
translation of your source. It does not inline, it does not unroll loops, it does not
eliminate dead branches in any meaningful way.

**All the optimisation happens at run time.** The JIT watches which methods run often,
compiles those to native code, inlines aggressively, and — the part that has no
equivalent in an ahead-of-time compiler — *speculates*. It sees that a call site has
only ever had one implementation and compiles as though it always will, with a guard
that deoptimises if a second one shows up.

Two consequences that matter in practice:

- **Java gets faster as it runs.** The first thousand executions of a method are
  interpreted or barely compiled. Any benchmark that does not warm up is measuring the
  interpreter.
- **Start-up cost is the price of the JIT.** Two seconds of Spring Boot start-up is
  partly class loading and partly the JIT having compiled nothing yet. That is the trade
  Quarkus and GraalVM native images unwind — module 16.

### Class loading, and the two exceptions people confuse

Classes are loaded lazily, by name, when first needed.

- **`ClassNotFoundException`** — a *runtime lookup* failed. Something asked for a class
  by name, usually reflectively, and it was not on the classpath.
- **`NoClassDefFoundError`** — the class was there at compile time and is not now. A
  packaging problem. Or, more confusingly, the class *was* found but its static
  initialiser threw the first time, and every subsequent attempt gets this instead of
  the original failure.

That second case is worth knowing: the interesting exception is the first one, which
appeared once, higher up in the log, and everything after it is a misleading
`NoClassDefFoundError`.

### JDK, not JRE — and whose build

A JRE has no compiler and none of the tools. `jcmd`, `jstack`, `jmap`, `jfr` are how you
diagnose a production problem, and they ship with the JDK. Running a JRE in a container
saves a few tens of megabytes and costs you the ability to look inside.

There is no single "Oracle Java" any more. Temurin, Corretto, Zulu, Liberica, Oracle —
all built from the same OpenJDK source. The differences are support, licence and
patch cadence. **Know which one you are running**, because "we're on Java 17" is not an
answer when a vendor-specific CVE lands.

### The version line

**8 → 11 → 17 → 21 are the LTS releases.** Everything between them is a six-month
release that most companies skip.

- **Java 8** is the one still in production everywhere. Lambdas, streams, `Optional`,
  `java.time`, and default methods — which existed so `Collection` could grow `stream()`
  without breaking every implementation ever written.
- **8 → 11 is the painful jump**, and not because of modules. It is *removals*:
  `javax.xml.bind`, CORBA, the JavaEE modules — plus strong encapsulation making
  `sun.misc.Unsafe` reflection start failing. Almost nobody has to modularise their own
  application; almost everybody has to find a replacement for something that was
  deleted.
- **11 → 17** is comparatively easy. Records, sealed types, switch expressions, text
  blocks, better NPE messages.
- **17 → 21** brings virtual threads, and they matter — module 08.

**On a Java 17 job, write Java 17.** Records instead of a class with five getters,
switch expressions instead of fall-through, `var` where the type is obvious on the right.
An interviewer reading Java 8 in a Java 17 codebase learns something about you, and it is
not what you wanted.

`var` is compile-time inference, not dynamic typing. The type is fixed and checked; you
just did not write it down.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| `maven.compiler.release` 21, one place | [`src/pom.xml`](../../src/pom.xml) |
| Records, sealed types, pattern matching in `switch` | throughout [`ordini-domain`](../../src/ordini-domain) |
| An exhaustive `switch` with no `default` | [`Result.map`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java) |
| `instanceof` pattern | [`Order.equals`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |

`release` rather than `source` and `target`: `release` also checks that you are not
calling APIs newer than the target, which the older pair does not. Compiling with
`source 11` on a JDK 21 will happily let you call a Java 17 method and then fail at run
time on Java 11.

This project targets 21 and writes 21. That is module 16's argument about Quarkus in a
different form: the version you are on is a decision, and half-using it is the worst
option.

---

## 3. Do it

**Lab A — watch the JIT warm up.**

```bash
jshell -q --execution local <<'EOF'
long work() { long s = 0; for (int i = 0; i < 20_000_000; i++) s += i % 7; return s; }
for (int run = 1; run <= 5; run++) {
    long t = System.nanoTime();
    work();
    System.out.println("run " + run + ": " + (System.nanoTime() - t) / 1_000_000 + " ms");
}
EOF
```

Later runs are faster than the first, on identical work. That is the JIT compiling a
method it has now seen run enough times. Every micro-benchmark that does not warm up is
measuring the wrong thing, which is why JMH exists.

**Lab B — see what it compiled.**

Run the same loop with `-XX:+PrintCompilation` in a scratch class and read the output.
Method names appear as they are compiled, some more than once at rising tiers, and
occasionally with `made not entrant` — that is a deoptimisation, the JIT discovering its
speculation was wrong.

**Lab C — the two exceptions.**

```bash
jshell -q --execution local <<'EOF'
try { Class.forName("com.example.NotThere"); }
catch (Throwable t) { System.out.println(t.getClass().getSimpleName()); }
EOF
```

`ClassNotFoundException`, because that was a runtime lookup. Now write a class with a
static initialiser that throws, load it twice in a scratch program, and print both
failures. The first is the real one; the second is a `NoClassDefFoundError` that tells
you nothing.

**Lab D — read the version.**

```bash
java -version
java -XshowSettings:properties -version 2>&1 | grep -E 'java.vendor|java.version'
```

Name the vendor out loud. Then look at `src/pom.xml` and confirm the project targets 21.
If those two ever disagree in a real project, the build is compiling for one runtime and
running on another.

**Lab E — write Java 8 on purpose.**

Take [`Result`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java)
and rewrite it as Java 8: abstract class, two subclasses, `instanceof` with casts, no
exhaustiveness. It works. Count the lines and the places a new case could be forgotten.
That difference is what "on a Java 17 job, write Java 17" is actually about.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:01,02 -->
**Chapter 01 — The JVM, and what actually runs**

1. **javac barely optimises.** The compiler that matters is the JIT, and it runs later, with profile data.
2. **Java gets faster as it runs.** Any benchmark without a warm-up phase is measuring the interpreter.
3. **`ClassNotFoundException` is a runtime lookup that failed;** `NoClassDefFoundError` is a packaging problem — or a static initialiser that threw.
4. **Install a JDK, not a JRE,** and know which vendor’s build you are running.
5. **Start-up cost is the price of the JIT.** That is the trade Quarkus and native images reverse.

**Chapter 02 — Java 8 → 17 → 21, version by version**

1. **The LTS line is 8, 11, 17, 21.** The number in an advert is a hint about the codebase’s age.
2. **Java 8 is lambdas, streams, Optional and java.time** and default methods, which existed so `Collection` could grow `stream()`.
3. **The 8→11 pain was removals and strong encapsulation,** not modules you had to adopt.
4. **`var` is compile-time inference.** There is no runtime difference at all.
5. **On Java 17, write Java 17.** A record instead of a thirty-line DTO is the cheapest signal you have.
6. **Virtual threads undercut the main argument for reactive.** Know that, even if the job is on 17.
<!-- /CARD -->

---

## 5. Interview questions

**"Cosa fa `javac`?"** — Very little optimisation: type checking, erasure, desugaring, and
a fairly literal bytecode translation. The optimisation is the JIT's job at run time,
which is why Java gets faster as it runs and why an un-warmed benchmark measures the
interpreter.

**"Differenza fra `ClassNotFoundException` e `NoClassDefFoundError`?"** — The first is a
runtime lookup that failed, usually reflective. The second means it was there at compile
time and is not now — a packaging problem, or a class whose static initialiser threw the
first time, in which case the real exception is further up the log and everything after
it is misleading.

**"Perché installare un JDK e non un JRE?"** — Because `jcmd`, `jstack`, `jmap` and JFR
are how you diagnose a production problem, and they are not in a JRE. The saving is a few
tens of megabytes; the cost is not being able to look inside a running system.

**"Cosa è cambiato fra Java 8 e 11?"** — The pain is removals and strong encapsulation,
not modules. `javax.xml.bind`, CORBA, the JavaEE modules gone; reflection into `sun.misc`
starting to fail. Most applications never modularise themselves and still have to do the
migration.

**"Perché il primo avvio è lento?"** — Class loading plus a JIT that has compiled nothing
yet. That is the trade Java makes for peak throughput, and it is exactly what Quarkus and
GraalVM native images give up in exchange for a fast start.

**"Cosa è `var`?"** — Compile-time type inference for local variables. The type is fixed
and checked; you just did not write it. Not dynamic typing, and not usable for fields or
method parameters.

# Module 16 — Spring Boot, auto-configuration, and Quarkus compared

> Site chapters: [14 — Spring Boot and auto-configuration](../../site/chapters/14-spring-boot-autoconfig.html),
> [15 — Quarkus, and when it is chosen instead](../../site/chapters/15-quarkus-vs-spring.html)
>
> Code: [`pom.xml`](../../src/pom.xml),
> [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml),
> [`OrdiniApplication.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/OrdiniApplication.java)

---

## 1. The idea

Spring Boot is two things wearing one name: **a version opinion** and **conditional
bean definition**. Keeping them separate in your head is most of understanding it.

### A starter is a version opinion

`spring-boot-starter-web` contains almost no code. What it contains is a dependency
list — Tomcat, Jackson, Spring MVC, the validation API — at versions known to work
together. You take the opinion, or you take the job of curating it yourself.

That is why the answer to "which Jackson version?" on a Boot project is "the one the
BOM says", and why overriding one of them is a decision rather than a tweak.

### Auto-configuration is conditional bean definition

Boot ships hundreds of `@Configuration` classes guarded by conditions:
`@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`. They mean
what they say — *if Tomcat is on the classpath and nobody defined a web server, define
one*.

Two consequences follow, and both matter:

- **`@ConditionalOnMissingBean` is why your `@Bean` wins.** Defining your own
  `ObjectMapper` does not fight Boot; it backs off. Auto-configuration is a set of
  defaults, and defaults are supposed to lose.
- **The classpath is configuration.** Adding a dependency changes which beans exist.
  That is the magic people complain about, and it is also just an `if`.

**`--debug` prints the condition evaluation report**: every auto-configuration that
matched, every one that did not, and why. It is the single most useful thing to know
about Boot when something is not wired the way you expect, and most people never run
it.

### Component scan starts at the main class's package

`@SpringBootApplication` includes `@ComponentScan`, and it scans *this package and
downwards*. Move `OrdiniApplication` into `it.fonderia.ordini.app.boot` and half the
beans disappear, with no error except a `NoSuchBeanDefinitionException` naming a
symptom rather than a cause.

The convention — main class in the root package — is not style. It is the thing that
makes scanning find everything.

### The parent-versus-BOM decision, and what it actually costs

Most tutorials inherit `spring-boot-starter-parent`. This build imports the BOM
instead:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-dependencies</artifactId>
  <type>pom</type><scope>import</scope>
</dependency>
```

The reason is that a multi-module build usually wants a parent of its own, and Maven
gives you one parent. Importing the BOM keeps Boot's version opinion and leaves the
build shape yours.

**What it costs is not obvious, and this project paid for both halves of it.**

The starter parent does not only manage versions. It also configures plugins — and two
of those configurations are load-bearing:

1. **`-parameters`.** Without it, parameter names are not in the bytecode, so Spring
   cannot tell that a controller argument is called `id`. Every `@PathVariable` and
   `@RequestParam` without an explicit name fails **at request time**:

   > `Name for argument of type [java.lang.String] not specified, and parameter name
   > information not available via reflection. Ensure that the compiler uses the
   > '-parameters' flag.`

   It is a 400, not a start-up error. A context-loads test passes. Seven controller
   tests in this project failed on it before the flag was added to the parent pom.

2. **The `repackage` goal.** The starter parent binds it; the BOM does not. Declare
   `spring-boot-maven-plugin` without an `<executions>` block and it sits on the build
   doing nothing. `mvn package` produces an ordinary jar, the build is green, and the
   failure appears the first time someone runs it: **`no main manifest attribute`**.

Both are in this repository's poms with the reasoning written next to them, because
both are silent. Neither is an argument against importing the BOM — it is a good
choice for a multi-module build. It is an argument for knowing what the parent was
doing for you.

### Quarkus, and the honest comparison

Quarkus moves wiring to **build time**. Spring decides at start-up what beans exist by
evaluating conditions; Quarkus decides during compilation and generates the graph.

- **Faster start, smaller footprint.** Milliseconds instead of seconds, tens of
  megabytes instead of hundreds. That matters for serverless and for scaling to zero.
- **Lower peak throughput**, generally, and a smaller ecosystem.
- **Built on Jakarta standards** — CDI, JAX-RS — so the annotations look familiar to
  anyone who has written Java EE.

It is a **start-up-versus-steady-state** question, not a better-versus-worse one. A
service that runs for weeks and handles sustained load does not care about two seconds
of start-up. A function that scales from zero cares about nothing else.

And say the last part in an interview: **Spring Boot 3 plus GraalVM native images
narrowed the gap considerably.** The choice is less stark than it was in 2021, and
knowing that is the difference between having read about it and having watched it.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| The BOM import, and why not the starter parent | [`src/pom.xml`](../../src/pom.xml) |
| `-parameters`, with the failure it prevents | [`src/pom.xml`](../../src/pom.xml) |
| `repackage` declared explicitly | [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml) |
| Starters as version opinions | [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml) |
| Main class in the root package | [`OrdiniApplication`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/OrdiniApplication.java) |
| What is deliberately *not* on the classpath yet | [`ordini-app/pom.xml`](../../src/ordini-app/pom.xml) — no JPA, no driver |

That last row is the auto-configuration point in reverse. There is no `DataSource` bean
in this application, and not because anyone excluded one: nothing on the classpath
triggers the condition that would create it. Add `spring-boot-starter-data-jpa` and a
driver, and a connection pool appears without another line of code.

---

## 3. Do it

**Lab A — read the condition report.**

```bash
cd src && mvn -q install -DskipTests
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18080 --debug
```

Find `Positive matches` and `Negative matches`. Look up `DataSourceAutoConfiguration`
in the negatives and read the reason — it will say the required class was not found.
Then find `DispatcherServletAutoConfiguration` in the positives. That report is the
answer to almost every "why is this bean here / not here" question.

**Lab B — remove the `-parameters` flag.**

Delete `<parameters>true</parameters>` from `src/pom.xml`, then run
`mvn clean test`. Seven controller tests fail with 400s. Note two things: it needs
`clean`, because incremental compilation will happily leave the old classes in place
and the flag change appears to do nothing; and the `@SpringBootTest` context-loads test
still passes, because nothing is wrong until a request arrives.

**Lab C — unbind `repackage`.**

Remove the `<executions>` block from `ordini-app/pom.xml`, run `mvn clean install
-DskipTests`, then `java -jar` the result. `no main manifest attribute`. The build was
green throughout. Put it back and confirm with:

```bash
unzip -p ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar META-INF/MANIFEST.MF | grep Start-Class
```

**Lab D — move the main class.**

Move `OrdiniApplication` into a new `it.fonderia.ordini.app.boot` package and run the
tests. The context fails: `OrderService` cannot be found, because scanning now starts
below it. Read the error and notice that it names the missing bean and not the cause —
which is why the convention is worth knowing rather than deriving.

**Lab E — override an auto-configured bean.**

Define your own `ObjectMapper` `@Bean` and set it to fail on unknown properties. It
wins, because Boot's is `@ConditionalOnMissingBean`. Then send a request with an extra
JSON field and watch the behaviour change. You did not disable anything; the default
backed off.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:14,15 -->
**Chapter 14 — Spring Boot and auto-configuration**

1. **A starter is a version opinion,** not code. That is most of Boot’s value.
2. **Auto-configuration is conditional bean definition.** Define your own bean and it backs off.
3. **`--debug` prints the condition evaluation report.** Use it instead of guessing.
4. **Component scan starts at the main class’s package.** Siblings are invisible.
5. **Expose actuator endpoints deliberately.** `/env` and `/heapdump` are not public information.

**Chapter 15 — Quarkus, and when it is chosen instead**

1. **Quarkus moves wiring to build time.** Less reflection, less start-up work.
2. **Faster start, smaller footprint, lower peak throughput.** All three, honestly.
3. **It is a start-up-versus-steady-state question,** not a tribal one.
4. **Built on Jakarta standards** CDI, JAX-RS, JPA. A Spring developer reads it fine.
5. **Spring Boot 3 + GraalVM narrowed the gap.** Say so; it shows you are current.
<!-- /CARD -->

---

## 5. Interview questions

**"Che cos'è uno starter?"** — A dependency list at versions known to work together —
almost no code of its own. It is a version opinion, and taking it is the alternative to
curating those versions yourself.

**"Come funziona l'auto-configuration?"** — Conditional bean definition. Boot ships
`@Configuration` classes guarded by `@ConditionalOnClass`, `@ConditionalOnMissingBean`
and friends, so the classpath and your own beans decide what gets created. The
practical consequence: defining your own bean makes Boot's back off, and `--debug`
prints exactly which conditions matched and why.

**"Perché un bean non viene trovato?"** — Usually component scan. Scanning starts at the
main class's package and goes down, so a class outside that tree is invisible. The
error names the missing bean rather than the cause, which is why this is worth knowing
by heart.

**"Boot o Quarkus?"** — A start-up-versus-steady-state question. Quarkus moves wiring to
build time: faster start, smaller footprint, generally lower peak throughput, smaller
ecosystem, and Jakarta standards underneath. For a long-running service handling
sustained load the start-up time is irrelevant; for something that scales to zero it is
the only thing that matters. And Boot 3 with GraalVM narrowed the gap.

**"Ha mai avuto problemi con `spring-boot-starter-parent`?"** — A good one to answer with
the opposite experience: importing the BOM instead, in a multi-module build that wanted
its own parent. Then name what the parent was doing for you — `-parameters`, without
which every `@PathVariable` fails at request time, and the `repackage` goal, without
which the jar has no main class. Both are silent failures, and both cost me a
debugging session.

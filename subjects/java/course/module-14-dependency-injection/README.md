# Module 14 — Dependency injection, and the design it exposes

> Site chapter: [12 — Dependency injection, done properly](../../site/chapters/12-dependency-injection.html)
>
> Code: [`OrderService.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java),
> [`OrderRepository.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java)

---

## 1. The idea

Constructor injection. Everything else in this module is a consequence.

```java
public OrderService(OrderRepository orders, Clock clock) {
    this.orders = orders;
    this.clock = clock;
}
```

No `@Autowired` — since Spring 4.3 a class with a single constructor needs none. Four
things follow:

1. **The fields can be `final`.** The object is fully built or it does not exist. There
   is no window in which a dependency is null.
2. **A test constructs it with `new`.**
   [`OrderServiceTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderServiceTest.java)
   does exactly that — no container, no reflection, no `@SpringBootTest`. That file is
   the argument in executable form.
3. **A missing dependency is a start-up failure**, not a `NullPointerException` on the
   first request that happens to need it.
4. **The class cannot hide how much it depends on.** Which is the interesting one.

### A long constructor is a visible design smell — and that is the feature

Field injection's real cost is not testability, it is camouflage. Eight
`@Autowired` fields look exactly like two; eight constructor parameters look like a
problem, because they are one. The class is doing eight things.

So when a constructor gets long, the answer is not `@Autowired` on fields. It is to
ask which of those eight collaborators belong together, and extract that. The
constructor is a design review you get for free on every save.

### `@Primary` for the default, `@Qualifier` for the exception

Two beans of the same type is an ambiguity the container cannot resolve. `@Primary`
marks the one that wins by default; `@Qualifier("name")` names a specific one at the
injection point. The rule of thumb: if nine call sites want the same one, `@Primary`
on it and `@Qualifier` on the tenth — not `@Qualifier` on all ten.

### A circular dependency is a design signal, not a configuration problem

A needs B, B needs A. Spring 2.6+ fails at start-up rather than papering over it, and
that is correct. `@Lazy` will make it start; it will not make it a good design.

The honest fix is almost always that there is a third thing hiding: the part of A that
B needs, and the part of B that A needs, belong in a class neither of them owns yet.

### The dependency arrow, and where the interface lives

[`OrderRepository`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java)
is declared in `ordini-domain` and implemented in `ordini-app`. That is dependency
inversion, and the reason it is real rather than aspirational is the build: the domain
module's classpath has JUnit on it and nothing else, so an `@Repository` or a
`Pageable` in that interface would not compile.

That is the test to apply to any codebase claiming clean architecture — not whether the
packages are named `domain` and `infrastructure`, but whether the domain *could* import
the framework if someone tried.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Constructor injection, no `@Autowired` | [`OrderService`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java), [`OrderController`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderController.java) |
| The port, in the domain | [`OrderRepository`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderRepository.java) |
| The adapter, in the app | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) |
| A test that builds the service with `new` | [`OrderServiceTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderServiceTest.java) |
| A slice test that assembles the graph by hand | [`OrderControllerTest.RealCollaborators`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrderControllerTest.java) |

That last one is worth reading closely. `@WebMvcTest` does not scan `@Service` or
`@Repository`, so the test builds the graph itself in three `@Bean` methods — which is
only possible because those classes take their dependencies through constructors. With
field injection there would be no way to construct one outside a container, and the
test would have had to mock the service instead.

---

## 3. Do it

**Lab A — switch to field injection and count what you lose.**

Replace `OrderService`'s constructor with `@Autowired` fields. The application still
runs. Then run `OrderServiceTest` — it no longer compiles, because there is no way to
supply the collaborators. Your options are a container, reflection, or a mock. All
three are worse than the constructor you deleted.

**Lab B — introduce a cycle.**

Give `InMemoryOrderRepository` a constructor parameter of type `OrderService`. The
application fails at start-up with a message naming the cycle. Then try `@Lazy` on one
side and watch it start — and ask whether anything got better. The answer is no: the
design still says the repository needs the service that needs the repository.

**Lab C — two beans, one type.**

Add a second `OrderRepository` implementation (a `NullOrderRepository` that stores
nothing). The context fails: two candidates, no way to choose. Fix it three ways —
`@Primary`, `@Qualifier`, and a `@Profile` on one of them — and decide which you would
use for a real second implementation. `@Profile` is usually the honest answer when the
second one exists for tests.

**Lab D — make the domain import Spring.**

Add `@Repository` to `OrderRepository` in `ordini-domain`. It does not compile, because
Spring is not on that module's classpath. Now add
`spring-context` to `ordini-domain/pom.xml` and watch it compile. Then remove both, and
notice what the exercise proved: the layering is enforced by one line in a pom, and
removing that line removes the guarantee silently.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:12 -->
**Chapter 12 — Dependency injection, done properly**

1. **Constructor injection** final fields, no half-built objects, no reflection needed to test.
2. **A single constructor needs no `@Autowired`** since Spring 4.3.
3. **A long constructor is a visible design smell.** Field injection hides it.
4. **`@Primary` for the default, `@Qualifier` for the exception,** a `List<T>` when you want all of them.
5. **A circular dependency is a design signal.** `@Lazy` silences the message.
<!-- /CARD -->

---

## 5. Interview questions

**"Constructor injection o field injection?"** — Constructor, always. Final fields, no
half-built object, no reflection needed to test, and a missing dependency fails at
start-up. The one people forget: a long constructor is *supposed* to be uncomfortable,
because it is telling you the class does too much. Field injection hides that.

**"Serve `@Autowired` sul costruttore?"** — Not since Spring 4.3, when there is a single
constructor. It is still fine to write it for clarity, but its absence is not a
mistake.

**"Come gestisce due bean dello stesso tipo?"** — `@Primary` on the default,
`@Qualifier` at the injection point that wants the other. And if the second one exists
only for a particular environment, `@Profile` is usually the better answer than either.

**"Cosa fa con una dipendenza circolare?"** — Treat it as a design signal. Spring fails
at start-up by default, and that is right. `@Lazy` makes it start without making it
correct; the real fix is that a third class is missing, holding the part of each that
the other needs.

**"Dove mette l'interfaccia del repository?"** — In the domain, with the implementation
outside it, so the dependency arrow points inwards. And I would say how it is enforced:
the domain module does not have Spring on its classpath, so it is a build failure
rather than a code-review convention.

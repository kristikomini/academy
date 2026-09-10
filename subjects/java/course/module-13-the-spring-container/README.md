# Module 13 — The Spring container: beans, scopes, lifecycle, proxies

> Site chapter: [11 — The container: beans, scopes, lifecycle](../../site/chapters/11-spring-container.html)
>
> Code: [`ClockConfig.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/ClockConfig.java),
> [`OrdiniApplicationTests.java`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniApplicationTests.java)

---

## 1. The idea

The container owns construction. That is the sentence the rest of Spring hangs off.

You stop writing `new OrderService(new InMemoryOrderRepository(), Clock.systemUTC())`
and instead declare what exists; the container works out the order, builds everything
once, and hands each object its collaborators. What you get in return is not less
typing — it is a **place to stand between you and your objects**, and that place is
where transactions, security, caching and metrics get added without your code
mentioning them.

### Two ways to declare a bean, and when each is right

- **`@Component`** (and its aliases `@Service`, `@Repository`, `@Controller`) — for
  classes you own. The annotation goes on the class, and component scanning finds it.
- **`@Bean` in a `@Configuration` class** — for types you do *not* own.
  [`ClockConfig`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/ClockConfig.java)
  is the minimal example: you cannot put `@Component` on `java.time.Clock`, so a
  factory method declares it instead.

The aliases are not decoration. `@Repository` additionally translates persistence
exceptions into Spring's `DataAccessException` hierarchy; `@Controller` is what makes
handler mapping look at the class. Using `@Component` everywhere works right up until
the day you wanted one of those behaviours.

### Singleton is the default scope, and that is the whole bug class

One instance, shared by every thread that touches it. That is right for a stateless
service and catastrophic for a bean holding per-request state — and the failure only
appears under concurrency, which means never in development and always on the
Wednesday after release.

The rule that follows: **a singleton bean's fields must be either immutable
dependencies or thread-safe.** `OrderService` holds a repository and a clock; both are
fine. The moment someone adds `private Order currentOrder;` the application has a data
race with no error message.

Chapter 09 says the same thing from the other end: singleton beans are shared across
request threads.

### The proxy, and the two ways it bites

**What you get injected is usually not your object.** When a bean needs
`@Transactional`, `@Async`, `@Cacheable` or method security, Spring hands out a proxy
that wraps the real instance. It is in the twelve, and everything surprising about
Spring AOP follows from it:

1. **Self-invocation does not go through the proxy.** A method calling another method
   on `this` calls the real object directly, so the second method's `@Transactional`
   does nothing. Silently.
2. **`private` and `final` methods get no advice.** A CGLIB proxy works by subclassing
   and overriding, and neither can be overridden. Also silently.

Both are the same fact seen twice: advice lives on the wrapper, and anything that
bypasses the wrapper bypasses the advice.

### Lifecycle

Construct → inject → `@PostConstruct` → in use → `@PreDestroy`.

The detail worth knowing: **`@PostConstruct` runs on the raw instance, before proxying
is complete.** So a `@PostConstruct` method that calls a `@Transactional` method of its
own class runs without a transaction. It is the self-invocation trap again, in the one
place people least expect it.

### Prototype inside a singleton

`@Scope("prototype")` means a new instance per lookup. Inject one into a singleton and
you get **one** instance, resolved once when the singleton was built — because
injection happens once. If you genuinely need a fresh one per call, ask the container
each time (`ObjectProvider<T>`) rather than holding a field.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| `@Bean` for a type we do not own | [`ClockConfig`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/ClockConfig.java) |
| `@Service` on a class we do own | [`OrderService`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/application/OrderService.java) |
| `@Repository` on the adapter | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) |
| Singleton scope, asserted | [`OrdiniApplicationTests.singletonIsTheDefaultScope`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniApplicationTests.java) |
| A singleton whose only mutable state is a thread-safe map | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) |
| The whole graph, verified once | [`OrdiniApplicationTests.contextLoads`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniApplicationTests.java) |

**There is no proxy in this application yet**, because nothing is `@Transactional` and
nothing is `@Async`. That arrives with persistence in module 23, and the module says so
rather than pointing at code that does not exist. The consequence is worth noticing on
its own: *every* object you get from this context is the real object, and you can prove
it — lab B does.

---

## 3. Do it

**Lab A — see the beans.**

Add a temporary `@Bean CommandLineRunner` that prints
`context.getBeanDefinitionNames()` sorted, and run the application. There are several
hundred. Almost all of them came from auto-configuration, which is module 16 — the
point here is that four annotations in your own code sit inside a very large graph you
did not write, and being unsurprised by that is half of debugging Spring.

**Lab B — prove nothing is proxied yet.**

In `OrdiniApplicationTests`, add:

```java
assertEquals(OrderService.class, context.getBean(OrderService.class).getClass());
```

It passes: no proxy. Now add `@Transactional` to any method of `OrderService`, and add
`spring-boot-starter-data-jpa` — the assertion fails, and the class name gains a
`$$SpringCGLIB$$` suffix. That suffix is the thing chapter 11 means by *what you get
injected is usually a proxy*, and seeing it once makes the self-invocation trap
memorable rather than theoretical.

**Lab C — break the singleton.**

Add `private int calls;` to `OrderService` and `calls++` to `submit`. It compiles, the
tests pass, and you have introduced a data race. Then write the test that catches it:
fire 100 concurrent `submit` calls through an executor and assert `calls == 100`. It
will not be. Remove the field and note what you learned — the tests passing is not
evidence of thread safety, because the tests are single-threaded.

**Lab D — the `@PostConstruct` ordering.**

Add a `@PostConstruct` to `OrderService` that logs, and another to
`InMemoryOrderRepository`. Predict the order before running. The dependency is
constructed first, so its `@PostConstruct` runs first — construction order and
initialisation order agree, which is the one intuitive thing in this area.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:11 -->
**Chapter 11 — The container: beans, scopes, lifecycle**

1. **The container owns construction.** You describe beans; Spring builds the graph.
2. **What you get injected is usually a proxy,** not your object. Everything AOP-based depends on that.
3. **Singleton is the default scope.** Mutable fields on a service are shared across every request.
4. **Prototype injected into a singleton is resolved once.** Use `ObjectProvider` for per-call instances.
5. **`@PostConstruct` runs before proxying.** Transactions there do not exist.
<!-- /CARD -->

---

## 5. Interview questions

**"Che cos'è l'inversion of control?"** — The container owns construction: you declare
what exists and what it needs, and it builds the graph. The value is not less typing —
it is a seam between you and your objects, which is where transactions, security and
metrics get added without your code mentioning them.

**"Qual è lo scope di default?"** — Singleton: one instance shared by every request
thread. So a bean's fields must be immutable dependencies or thread-safe, and a bean
holding per-request state is a data race that never shows up in development.

**"Perché `@Transactional` a volte non funziona?"** — Because it lives on a proxy.
Self-invocation calls the real object and skips the wrapper entirely; `private` and
`final` methods cannot be overridden, so they get no advice either. Both fail silently,
which is what makes it worth knowing rather than looking up.

**"Differenza fra `@Component` e `@Bean`?"** — `@Component` for classes you own, found
by scanning; `@Bean` in a `@Configuration` class for types you cannot annotate — a
`Clock`, a third-party client, anything from a library. If you find yourself wanting to
annotate someone else's class, `@Bean` is the answer.

**"Un prototype dentro un singleton?"** — You get one instance, resolved when the
singleton was built, because injection happens once. If you need a fresh one per call,
inject `ObjectProvider<T>` and ask for it each time.

**"Cosa fa `@PostConstruct`?"** — Runs after dependencies are injected and before the
bean is in service. The trap: it runs on the raw instance before proxying is complete,
so a `@Transactional` method called from it runs without a transaction.

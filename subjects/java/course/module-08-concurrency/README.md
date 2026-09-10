# Module 08 — Threads, executors and virtual threads

> Site chapter: [09 — Threads, executors and virtual threads](../../site/chapters/09-concurrency.html)
>
> Code: [`InMemoryOrderRepository.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java),
> [`OutboxRelay.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java)

---

## 1. The idea

### Visibility is not atomicity

The one people get half right. Two separate problems, and `volatile` solves only the
first:

- **Visibility** — one thread's write may never be seen by another, because it sat in a
  register or a core's cache. `volatile` fixes this: reads and writes go to main memory,
  with the ordering guarantees to match.
- **Atomicity** — `count++` is three operations: read, add, write. Two threads can
  interleave and one increment vanishes. `volatile` does *nothing* for this, because each
  individual read and write was already fine; it is the sequence that is not.

For a counter, `AtomicInteger`. For anything larger, a lock or an immutable design.

A `volatile boolean running` flag to stop a loop is the correct use, and about the only
one most code needs.

### Executors, not `new Thread()`

A thread is an operating-system resource with a megabyte of stack. Creating one per task
means you can create a few thousand before the machine stops, and creating them at the
rate requests arrive means the cost of creation dominates.

An `ExecutorService` separates *what* runs from *how many* run at once. That is the whole
point, and it is why the interesting configuration is the queue rather than the pool.

### Bounded queues, and an explicit rejection policy

`Executors.newFixedThreadPool(10)` uses an **unbounded** queue. Under sustained overload
it does not reject anything — it accepts work forever until the heap is gone. The failure
is an `OutOfMemoryError` in a component that looks healthy right up to the moment it is
not.

Build the executor by hand:

```java
new ThreadPoolExecutor(10, 10, 0L, MILLISECONDS,
    new ArrayBlockingQueue<>(100),
    new ThreadPoolExecutor.CallerRunsPolicy());
```

A bounded queue means overload becomes rejection, which is a decision you can see.
`CallerRunsPolicy` makes the submitting thread do the work, which slows the producer down
— crude, effective backpressure.

### Virtual threads: one per task, never pooled

Java 21's headline. A virtual thread is scheduled by the JVM onto a small number of
carrier threads, and it costs kilobytes rather than a megabyte. Millions are fine.

**So do not pool them.** Pooling exists because threads are expensive; virtual threads
are not, and a pool of them reintroduces a limit for no reason.
`Executors.newVirtualThreadPerTaskExecutor()` is the idiom, and "pool" in its name is
absent on purpose.

The catch worth knowing: a virtual thread that blocks *inside a `synchronized` block*
pins its carrier thread, which undoes the benefit. Use `ReentrantLock` in code that will
run on virtual threads and block. (This is much improved in recent JDKs, and asking
whether it still applies is a good interview answer in itself.)

**Virtual threads undercut the main argument for reactive.** Reactive programming's
central promise was handling many concurrent connections without many threads — at the
cost of a programming model where stack traces are useless and debugging is hard. Virtual
threads give the first without the second. Reactive still wins for streaming and
backpressure; for "our service calls four other services", plain blocking code on virtual
threads is now the simpler answer.

### Singleton beans are shared across request threads

Module 13's rule, from the concurrency side. Every `@Service` is one instance handling
every concurrent request. Its fields must be immutable dependencies or thread-safe, and
the moment somebody adds mutable per-request state the application has a data race that
no single-threaded test can find.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Shared mutable state, made safe by choosing the structure | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) |
| A scheduled task, i.e. a second thread | [`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java) |
| Concurrency handled by the database rather than by locks | [`JpaOrderRepository.save`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/JpaOrderRepository.java) |
| The test with two concurrent editors in it | [`JpaOrderRepositoryTest.optimisticLockingRejectsAStaleWrite`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/JpaOrderRepositoryTest.java) |

**There is not a single `synchronized`, `Thread` or `ExecutorService` in this
application**, and that is the most useful thing this module can point at.

The concurrency is real — Tomcat runs requests on many threads, and the relay runs on
another — and it is handled by three decisions instead of by locks:

1. **Stateless services.** Nothing to race over.
2. **A thread-safe structure** where shared state was unavoidable.
3. **Optimistic concurrency in the database** for the case that actually matters — two
   people editing the same order — which is module 23.

That is the pattern to take away. Most "concurrency" in a web application is not solved
with `synchronized`; it is solved by not sharing mutable state and by letting the
database arbitrate the one thing that genuinely is contended.

**The relay is the exception worth watching.** It is `@Scheduled`, so with more than one
replica two relays poll the same table. It works — the row is marked inside the
transaction — but it does duplicate work. `SELECT … FOR UPDATE SKIP LOCKED` is the
standard fix, and its absence is noted rather than hidden.

---

## 3. Do it

**Lab A — lose increments.**

```bash
jshell -q --execution local <<'EOF'
int[] plain = {0};
var atomic = new java.util.concurrent.atomic.AtomicInteger();
var pool = java.util.concurrent.Executors.newFixedThreadPool(8);
for (int i = 0; i < 100_000; i++) pool.submit(() -> { plain[0]++; atomic.incrementAndGet(); });
pool.shutdown(); pool.awaitTermination(30, java.util.concurrent.TimeUnit.SECONDS);
System.out.println("plain:  " + plain[0]);
System.out.println("atomic: " + atomic.get());
EOF
```

```
plain:  99760
atomic: 100000
```

240 increments gone. Run it again and you lose a different number — which is the worst
property of the bug: it is not reproducible, so it survives being "tested". Then make it `volatile` in a scratch class and watch it still be wrong —
which is the point of the first section.

**Lab B — the unbounded queue.**

Submit tasks that sleep for a second to `Executors.newFixedThreadPool(2)`, faster than
they can complete, and watch memory climb with nothing rejected. Then build a
`ThreadPoolExecutor` with an `ArrayBlockingQueue<>(10)` and `CallerRunsPolicy`, and watch
the submitting loop slow down instead. Overload became backpressure.

**Lab C — a million virtual threads.**

```bash
jshell -q --execution local <<'EOF'
long t = System.nanoTime();
try (var ex = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1_000_000; i++) ex.submit(() -> { Thread.sleep(100); return null; });
}
System.out.println((System.nanoTime()-t)/1_000_000 + " ms for a million tasks");
EOF
```

A million tasks, each sleeping 100 ms, finished in about **27 seconds** on an ordinary
laptop. A million platform threads would not have started. This is the demonstration that
makes "one per task, never pooled" obvious rather than memorised.

**Lab D — race the real application.**

Write a test that fires 50 concurrent `submit` calls at the same order id through
`OrderService`, and count how many succeed. Exactly one should; the rest should be
`OptimisticLockingFailureException` or an illegal-transition failure. That is the
database arbitrating, and it is what "handled without locks" actually means.

**Lab E — add the race back.**

Put `private int submissions;` on `OrderService` and increment it in `submit`. Run lab D
again and compare the counter to the number of successful calls. They disagree. Then
delete it, and remember that every test in this project passed the whole time.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:09 -->
**Chapter 09 — Threads, executors and virtual threads**

1. **Visibility is not atomicity.** `volatile` gives the first, not the second.
2. **`count++` is read-modify-write.** Use an atomic, or a lock.
3. **Executors, not `new Thread()`.** Execution policy belongs in one place.
4. **Bounded queues with an explicit rejection policy.** Unbounded turns overload into OOM.
5. **Virtual threads: one per task, never pooled.**
6. **Singleton beans are shared across request threads.** Keep them stateless.
<!-- /CARD -->

---

## 5. Interview questions

**"A cosa serve `volatile`?"** — Visibility and ordering, not atomicity. It guarantees one
thread sees another's write; it does nothing for `count++`, which is read-modify-write
and can still interleave. For a counter, `AtomicInteger`; `volatile` is right for a flag.

**"Perché un executor invece di `new Thread()`?"** — A platform thread is an OS resource
with about a megabyte of stack, so per-task creation does not scale and the creation cost
dominates. An executor separates what runs from how many run at once — and the important
configuration is the queue, not the pool size.

**"Cosa c'è di sbagliato in `newFixedThreadPool`?"** — Its queue is unbounded, so overload
becomes an `OutOfMemoryError` instead of a rejection. I build a `ThreadPoolExecutor` with
a bounded queue and an explicit rejection policy — `CallerRunsPolicy` gives crude
backpressure by making the submitter do the work.

**"Cosa cambia con i virtual thread?"** — They cost kilobytes instead of a megabyte, so
one per task and never pooled — pooling existed because threads were expensive. The trap
is blocking inside `synchronized`, which pins the carrier thread; use `ReentrantLock`
there.

**"Virtual thread o reactive?"** — Virtual threads undercut reactive's main argument:
many concurrent connections without many threads, but with readable stack traces and
ordinary debugging. Reactive still wins for streaming and backpressure. For a service
that calls four other services, blocking code on virtual threads is now simpler and just
as scalable.

**"Come gestisce la concorrenza nella sua applicazione?"** — Mostly by not having any
shared mutable state: stateless services, a thread-safe map where sharing was
unavoidable, and optimistic concurrency in the database for the one genuinely contended
thing. There is no `synchronized` anywhere in it, and that is a design outcome rather
than an oversight.

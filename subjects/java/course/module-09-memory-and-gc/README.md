# Module 09 — Memory, garbage collection and the heap

> Site chapter: [10 — Memory, garbage collection and the heap](../../site/chapters/10-memory-gc.html)
>
> Code: [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml)

---

## 1. The idea

### Most objects die young

The generational hypothesis, and it is not a guess — it is measured, repeatedly, across
decades of real programs. The overwhelming majority of allocations become garbage almost
immediately: a DTO built for one response, a `BigDecimal` in a loop, the intermediate
list a stream avoided building.

Every modern collector is designed around it. New objects go in a small region; a minor
collection copies the few survivors out and declares the rest of the region free without
looking at them. **Collecting garbage costs nothing; only survivors are paid for.** So a
method that allocates heavily and keeps nothing is far cheaper than its allocation count
suggests, and "avoid object creation" is 2004 advice.

What *is* expensive is objects that survive long enough to be promoted and then die —
which is what a cache with a bad eviction policy produces.

### Use the default collector until a measurement disagrees

G1 since Java 9, and it is a good default: a target pause time, region-based, handles
multi-gigabyte heaps.

- **ZGC / Shenandoah** — sub-millisecond pauses, at the cost of some throughput. Worth it
  for latency-sensitive services with large heaps.
- **Parallel** — best raw throughput, longest pauses. Fine for batch.

Choosing one without a measurement is cargo cult. Choosing one *with* a measurement, and
being able to say which percentile improved, is a good interview answer.

### The heap is not the whole footprint

The senior-six rule, and the arithmetic behind most container OOM kills:

```
RSS = heap + metaspace + thread stacks + code cache + direct buffers + GC structures + native
```

`-Xmx2g` in a 2 GB container is not a tight fit, it is a guarantee of death. Thread
stacks alone are about 1 MB each, and 200 Tomcat threads is 200 MB before your
application has allocated anything.

**`MaxRAMPercentage`, not `-Xmx`.** In a container the JVM should size itself from the
cgroup limit:

```
-XX:MaxRAMPercentage=75.0
```

Change the container's memory limit and the heap follows. With a hard-coded `-Xmx` the
two drift apart the first time somebody edits the deployment.

### Exit code 137 with no stack trace is the OOMKiller

The most useful diagnostic fact in this module, and the one people waste hours on.

- **`OutOfMemoryError`** — the *JVM* ran out of heap. You get an exception, a stack
  trace, and a heap dump if you configured one.
- **Exit code 137** — the *kernel* killed the process. `128 + 9`, SIGKILL. No stack
  trace, no log line, nothing in the application's output, because the process was shot
  rather than asked to stop.

137 means the container exceeded its memory limit — heap plus everything else. So the fix
is not always a bigger heap; often it is a *smaller* heap percentage, because the
non-heap part was the excess.

### Heap dump first, opinions second

```
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/app/
```

Set it before you need it. Then open the dump in Eclipse MAT and read the dominator tree,
which shows what is keeping objects alive rather than what is merely large. A memory leak
in Java is not a leak; it is a reference somebody forgot to drop, and the dominator tree
names it.

The classic culprits: a `static` collection that only grows, an unbounded cache, a
`ThreadLocal` not cleared on a pooled thread (which outlives the request by design), and
listeners that are registered and never removed.

---

## 2. In this codebase

**This is the module with the least code to point at, and pretending otherwise would be
worse than saying so.** The application runs on default JVM settings, has no cache, no
`ThreadLocal`, and no `static` mutable state. Its memory profile is uninteresting, which
is the correct outcome and not a demonstration of anything.

What the project *does* contain that is relevant:

| Thing | Where | Why it matters here |
|---|---|---|
| `open-in-view: false` | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) | Holds a connection, and its session's first-level cache, for the whole request |
| A bounded relay batch | [`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java) | Unbounded, it would load every pending row into memory after an outage |
| A `ConcurrentHashMap` that only grows | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) | An unbounded in-memory store *is* a leak — which is why it is not the production adapter |

That third row is the honest one. `InMemoryOrderRepository` never evicts anything: run it
in production and it grows until the process dies. It exists to make the web tier
testable before there was a database, `JpaOrderRepository` is `@Primary`, and the class's
own comment says what it is not.

The JVM flags in this module belong to the container, which is module 27. Naming them
here without a Dockerfile to put them in would be exactly the kind of cross-reference
this repository's gate exists to catch.

---

## 3. Do it

**Lab A — watch young collections be free.**

```bash
jshell -q --execution local -R-Xlog:gc <<'EOF'
for (int i = 0; i < 5_000_000; i++) { var s = new StringBuilder().append(i).toString(); }
System.out.println("done");
EOF
```

Millions of allocations, several young collections, and the pauses are sub-millisecond.
Now keep them — add each string to a `List` — and watch the collections get slower and
the heap grow, because now there are survivors to copy.

**Lab B — see the whole footprint.**

Start the application and compare:

```bash
jcmd <pid> GC.heap_info
jcmd <pid> VM.native_memory summary   # needs -XX:NativeMemoryTracking=summary
```

The heap is a fraction of the resident set. Write down the difference; that number is
what people forget when they set `-Xmx` to the container limit.

**Lab C — cause both kinds of death.**

First an `OutOfMemoryError`: run with `-Xmx64m` and add to a `List` in a loop. You get an
exception, a stack trace, and — with `-XX:+HeapDumpOnOutOfMemoryError` — a dump.

Then the other one: run in Docker with `--memory=256m` and `-XX:MaxRAMPercentage=95`, and
allocate. The container is killed. `docker inspect` shows exit code **137** and the
application log ends mid-sentence. Two very different failures, and only one of them
leaves evidence in your logs.

**Lab D — read a dump.**

Take the dump from lab C into Eclipse MAT and find the leak in the dominator tree. It
will take about ninety seconds and it is a skill worth having before the day you need it
at 3am.

**Lab E — the `ThreadLocal` leak.**

Set a `ThreadLocal` in a controller and never remove it. Tomcat's threads are pooled, so
the value outlives the request and the next request on that thread sees it. That is both
a leak and a correctness bug — and it is why every framework that uses `ThreadLocal`
clears it in a `finally`.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:10 -->
**Chapter 10 — Memory, garbage collection and the heap**

1. **Most objects die young.** That is why the heap is generational.
2. **Use the default collector until a measurement disagrees.** G1 is a good default.
3. **Exit code 137 with no stack trace is the OOMKiller,** not a Java error.
4. **The heap is not the whole footprint.** Metaspace, stacks, code cache and direct buffers sit outside it.
5. **Set `MaxRAMPercentage` and leave headroom** under the container limit.
6. **Heap dump first, opinions second.**
<!-- /CARD -->

---

## 5. Interview questions

**"Come funziona il garbage collector?"** — Generationally, because most objects die
young. New allocations go in a small region and a minor collection copies out the few
survivors, so collecting garbage is essentially free and only survivors cost anything.
Which is why "avoid allocating" is outdated advice and "avoid keeping things alive" is
not.

**"Quale collector usa?"** — G1, the default, until a measurement says otherwise. ZGC or
Shenandoah for sub-millisecond pauses on a large heap, Parallel for batch throughput.
Picking one without a measurement is cargo cult.

**"L'applicazione muore con exit code 137. Cosa fa?"** — I stop looking for an
`OutOfMemoryError`, because there will not be one. 137 is 128 + SIGKILL: the kernel
killed the container for exceeding its memory limit, so the process never got to log
anything. Then I look at the *whole* footprint — heap plus metaspace, thread stacks, code
cache, direct buffers — and often the fix is a lower `MaxRAMPercentage`, not a higher one.

**"`-Xmx` o `MaxRAMPercentage`?"** — `MaxRAMPercentage` in a container, so the heap tracks
the cgroup limit. A hard-coded `-Xmx` and a container limit drift apart the first time
somebody edits one of them, and the drift is discovered by an OOMKill.

**"Come trova un memory leak?"** — Heap dump first, opinions second.
`-XX:+HeapDumpOnOutOfMemoryError` set in advance, then the dominator tree in MAT — it
shows what is *keeping* objects alive rather than what is large. Usually a static
collection, an unbounded cache, or a `ThreadLocal` never cleared on a pooled thread.

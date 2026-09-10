# Module 03 — Collections, and what each one costs

> Site chapter: [04 — Collections, and choosing the right one](../../site/chapters/04-collections.html)
>
> Code: [`OrderStatus.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java),
> [`InMemoryOrderRepository.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java)

---

## 1. The idea

### `ArrayList` unless proven otherwise

It is an array. Indexing is one memory access, iteration is sequential and
cache-friendly, and appending is amortised O(1). For the overwhelming majority of lists,
nothing else is worth thinking about.

**`ArrayDeque`, not `LinkedList`.** `LinkedList` is the classic textbook answer for a
queue and the wrong practical one: every element is a separate object with two pointers,
so iteration jumps around memory and the cache misses dominate whatever the big-O
suggests. `ArrayDeque` is a circular array and beats it at both ends.

`LinkedList` wins when you are removing from the middle *while holding an iterator*.
That is rare enough that most codebases never do it.

### `contains` in a loop over a `List` is O(n²)

The most common accidental performance bug in Java, and it looks completely innocent:

```java
for (String id : incoming) {
    if (existing.contains(id)) { … }   // existing is a List
}
```

`List.contains` is a linear scan. Ten thousand of each is a hundred million comparisons.
Put `existing` in a `HashSet` first and it is ten thousand hash lookups.

### The map that matters most: `ConcurrentHashMap`

For a map shared between threads, `ConcurrentHashMap` — not `Collections.synchronizedMap`,
which takes one lock for the whole map and serialises every access.
[`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java)
uses one, and the comment there says why: a singleton bean's mutable state must be
thread-safe (module 13), and the class-level lock the alternative takes would serialise
every request in the application.

Note what `ConcurrentHashMap` does *not* give you: compound operations are still not
atomic. `if (!map.containsKey(k)) map.put(k, v)` has a race between the two calls.
`putIfAbsent`, `computeIfAbsent` and `merge` exist precisely for that.

### Enum keys deserve `EnumSet` and `EnumMap`

[`OrderStatus`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java)
holds its transition table in an `EnumMap` of `EnumSet`s. They are not a stylistic
preference: `EnumSet` is a bit vector — a single `long` for up to 64 constants — and
`EnumMap` is an array indexed by ordinal. No hashing, no boxing, almost no allocation.

For enum keys they are simply the right structure, and using `HashMap` there is a small
free loss.

### Size large maps up front

`HashMap` resizes by rehashing everything into a new table, at 75% load. Building a map
of a million entries from the default capacity of 16 rehashes it about sixteen times.
`new HashMap<>(expected / 0.75f + 1)` costs one argument.

### Ordering, and saying which one you mean

- `HashMap` — no order, and *not* insertion order even though it sometimes looks like it
  for small integer keys. Code that depends on it breaks on a rename.
- `LinkedHashMap` — insertion order, and it is what
  [`OutboxPayload`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxPayload.java)
  uses, because the JSON field order is part of what a human reads in a log.
- `TreeMap` — sorted, O(log n), and needs a `Comparator` or `Comparable` keys.

### Immutable views, and what they do not protect

`List.of(...)` is immutable. `Collections.unmodifiableList(existing)` is a *view* — the
underlying list can still change, and the view will show it.

[`Order.lines()`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java)
returns the unmodifiable view deliberately, and its comment states the condition that
makes that safe: `OrderLine` is itself immutable. Chapter 03's rule that immutability is
shallow is doing real work there — an unmodifiable list of mutable objects protects the
collection and not its contents.

---

## 2. In this codebase

| Choice | Where | Why |
|---|---|---|
| `EnumMap` + `EnumSet` | [`OrderStatus`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java) | Enum keys: bit vector and ordinal array, no hashing |
| `ConcurrentHashMap` | [`InMemoryOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/InMemoryOrderRepository.java) | Shared by every request thread |
| `ArrayList` | [`Order`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | A short list, iterated |
| `LinkedHashMap` | [`OutboxPayload`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxPayload.java) | JSON field order is read by humans |
| `Collections.unmodifiableList` | [`Order.lines`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | A view that cannot be used to bypass the rules |
| `List.copyOf` | [`Order.pullEvents`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | A genuine copy, because the source is then cleared |

That last pair is worth comparing. `lines()` returns a view because the caller should see
the current lines; `pullEvents()` returns a copy because the list it copied from is
emptied on the next line. Handing out a view there would give the caller an empty list.

There is also a **linear scan on purpose**:
[`Order.indexOf(Sku)`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java)
walks the lines. An order has a handful of them, and a `HashMap` beside the list would be
a second structure to keep in step for no measurable gain. Knowing when *not* to reach
for the faster structure is the other half of this module.

---

## 3. Do it

**Lab A — the O(n²) you will actually write.**

```bash
jshell -q --execution local <<'EOF'
var list = new java.util.ArrayList<Integer>();
for (int i = 0; i < 50_000; i++) list.add(i);
var set = new java.util.HashSet<>(list);
long t = System.nanoTime();
int hits = 0; for (int i = 0; i < 50_000; i++) if (list.contains(i)) hits++;
System.out.println("List.contains: " + (System.nanoTime()-t)/1_000_000 + " ms");
t = System.nanoTime();
hits = 0; for (int i = 0; i < 50_000; i++) if (set.contains(i)) hits++;
System.out.println("Set.contains:  " + (System.nanoTime()-t)/1_000_000 + " ms");
EOF
```

```
List.contains: 1875 ms
Set.contains:   119 ms
```

Sixteen times, from one word — and the gap widens with n, because one side is quadratic
and the other is linear. Then note the reason this reaches production: with fifty
*elements* instead of fifty thousand, both are under a millisecond and nothing looks
wrong.

**Lab B — `ArrayDeque` versus `LinkedList`.**

Push and pop a million elements through each. `ArrayDeque` wins comfortably, despite
identical big-O, because it is one array and `LinkedList` is a million small objects
scattered across the heap. Big-O does not model cache misses.

**Lab C — break `ConcurrentHashMap` anyway.**

Write a counter using `if (!map.containsKey(k)) map.put(k, 0); map.put(k, map.get(k)+1);`
and hammer it from twenty threads. The total is wrong. Now use `merge(k, 1, Integer::sum)`
and it is right. Thread-safe *operations* do not make thread-safe *sequences*.

**Lab D — the unmodifiable view.**

```bash
jshell -q --execution local <<'EOF'
var backing = new java.util.ArrayList<>(java.util.List.of("a"));
var view = java.util.Collections.unmodifiableList(backing);
backing.add("b");
System.out.println(view);   // [a, b]
EOF
```

The view changed. Then look at `Order.lines()` and work out why that is safe there and
would not be if the field were handed out directly.

**Lab E — replace the `EnumMap`.**

Swap `OrderStatus`'s `EnumMap` for a `HashMap` and its `EnumSet`s for `HashSet`s. Every
test still passes — that is the point. Then say what you gave up, and why "it works
either way" is not the same as "the choice does not matter".

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:04 -->
**Chapter 04 — Collections, and choosing the right one**

1. **`ArrayList` unless proven otherwise.** Cache locality beats the complexity table more often than people expect.
2. **`ArrayDeque`, not `LinkedList`,** when you need both ends.
3. **`contains` in a loop over a List is O(n²).** Use a Set.
4. **`ConcurrentHashMap` for shared maps** not `Hashtable`, not a synchronized wrapper.
5. **Size large maps up front.** Resizing rehashes everything.
<!-- /CARD -->

---

## 5. Interview questions

**"Quale `List` usa?"** — `ArrayList`, unless something specific says otherwise. It is an
array: cheap indexing, cache-friendly iteration, amortised O(1) append. And for a queue,
`ArrayDeque` rather than `LinkedList` — same big-O, far better locality.

**"`HashMap` o `ConcurrentHashMap`?"** — `ConcurrentHashMap` for anything shared between
threads, never `synchronizedMap`, which serialises every access behind one lock. And I
would add the trap: individual operations are atomic, sequences are not, so
`containsKey` then `put` is still a race — that is what `computeIfAbsent` and `merge`
are for.

**"Come funziona `HashMap` internamente?"** — Buckets by hash, a list per bucket that
becomes a red-black tree past a threshold, resize at 75% load by rehashing everything.
The practical consequences: size it up front if you know the size, and the key's
`hashCode` must not change while it is in there.

**"Un errore di performance comune?"** — `contains` on a `List` inside a loop. It is a
linear scan, so it is quietly O(n²), it looks completely normal, and with test-sized data
it is invisible. A `HashSet` fixes it in one line.

**"Perché `EnumMap`?"** — It is an array indexed by ordinal, and `EnumSet` is a bit
vector. No hashing, no boxing, essentially no allocation. For enum keys they are simply
the right structure.

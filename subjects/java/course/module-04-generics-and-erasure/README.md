# Module 04 — Generics and erasure

> Site chapter: [05 — Generics and erasure](../../site/chapters/05-generics.html)
>
> Code: [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java)

---

## 1. The idea

Java generics are a **compile-time** feature. The compiler checks your types, then
erases them. `Result<Order>` and `Result<String>` are the same class at runtime, and
the bytecode has no idea which is which.

That single fact explains every generics restriction you will be asked about.

### What erasure takes away

- **`new T[]` does not compile.** The array would need to know its component type at
  runtime, and it cannot.
- **`instanceof List<String>` does not compile.** There is nothing to check.
- **You cannot overload on `List<String>` and `List<Integer>`.** Same erasure, same
  signature.
- **A generic type cannot be caught.** `catch (MyException<T> e)` is out for the same
  reason.

### What erasure gives back

Compatibility. Generics arrived in Java 5 into a world of existing `List` code, and
erasure is why that code kept working and kept linking. It is a deliberate trade —
runtime type information for a migration path — and knowing it was a trade rather
than an oversight is the difference between complaining about generics and explaining
them.

### Invariance, and the wildcard that fixes it

`List<String>` is **not** a `List<Object>`, even though `String` is an `Object`.

```java
List<Object> objects = strings;   // if this compiled…
objects.add(42);                  // …this would poison the List<String>
```

Arrays made the opposite choice — `String[]` *is* an `Object[]` — and pay for it with
`ArrayStoreException` at runtime. Generics moved the error to compile time, which is
the whole point.

Wildcards restore the flexibility you actually wanted:

> **PECS — Producer `extends`, Consumer `super`.**
>
> If the parameter *produces* values you read, use `? extends T`.
> If it *consumes* values you write, use `? super T`.

`Collections.copy(List<? super T> dest, List<? extends T> src)` is the mnemonic in the
standard library: source produces, destination consumes.

### `@SuppressWarnings("unchecked")` is a request to think

An unchecked warning means the compiler has stopped being able to help. Sometimes that
is correct and unavoidable — you know something it cannot express. Suppressing it is
then fine **on the narrowest possible scope, with a comment saying why it is safe**.
Suppressing it on a class because there were too many warnings is how a
`ClassCastException` appears three layers away from its cause.

---

## 2. In this codebase

`Result<T>` is a small generic type that exercises most of this.

| Thing | Where |
|---|---|
| A generic sealed interface with two generic records | [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java) |
| `map(Function<T, R>)` — a type parameter on the method, not the type | `Result.map` |
| Pattern matching that binds the type variable: `case Ok<T> ok ->` | `Result.map`, `flatMap`, `toOptional` |
| A generic factory whose type argument is inferred from the target | `Result.err(...)` |

Two details worth stopping on.

**`Err<T>` never stores a `T`.** It holds a `Failure` and nothing else. The type
parameter exists purely so that `Result<Order>` and `Result<String>` do not mix at
compile time — and after erasure, an `Err<Order>` and an `Err<String>` are
indistinguishable objects. That is erasure in one class you can read in thirty
seconds.

**`map` rebuilds the failure instead of casting.**

```java
case Err<T> e -> Result.err(e.failure());
```

Because of erasure, `(Result<R>) this` would work identically at runtime and allocate
nothing. It is also an unchecked cast. Lab B is about deciding which you prefer, and
being able to defend it.

---

## 3. Do it

**Lab A — prove erasure in three lines.**

```bash
jshell -q --execution local <<'EOF'
var a = new java.util.ArrayList<String>();
var b = new java.util.ArrayList<Integer>();
System.out.println(a.getClass() == b.getClass());   // true
System.out.println(a.getClass().getName());         // java.util.ArrayList
EOF
```

Same class. Now try to write `if (a instanceof java.util.List<String>)` and read the
compiler's message — it names the reason rather than just refusing.

**Lab B — replace the rebuild with a cast.**

In `Result.map` and `flatMap`, change the `Err` branch to:

```java
case Err<T> e -> (Result<R>) this;
```

Compile with `mvn -pl ordini-domain test`. It builds, the tests pass, and the compiler
warns — `-Xlint:all` is on in the parent pom, so you will see it. Now argue both sides.
The cast is safe *here* because `Err` provably contains no `T`; the rebuild costs one
allocation and needs no warning to be suppressed. Pick one, and note that the reason
the cast is safe is a fact about this class that a future editor could break without
the compiler noticing.

**Lab C — make `map` accept the functions it should.**

`map` takes `Function<T, R>`. That is narrower than it needs to be:

```java
Function<Object, String> describe = Object::toString;
Result<Order> r = Result.ok(order);
r.map(describe);          // does not compile
```

Widen it to `Function<? super T, ? extends R>` and try again. This is PECS with a
consequence you can see: the function *consumes* a `T`, so `? super T`; it *produces*
an `R`, so `? extends R`. Keep the change if you like it — then explain why the JDK's
own `Optional.map` uses exactly that signature.

**Lab D — the array you cannot make.**

Try to add this to `Result`:

```java
static <T> Result<T>[] pair(Result<T> a, Result<T> b) {
    return new Result<T>[] { a, b };   // does not compile
}
```

Read the error. Then find the workaround the JDK uses everywhere — an `Object[]` plus
an unchecked cast, exactly what `ArrayList` does internally — and decide whether you
would accept it in review. `List<Result<T>>` is almost always the better answer, and
saying so is a better interview response than reciting the workaround.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:05 -->
**Chapter 05 — Generics and erasure**

1. **Generics are erased.** Compile-time safety, no runtime type argument.
2. **No `new T[]`, no `instanceof List<String>`,** no overloading that differs only by type argument.
3. **PECS.** Producer `extends`, consumer `super`.
4. **Generics are invariant** and that is what stops a cat entering your list of dogs.
5. **`@SuppressWarnings("unchecked")` is a request to think,** not a way to silence the compiler.
<!-- /CARD -->

---

## 5. Interview questions

**"Che cos'è la type erasure?"** — Generics are checked at compile time and removed
from the bytecode, so `List<String>` and `List<Integer>` are the same class at
runtime. Then give the consequences unprompted — no `new T[]`, no
`instanceof List<String>`, no overloading on the type argument — because the
consequences are what they are really checking.

**"Perché `List<String>` non è un `List<Object>`?"** — Because it would let you add an
`Integer` to a list of strings, and the error would surface far from the mistake.
Arrays made the covariant choice and pay with `ArrayStoreException` at runtime;
generics moved it to compile time. Naming the array contrast is what makes this answer
sound like understanding rather than recall.

**"Cos'è PECS?"** — Producer `extends`, Consumer `super`. A parameter you read from is
`? extends T`; one you write to is `? super T`. `Collections.copy(List<? super T>,
List<? extends T>)` is the example to give, because it has both in one signature.

**"Quando usa `@SuppressWarnings("unchecked")`?"** — When I know something the compiler
cannot express, on the narrowest scope possible, with a comment saying why it is safe.
The dangerous version is at class level, because it also silences the next unchecked
cast somebody adds — the one that was not safe.

**"Può avere un campo `static` di tipo `T`?"** — No. A static member belongs to the
class, and after erasure the class has no type argument to belong to. It is a good
follow-up question because the reason is erasure again, from a different direction.

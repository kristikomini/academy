# Module 06 — Records, sealed types and pattern matching

> Site chapter: [07 — Records, sealed types and pattern matching](../../site/chapters/07-records-sealed-pattern.html)
>
> Code: [`DomainEvent.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/DomainEvent.java),
> [`Result.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java)

*This module is the language treatment. [Module 10](../module-10-the-domain-model/) and
[module 11](../module-11-the-state-machine/) apply it — they share chapter 07's card
deliberately, because it is the same rule seen from a different height.*

---

## 1. The idea

Three features that arrived separately and are really one idea: **let the compiler
know the shape of your data, and it will do the bookkeeping.**

### Records — a transparent carrier

```java
public record OrderLine(Sku sku, int quantity, Money unitPrice) { }
```

You get a canonical constructor, accessors, `equals`, `hashCode` and `toString`,
derived from the header. The class is final, the fields are final, and — the part that
matters — `equals` is correct by construction, which is where hand-written data classes
usually go wrong.

**The compact constructor is where validation goes.**

```java
public OrderLine {
    if (quantity <= 0) throw new IllegalArgumentException(...);
}
```

There is no other way to build one, so there is no path that skips the check. That
property is worth more than the brevity: a hand-written class with a validating
constructor and a second, convenience constructor that forgets the validation is a
thing that happens.

**What a record does not give you: deep immutability.** A record holding a `List`
hands out the same mutable list to everyone. Chapter 03's rule that immutability is
shallow lands here — if a component is mutable, copy it in the compact constructor and
copy it again in the accessor, or the record is immutable in name only.

### Sealed types — a closed set of shapes

```java
public sealed interface DomainEvent {
    record OrderSubmitted(...) implements DomainEvent {}
    record OrderShipped(...)   implements DomainEvent {}
    ...
}
```

`sealed` says: these are all the cases, and no one outside can add another.

That is not access control. It is information for the compiler, and the payoff is
**exhaustiveness**:

```java
return switch (this) {
    case Ok<T> ok  -> ...;
    case Err<T> e  -> ...;
};                          // no default, and none needed
```

No `default` branch. The compiler proves the switch is total. Add a third permitted
subtype and every switch like this **stops compiling** until you handle it.

That is the reason to reach for sealed types, and it is worth being precise about why
it beats the alternative. With an open interface you write a `default` branch that
throws, and you find the missing case at runtime, in production, on the one event type
nobody tested. With a sealed one you find it at compile time, in every place at once.

### Enum or sealed interface?

- **Enum** — a closed set of *constants*. `OrderStatus` has six values and no data
  beyond identity.
- **Sealed interface** — a closed set of *shapes*. `DomainEvent` has five cases, each
  carrying different fields: `OrderShipped` has a tracking code, `OrderCancelled` has a
  reason.

Both are closed; the difference is whether the cases carry different data. Reach for
the enum first, and move to a sealed interface the moment a case needs a field the
others do not.

### Pattern matching — the switch that binds

`case Ok<T> ok ->` tests the type and binds the variable in one step, so the cast you
would have written cannot be wrong. `instanceof` does it too:

```java
return other instanceof Order that && id.equals(that.id);
```

That is `Order.equals` in this codebase: no cast, no separate declaration, and `that`
is in scope exactly where it is provably an `Order`.

---

## 2. In this codebase

| Feature | Where |
|---|---|
| Record with validation in the compact constructor | [`OrderLine`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderLine.java), [`Sku`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Sku.java), [`Money`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Money.java) |
| Record whose compact constructor *normalises* as well as validates | [`Money`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Money.java) — the `setScale` line |
| Record used purely for type safety | [`OrderId`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderId.java), [`CustomerId`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/CustomerId.java) |
| Sealed interface, closed set of shapes | [`DomainEvent`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/DomainEvent.java) |
| Sealed *generic* interface with two record cases | [`Result`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Result.java) |
| Exhaustive switch with no `default` | `Result.map`, `flatMap`, `toOptional`, `error`, `orElseThrow` |
| `instanceof` pattern | [`Order.equals`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) |
| Enum as a closed set of constants | [`OrderStatus`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderStatus.java) |

`DomainEvent` and `OrderStatus` sit in the same package and demonstrate the two halves
of the enum-versus-sealed question. Read them together.

---

## 3. Do it

**Lab A — add a case and watch the compiler find every switch.**

Add a sixth event to `DomainEvent`:

```java
record OrderReturned(OrderId orderId, String reason, Instant occurredAt)
    implements DomainEvent {}
```

Nothing breaks yet — there is no exhaustive switch over `DomainEvent` in the domain
today. So write one first, in a scratch test:

```java
String describe(DomainEvent e) {
    return switch (e) {
        case DomainEvent.OrderSubmitted s -> "submitted";
        case DomainEvent.OrderConfirmed c -> "confirmed";
        case DomainEvent.OrderShipped s   -> "shipped";
        case DomainEvent.OrderDelivered d -> "delivered";
        case DomainEvent.OrderCancelled c -> "cancelled";
    };
}
```

It compiles. Now add `OrderReturned` and watch it stop compiling with a message that
names the missing case. That failure — at compile time, in every switch at once — is
the entire argument for sealed types.

**Lab B — remove `sealed` and lose the guarantee.**

Drop `sealed` from `DomainEvent` (and `permits`/nesting as needed). The same switch now
demands a `default` branch. Add one that throws, and notice what you have built: a
runtime failure for a condition the compiler was previously able to prove impossible.
Revert.

**Lab C — the shallow-immutability trap.**

Write a record with a `List` component, hand the list to it, then mutate the original
list and read it back through the accessor:

```bash
jshell -q --execution local <<'EOF'
record Basket(java.util.List<String> items) {}
var raw = new java.util.ArrayList<String>(java.util.List.of("a"));
var b = new Basket(raw);
raw.add("b");
System.out.println(b.items());   // [a, b] — the record changed
EOF
```

Then fix it with `List.copyOf` in the compact constructor and run it again. Now go and
check `Order.lines()` — it does the same job with `Collections.unmodifiableList`, and
the comment there says why that is only safe because `OrderLine` is itself immutable.

**Lab D — enum or sealed interface?**

`OrderStatus` is an enum. Try to give `SHIPPED` a `carrierTracking` field and see how
quickly it goes wrong: every other constant gets a field it does not use, and the
constructor grows a null. That is the signal to move to a sealed interface — and also
the reason `Order` keeps the tracking code as its own field instead. Decide which you
would do in a real codebase, and be able to say what the enum version costs.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:07 -->
**Chapter 07 — Records, sealed types and pattern matching**

1. **A record is a transparent data carrier** with correct `equals` by construction.
2. **Validate in the compact constructor,** and copy mutable components while you are there.
3. **Sealed + switch gives exhaustiveness checking.** That is the reason to use it.
4. **Enum = closed set of constants; sealed interface = closed set of shapes.**
5. **On a Java 17 job, write Java 17.** The DTO is where it shows first.
<!-- /CARD -->

---

## 5. Interview questions

**"Cosa cambia un `record` rispetto a una classe?"** — The constructor, accessors,
`equals`, `hashCode` and `toString` are generated from the header; the class is final
and its fields are final. The compact constructor is where validation and normalisation
go, and because there is no other way to construct one, there is no path that skips
them. Then say what it does not give you: deep immutability.

**"Quando usa un `sealed interface`?"** — When there is a closed set of shapes and I
want the compiler to tell me about every place that handles them whenever a new one
appears. The payoff is exhaustiveness checking in `switch`; without it you write a
`default` that throws and find the missing case in production.

**"Enum o sealed interface?"** — Enum for a closed set of constants, sealed interface
for a closed set of shapes carrying different data. The moment one case needs a field
the others do not, the enum starts growing unused fields and nulls, and that is the
signal.

**"Che vantaggio ha il pattern matching?"** — The type test and the binding are one
step, so the cast cannot disagree with the test, and the variable is only in scope
where it is provably that type. In a `switch` over a sealed type it also buys
exhaustiveness, which is the bigger win.

**"Un `record` è davvero immutabile?"** — Shallowly. The reference fields are final;
what they point at may not be. A record holding a `List` is mutable through that list
unless the compact constructor copies it, and the accessor hands out an unmodifiable
view. Give the concrete failure: you construct it, the caller keeps their list, and
your "immutable" object changes behind you.

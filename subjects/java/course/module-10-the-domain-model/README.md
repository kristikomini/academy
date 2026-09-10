# Module 10 — The domain model: value objects, typed ids and money

> Site chapters: [03 — Types, objects and equality](../../site/chapters/03-types-and-objects.html),
> [07 — Records, sealed types and pattern matching](../../site/chapters/07-records-sealed-pattern.html)
>
> Code: [`src/ordini-domain`](../../src/ordini-domain)

---

## 1. The idea

Most Java codebases model a domain with `String`, `long`, `BigDecimal` and `UUID`.
Everything is one of four types, so nothing the compiler knows about is wrong, and
every rule about what those values *mean* lives somewhere else — in a service, in a
validator, in a comment, in someone's head.

A domain model is the opposite bet: give each concept its own type, put the rule
inside it, and let the compiler carry what it can.

Three concepts, three different answers:

**A value object** has no identity. Ten euro is ten euro; there is no "which ten
euro". Two instances with equal contents are interchangeable, so equality is by
value, and mutation makes no sense — you do not change ten euro into eleven, you get
a different amount. `Money`, `Sku`, `OrderLine`.

**An identifier** is a value object whose entire job is to be distinguishable. The
interesting property is not what it contains but what it is *not*: an `OrderId` is
not a `CustomerId`, even though both wrap a `UUID`.

**An entity** has identity and history. An order is the same order after it ships.
Equality is by id, never by contents, and it is allowed to change — in controlled
ways, which is module 11.

The payoff is not elegance. It is that a large class of bug stops compiling:

```java
// With UUID everywhere, this compiles and returns nothing at 3am:
repository.findOrder(customer.getId());

// With typed ids, it does not compile at all.
```

The cost is real and worth stating out loud in an interview: every boundary — JSON,
SQL, a URL path — needs a conversion, four lines each. On anything past a weekend
project that trade has been worth it every time. On a two-week script it has not.

### Why `Money` is the file to read first

`BigDecimal.equals` compares **scale as well as value**. `new BigDecimal("10.0")` is
not equal to `new BigDecimal("10.00")`, while `compareTo` says they are the same
number. A record's generated `equals` delegates to its components' — so a naive
`record Money(BigDecimal amount, Currency currency)` gives you two objects for the
same ten euro that are unequal, hash differently, and silently fail to find each
other in a `HashMap`.

That is the `equals`/`hashCode` rule from chapter 03 with money attached, and it is
why `Money` normalises scale in its compact constructor. One line, and the whole
class of defect goes away — including the consistency requirement that `compareTo`
returning `0` should mean `equals` returns `true`, which raw `BigDecimal` famously
breaks.

---

## 2. In this codebase

| File | What to look at |
|---|---|
| [`Money.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Money.java) | The compact constructor normalising scale, and *why* that is an equality decision rather than a formatting one. Also: no `double` overload anywhere, deliberately. |
| [`OrderId.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderId.java) | A record wrapping a `UUID`, plus an honest comment about what random v4 ids cost an index. |
| [`CustomerId.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/CustomerId.java) | Structurally identical to `OrderId` — that is the entire point. |
| [`Sku.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Sku.java) | Validation at the edge, once. Note the normalisation happens *before* the format check, not after. |
| [`OrderLine.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/OrderLine.java) | The unit price is copied onto the line, not looked up. That is not duplication, it is a snapshot — and every invoice line in every real system works this way. |
| [`Order.java`](../../src/ordini-domain/src/main/java/it/fonderia/ordini/domain/Order.java) | The contrast: `equals` by id only, and a comment saying why that is the opposite rule to `Money`. |
| [`MoneyTest.java`](../../src/ordini-domain/src/test/java/it/fonderia/ordini/domain/MoneyTest.java) | `worksAsAHashKey` is the test that fails first if the normalisation is removed. |

Read `Money` and `Order` back to back. They are the two halves of chapter 03's claim
that a value and an entity are not the same kind of object.

Note what is **not** on this module's classpath: Spring, Jakarta Persistence,
Jackson. `ordini-domain/pom.xml` declares JUnit and nothing else, so "the domain must
not depend on the framework" is enforced by the build rather than by a code review.
It is the cheapest architecture test there is.

---

## 3. Do it

**Lab A — break the normalisation and watch a `HashMap` lie.**

In `Money`, delete the `setScale` line from the compact constructor and run
`mvn -pl ordini-domain test`. **Five** tests go red, and the spread is the lesson:
four in `MoneyTest` and one in `OrderTest.startsEmpty`, which was not testing money
at all. One line in one value object, and a test three classes away changes its
answer.

Before you look, predict which one matters most. `scaleIsNormalisedSoEqualsBehaves`
is the obvious failure. The one to look at is `worksAsAHashKey`:

```
expected: <ten euro> but was: <null>
```

No exception. No stack trace. A `null` where a total should be — which is exactly
the shape this bug takes in production, and why it survives code review. Put the
line back and re-run.

**Lab B — make the typed ids earn their keep.**

Add this to `OrderTest` and try to compile it:

```java
Order order = Order.draft(CustomerId.newId(), clock);
OrderId wrong = new OrderId(order.customerId().value());   // compiles: explicit
Order other = Order.draft(order.id(), clock);              // does NOT compile
```

The second line is the bug typed ids prevent. The first still compiles because you
asked for it explicitly — which is the right level of protection: it stops accidents,
not deliberate acts.

**Lab C — the `Locale` trap.**

`Sku` upper-cases with `Locale.ROOT`. Find out what that is protecting you from:

```bash
java -Duser.language=tr -Duser.country=TR - <<'EOF'
String sku = "in-2002";
System.out.println(sku.toUpperCase());                      // İN-2002
System.out.println(sku.toUpperCase(java.util.Locale.ROOT));  // IN-2002
EOF
```

In Turkish the upper case of `i` is `İ`, not `I`. So a `Sku` that upper-cased with
the no-argument overload would accept `in-2002` on your laptop and reject it on a
server whose locale is `tr_TR` — the same input, the same code, a different answer.

Note the detail that makes this hard to catch: `bl-1001`, the SKU used throughout
`OrderTest`, contains no `i` and behaves identically under both locales. A test suite
built from that fixture passes everywhere. Change the fixture to `in-2002`, switch
`Sku` to the no-argument `toUpperCase()`, and watch it fail only under
`-Duser.language=tr`.

Locale-sensitive case conversion on machine-readable identifiers is a real production
incident, and this is why `Locale.ROOT` is not decoration.

**Lab D — add `Quantity`.**

`OrderLine` still takes a raw `int`. Make it a `Quantity` value object that cannot be
zero or negative, and notice what happens to `OrderLine`'s compact constructor: one
of its two checks moves into the new type and stops being repeated at every call
site. Then decide honestly whether it was worth it — this is the trade the module is
about, and "no" is a defensible answer for a quantity in a way it is not for money.

---

## 4. Golden rules

Generated from the chapters this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:03,07 -->
**Chapter 03 — Types, objects and equality**

1. **Never `==` on wrappers.** The −128…127 cache makes it look correct in tests.
2. **Override `equals` and `hashCode` together,** or hash-based collections silently lose elements.
3. **Keys must be immutable** in the fields that feed `hashCode`.
4. **Unboxing a null wrapper throws NPE** on a line with no visible dereference.
5. **Immutability is shallow.** Copy mutable components in and out.

**Chapter 07 — Records, sealed types and pattern matching**

1. **A record is a transparent data carrier** with correct `equals` by construction.
2. **Validate in the compact constructor,** and copy mutable components while you are there.
3. **Sealed + switch gives exhaustiveness checking.** That is the reason to use it.
4. **Enum = closed set of constants; sealed interface = closed set of shapes.**
5. **On a Java 17 job, write Java 17.** The DTO is where it shows first.
<!-- /CARD -->

---

## 5. Interview questions

**"Perché non usa `double` per gli importi?"** — Because `0.1 + 0.2` is not `0.3` in
binary floating point, in any language. Over a few thousand order lines that becomes
a reconciliation meeting. `BigDecimal` is exact decimal arithmetic, and it is slow in
a way that has never mattered next to a database round trip. Say the second half too:
knowing *when* the cost does not matter is the part that sounds like experience.

**"Qual è la differenza fra `equals` e `==`?"** — `==` compares references for
objects and values for primitives; `equals` is whatever the class defines. The trap
they are usually probing for is wrappers: `Integer` caches −128 to 127, so `==` on
two `Integer`s appears to work in tests and fails in production with real ids. Never
`==` on wrappers.

**"Se sovrascrivo `equals`, devo sovrascrivere anche `hashCode`?"** — Yes, always,
and the reason is the contract: equal objects must have equal hash codes, or
hash-based collections put them in different buckets and silently lose them. Offer
the `Money` story — scale normalisation — as the version of this that bites even when
you did write both, because you delegated to a component whose `equals` was stricter
than you expected.

**"Cosa cambia un `record` rispetto a una classe?"** — A record is a transparent
carrier for its components: the constructor, accessors, `equals`, `hashCode` and
`toString` are generated from the header, and the compact constructor is where
validation goes. It is final, its fields are final, and that shallow immutability is
the point. What it does *not* give you: deep immutability. A record holding a
`List` still hands out a mutable list unless you copy it.

**"Perché un tipo per l'id invece di `UUID`?"** — Because `UUID` is a shape, not a
type: every id in the system has it, so the compiler cannot tell an order's from a
customer's. The bug that prevents does not throw — it returns an empty result. Then
be fair about the cost: a conversion at every boundary, and on a small codebase that
may not pay for itself.

**"Come modella il denaro in un sistema multivaluta?"** — Amount plus currency in one
value object, arithmetic that refuses to mix currencies, and conversion as an
explicit business operation carrying a rate and a timestamp. The reason to make
mixing impossible rather than merely discouraged is that the alternative is a total
that is silently wrong, and nothing downstream can detect it.

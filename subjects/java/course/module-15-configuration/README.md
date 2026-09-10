# Module 15 — Configuration, profiles and typed binding

> Site chapter: [13 — Configuration, profiles and properties](../../site/chapters/13-configuration-profiles.html)
>
> Code: [`OrdiniProperties.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/OrdiniProperties.java),
> [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml),
> [`OrdiniPropertiesTest.java`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniPropertiesTest.java)

---

## 1. The idea

**One artefact, many environments.** The jar that passed testing is the jar that goes
to production — not a rebuild with different constants compiled in. Everything that
differs between environments arrives from outside: environment variables, a mounted
file, a secret store.

That is not a preference. It is what makes "it worked in staging" a meaningful
sentence, and it is why module 27's pipeline builds once and promotes the artefact.

### Later sources win

Spring assembles an `Environment` from many property sources in a defined order, and
later ones override earlier ones. Roughly, from weakest to strongest:

```
application.yaml  <  application-<profile>.yaml  <  OS environment  <  --command-line
```

So `ORDINI_ENVIRONMENTNAME=produzione` beats the `local` in the yaml with no rebuild,
and `--server.port=18080` beats both. The defaults in the file are a developer's
convenience, not a deployment decision.

### `@ConfigurationProperties` over `@Value`, bound to a record

Three reasons, in order of how much they matter:

1. **It fails at start-up.** A record that cannot be constructed — a missing value, a
   number outside its range — stops the application. A missing `@Value` is discovered
   by the first request that happens to read it, which may be weeks later.
2. **The configuration has a shape.** One type lists everything the application can be
   told. "What is configurable?" has an answer you can read, instead of being the set
   of all `@Value` strings in the codebase.
3. **It is immutable.** No setters, so nothing rebinds it at run time.

`@Validated` is what turns the constraints into start-up failures. Without it,
`@Min` and `@NotBlank` on a properties class are documentation.

### Relaxed binding, and the part that is not relaxed

`ordini.environment-name`, `ordini.environmentName` and `ordini.ENVIRONMENT_NAME` all
bind to the same record component. That is relaxed binding, and it is what lets a yaml
file and a container's environment agree without anyone maintaining a mapping.

**But `ORDINI_ENVIRONMENTNAME` is decoded specifically by
`SystemEnvironmentPropertySource`**, not by every property source. The mangling is
known to be the operating system's, so Spring reverses it there and nowhere else. Put
that same string into an ordinary property source and it binds to nothing at all.

This is not trivia — it cost
[`OrdiniPropertiesTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniPropertiesTest.java)
a rewrite. The first version used `withPropertyValues("ORDINI_ENVIRONMENTNAME=…")`,
which bound nothing, and the context failed on the missing `@NotBlank` — a confusing
way to learn the rule. The test now installs a real `SystemEnvironmentPropertySource`
and says why in a comment.

### Profiles, and what they are not for

`@Profile("test")` and `application-collaudo.yaml` switch beans and values by
environment. They are good for *structural* differences: an in-memory adapter in tests,
a real one in production.

They are not a substitute for configuration values. A profile per customer, or per
region, ends with fifteen files nobody can diff. Values belong in values.

### No secrets in the repository

Ever. Not in `application.yaml`, not in a profile file, not "temporarily". A secret in
git is a secret in every clone, every fork and every CI cache, and rotating it is the
only remedy. There are none in this application because there is nothing to keep
secret yet; when there is, it arrives as an environment variable or from a secret
store.

---

## 2. In this codebase

| Thing | Where |
|---|---|
| Properties bound to a record, validated | [`OrdiniProperties`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/config/OrdiniProperties.java) |
| `@ConfigurationPropertiesScan` so it is found | [`OrdiniApplication`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/OrdiniApplication.java) |
| Defaults, and a comment about what must never go here | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) |
| Binding, relaxed binding and both failure modes | [`OrdiniPropertiesTest`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniPropertiesTest.java) |
| The defaults asserted through a real context | [`OrdiniApplicationTests.defaultsComeFromTheYaml`](../../src/ordini-app/src/test/java/it/fonderia/ordini/app/OrdiniApplicationTests.java) |

`OrdiniPropertiesTest` is also the module's tooling lesson.
`ApplicationContextRunner` builds a tiny context per test with exactly the properties
you give it, in milliseconds. Most people reach for `@SpringBootTest` to test
configuration and pay a second per case; this is the right tool, and it is
under-known.

---

## 3. Do it

**Lab A — override without rebuilding.**

```bash
cd src && mvn -q install -DskipTests
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18080 --ordini.environment-name=collaudo
```

Then again with an environment variable instead:

```bash
ORDINI_ENVIRONMENTNAME=produzione java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --server.port=18080
```

Same jar, three different configurations, no rebuild. That is the whole of "one
artefact, many environments" in two commands.

**Lab B — break it and watch it refuse to start.**

```bash
java -jar ordini-app/target/ordini-app-0.1.0-SNAPSHOT.jar --ordini.max-page-size=100000
```

The application does not start, and the message names the constraint. Now delete
`@Validated` from `OrdiniProperties` and try again: it starts happily with a page size
of a hundred thousand. That one annotation is the difference between a start-up failure
and a production incident.

**Lab C — the same value as `@Value`.**

Add `@Value("${ordini.max-page-size}") int maxPageSize` to a scratch bean, then remove
the property from the yaml. It still starts if nothing reads it early — and fails
later, at the moment the field is used. Compare with lab B. This is the argument in one
side-by-side.

**Lab D — prove the source ordering.**

Put `ordini.environment-name` in `application.yaml`, in an
`application-collaudo.yaml`, in an environment variable and on the command line, all
with different values. Run with `--spring.profiles.active=collaudo` and see which wins.
Then remove them one at a time. Predict each result before running it.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:13 -->
**Chapter 13 — Configuration, profiles and properties**

1. **One artefact, many environments.** The environment supplies the differences.
2. **Later sources win:** command line > env vars > external files > packaged files.
3. **`@ConfigurationProperties` over `@Value`** it fails at start-up instead of at first use.
4. **Bind to a record** and add `@Validated`.
5. **No secrets in the repository.** Git history outlives the deletion.
<!-- /CARD -->

---

## 5. Interview questions

**"Come gestisce la configurazione fra ambienti?"** — One artefact, promoted. Everything
environment-specific comes from outside — environment variables, a mounted file, a
secret store — because rebuilding per environment means the thing you tested is not the
thing you shipped.

**"`@Value` o `@ConfigurationProperties`?"** — `@ConfigurationProperties`, bound to a
record, with `@Validated`. Bad configuration then stops the application from starting
instead of failing on the first request that needs it, and the class doubles as the
list of everything the application can be told.

**"Cosa sono i profili e quando li usa?"** — For structural differences: which beans
exist, which adapter is wired. Not for values — a profile per customer ends with
fifteen files nobody can diff, and values belong in values.

**"Se la stessa proprietà è definita in due posti?"** — Later sources win. Roughly:
yaml, then profile-specific yaml, then the OS environment, then the command line. It is
worth being able to name that order, because it is how an override is debugged.

**"Dove mette i segreti?"** — Never in the repository. Environment variables or a secret
store, injected at run time. A secret committed to git is a secret in every clone and
every CI cache, and the only remedy is rotation.

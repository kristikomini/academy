# Module 20 — Security: the filter chain, JWT and OAuth2

> Site chapter: [20 — Spring Security, JWT and OAuth2](../../site/chapters/20-security-auth.html)
>
> Code: [`ApiExceptionAdvice.java`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) — and see the honesty note below.

---

## 1. The idea

### It is a filter chain, before the dispatcher

The single most useful fact about Spring Security, and it explains most of the confusion.

```
Tomcat → SecurityFilterChain → DispatcherServlet → your controller
```

Authentication and authorisation happen **before any of your code runs**. Consequences:

- A 401 never reaches a controller, so it is invisible to `@WebMvcTest` unless you import
  the security configuration.
- An exception thrown in a filter does **not** reach your `@RestControllerAdvice`, which
  runs inside the dispatcher. Authentication failures need their own
  `AuthenticationEntryPoint` to produce the same error shape as everything else — and
  forgetting that is why so many APIs return a tidy RFC 7807 body for business errors and
  an HTML error page for a bad token.
- **A CORS error is often a 401 on the preflight.** The browser's `OPTIONS` request hit
  the filter chain, had no credentials, was rejected, and the browser reported the
  symptom rather than the cause.

### 401 is "who are you", 403 is "not allowed"

401 Unauthorized is misnamed: it means *unauthenticated*. Send credentials and try again.
403 Forbidden means we know who you are and you still may not.

Getting this backwards makes clients retry logins that will never help.

### `hasRole("ADMIN")` looks for `ROLE_ADMIN`

Spring prefixes it for you. `hasAuthority("ADMIN")` does not. Mixing the two produces
rules that silently never match — the request is denied, nothing is logged as unusual, and
the authority in the token looks correct when you print it.

### A JWT is signed, not secret, and cannot be revoked

Three facts, each with a consequence.

**Signed, not encrypted.** Anyone holding the token can read the payload —
base64, paste it into jwt.io. So never put anything in it you would not put in a URL.

**Not secret.** It is a bearer token: whoever has it *is* the user. Which is why it goes
in an `Authorization` header over TLS, and why storing it in `localStorage` hands it to
any XSS.

**Cannot be revoked.** This is the one people miss. The whole point is that the server
validates it without a lookup — so there is nothing to delete. A logged-out user's token
is valid until it expires. The mitigations are short expiry with refresh tokens, or a
denylist — and a denylist is a lookup, which gives back the statelessness you adopted
JWTs for. Be able to say that trade out loud.

### Sessions are not obsolete

For a browser application talking to one backend, a server-side session in a cookie with
`HttpOnly`, `Secure` and `SameSite=Lax` is simpler, revocable, and immune to the
`localStorage` XSS problem. JWTs earn their place across service boundaries and for
mobile clients.

### CSRF: disable it only for header-authenticated stateless APIs

CSRF attacks work because browsers attach cookies automatically. If your API authenticates
with a cookie, you need CSRF protection. If it authenticates with an `Authorization`
header — which the browser does not attach on its own — the attack does not apply and
disabling it is correct.

`http.csrf(csrf -> csrf.disable())` is right for a token API and a serious hole in a
cookie-session app. It is the same line of code either way, which is why this is worth
knowing rather than looking up.

### The SecurityContext is thread-local

`SecurityContextHolder` uses a `ThreadLocal`. So it is **not** propagated to an
`@Async` method, a `@Scheduled` task, or a `parallelStream()`. A message listener or a
relay thread has no authenticated user, which is correct — nobody is asking — but code
that assumes `getAuthentication()` is non-null will NPE there.

That applies directly to
[`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java):
it runs on a scheduler thread and would have no principal.

### OAuth2 and OIDC, distinguished

**OAuth2 is authorisation** — "this application may act on my behalf". **OIDC** is a thin
layer on top that adds *authentication* — an `id_token` saying who the user is. If you
are using OAuth2 to log people in, you are using OIDC.

As a resource server, the work is small: validate the token's signature against the
provider's JWKS, check `iss`, `aud` and `exp`, and map claims to authorities. Do not write
that yourself — `spring-boot-starter-oauth2-resource-server` is about six lines of
configuration, and hand-rolled JWT validation is a reliable source of CVEs (the
`alg: none` family being the classic).

---

## 2. In this codebase

**There is no security here at all.** No `spring-boot-starter-security`, no filter chain,
no authentication. Every endpoint is open.

That is a deliberate stopping point for a reference system whose purpose is to be read,
and stating it plainly is the honest option — but it is also the one gap in this project
that would be **unacceptable in production**, so it is worth being precise about what is
missing:

- Anyone can create, submit, confirm, ship or cancel any order.
- There is no notion of a customer only seeing their own orders. `findByCustomer` takes a
  `CustomerId` from the caller and trusts it completely.
- The correlation id in
  [`ApiExceptionAdvice`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java)
  is the only security-adjacent thing present, and it is there for support rather than
  for defence.

What the codebase *does* get right, in advance:

| Practice | Where |
|---|---|
| Stack traces logged, never returned | [`ApiExceptionAdvice.handleUnexpected`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/ApiExceptionAdvice.java) |
| No secrets in the repository | [`application.yaml`](../../src/ordini-app/src/main/resources/application.yaml) |
| Parameterised SQL everywhere (JPA) | [`SpringDataOrderRepository`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/jpa/SpringDataOrderRepository.java) |
| Input validated at the edge, before the domain | [`OrderDtos`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/web/OrderDtos.java) |
| A scheduled thread that would have no principal | [`OutboxRelay`](../../src/ordini-app/src/main/java/it/fonderia/ordini/app/infrastructure/outbox/OutboxRelay.java) |

Adding security is the natural next piece of work on this project, and lab A is most of
it.

---

## 3. Do it

**Lab A — add it.**

Add `spring-boot-starter-security` and start the application. Every endpoint is now behind
HTTP Basic with a generated password in the log — and **every test in
`OrderControllerTest` fails with 401**. That failure is the lesson: security is a filter,
so it broke tests that never mentioned it.

Then write a `SecurityFilterChain`, add `@AutoConfigureMockMvc(addFilters = false)` or
`@WithMockUser` to the slice, and get back to green.

**Lab B — the ownership rule that is missing.**

`GET /api/orders?customerId=X` would let anyone read anyone's orders. Add a rule that the
authenticated principal must match the customer id, and write the test that proves user B
gets 403 for user A's order. Notice that this rule cannot live in the controller alone if
a message consumer can also reach the service.

**Lab C — read a JWT.**

Take any JWT and paste it into `jwt.io`, or:

```bash
jshell -q --execution local <<'EOF'
String jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrcnMiLCJyb2xlIjoiQURNSU4ifQ.x";
for (String part : jwt.split("\\.")) {
    try { System.out.println(new String(java.util.Base64.getUrlDecoder().decode(part))); }
    catch (Exception e) { System.out.println("(signature)"); }
}
EOF
```

No key required. Now decide what you would never put in one.

**Lab D — `hasRole` versus `hasAuthority`.**

Give a user the authority `ADMIN` and guard an endpoint with `hasRole("ADMIN")`. Denied.
Change the authority to `ROLE_ADMIN` and it works. Then swap the rule to
`hasAuthority("ADMIN")` and watch it flip back. Two spellings, no error message.

**Lab E — the thread-local.**

Log `SecurityContextHolder.getContext().getAuthentication()` from a controller and from
`OutboxRelay.publishPending`. Non-null in one, null in the other. That is why an audit
column populated from the security context is empty for everything the relay writes.

---

## 4. Golden rules

Generated from the chapter this module covers — edit the chapter, not this block.
Run `php tools/module-cards.php java` after any change.

<!-- CARD:20 -->
**Chapter 20 — Spring Security, JWT and OAuth2**

1. **It is a filter chain, before the dispatcher.** Security errors need their own handlers.
2. **401 is “who are you”, 403 is “not allowed”.** Clients branch on the difference.
3. **`hasRole("ADMIN")` looks for `ROLE_ADMIN`.** The prefix is implicit.
4. **A JWT is signed, not secret, and cannot be revoked.** Short access token, revocable refresh token.
5. **Disable CSRF only for header-authenticated stateless APIs.** Cookie auth needs it.
6. **The SecurityContext is thread-local.** It does not follow you into `@Async`.
<!-- /CARD -->

---

## 5. Interview questions

**"Come funziona Spring Security?"** — A filter chain in front of the dispatcher, so
authentication and authorisation happen before any of my code. The practical consequences
are the interesting part: a 401 never reaches a controller, an exception in a filter does
not reach my `@RestControllerAdvice`, and a CORS failure is very often a 401 on the
preflight.

**"401 o 403?"** — 401 means unauthenticated despite the name — send credentials and retry.
403 means we know who you are and you still may not.

**"Cosa c'è da sapere su un JWT?"** — It is signed, not encrypted, so anyone holding it can
read the payload. It is a bearer token, so whoever has it is the user. And it cannot be
revoked, because the server validates it without a lookup — short expiry with refresh
tokens, or a denylist that gives back the statelessness you adopted it for.

**"JWT o sessione?"** — Session for a browser talking to one backend: simpler, revocable,
and an `HttpOnly` cookie is not reachable by XSS. JWT across service boundaries and for
mobile. "JWT because it is stateless" without naming the revocation problem is the answer
that gets followed up.

**"Quando disabilita CSRF?"** — When authentication is a header the browser does not attach
automatically. With cookie sessions, never. It is the same line of code in both cases,
which is why it is worth knowing rather than copying.

**"Perché il mio `@Async` non ha l'utente?"** — The `SecurityContext` is a `ThreadLocal`, so
it does not cross to an async or scheduled thread. Either propagate it deliberately, or
accept that background work has no principal — which is usually correct, and only a
problem for code that assumed otherwise.

# Deploying the accounts service

The sites are static and live on Cloudflare Workers. This service is not: Workers
runs V8 isolates, and this is a JVM. It runs on the VPS at `91.99.137.240`.

## What that box actually is

Not a bare VPS — a **Coolify** host running ~19 containers, with **Traefik**
(`coolify-proxy`) owning ports 80 and 443. There is no system Java, no system
nginx. Anything deployed here has to be a container on the `coolify` network with
Traefik labels; a systemd unit would never be routed and would never get a
certificate.

It is also **memory-tight**: 3.8 GB of RAM against container limits summing to
16 GB, and it was already 2.9 GB into swap before this service existed. Swap was
raised from 4 GB to 8 GB (`/swapfile2`, in `/etc/fstab`) to make room. That is why
`mem_limit: 512m` in the compose file is not decoration — an unbounded JVM here
gets somebody else's production container OOM-killed.

## What is on the server

Everything lives in `/opt/accounts`:

| | |
|---|---|
| `accounts.jar` | uploaded, not built there |
| `Dockerfile` | runtime only: `eclipse-temurin:21-jre-alpine`, non-root, `MaxRAMPercentage=65` |
| `docker-compose.yml` | memory cap, healthcheck, H2 volume, Traefik labels |
| `accounts.env` | **the JWT signing key**. Root-owned, mode 600, generated on that machine with `openssl rand -base64 48`. Never committed, never copied from a laptop. |
| `data/` | the H2 file. Owned by uid 100 — the container's user, not root, or H2 cannot write and the service crash-loops. |

It is **not a Coolify-managed resource**: it will not appear in the Coolify UI, and
Coolify will neither redeploy nor garbage-collect it.

## DNS

`api.hub.testdemo.it` is an **A record to `91.99.137.240`, DNS only (grey cloud)**
— matching `java` and `auto`, which are set up the same way. The name is a third
level deep deliberately: `api.testdemo.it` would read as an API for the whole
domain, and this one only serves the Academy sites. Grey cloud matters:
Traefik gets its certificate through a Let's Encrypt HTTP-01 challenge on port 80,
and proxying that through Cloudflare complicates it for no benefit here.

## Deploying a new build

```
./deploy/deploy-api.sh
```

Builds with tests locally, uploads the jar, rebuilds the image on the server,
restarts, and waits for the healthcheck.

## Checking it by hand

```
ssh root@91.99.137.240 'docker logs --tail 50 fonderia-accounts'
ssh root@91.99.137.240 'docker run --rm --network coolify alpine/curl -sS http://fonderia-accounts:8090/api/health'
curl https://api.hub.testdemo.it/api/health
```

The middle one is the useful one when the site cannot sign in: it answers
"is the service healthy" separately from "is it routed and resolvable",
which are the two failures that look identical from a browser.

## Pointing the site at it

`engine/account.js` reads the API base from localStorage and lets the user type
one, which is why sign-in degrades gracefully on a static host. Once DNS is live,
either set `https://api.hub.testdemo.it` as the default in `account.js` and re-sync the
engine, or type it once per browser. That is a site change, not a deploy step.

## What is NOT deployed

`subjects/java/src` — the reference application. It is a teaching artifact the
course reads, not a service anyone needs running.

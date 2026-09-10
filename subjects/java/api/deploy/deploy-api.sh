#!/usr/bin/env bash
#
# Ship a new build of the accounts service to the VPS.
#
#   ./deploy/deploy-api.sh              build (with tests), upload, rebuild, restart
#   ./deploy/deploy-api.sh --no-build   upload the existing target/ jar
#
# THE JAR IS BUILT HERE, NOT THERE, ON PURPOSE. That box runs ~19 containers on
# 3.8 GB of RAM; a Maven build on it would compete for memory with live sites and
# buy nothing. The image is runtime-only — see /opt/accounts/Dockerfile.
#
# Everything else (the container, the signing key, the Traefik labels, the H2
# volume) already exists on the server. See README.md if you need to rebuild it.

set -euo pipefail

HOST="${ACCOUNTS_HOST:-root@91.99.137.240}"
REMOTE=/opt/accounts

cd "$(dirname "$0")/.."

if [ "${1:-}" != "--no-build" ]; then
  echo "==> building (tests included)"
  mvn -B clean package
fi

JAR=$(ls -1 target/accounts-*.jar | head -1)
[ -n "$JAR" ] || { echo "no jar in target/ — build first" >&2; exit 1; }

echo "==> uploading $(du -h "$JAR" | cut -f1) to $HOST"
# Upload beside the live jar, then move: the window where the file is half
# written is never the window where docker build might read it.
scp "$JAR" "$HOST:$REMOTE/accounts.jar.new"

ssh "$HOST" "
  set -e
  mv $REMOTE/accounts.jar.new $REMOTE/accounts.jar
  cd $REMOTE
  docker compose build
  docker compose up -d
  echo '   waiting for health...'
  for i in \$(seq 1 30); do
    s=\$(docker inspect --format '{{.State.Health.Status}}' fonderia-accounts 2>/dev/null || echo none)
    [ \"\$s\" = healthy ] && { echo '   healthy'; exit 0; }
    [ \"\$s\" = unhealthy ] && break
    sleep 3
  done
  echo '   DID NOT BECOME HEALTHY — last 40 lines:'
  docker logs fonderia-accounts 2>&1 | tail -40
  exit 1
"

echo "==> external check"
curl -fsS -m 15 https://api.hub.testdemo.it/api/health && echo || \
  echo "   unreachable from outside — check the DNS record and Traefik, not the app
   (the health check above already passed inside the container)."

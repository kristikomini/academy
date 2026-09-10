-- V3 — the transactional outbox.
--
-- THE PROBLEM THIS TABLE EXISTS TO SOLVE.
--
-- An order is saved to the database and an event is published to a broker. Two systems,
-- no shared transaction. Whatever order you choose, there is a failure case:
--
--   publish, then commit  →  the commit fails, and consumers have already reacted to
--                            an order that does not exist
--   commit, then publish  →  the process dies in between, and the event is lost forever
--                            with no trace that it should have existed
--
-- That is the dual-write problem, and it has no solution with two systems and no
-- coordination. Two-phase commit is the textbook answer and is not one in practice:
-- it holds locks across services and blocks when the coordinator dies.
--
-- The outbox sidesteps it. The event is written to THIS table, in the SAME transaction
-- as the order, so the two either both happen or neither does — one database, one
-- commit, no distributed anything. A separate relay then reads unpublished rows and
-- sends them.
--
-- What you get: the event is never lost and never describes a rolled-back state.
-- What you accept: delivery is at-least-once. The relay can publish a row and die
-- before marking it, so it will send it again. Consumers must be idempotent — which
-- they had to be anyway, because every broker worth using is at-least-once too.

CREATE TABLE outbox (
    id           UUID          NOT NULL,
    -- Which aggregate this concerns. Also the message key: events for one order must
    -- arrive in order, and a broker partitions by key, so the key is what makes
    -- per-order ordering possible at all.
    aggregate_id UUID          NOT NULL,
    -- The event's simple class name. Stored rather than derived so that renaming a
    -- Java class does not silently change the wire contract — an event is a public API.
    event_type   VARCHAR(64)   NOT NULL,
    payload      TEXT          NOT NULL,
    occurred_at  TIMESTAMP     NOT NULL,
    -- NULL means not yet sent. A nullable timestamp rather than a boolean: it records
    -- when as well as whether, which is the difference between "it went" and being able
    -- to answer "why was it late".
    published_at TIMESTAMP,
    attempts     INT           NOT NULL DEFAULT 0,
    CONSTRAINT pk_outbox PRIMARY KEY (id)
);

-- The relay's only query: unpublished rows, oldest first. A partial index would be
-- better on PostgreSQL — WHERE published_at IS NULL — because the table is mostly
-- published rows and the index only needs to cover the few that are not. It is written
-- as a plain composite index here because H2 does not support partial indexes and the
-- fast tests run on H2; the trade-off is noted rather than hidden.
CREATE INDEX ix_outbox_unpublished ON outbox (published_at, occurred_at);

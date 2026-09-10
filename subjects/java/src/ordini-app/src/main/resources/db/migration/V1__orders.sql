-- V1 — orders and their lines.
--
-- Migrations are reviewed artefacts, versioned with the code that needs them, and run
-- by the pipeline rather than by the application at start-up. Chapter 29.
--
-- Note VARCHAR(3) and not CHAR(3) for the currency codes. CHAR pads to a fixed width,
-- so "EUR" comes back with trailing spaces on some databases and comparisons start
-- failing in ways that look like data corruption. Hibernate's ddl-auto: validate
-- refuses to start on the mismatch, which is how this line got written correctly:
-- the first version of this file said CHAR(3) and the context would not load.
--
-- Flyway checksums this file after it has run. Editing it later is refused, and that
-- refusal is a feature: a migration that has been applied somewhere is history, and
-- history is append-only. The next change is V2, always.

CREATE TABLE orders (
    id                  UUID         NOT NULL,
    customer_id         UUID         NOT NULL,
    status              VARCHAR(16)  NOT NULL,
    -- Money as an exact decimal, never a float. The currency travels with it, because
    -- an amount without one is a number, not a price.
    total_amount        NUMERIC(19,2) NOT NULL,
    total_currency      VARCHAR(3)   NOT NULL,
    carrier_tracking    VARCHAR(64),
    cancellation_reason VARCHAR(255),
    last_changed_at     TIMESTAMP    NOT NULL,
    -- Optimistic concurrency. Hibernate writes WHERE version = ? and treats zero rows
    -- affected as a conflict. Chapter 25: cheaper than raising the isolation level,
    -- because it holds no locks between reading and writing.
    version             BIGINT       NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (id)
);

CREATE TABLE order_lines (
    order_id   UUID          NOT NULL,
    sku        VARCHAR(16)   NOT NULL,
    quantity   INT           NOT NULL,
    unit_price NUMERIC(19,2) NOT NULL,
    currency   VARCHAR(3)    NOT NULL,
    -- The key is (order, SKU), not (order, position).
    --
    -- The aggregate already merges duplicate SKUs, so this is the natural key and the
    -- database now enforces the same invariant — an invariant guarded in only one place
    -- holds until somebody writes a second code path.
    --
    -- The first version of this table keyed on a line number instead, with a UNIQUE on
    -- the SKU beside it. That fails on a realistic edit: removing the first of two lines
    -- makes the mapper renumber, Hibernate issues the UPDATE before the DELETE, and for
    -- an instant two rows claim the same SKU. Keying on the thing that is actually
    -- unique removes the problem rather than sequencing around it.
    CONSTRAINT pk_order_lines PRIMARY KEY (order_id, sku),
    CONSTRAINT fk_order_lines_order FOREIGN KEY (order_id)
        REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT ck_order_lines_qty CHECK (quantity > 0)
);

-- Orders are almost always fetched by customer in this application, and a table scan
-- for that is fine at a thousand rows and not at a million. Chapter 27: an index is a
-- decision about a query you actually run.
CREATE INDEX ix_orders_customer ON orders (customer_id);

-- V2 — an index for a query that now exists.
--
-- V1 already indexed customer_id, which was right when the only question was "which
-- orders belong to this customer". The list endpoint added in module 24 asks a
-- different question:
--
--   SELECT ... FROM orders WHERE customer_id = ? ORDER BY last_changed_at DESC
--
-- With an index on customer_id alone the database can find the rows and must then sort
-- them. With both columns in one index, in that order, it can walk the index and the
-- rows come out already ordered — no sort step at all.
--
-- **Composite indexes work left to right.** This index serves `WHERE customer_id = ?`
-- and `WHERE customer_id = ? ORDER BY last_changed_at`. It does not serve a query that
-- filters on last_changed_at alone, because that is the second column and the first is
-- unconstrained. That rule is why column order in a composite index is a design
-- decision and not a formatting one.
--
-- It replaces ix_orders_customer rather than sitting beside it: the new index can do
-- everything the old one could, and every redundant index is write amplification on
-- every insert and update, forever.
--
-- **Why this is V2 and not an edit to V1.** Flyway checksums a migration once it has
-- run and refuses to start if the file changes afterwards. That refusal is the feature:
-- a migration applied anywhere is history, and history is append-only. Editing V1 would
-- work on a fresh database and break every environment that already has it.

DROP INDEX ix_orders_customer;

CREATE INDEX ix_orders_customer_recent ON orders (customer_id, last_changed_at DESC);

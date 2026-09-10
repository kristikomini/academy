-- Create-if-missing, on first launch. Blueprint §5.5.
--
-- Not migrations, and the blueprint is explicit that this trade is right HERE and wrong
-- almost everywhere else: one instance, a small schema, no upgrade history worth keeping.
-- The same shortcut in a multi-instance deployment races on start-up and forces the
-- runtime account to hold schema-altering permissions. If this ever grows a second
-- instance, the fix is real migrations as a separate pipeline step — which is exactly
-- what ../src does with Flyway, and course module 25 argues for.

CREATE TABLE IF NOT EXISTS users (
    id                      UUID          NOT NULL PRIMARY KEY,
    -- Stored already normalised: trimmed and lower-cased. Normalising on write rather
    -- than on every read means the UNIQUE index is the uniqueness rule, instead of the
    -- index and some code both having an opinion.
    username                VARCHAR(32)   NOT NULL UNIQUE,
    display_name            VARCHAR(60)   NOT NULL,
    password_hash           VARCHAR(128)  NOT NULL,
    password_salt           VARCHAR(64)   NOT NULL,
    -- Per user, so the cost can be raised later without invalidating existing accounts.
    password_iterations     INT           NOT NULL,
    recovery_code_hash      VARCHAR(64)   NOT NULL,
    recovery_code_issued_at TIMESTAMP     NOT NULL,
    created_at              TIMESTAMP     NOT NULL,
    last_sign_in_at         TIMESTAMP,
    failed_attempts         INT           NOT NULL DEFAULT 0,
    locked_until            TIMESTAMP,
    -- Opt-OUT, not opt-in: the leaderboard is part of the product, and a leaderboard
    -- nobody is on is not one.
    show_on_leaderboard     BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS profiles (
    user_id           UUID      NOT NULL PRIMARY KEY,
    -- The whole progress document, as text. Its shape is owned by the browser and changes
    -- with every learning feature; modelling it relationally would mean a migration per
    -- badge, for data the server never queries by its parts.
    document          CLOB      NOT NULL,
    revision          INT       NOT NULL,
    client_updated_at TIMESTAMP NOT NULL,
    updated_at        TIMESTAMP NOT NULL,
    -- Denormalised FROM the document on every write, because the leaderboard orders by
    -- them and querying inside a JSON column across two engines is the sort of cleverness
    -- that stops working when somebody switches engine.
    xp                INT       NOT NULL DEFAULT 0,
    mastery_percent   DOUBLE    NOT NULL DEFAULT 0,
    streak_days       INT       NOT NULL DEFAULT 0,
    chapters_passed   INT       NOT NULL DEFAULT 0,
    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS ix_profiles_xp ON profiles (xp DESC);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id                     UUID         NOT NULL PRIMARY KEY,
    user_id                UUID         NOT NULL,
    -- Only the SHA-256. A refresh token is a bearer credential, so a stolen dump must not
    -- hand over working sessions.
    token_hash             VARCHAR(64)  NOT NULL UNIQUE,
    expires_at             TIMESTAMP    NOT NULL,
    created_at             TIMESTAMP    NOT NULL,
    revoked_at             TIMESTAMP,
    -- Which token replaced this one, so a replay can be recognised as a replay.
    replaced_by_token_hash VARCHAR(64),
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         UUID        NOT NULL PRIMARY KEY,
    user_id    UUID        NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP   NOT NULL,
    created_at TIMESTAMP   NOT NULL,
    used_at    TIMESTAMP,
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

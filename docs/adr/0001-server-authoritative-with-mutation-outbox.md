# Server-authoritative data with TanStack Query mutation outbox

Server DB is the source of truth. Client keeps a persisted TanStack Query cache and persisted paused mutations as its offline outbox. No local-first sync engine, no client DB, sql.js removed. Local-only mode (no backend) dropped.

Why: the offline requirement is only "capture offline, sync later". Local-first replication (CRDT, PowerSync, ElectricSQL) is far heavier for no extra value. Accepted cost: offline the user sees cached reads only, and aggregates stay stale until sync.

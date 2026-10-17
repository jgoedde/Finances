# Per-user composite keys with client-generated nanoid(8)

Transactions keep client-generated `nanoid(8)` IDs. Primary key is `(user_id, id)`, not `id` alone. Create is an idempotent `PUT /api/transactions/:id`.

Why: client-generated IDs let offline creates replay safely and let pending transactions be edited before sync. `nanoid(8)` (~48 bits) chosen over UUIDs for readability. That is safe per user but not globally, so scoping the key to the user removes cross-user collisions that would otherwise strand a pending transaction.

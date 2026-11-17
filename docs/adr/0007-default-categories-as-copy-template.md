# Default categories are a template copied to new users, not shared categories

An admin maintains the instance's default categories, and every new user gets their own copy of each at sign-up; afterwards the copies are independent, so later changes to the defaults never reach existing users and users edit their own categories freely. We considered making categories global (one admin-managed set shared by all users), but that would drop the per-user keys of ADR 0003 for categories, let an admin rename or delete categories inside other users' history, and stop users from adapting categories to their own life.

## Consequences

- Existing users don't receive default categories added later; they create them themselves.
- The fallback categories are not default categories: they are fixed in code and created for every user in addition to the copies.

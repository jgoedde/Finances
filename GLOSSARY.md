# Finances

A personal finance tracker where each user records what they spend and earn.

## Language

**User**:
A person with an account. Every piece of financial data belongs to exactly one user and is never shared.
_Avoid_: Account, member, household

**Admin**:
A user who can also manage other users of the instance. An admin's own financial data is just as private as anyone else's.
_Avoid_: Owner, superuser

**Operator**:
The person running an instance, with shell access to where it runs. Not necessarily a user of the app.
_Avoid_: Host, sysadmin, owner

**Invite**:
A one-time, expiring permission, created by an admin or the operator, that lets one person become a user.
_Avoid_: Signup code, registration link

**Password reset link**:
A one-time, expiring permission, created by an admin or the operator, that lets an existing user set a new password.
_Avoid_: Reset invite, reset token

**Transaction**:
A single recorded movement of money, either an expense or an income.
_Avoid_: Expense (for the general case), entry, booking

**Expense**:
A transaction where money is spent.
_Avoid_: Cost, spending

**Income**:
A transaction where money is received.
_Avoid_: Revenue, earning

## Sync

**Pending change**:
A creation, edit or deletion of a transaction made on a device but not yet accepted by the server, typically because the device is offline.
_Avoid_: Pending transaction, draft, queued transaction, offline transaction

**Sync failure**:
A pending change the server rejected, kept visible so the user can fix and retry or discard it. It is never silently lost.
_Avoid_: Sync error, conflict

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

**Exceptional transaction**:
A one-off, unusually large transaction, such as buying a car. Left out of insights about typical spending so it doesn't distort them, but still counted in how much was spent.
_Avoid_: Outlier, special purchase

**Net spending**:
What was spent minus what was received over a set of transactions. An expense adds to it and an income subtracts from it, so a negative value means more came in than went out.
_Avoid_: Balance, total, signed amount

## Fixed costs

**Fixed cost**:
A recurring expense of a fixed amount, such as rent or a subscription, charged every interval between its start date and optional end date.
_Avoid_: Subscription, recurring transaction, standing order

**Interval**:
How often a fixed cost is charged: monthly, quarterly or yearly.
_Avoid_: Frequency, period, cycle

**Monthly amount**:
A fixed cost's amount spread evenly over the months of its interval. A yearly amount is twelve monthly amounts.
_Avoid_: Monthly rate, average

**Active**:
A fixed cost the user has not switched off. An inactive fixed cost is kept but counts nowhere.
_Avoid_: Enabled, paused

**Running**:
A fixed cost is running on a day when it is active and the day falls within its start and end date.
_Avoid_: Current, ongoing, valid

## Sync

**Pending change**:
A creation, edit or deletion of a transaction made on a device but not yet accepted by the server, typically because the device is offline.
_Avoid_: Pending transaction, draft, queued transaction, offline transaction

**Sync failure**:
A pending change the server rejected, kept visible so the user can fix and retry or discard it. It is never silently lost.
_Avoid_: Sync error, conflict

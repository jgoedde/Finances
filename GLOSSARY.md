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

**Counterparty**:
Who a transaction is with: where the money went for an expense, where it came from for an income, such as a supermarket or an employer. The same counterparty may appear under several categories.
_Avoid_: Vendor, merchant, payee, name

**Exceptional transaction**:
A one-off, unusually large transaction, such as buying a car. Left out of insights about typical spending so it doesn't distort them, but still counted in how much was spent.
_Avoid_: Outlier, special purchase

**Upcoming transaction**:
A transaction dated after today, such as a bill already known. Shown in the UI as "Geplant" / "Upcoming".
_Avoid_: Future transaction, scheduled transaction, planned transaction

**Net spending**:
What was spent minus what was received over a set of transactions. An expense adds to it and an income subtracts from it, so a negative value means more came in than went out.
_Avoid_: Balance, total, signed amount

**Pattern**:
A regularity in a user's spending that they may not consciously notice, such as many small purchases at the same vendor or spending that clusters on certain weekdays. Detected from their transactions, never entered by hand.
_Avoid_: Habit, insight, trend

**Typical month**:
The median net spending of the six most recent complete months, leaving out exceptional transactions. Measured up to a given day of the month when compared with a month in progress.
_Avoid_: Average month, normal month, baseline

**Pace**:
How a month's net spending so far compares with a typical month up to the same day, for example 12 % above.
_Avoid_: Burn rate, budget status

## Fixed costs

**Fixed cost**:
A recurring expense, such as rent or a subscription, charged every interval between its start date and optional end date. Its amount is fixed until a price change. Never also recorded as a transaction.
_Avoid_: Subscription, recurring transaction, standing order

**Amount** (of a fixed cost):
What a fixed cost charges per interval on a given day: the amount of its latest price change on or before that day, else its initial amount.
_Avoid_: Price, rate

**Initial amount**:
The amount of a fixed cost from its start date until its first price change.
_Avoid_: Base amount, original price

**Price change**:
A new amount of a fixed cost from a given day on, past or future, within its start and end date. Correcting a mistyped amount is not a price change.
_Avoid_: Amount history entry, revision, version

**Fixed cost category**:
What kind of obligation a fixed cost is, such as housing, insurance or mobility. Separate from the categories of transactions.
_Avoid_: Category (unqualified), fixed category

**Interval**:
How often a fixed cost is charged: monthly, quarterly or yearly.
_Avoid_: Frequency, period, cycle

**Monthly amount**:
A fixed cost's amount spread evenly over the months of its interval. A yearly amount is twelve monthly amounts. A month's monthly amount uses the amount on the last day of that month the fixed cost runs, so a price change counts for the whole month it falls in.
_Avoid_: Monthly rate, average

**Total outflow**:
A month's net spending plus the monthly amounts of the fixed costs running in it.
_Avoid_: Total spending, expenses

**Gross outflow**:
What a month's money went to: the monthly amounts of the fixed costs running in it plus, for each category, its net spending where that is above zero. Leaves out exceptional transactions and income, so it shows what spending is made of rather than how the month ended.
_Avoid_: Spending mix, total spending

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

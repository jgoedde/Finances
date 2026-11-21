# Attached expenses reference a main expense, not a group

To keep expenses of one occasion together (a restaurant bill and its tip, an online order and its shipping), an attached expense points at its main expense, which stays a regular expense. We considered a separate group entity with its own title whose members are equals, and splitting one payment into line items whose amounts must add up to it. We rejected both: a group entity adds a second kind of object to sync, export and the list for no gain over the main expense's own counterparty and description, and line items would change what a transaction is, while tips and shipping are often separate payments anyway.

## Consequences

- Only expenses take part, only one level deep: a main expense can't be attached, an attached expense can't have attached expenses, and incomes never do.
- An attached expense always has its main expense's day. The server enforces it, so a stale date from an offline device is overwritten.
- Deleting a main expense detaches its attached expenses and never deletes them. A late write that attaches to a deleted or unknown main expense is saved as a regular expense, not a sync failure.
- Splitting in the transaction form creates a main expense (the remainder) with the parts attached. Split incomes stay separate transactions.
- Insights, totals and categories count every expense on its own. Being attached changes only how the list shows it.

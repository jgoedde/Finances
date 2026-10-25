import type { FixedCostInterval, TransactionKind } from "@finances/shared";

// Row types of the app tables. better-auth owns and types its own tables
// (`user`, `session`, `account`, `verification`).

export interface CategoriesTable {
    user_id: string;
    id: string;
    name: string;
    color: string;
    icon_name: string;
}

export interface FixedCostCategoriesTable {
    user_id: string;
    id: string;
    name: string;
    description: string | null;
}

export interface TransactionsTable {
    user_id: string;
    id: string;

    /**
     * Unix timestamp in milliseconds.
     */
    date: number;
    counterparty: string;
    description: string | null;
    kind: TransactionKind;
    amount: number;
    currency: string;
    category_id: string;
    exceptional: 0 | 1;

    /**
     * All three set, or all three `null`.
     */
    location_lat: number | null;
    location_lng: number | null;
    location_accuracy: number | null;
    updated_at: number;
}

export interface TransactionTombstonesTable {
    user_id: string;
    id: string;
    deleted_at: number;
}

export interface FixedCostsTable {
    user_id: string;
    id: string;
    name: string;
    description: string | null;
    initial_amount: number;
    currency: string;
    interval: FixedCostInterval;
    category_id: string;
    active: 0 | 1;

    /**
     * `YYYY-MM-DD`
     */
    start_date: string;

    /**
     * `YYYY-MM-DD`
     */
    end_date: string | null;
}

export interface FixedCostPriceChangesTable {
    user_id: string;
    fixed_cost_id: string;

    /**
     * `YYYY-MM-DD`
     */
    date: string;
    amount: number;
}

export interface InvitesTable {
    token_hash: string;
    kind: "signup" | "password-reset";

    /**
     * Target user of a password reset.
     */
    user_id: string | null;
    created_by: string | null;
    created_at: number;
    expires_at: number;
    used_at: number | null;
}

export interface UserTable {
    id: string;
    username: string | null;
    role: string | null;

    /**
     * ISO timestamp, written by better-auth.
     */
    createdAt: string;
}

export interface Database {
    categories: CategoriesTable;
    fixed_cost_categories: FixedCostCategoriesTable;
    transactions: TransactionsTable;
    transaction_tombstones: TransactionTombstonesTable;
    fixed_costs: FixedCostsTable;
    fixed_cost_price_changes: FixedCostPriceChangesTable;
    invites: InvitesTable;

    /**
     * Read-only view of the better-auth user table.
     */
    user: UserTable;
}

export interface Category {
    id: number;
    name: string;
    color: string;
    icon_name: string;
}

export interface Expense {
    id: string;
    /**
     * The date of the expense represented as unix timestamp in milliseconds.
     */
    date: number;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    category_id: number;
}

export type ExpenseWithCategory = Expense & { category: Category };

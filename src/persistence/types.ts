export interface Category {
    id: number;
    name: string;
    color: string;
    icon_name: string;
}

export interface Transaction {
    id: string;
    /**
     * The date of the transaction represented as unix timestamp in milliseconds.
     */
    date: number;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    category_id: number;

    /**
     * Is this transaction an exceptional expense/income, i.e. buying a car, paying for a wedding, etc
     */
    exceptional: boolean;
}

export type TransactionWithCategory = Transaction & { category: Category };

export enum TransactionType {
    income = "income",
    expense = "expense",
}

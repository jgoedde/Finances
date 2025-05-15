export type Expense = {
    id: string;
    date: number;
    name: string;
    amount: number;
    amountFormatted: string;
    category: {
        name: string;
        color: string;
        iconName: string;
    };
    lat?: number;
    long?: number;
    description?: string;
};

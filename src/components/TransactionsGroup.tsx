import { Apple } from "lucide-react";

export const TransactionsGroup = ({
    date,
    transactions,
}: {
    date: string;
    transactions: {
        name: string;
        amount: string;
        category: string;
        description?: string;
    }[];
}) => {
    return (
        <div className={"flex flex-col"}>
            <div className={"text-on-surface-variant mb-1"}>{date}</div>
            <div className={"flex flex-col gap-y-1.5"}>
                {transactions.map((transaction) => (
                    <Transaction
                        key={transaction.name}
                        transaction={transaction}
                    />
                ))}
            </div>
        </div>
    );
};

const Transaction = ({
    transaction: { amount, name, description, category },
}: {
    transaction: {
        name: string;
        amount: string;
        description?: string;
        category: string;
    };
}) => (
    <div className={"flex w-full max-w-sm flex-row items-center gap-x-3"}>
        <Apple className={"text-on-surface-variant size-8 shrink-0"} />
        <div className={"flex flex-1 flex-col"}>
            <div className={"text-on-surface font-medium"}>{name}</div>
            <div className={"text-on-surface-variant line-clamp-2 text-sm/5"}>
                {(description ?? "").trim() === "" ? category : description}
            </div>
        </div>
        <div className={"text-on-surface-variant justify-self-end"}>
            {amount}
        </div>
    </div>
);

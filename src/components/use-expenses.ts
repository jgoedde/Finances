import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useEncryption } from "@/components/use-encryption.ts";
import { nanoid } from "nanoid";

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

export function useExpenses() {
    const { key } = useEncryption();

    const [encryptedLs, setEncryptedLs] = useLocalStorage<string | null>({
        key: "expenses",
        defaultValue: null,
    });

    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (!encryptedLs) return;

        try {
            if (!key) {
                console.warn("No encryption key set");
                return;
            }
            const decrypted = CryptoJS.AES.decrypt(encryptedLs, key).toString(
                CryptoJS.enc.Utf8,
            );
            const parsed = JSON.parse(decrypted) as Expense[];
            parsed.sort((a, b) => b.date - a.date);
            setExpenses(parsed);
        } catch (e) {
            console.error("Failed to decrypt expenses", e);
        }
    }, [encryptedLs, key]);

    const saveToLocalStorage = (data: Expense[]) => {
        if (!key) throw new Error("No encryption key set");

        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            key,
        ).toString();
        setEncryptedLs(encrypted);
    };

    const addExpense = (expense: Omit<Expense, "id">) => {
        const updatedExpenses = [...expenses, { ...expense, id: nanoid(8) }];
        setExpenses(updatedExpenses);
        saveToLocalStorage(updatedExpenses);
    };

    const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
        const updatedExpenses = expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense,
        );
        setExpenses(updatedExpenses);
        saveToLocalStorage(updatedExpenses);
    };

    const deleteExpense = (id: string) => {
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        saveToLocalStorage(updatedExpenses);
    };

    const getExpense = (id: string) => {
        return expenses.find((expense) => expense.id === id);
    };

    return {
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpense,
    };
}

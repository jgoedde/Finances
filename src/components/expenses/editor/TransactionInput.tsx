import { Input } from "@/components/ui/input.tsx";
import { addMonths, endOfDay, startOfMonth } from "date-fns";
import * as React from "react";
import { useMemo } from "react";
import { mergeSimilarKeys, mergeSimilarStrings } from "@/lib/utils";
import { groupBy, uniq } from "lodash";
import { useRipple } from "@/hooks/use-ripple.ts";
import { useExpenses } from "@/components/expenses/use-expenses.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Label } from "@/components/ui/label.tsx";
import Fuse from "fuse.js";

const now = new Date();

interface TransactionInputProps {
    expenseLocal: string;
    selectedCategoryId: number | undefined;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onApplySuggestion: (suggestion: string) => void;
    shouldShowSuggestions: boolean;
    isExceptional: boolean;
    onExceptionalCheckBoxClick: (val: boolean) => void;
    transactionType: "expense" | "income";
}

export function TransactionInput({
    expenseLocal,
    selectedCategoryId,
    onInputChange,
    onApplySuggestion,
    shouldShowSuggestions,
    isExceptional,
    onExceptionalCheckBoxClick,
    transactionType,
}: TransactionInputProps) {
    const queryOptions = useMemo(
        () => ({
            start: startOfMonth(addMonths(now, -3)),
            end: endOfDay(now),
            categoryId: selectedCategoryId,
        }),
        [selectedCategoryId],
    );

    const expenses = useExpenses(queryOptions);

    const fuse = useMemo(() => {
        return new Fuse(expenses, {
            keys: ["name", "description"],
            shouldSort: true,
        });
    }, [expenses]);

    const similarExpenses = useMemo(() => {
        if (expenseLocal.trim() === "") {
            return [];
        }
        const names = uniq(fuse.search(expenseLocal).map((e) => e.item.name));
        return mergeSimilarStrings(names, 2).slice(0, 4);
    }, [expenseLocal, fuse]);

    // Shuffle top 8 for randomness
    const topExpenses = useMemo(() => {
        function getTimeOfDayBucket(date: Date) {
            const hour = date.getHours();
            if (hour >= 5 && hour < 11) return "Morgen";
            if (hour >= 11 && hour < 17) return "Mittag";
            if (hour >= 17 && hour < 22) return "Abend";
            return "Nacht";
        }

        const currentTimeBucket = getTimeOfDayBucket(now);
        const currentWeekday = now.getDay();

        // Group by name using mergeSimilarKeys
        const grouped = mergeSimilarKeys(groupBy(expenses, "name"));

        // Score suggestions by frequency, time of day, and weekday
        const scored = Object.entries(grouped).map(([name, arr]) => {
            // arr: Expense[]
            const freq = arr.length;
            // How many match current time bucket?
            const timeMatches = arr.filter((e) => {
                const d = new Date(e.date);
                return getTimeOfDayBucket(d) === currentTimeBucket;
            }).length;
            // How many match current weekday?
            const weekdayMatches = arr.filter((e) => {
                const d = new Date(e.date);
                return d.getDay() === currentWeekday;
            }).length;
            // Score: freq + timeMatches*2 + weekdayMatches*2
            const score = freq + timeMatches * 2 + weekdayMatches * 2;
            return { name, freq, score };
        });
        // Sort by score, then freq
        scored.sort((a, b) => b.score - a.score || b.freq - a.freq);

        return scored
            .slice(0, 8)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map((s) => s.name);
    }, [expenses]);

    const ripple = useRipple();

    const suggestions = useMemo(() => {
        if (expenseLocal.trim() === "") {
            return topExpenses;
        } else {
            return similarExpenses;
        }
    }, [expenseLocal, similarExpenses, topExpenses]);

    return (
        <div className={"flex flex-col gap-x-2"}>
            {suggestions.length > 0 && shouldShowSuggestions && (
                <div className={"my-2 flex flex-wrap gap-2"}>
                    {suggestions.map((e) => (
                        <button
                            key={`suggestion-${e}`}
                            tabIndex={-1}
                            aria-hidden="true"
                            className={
                                "border-outline-variant bg-surface-container-low text-on-surface-variant ripple-container cursor-pointer rounded-md border-1 px-2 py-1"
                            }
                            data-ripple-color={"bg-on-surface/50"}
                            {...ripple}
                            type={"button"}
                            onClick={(event) => {
                                ripple.onClick(event);

                                onApplySuggestion(e);
                            }}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            )}
            <div className={"flex items-center justify-between"}>
                <div className={"flex items-center"}>
                    <Label
                        htmlFor="expense"
                        className={"text-on-surface-variant"}
                    >
                        {transactionType === "expense" ? "Ausgabe" : "Einnahme"}
                    </Label>
                    <Input
                        id={"expense"}
                        name={"expense"}
                        required
                        value={expenseLocal}
                        onChange={onInputChange}
                        type={"text"}
                        className={
                            "rounded-none border-none shadow-none focus-visible:ring-0"
                        }
                    />
                </div>
                <div className={"flex items-center gap-x-4"}>
                    <Checkbox
                        id={"exceptional"}
                        name={"exceptional"}
                        checked={isExceptional}
                        onCheckedChange={onExceptionalCheckBoxClick}
                    />
                    <Label htmlFor={"exceptional"} className={"text-md"}>
                        Außerordentlich
                    </Label>
                </div>
            </div>
        </div>
    );
}

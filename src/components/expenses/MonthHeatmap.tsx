import { Calendar } from "@/components/ui/calendar.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";
import { ChartNoAxesColumn, ShoppingBasket } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useAppSelector } from "@/redux-hooks.ts";
import {
    selectExpensesInMonth,
    selectSpentInMonth,
    type YearMonth,
} from "@/components/expenses/selectors.ts";
import type { Expense } from "@/components/expense.ts";
import {
    categories,
    type Category,
} from "@/components/expenses/editor/categories.ts";
import { endOfMonth } from "date-fns";

export function MonthHeatmap({ month }: { month: YearMonth }) {
    const expenses = useAppSelector((state) =>
        selectExpensesInMonth(state, month),
    );

    const topCategories = getTopCategories(expenses, 3);

    const spent = useAppSelector((state) => selectSpentInMonth(state, month));

    const avgSpentPerDay =
        spent / endOfMonth(new Date(month.year, month.monthIndex)).getDate();

    return (
        <div className="bg-surface-container-lowest w-full flex-shrink-0 snap-start">
            <div className={"divide-outline-variant flex h-full divide-x"}>
                <Calendar
                    className={"w-1/2"}
                    defaultMonth={new Date(month.year, month.monthIndex)}
                    disableNavigation
                    selected={expenses.map((e) => new Date(e.date))}
                />
                <div className={"flex h-full flex-col px-2 text-sm"}>
                    <h3
                        className={
                            "font-poppins mt-2 mb-auto text-lg font-semibold"
                        }
                    >
                        {formatEuro(spent)} ausgegeben
                    </h3>
                    <div className={"mt-2 flex flex-col gap-y-1"}>
                        <div className={"flex items-center gap-x-2"}>
                            <div>
                                <ShoppingBasket className={"size-4"} />
                            </div>
                            <div>{expenses.length} Ausgaben</div>
                        </div>
                        <div className={"flex items-center gap-x-2"}>
                            <div>
                                <ChartNoAxesColumn className={"size-4"} />
                            </div>
                            <div>
                                {formatEuro(avgSpentPerDay)} Ausgaben pro Tag
                            </div>
                        </div>
                    </div>
                    <div className={"mb-2"}>
                        <h3 className={"mt-4 font-semibold"}>Top Kategorien</h3>
                        <div className={"mt-2 flex flex-col gap-y-1"}>
                            {topCategories.map(({ color, icon, name }) => (
                                <div
                                    key={name}
                                    className={"flex items-center gap-x-2"}
                                >
                                    <div>
                                        <DynamicIcon
                                            name={icon}
                                            className={"size-4"}
                                            style={{
                                                color,
                                            }}
                                        />
                                    </div>
                                    <div>{name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getTopCategories(expenses: Expense[], limit: number) {
    const categoryMap = new Map<
        string,
        { category: Category; total: number }
    >();

    for (const expense of expenses) {
        const categoryName = expense.category.name;
        if (!categoryMap.has(categoryName)) {
            const category = categories.find((c) => c.name === categoryName);
            if (!category) {
                continue;
            }
            categoryMap.set(categoryName, {
                category: category,
                total: 0,
            });
        }
        const entry = categoryMap.get(categoryName)!;
        entry.total += expense.amount;
    }

    return Array.from(categoryMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, limit)
        .map((c) => c.category);
}

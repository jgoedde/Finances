import { formatCurrency } from "@finances/shared";
import type { MonthOverview } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface IncomeExpensesCardProps {
    overview: MonthOverview;
}

/**
 * What came in and what went out in the month, exceptional included.
 */
export function IncomeExpensesCard({ overview }: IncomeExpensesCardProps) {
    return (
        <Card className={"grid grid-cols-2 gap-4 p-5"}>
            <div className={"flex flex-col gap-1"}>
                <span className={"text-label-large text-on-surface-variant"}>
                    {m.overview_income()}
                </span>
                <span className={"font-brand text-title-large text-income"}>
                    {formatCurrency(overview.income, getLocale())}
                </span>
            </div>
            <div className={"flex flex-col gap-1"}>
                <span className={"text-label-large text-on-surface-variant"}>
                    {m.overview_expenses()}
                </span>
                <span className={"font-brand text-title-large text-on-surface"}>
                    {formatCurrency(overview.expenses, getLocale())}
                </span>
            </div>
        </Card>
    );
}

import React, { type FC, type ReactNode, useMemo } from "react";
import { useAppSelector } from "@/redux-hooks.ts";
import {
    selectMonthlyFixCosts,
    selectMonthlyIncome,
} from "@/components/fixed-costs/slice.ts";
import { selectSpentThisMonth } from "@/components/expenses/slice.ts";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";
import { useColorScheme } from "@mantine/hooks";
import _ from "lodash";
import { isSaving } from "@/components/fixed-costs/fixed-cost.ts";

export const IncomeDistribution: FC = () => {
    const monthlyFixCosts = useAppSelector(selectMonthlyFixCosts);
    const monthlyIncome = useAppSelector(selectMonthlyIncome);
    const spentThisMonth = useAppSelector(selectSpentThisMonth);

    const theme = useColorScheme();

    const colors = useMemo(() => {
        return {
            income: convertHexToTonal("66dc6e", { light: 93, dark: 7 }),
            expenses: convertHexToTonal("ff6f61", { light: 95, dark: 2 }),
            fixCosts: convertHexToTonal("ffb74d", { light: 95, dark: 5 }),
            savings: convertHexToTonal("a0ff5d", { light: 97, dark: 3 }),
        };
    }, []);

    const savingsThisMonth = monthlyFixCosts
        .filter(isSaving)
        .reduce((acc, fc) => acc + fc.amount, 0);

    return (
        <div className={"my-4"}>
            {monthlyIncome > 0 && (
                <MonthlyFinanceBar
                    incomeSegment={{
                        income: monthlyIncome,
                        backgroundColor: colors.income[theme].container,
                        textColor: colors.income[theme].onContainer,
                    }}
                    segments={[
                        {
                            label: "Sparen",
                            amount: savingsThisMonth,
                            backgroundColor: colors.savings[theme].container,
                            textColor: colors.savings[theme].onContainer,
                            popoverLabel: `Sparen ${new Date().toLocaleDateString(
                                "de-DE",
                                {
                                    month: "long",
                                },
                            )}: ${formatEuro(savingsThisMonth)}`,
                        },
                        {
                            label: "Fixkosten",
                            amount:
                                monthlyFixCosts.reduce(
                                    (acc, fc) => acc + fc.amount,
                                    0,
                                ) - savingsThisMonth,
                            backgroundColor: colors.fixCosts[theme].container,
                            textColor: colors.fixCosts[theme].onContainer,
                            popoverLabel: (
                                <div className={"flex flex-col"}>
                                    <span className={"font-bold"}>
                                        Fixkosten{" "}
                                        {new Date().toLocaleDateString(
                                            "de-DE",
                                            {
                                                month: "long",
                                            },
                                        )}
                                    </span>
                                    <div className={"flex flex-col"}>
                                        {_.orderBy(
                                            monthlyFixCosts.filter(
                                                (fc) => !isSaving(fc),
                                            ),
                                            "amount",
                                            "desc",
                                        ).map((fc, idx) => (
                                            <span key={fc.expense}>
                                                {idx + 1}. {fc.expense}:{" "}
                                                {formatEuro(fc.amount)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            label: "Ausgaben",
                            amount: spentThisMonth,
                            backgroundColor: colors.expenses[theme].container,
                            textColor: colors.expenses[theme].onContainer,
                            popoverLabel: `Ausgaben ${new Date().toLocaleDateString(
                                "de-DE",
                                {
                                    month: "long",
                                },
                            )}: ${formatEuro(spentThisMonth)}`,
                        },
                    ]}
                />
            )}
        </div>
    );
};

type BudgetSegment = {
    label: string;
    popoverLabel: ReactNode;
    amount: number;
    backgroundColor: string;
    textColor: string;
};

interface MonthlyFinanceBarProps {
    incomeSegment: {
        income: number;
        backgroundColor: string;
        textColor: string;
    };
    segments: BudgetSegment[];
}

const MonthlyFinanceBar: React.FC<MonthlyFinanceBarProps> = ({
    incomeSegment,
    segments,
}) => {
    const totalSpent = segments.reduce((sum, s) => sum + s.amount, 0);
    const leftover = incomeSegment.income - totalSpent;

    const allSegments: BudgetSegment[] =
        leftover > 0
            ? [
                  ...segments,
                  {
                      label: "Übrig",
                      backgroundColor: incomeSegment.backgroundColor,
                      textColor: incomeSegment.textColor,
                      amount: leftover,
                      popoverLabel: `Monatliches Einkommen: ${formatEuro(incomeSegment.income)}`,
                  },
              ]
            : segments;

    return (
        <div className="mx-auto flex h-16 w-full overflow-hidden rounded-sm">
            {allSegments.map((seg, idx) => (
                <div
                    key={`expenses-${seg.label}-${idx}`}
                    className={`relative mx-0.5 h-full`}
                    style={{
                        width: `${(seg.amount / incomeSegment.income) * 100}%`,
                        backgroundColor: seg.backgroundColor,
                    }}
                >
                    <Popover>
                        <PopoverTrigger asChild>
                            <div
                                className="absolute inset-0 flex w-full flex-col items-center justify-center px-1 text-center text-xs"
                                style={{
                                    color: seg.textColor,
                                }}
                            >
                                <div className={"w-full truncate font-bold"}>
                                    {seg.label}
                                </div>
                                <div className={"w-full truncate"}>
                                    {formatEuro(seg.amount)}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className={
                                "bg-inverse-surface text-inverse-on-surface w-full rounded-[4px] border-none px-2 py-1 text-sm"
                            }
                        >
                            {seg.popoverLabel}
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
        </div>
    );
};

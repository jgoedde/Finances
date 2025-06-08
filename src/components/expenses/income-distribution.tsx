import React, { type FC, useMemo } from "react";
import { useAppSelector } from "@/redux-hooks.ts";
import {
    selectMonthlyFixCosts,
    selectMonthlyIncome,
} from "@/components/fixed-costs/slice.ts";
import { selectSpentThisMonth } from "@/components/expenses/slice.ts";
import { useTheme } from "@/components/theme-provider.tsx";
import { convertHexToTonal } from "@/lib/color-utils.ts";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { formatEuro } from "@/lib/currency-utils.ts";

export const IncomeDistribution: FC = () => {
    const monthlyFixCosts = useAppSelector(selectMonthlyFixCosts);
    const monthlyIncome = useAppSelector(selectMonthlyIncome);
    const spentThisMonth = useAppSelector(selectSpentThisMonth);

    const { theme } = useTheme();

    const themeKey = theme === "system" ? "light" : theme;

    const colors = useMemo(() => {
        return {
            income: convertHexToTonal("66dc6e", { light: 93, dark: 7 }),
            expenses: convertHexToTonal("ff6f61", { light: 95, dark: 5 }),
            fixCosts: convertHexToTonal("ffb74d", { light: 95, dark: 5 }),
        };
    }, []);

    return (
        <div className={"my-4"}>
            {monthlyIncome > 0 && (
                <MonthlyFinanceBar
                    incomeSegment={{
                        income: monthlyIncome,
                        backgroundColor: colors.income[themeKey].container,
                        textColor: colors.income[themeKey].onContainer,
                    }}
                    segments={[
                        {
                            label: "Ausgaben",
                            amount: spentThisMonth,
                            backgroundColor:
                                colors.expenses[themeKey].container,
                            textColor: colors.expenses[themeKey].onContainer,
                        },
                        {
                            label: "Fixkosten",
                            amount: monthlyFixCosts.reduce(
                                (acc, fc) => acc + fc.amount,
                                0,
                            ),
                            backgroundColor:
                                colors.fixCosts[themeKey].container,
                            textColor: colors.fixCosts[themeKey].onContainer,
                        },
                    ]}
                />
            )}
        </div>
    );
};

type BudgetSegment = {
    label: string;
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
                  },
              ]
            : segments;

    return (
        <div className="motion-preset-expand mx-auto flex h-12 w-11/12 overflow-hidden rounded-sm">
            {allSegments.map((seg, idx) => (
                <div
                    key={`expenses-${seg.label}-${idx}`}
                    className={`relative h-full`}
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
                            {seg.label + " • " + formatEuro(seg.amount)}
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
        </div>
    );
};

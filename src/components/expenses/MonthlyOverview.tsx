import { addMonths } from "date-fns";
import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { cn } from "@/lib/utils.ts";
import { ArrowDown, ArrowUp, Calendar, CircleSlash2 } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";
import { formatEuro } from "@/lib/currency-utils.ts";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion.tsx";

const now = new Date();

export function MonthlyOverview() {
    const lastMonth = addMonths(now, -1);

    const changeOverMonth = useTableSubscription(
        () => expensesRepository.getChangeOverMonth(),
        [],
        "expenses:changed",
    );

    const categories = useTableSubscription(
        () => expensesRepository.getSpentPerCategory(),
        [],
        "expenses:changed",
    );

    const chartData = categories.map((c) => ({
        categoryName: c.category_name,
        expensesCount: c.expenses_count,
        averageExpenseAmount: c.avg_expense_amount,
        fill: c.category_color,
        spent: c.total,
    }));

    const chartConfig = useMemo(() => {
        const target: Record<
            string,
            {
                color: string;
                label: string;
            }
        > = {};
        chartData.forEach((it) => {
            target[it.categoryName] = {
                color: it.fill,
                label: it.categoryName,
            };
        });

        return target;
    }, [chartData]);

    return (
        <div className={"bg-surface-container-lowest m-2 flex rounded-md p-4"}>
            <div className={"flex w-full flex-col"}>
                {changeOverMonth.change_percentage != null ? (
                    <div className={"flex items-center gap-x-4"}>
                        <div
                            className={
                                "bg-primary-container flex w-24 items-center justify-center self-stretch rounded p-2 shadow-lg"
                            }
                        >
                            <Calendar
                                className={"text-on-primary-container size-6"}
                            />
                        </div>
                        <div
                            className={
                                "text-md flex flex-wrap items-center rounded-sm"
                            }
                        >
                            <div>Du hast diesen Monat insgesamt</div>
                            <div
                                className={cn(
                                    "mx-1 flex items-center",
                                    changeOverMonth.change_percentage > 0
                                        ? "text-error"
                                        : "text-[green] dark:text-[lightgreen]",
                                )}
                            >
                                {changeOverMonth.change_percentage > 0 ? (
                                    <ArrowUp className={"size-4"} />
                                ) : (
                                    <ArrowDown className={"size-4"} />
                                )}
                                {String(
                                    Math.abs(changeOverMonth.change_percentage),
                                )}
                                %{" "}
                                {changeOverMonth.change_percentage > 0
                                    ? "mehr"
                                    : "weniger"}
                            </div>
                            <div className={""}>
                                Ausgaben als im{" "}
                                {lastMonth.toLocaleDateString("de-DE", {
                                    month: "long",
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        Es wird Zeit für die Arbeit. Ein neuer Tag, ein neuer
                        Dollar!
                    </>
                )}

                <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-full"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={20}
                        outerRadius={150}
                        barSize={40}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    nameKey="categoryName"
                                />
                            }
                        />
                        <RadialBar dataKey="spent" background>
                            <LabelList
                                position="insideStart"
                                dataKey="categoryName"
                                className="fill-surface capitalize mix-blend-luminosity"
                                fontSize={11}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={"item-1"}>
                        <AccordionTrigger>Mehr</AccordionTrigger>
                        <AccordionContent>
                            <div className="divide-outline-variant flex flex-col space-y-2 divide-y">
                                {chartData.map((payload) => {
                                    return (
                                        <MyLegend
                                            key={payload.categoryName}
                                            averageExpenseAmount={
                                                payload.averageExpenseAmount
                                            }
                                            categoryName={payload.categoryName}
                                            expensesCount={
                                                payload.expensesCount
                                            }
                                            fill={payload.fill}
                                        />
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

function MyLegend({
    categoryName,
    expensesCount,
    averageExpenseAmount,
    fill,
}: {
    categoryName: string;
    expensesCount: number;
    averageExpenseAmount: number;
    fill: string;
}) {
    return (
        <div
            key={categoryName}
            className={cn("text-on-surface m-0 flex items-center gap-x-4 py-2")}
        >
            {
                <div
                    className="size-8 shrink-0 rounded-md"
                    style={{
                        backgroundColor: fill,
                    }}
                />
            }
            <div className={"flex flex-col"}>
                <div className={"text"}>{categoryName}</div>
                <div
                    className={
                        "text-on-surface-variant flex items-center text-sm"
                    }
                >
                    {expensesCount} Ausgaben,{" "}
                    <CircleSlash2 className={"mx-1 size-3"} />
                    {formatEuro(averageExpenseAmount)} pro Ausgabe
                </div>
                <div className={"ml-auto"}></div>
            </div>
        </div>
    );
}

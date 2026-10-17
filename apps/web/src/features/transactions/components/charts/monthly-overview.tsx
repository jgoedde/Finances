import { CircleSlash2 } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "#/components/ui/chart.tsx";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo } from "react";
import { formatEuro } from "#/utils/currency.ts";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "#/components/ui/accordion.tsx";
import { ExportSankeyDialog } from "#/features/sankey/export-as-sankey.tsx";
import { useSpendingPerCategory } from "#/features/transactions/insight-queries.ts";
import { Card } from "#/components/ui/card.tsx";

export function MonthlyOverview() {
    const categories = useSpendingPerCategory();

    const chartData = categories.map((c) => ({
        categoryName: c.categoryName,
        expensesCount: c.expenseCount,
        averageExpenseAmount: c.averageExpense,
        fill: c.categoryColor,
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
        <Card className={"m-2 gap-0 p-4"}>
            <div className={"flex w-full flex-col"}>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-md"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={35}
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
                                className="fill-surface capitalize
                                    mix-blend-luminosity"
                                fontSize={11}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={"item-1"}
                >
                    <AccordionItem value={"item-1"}>
                        <AccordionTrigger>Mehr</AccordionTrigger>
                        <AccordionContent>
                            <div
                                className="flex flex-col divide-y
                                    divide-outline-variant"
                            >
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
                <div className={"flex items-center gap-x-2"}>
                    <ExportSankeyDialog />
                </div>
            </div>
        </Card>
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
            className={
                "flex min-h-14 items-center gap-x-4 py-2 text-on-surface"
            }
        >
            {
                <div
                    className="size-10 shrink-0 rounded-full"
                    style={{
                        backgroundColor: fill,
                    }}
                />
            }
            <div className={"flex flex-col"}>
                <div className={"text-body-large"}>{categoryName}</div>
                <div
                    className={`flex items-center text-body-medium
                        text-on-surface-variant`}
                >
                    {expensesCount} Ausgaben,{" "}
                    <CircleSlash2 className={"mx-1 size-3"} />
                    {formatEuro(averageExpenseAmount)} pro Ausgabe
                </div>
            </div>
        </div>
    );
}

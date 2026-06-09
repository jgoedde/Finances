import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { cn } from "@/lib/utils.ts";
import { Check, CircleSlash2, FileLock } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { LabelList, RadialBar, RadialBarChart } from "recharts";
import { useMemo, useState } from "react";
import { formatEuro } from "@/lib/currency-utils.ts";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { ExportSankeyDialog } from "@/components/export-as-sankey.tsx";
import { Button } from "@/components/ui/button.tsx";
import { isBackupOverdue, useBackupConfig } from "@/hooks/use-backup-config.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { transactionRepository } from "@/persistence/repositories/transaction-repository.ts";

const now = new Date();

export function MonthlyOverview() {
    const categories = useTableSubscription(
        () => transactionRepository.getSpentPerCategory(),
        [],
        "expenses:changed",
    );

    const [backupConfig, setBackupConfig] = useBackupConfig();
    const [hasBackedUp, setHasBackedUp] = useState(false);

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

    const shouldBackup = isBackupOverdue(new Date(), backupConfig);

    return (
        <div className={"bg-surface-container-lowest m-2 flex rounded-md p-4"}>
            <div className={"flex w-full flex-col"}>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-full"
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
                                className="fill-surface capitalize mix-blend-luminosity"
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
                <div className={"flex items-center gap-x-2"}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={
                                    shouldBackup ? "filled" : "filledTonal"
                                }
                                className={cn(
                                    shouldBackup && "rounded-sm",
                                    "relative",
                                )}
                                onClick={async () => {
                                    try {
                                        await PersistentDatabase.exportFile();
                                        setHasBackedUp(true);
                                    } finally {
                                        setBackupConfig((prev) => ({
                                            ...prev,
                                            lastBackup: now.toISOString(),
                                        }));
                                    }
                                }}
                            >
                                {hasBackedUp ? <Check /> : <FileLock />}
                                Backup
                                {shouldBackup && (
                                    <div className="bg-error absolute -end-0.5 -top-0.5 size-3 rounded-full"></div>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className={"max-w-48"}>
                            <p>
                                Download a copy of the database as a backup. It
                                can be used to import it later.
                            </p>
                        </TooltipContent>
                    </Tooltip>

                    <ExportSankeyDialog />
                </div>
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

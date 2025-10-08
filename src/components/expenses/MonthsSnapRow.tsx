import { ChartContainer } from "@/components/ui/chart.tsx";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";
import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { expensesRepository } from "@/persistence/repository.ts";
import { formatEuro } from "@/lib/currency-utils.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface YearMonth {
    year: number;
    monthIndex: number; // 0-11
}

interface ChartData {
    category: string;
    totalSpent: number;
    iconName: string;
}

export function MonthsSnapRow() {
    const pastMonths: YearMonth[] = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
            year: date.getFullYear(),
            monthIndex: date.getMonth(),
        };
    });

    const res = useTableSubscription(
        () => expensesRepository.getMonths(),
        [],
        "expenses:changed",
    );

    function getMonthName(date: YearMonth) {
        return new Date(date.year, date.monthIndex).toLocaleString("de-DE", {
            month: "long",
            year: "numeric",
        });
    }

    function getChartDataAt(date: YearMonth): ChartData[] {
        const dataForMonth = res.filter(
            (x) =>
                x.month ===
                `${date.year}-${(date.monthIndex + 1).toString().padStart(2, "0")}`,
        );

        return dataForMonth.map((it) => ({
            category: it.category,
            totalSpent: it.total,
            iconName: it.category_icon_name,
        }));
    }

    return (
        <div
            className={
                "bg-surface-container-high flex flex-col space-y-2 rounded-xl p-4 shadow-lg"
            }
        >
            <div className={"flex flex-col"}>
                <div className={"font-poppins text-lg font-medium"}>
                    Ausgabenverteilung
                </div>
                <div className={"text-md text-on-surface-variant"}>
                    Pro Monat
                </div>
            </div>
            {/* Scrollable Snap Container */}
            <div className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl">
                {pastMonths.map((date) => (
                    <Chart
                        key={`${date.year}-${date.monthIndex}`}
                        data={getChartDataAt(date)}
                        monthName={getMonthName(date)}
                    />
                ))}
            </div>
        </div>
    );
}

function Chart({ data, monthName }: { data: ChartData[]; monthName: string }) {
    return (
        <div
            className={
                "flex w-full flex-shrink-0 snap-center flex-col items-center justify-center"
            }
        >
            <div
                className={
                    "text-primary font-poppins self-center text-lg font-extrabold"
                }
            >
                {formatEuro(
                    data.reduce((acc, item) => acc + item.totalSpent, 0),
                )}
            </div>
            <div className={"text-on-surface-variant self-center text-sm"}>
                {monthName}
            </div>
            <ChartContainer className={"w-full"} config={{}}>
                <BarChart accessibilityLayer data={data}>
                    <CartesianGrid
                        vertical={false}
                        stroke={"var(--color-surface-variant)"}
                    />

                    <Bar dataKey="totalSpent">
                        <LabelList
                            dataKey="totalSpent"
                            position="inside"
                            className="fill-(--color-on-secondary)"
                        />
                        <LabelList
                            position="top"
                            dataKey="iconName"
                            fillOpacity={1}
                            content={(props) => {
                                const iconName = props.value;
                                if (!iconName || typeof iconName !== "string") {
                                    return null;
                                }

                                return (
                                    <DynamicIcon
                                        x={
                                            (props.width as number) / 2 +
                                            (props.x as number) -
                                            12
                                        }
                                        y={(props.y as number) - 28}
                                        name={iconName as IconName}
                                        stroke={"var(--color-secondary"}
                                    />
                                );
                            }}
                        />
                        {data.map((item) => (
                            <Cell
                                key={item.category}
                                fill={"var(--color-secondary)"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
}

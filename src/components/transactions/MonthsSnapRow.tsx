import { ChartContainer } from "@/components/ui/chart.tsx";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";
import { useTableSubscription } from "@/hooks/use-table-subscription.ts";
import { formatEuro } from "@/lib/currency-utils.ts";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { startOfMonth } from "date-fns";
import { transactionRepository } from "@/persistence/repositories/transaction-repository.ts";

const now = new Date();

export function MonthsSnapRow() {
    const pastMonths = getPastMonths(now, 12);

    const res = useTableSubscription(
        () => transactionRepository.getMonths(),
        [],
        "expenses:changed",
    );

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
            className={`bg-surface-container-high flex flex-col space-y-2
                rounded-xl p-4 shadow-lg`}
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
            <div
                className="flex w-full snap-x snap-mandatory overflow-x-auto
                    scroll-smooth rounded-xl"
            >
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

function getMonthName(date: YearMonth) {
    return new Date(date.year, date.monthIndex).toLocaleString("de-DE", {
        month: "long",
        year: "numeric",
    });
}

interface ChartData {
    category: string;
    totalSpent: number;
    iconName: string;
}

interface ChartProps {
    data: ChartData[];
    monthName: string;
}

function Chart({ data, monthName }: ChartProps) {
    return (
        <div
            className={`flex w-full shrink-0 snap-center flex-col items-center
                justify-center`}
        >
            <div
                className={`text-primary font-poppins self-center text-lg
                    font-extrabold`}
            >
                {formatEuro(
                    data.reduce((acc, item) => acc + item.totalSpent, 0),
                )}
            </div>
            <div className={"text-on-surface-variant self-center text-sm"}>
                {monthName}
            </div>
            <ChartContainer className={"w-full"} config={{}}>
                <BarChart accessibilityLayer data={data} margin={{ top: 40 }}>
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

interface YearMonth {
    year: number;
    monthIndex: number; // 0-11
}

function getPastMonths(referenceDate: Date, count: number): YearMonth[] {
    const months: YearMonth[] = [];
    const startOfReferenceMonth = startOfMonth(referenceDate);

    for (let i = 0; i < count; i++) {
        months.push({
            year: startOfReferenceMonth.getFullYear(),
            monthIndex: startOfReferenceMonth.getMonth(),
        });
        startOfReferenceMonth.setMonth(startOfReferenceMonth.getMonth() - 1);
    }

    return months;
}

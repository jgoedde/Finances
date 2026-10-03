import { ChartContainer } from "@/components/ui/chart.tsx";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";
import { useTableSubscription } from "@/persistence/use-table-subscription.ts";
import { formatEuro } from "@/utils/currency.ts";
import { DynamicIcon } from "lucide-react/dynamic";
import { startOfMonth } from "date-fns";
import { transactionRepository } from "@/features/transactions/transaction-repository.ts";
import { type ComponentProps, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";

const now = new Date();

export function MonthsSnapRow() {
    const pastMonths = getPastMonths(now, 12);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    function scrollByPage(direction: 1 | -1) {
        const container = scrollContainerRef.current;
        if (!container) {
            return;
        }

        container.scrollBy({ left: direction * container.clientWidth });
    }

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
        <Card className={"gap-2 p-4"}>
            <div className={"flex items-start"}>
                <div className={"flex flex-col"}>
                    <h2 className={"font-brand text-title-large"}>
                        Ausgabenverteilung
                    </h2>
                    <div className={"text-body-medium text-on-surface-variant"}>
                        Pro Monat
                    </div>
                </div>
                {/* Mouse users can't swipe, so offer explicit navigation on larger screens. */}
                <div className={"ml-auto hidden gap-x-1 md:flex"}>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        aria-label={"Neuerer Monat"}
                        onClick={() => scrollByPage(-1)}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        aria-label={"Älterer Monat"}
                        onClick={() => scrollByPage(1)}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            {/* Scrollable Snap Container */}
            <div
                ref={scrollContainerRef}
                className="flex w-full snap-x snap-mandatory overflow-x-auto
                    scroll-smooth"
            >
                {pastMonths.map((date) => (
                    <Chart
                        key={`${date.year}-${date.monthIndex}`}
                        data={getChartDataAt(date)}
                        monthName={getMonthName(date)}
                    />
                ))}
            </div>
        </Card>
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
                className={`text-primary font-brand text-title-large self-center
                    font-semibold`}
            >
                {formatEuro(
                    data.reduce((acc, item) => acc + item.totalSpent, 0),
                )}
            </div>
            <div
                className={
                    "text-on-surface-variant text-body-medium self-center"
                }
            >
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
                            className="fill-on-secondary text-label-small"
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
                                        name={
                                            iconName as ComponentProps<
                                                typeof DynamicIcon
                                            >["name"]
                                        }
                                        stroke={"var(--color-secondary)"}
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

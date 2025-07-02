import { MonthHeatmap } from "@/components/expenses/MonthHeatmap.tsx";

const now = new Date();

const thePast = Array.from({ length: 4 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
    };
});

export function MonthsComparison() {
    return (
        <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
            {thePast.map((month) => (
                <MonthHeatmap
                    key={`heatmap-${month.year}-${month.monthIndex}`}
                    month={month}
                />
            ))}
        </div>
    );
}

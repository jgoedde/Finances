import { BiggestDailySpike } from "@/features/transactions/components/charts/biggest-daily-spike.tsx";
import { MonthsSnapRow } from "@/features/transactions/components/charts/months-snap-row.tsx";

export function Insights() {
    return (
        <div className={"my-8 flex w-full flex-col space-y-8 px-2"}>
            <BiggestDailySpike />
            <MonthsSnapRow />
        </div>
    );
}

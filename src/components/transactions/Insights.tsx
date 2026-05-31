import { BiggestDailySpike } from "@/components/transactions/BiggestDailySpike.tsx";
import { MonthsSnapRow } from "@/components/transactions/MonthsSnapRow.tsx";

export function Insights() {
    return (
        <div className={"my-8 flex w-full flex-col space-y-8 px-2"}>
            <BiggestDailySpike />
            <MonthsSnapRow />
        </div>
    );
}

import { useEncryption } from "@/components/use-encryption.ts";
import { BiggestDailySpike } from "@/components/transactions/BiggestDailySpike.tsx";
import { MonthsSnapRow } from "@/components/transactions/MonthsSnapRow.tsx";

export function Insights() {
    const { key } = useEncryption();

    if (!key) {
        return null;
    }

    return (
        <div className={"my-8 flex w-full flex-col space-y-8 px-2"}>
            <BiggestDailySpike />
            <MonthsSnapRow />
        </div>
    );
}

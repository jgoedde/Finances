import type { FixedCostInterval } from "@finances/shared";
import {
    type FixedCost,
    INTERVAL_LABELS,
} from "#/features/fixed-costs/fixed-cost.ts";
import { FixedCostListItem } from "#/features/fixed-costs/list/fixed-cost-list-item.tsx";

interface FixedCostGroupProps {
    interval: FixedCostInterval;
    fixedCosts: FixedCost[];
}

/**
 * The fixed costs of one interval under a header.
 */
export function FixedCostGroup({ interval, fixedCosts }: FixedCostGroupProps) {
    return (
        <section className={"flex flex-col"}>
            <h2
                className={"px-4 py-2 text-title-small text-on-surface-variant"}
            >
                {INTERVAL_LABELS[interval]()}
            </h2>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                {fixedCosts.map((it) => (
                    <FixedCostListItem key={it.id} fixedCost={it} />
                ))}
            </div>
        </section>
    );
}

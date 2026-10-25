import { useId, useState } from "react";
import {
    type FixedCostChange,
    formatCurrency,
    formatMonthYear,
} from "@finances/shared";
import { ChevronDown } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table.tsx";
import { fromIsoDate } from "#/features/fixed-costs/fixed-cost.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostChangeLogProps {
    /**
     * Newest first.
     */
    changes: FixedCostChange[];
}

/**
 * The starts, price changes and ends behind the history graph with their
 * monthly amount delta, collapsed until opened.
 */
export function FixedCostChangeLog({ changes }: FixedCostChangeLogProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentId = useId();

    return (
        <div className={"flex flex-col border-t border-outline-variant"}>
            <button
                type={"button"}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`state-layer flex min-h-12 items-center gap-3 px-5
                    text-left text-label-large text-primary focus-ring`}
            >
                <span className={"grow"}>
                    {m.fixed_cost_changes({ count: changes.length })}
                </span>
                <ChevronDown
                    aria-hidden
                    className={cn(
                        `size-5 shrink-0 transition-transform duration-200
                        ease-standard`,
                        isExpanded && "rotate-180",
                    )}
                />
            </button>
            {isExpanded && (
                <div id={contentId} className={"px-3 pb-3"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    {m.fixed_cost_changes_month()}
                                </TableHead>
                                <TableHead>
                                    {m.fixed_cost_changes_what()}
                                </TableHead>
                                <TableHead className={"text-right"}>
                                    {m.fixed_cost_changes_delta()}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {changes.map((change) => (
                                <TableRow
                                    key={`${change.month}-${change.kind}-${change.fixedCost.id}`}
                                >
                                    <TableCell
                                        className={`text-body-small
                                        text-on-surface-variant`}
                                    >
                                        {formatMonthYear(
                                            fromIsoDate(`${change.month}-01`),
                                            getLocale(),
                                        )}
                                    </TableCell>
                                    <TableCell
                                        className={
                                            "whitespace-normal text-on-surface"
                                        }
                                    >
                                        {CHANGE_LABELS[change.kind]({
                                            name: change.fixedCost.name,
                                        })}
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            "text-right",
                                            change.delta < 0
                                                ? "text-on-surface-variant"
                                                : "text-on-surface",
                                        )}
                                    >
                                        {formatCurrency(
                                            change.delta,
                                            getLocale(),
                                            change.fixedCost.currency,
                                            { signed: true },
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

const CHANGE_LABELS = {
    started: m.fixed_cost_change_started,
    price_change: m.fixed_cost_change_price_change,
    ended: m.fixed_cost_change_ended,
} as const satisfies Record<
    FixedCostChange["kind"],
    (inputs: { name: string }) => string
>;

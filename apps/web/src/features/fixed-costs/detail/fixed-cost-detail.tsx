import {
    type FixedCost as FixedCostRecord,
    type FixedCostCategory,
    formatCurrency,
    formatLongDate,
    getPriceHistory,
    type PriceChange,
} from "@finances/shared";
import { Link, useNavigate } from "@tanstack/react-router";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteButton } from "#/components/delete-button.tsx";
import { Button } from "#/components/ui/button.tsx";
import { TopAppBar } from "#/components/ui/top-app-bar.tsx";
import { PriceChangeSheet } from "#/features/fixed-costs/detail/price-change-sheet.tsx";
import { PriceHistoryList } from "#/features/fixed-costs/detail/price-history-list.tsx";
import {
    INTERVAL_LABELS,
    toFixedCost,
    toLocalIsoDate,
} from "#/features/fixed-costs/fixed-cost.ts";
import { useDeleteFixedCost } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface FixedCostDetailProps {
    record: FixedCostRecord;
    categories: FixedCostCategory[];
}

/**
 * Read-only summary of a fixed cost with its price history. Price changes
 * are made in a sheet; the top app bar edits or deletes the fixed cost.
 */
export function FixedCostDetail({ record, categories }: FixedCostDetailProps) {
    const navigate = useNavigate();
    const deleteFixedCost = useDeleteFixedCost();
    // Fixed costs are read-only offline.
    const isOnline = useIsOnline();
    // Once per mount: "current" is about today.
    const [today] = useState(() => toLocalIsoDate(new Date()));
    const fixedCost = toFixedCost(record, categories, today);

    // The sheet keeps its content while closing; `key` resets its form.
    const [sheet, setSheet] = useState<{
        change: PriceChange | null;
        key: number;
    }>({ change: null, key: 0 });
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    function openSheet(change: PriceChange | null) {
        setSheet(({ key }) => ({ change, key: key + 1 }));
        setIsSheetOpen(true);
    }

    function remove() {
        deleteFixedCost.mutate(record.id);
        toast.success(m.fixed_cost_deleted());
        void navigate({ to: "/fixed-costs" });
    }

    const supportingText = [
        INTERVAL_LABELS[fixedCost.interval](),
        fixedCost.category.name,
        m.fixed_cost_since({
            date: formatLongDate(fixedCost.startDate, getLocale()),
        }),
        fixedCost.endDate &&
            m.fixed_cost_until({
                date: formatLongDate(fixedCost.endDate, getLocale()),
            }),
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className={"flex min-h-dvh flex-col"}>
            <TopAppBar
                title={fixedCost.name}
                actions={
                    <>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={m.action_edit()}
                            asChild
                        >
                            <Link
                                to={"/fixed-costs/$id/edit"}
                                params={{ id: record.id }}
                            >
                                <PencilIcon />
                            </Link>
                        </Button>
                        <OfflineHint active={!isOnline}>
                            <DeleteButton
                                title={m.fixed_cost_delete_title()}
                                description={m.fixed_cost_delete_description()}
                                disabled={!isOnline}
                                onDelete={remove}
                            />
                        </OfflineHint>
                    </>
                }
            />
            <main className={"mx-auto w-full max-w-md px-4 pb-6"}>
                <section className={"py-6"}>
                    <div
                        className={
                            "font-brand text-display-small text-on-surface"
                        }
                    >
                        {formatCurrency(
                            fixedCost.amount,
                            getLocale(),
                            fixedCost.currency,
                        )}
                    </div>
                    <div className={"text-body-medium text-on-surface-variant"}>
                        {supportingText}
                    </div>
                </section>

                <div className={"flex items-center justify-between pb-2"}>
                    <h2 className={"text-title-medium text-on-surface"}>
                        {m.price_history_title()}
                    </h2>
                    <OfflineHint active={!isOnline}>
                        <Button
                            variant={"filledTonal"}
                            disabled={!isOnline}
                            onClick={() => openSheet(null)}
                        >
                            <PlusIcon />
                            {m.price_change_add()}
                        </Button>
                    </OfflineHint>
                </div>

                <PriceHistoryList
                    entries={getPriceHistory(record, today)}
                    currency={record.currency}
                    onSelect={openSheet}
                />
            </main>

            <PriceChangeSheet
                key={sheet.key}
                record={record}
                change={sheet.change}
                today={today}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}

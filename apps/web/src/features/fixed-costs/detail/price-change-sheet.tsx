import {
    findPriceChangeProblem,
    type FixedCost as FixedCostRecord,
    formatLongDate,
    getAmountOn,
    type PriceChange,
    type PriceChangeProblem,
    withPriceChange,
} from "@finances/shared";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { apiErrorCode } from "#/api/api-errors.ts";
import { Button } from "#/components/ui/button.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import { CurrencyInputWrapper } from "#/components/ui/currency-input-wrapper.tsx";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "#/components/ui/drawer.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import {
    fromIsoDate,
    toLocalIsoDate,
} from "#/features/fixed-costs/fixed-cost.ts";
import { useUpdateFixedCost } from "#/features/fixed-costs/fixed-cost-queries.ts";
import { dateTriggerClassName } from "#/features/fixed-costs/fixed-cost-wizard.tsx";
import { useIsOnline } from "#/features/sync/connectivity.ts";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const PROBLEM_MESSAGES = {
    duplicate_date: m.price_change_duplicate_date,
    before_start: m.price_change_before_start,
    after_end: m.price_change_after_end,
} as const satisfies Record<PriceChangeProblem, () => string>;

// Shown inline instead of the mutation's toast.
function isOutOfRange(error: Error): boolean {
    return apiErrorCode(error) === "price_change_out_of_range";
}

interface PriceChangeSheetProps {
    record: FixedCostRecord;

    /**
     * The price change to edit; `null` adds one.
     */
    change: PriceChange | null;

    /**
     * `YYYY-MM-DD`; a new price change starts on this day with its amount.
     */
    today: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Bottom sheet that adds, edits or deletes a price change. Saving sends all
 * price changes and closes the sheet once the server took them.
 */
export function PriceChangeSheet({
    record,
    change,
    today,
    open,
    onOpenChange,
}: PriceChangeSheetProps) {
    const [amountStr, setAmountStr] = useState(() =>
        (change?.amount ?? getAmountOn(record, today)).toFixed(2),
    );
    const [date, setDate] = useState(change?.date ?? today);
    const [error, setError] = useState<string>();
    const updateFixedCost = useUpdateFixedCost(isOutOfRange);
    // Fixed costs are read-only offline.
    const isOnline = useIsOnline();
    const isBlocked = !isOnline || updateFixedCost.isPending;
    const replacing = change?.date ?? null;

    function submit(priceChanges: PriceChange[], successMessage: string) {
        setError(undefined);
        updateFixedCost.mutate(
            { id: record.id, patch: { priceChanges } },
            {
                onSuccess: () => {
                    toast.success(successMessage);
                    onOpenChange(false);
                },
                onError: (mutationError) => {
                    // Other errors get the mutation's toast.
                    if (isOutOfRange(mutationError)) {
                        setError(m.api_error_price_change_out_of_range());
                    }
                },
            },
        );
    }

    function save() {
        const problem = findPriceChangeProblem(record, date, replacing);
        if (problem !== null) {
            setError(PROBLEM_MESSAGES[problem]());
            return;
        }
        const amount = parseFloat(amountStr.replace(",", ".")) || 0;
        submit(
            withPriceChange(record.priceChanges, { date, amount }, replacing),
            m.price_change_saved(),
        );
    }

    function remove() {
        submit(
            record.priceChanges.filter((it) => it.date !== replacing),
            m.price_change_deleted(),
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        {change ? m.price_change_edit() : m.price_change_new()}
                    </DrawerTitle>
                </DrawerHeader>
                <div className={"flex flex-col gap-4 px-4 pb-6"}>
                    <Field>
                        <FieldLabel htmlFor={"price-change-amount"}>
                            {m.price_change_amount()}
                        </FieldLabel>
                        <CurrencyInputWrapper
                            id={"price-change-amount"}
                            inputMode={"decimal"}
                            intlConfig={{
                                locale: getLocale(),
                                currency: "EUR",
                            }}
                            allowNegativeValue={false}
                            decimalsLimit={2}
                            value={amountStr}
                            onValueChange={(value) => setAmountStr(value ?? "")}
                            autoComplete={"off"}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={"price-change-date"}>
                            {m.price_change_date()}
                        </FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id={"price-change-date"}
                                    variant={"ghost"}
                                    shape={"square"}
                                    className={dateTriggerClassName}
                                >
                                    {formatLongDate(
                                        fromIsoDate(date),
                                        getLocale(),
                                    )}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className={"w-auto p-0"}
                                align={"start"}
                            >
                                <Calendar
                                    mode={"single"}
                                    selected={fromIsoDate(date)}
                                    defaultMonth={fromIsoDate(date)}
                                    onSelect={(day) => {
                                        if (day) {
                                            setDate(toLocalIsoDate(day));
                                            setError(undefined);
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        {error && (
                            <FieldDescription
                                role={"alert"}
                                className={"text-error"}
                            >
                                {error}
                            </FieldDescription>
                        )}
                    </Field>
                    <div className={"flex gap-2"}>
                        {change && (
                            <OfflineHint active={!isOnline}>
                                <Button
                                    variant={"outline"}
                                    className={"flex-1"}
                                    disabled={isBlocked}
                                    onClick={remove}
                                >
                                    {m.action_delete()}
                                </Button>
                            </OfflineHint>
                        )}
                        <OfflineHint active={!isOnline}>
                            <Button
                                variant={"filled"}
                                className={"flex-1"}
                                disabled={isBlocked || amountStr === ""}
                                onClick={save}
                            >
                                {m.action_save()}
                            </Button>
                        </OfflineHint>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

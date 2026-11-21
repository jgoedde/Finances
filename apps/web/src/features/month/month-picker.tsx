import { formatShortMonth } from "@finances/shared";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "@tanstack/react-router";
import ChevronLeft from "~icons/material-symbols/chevron-left-rounded";
import ChevronRight from "~icons/material-symbols/chevron-right-rounded";
import { addYears, setMonth, startOfMonth } from "date-fns";
import { Button } from "#/components/ui/button.tsx";
import { toMonthParam } from "#/features/month/month.ts";
import { isFuture } from "#/features/month/month-switcher-utils.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface MonthPickerProps {
    month: Date;
    to: "/" | "/transactions";

    /**
     * Any day in the year whose months are shown.
     */
    year: Date;
    onYearChange: Dispatch<SetStateAction<Date>>;
    onPick: VoidFunction;
}

/**
 * A year's months to pick from; months after the current one are disabled.
 */
export function MonthPicker({
    month,
    to,
    year,
    onYearChange,
    onPick,
}: MonthPickerProps) {
    return (
        <>
            <div className={"mb-2 flex items-center justify-between"}>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.month_previous_year()}
                    onClick={() => onYearChange((it) => addYears(it, -1))}
                >
                    <ChevronLeft />
                </Button>
                <span className={"text-title-medium text-on-surface"}>
                    {year.getFullYear()}
                </span>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.month_next_year()}
                    disabled={isFuture(
                        startOfMonth(setMonth(addYears(year, 1), 0)),
                    )}
                    onClick={() => onYearChange((it) => addYears(it, 1))}
                >
                    <ChevronRight />
                </Button>
            </div>
            <div className={"grid grid-cols-3 gap-1"}>
                {Array.from({ length: 12 }, (_, index) => {
                    const option = startOfMonth(setMonth(year, index));
                    const label = formatShortMonth(option, getLocale());
                    const isSelected = option.getTime() === month.getTime();
                    const className = cn(
                        `flex h-10 items-center justify-center rounded-full
                        text-label-large`,
                        isSelected
                            ? "bg-primary text-on-primary"
                            : "text-on-surface",
                    );

                    if (isFuture(option)) {
                        return (
                            <span
                                key={index}
                                className={cn(className, "text-on-surface/38")}
                            >
                                {label}
                            </span>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            to={to}
                            search={{ month: toMonthParam(option) }}
                            className={cn(className, "state-layer focus-ring")}
                            onClick={onPick}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </>
    );
}

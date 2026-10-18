import { formatMonthYear, formatShortMonth } from "@finances/shared";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, addYears, isAfter, setMonth, startOfMonth } from "date-fns";
import { Button } from "#/components/ui/button.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { toMonthParam, useSelectedMonth } from "#/features/month/month.ts";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

function isFuture(month: Date) {
    return isAfter(month, startOfMonth(new Date()));
}

interface MonthSwitcherProps {
    /** The destination showing the switcher. */
    to: "/" | "/transactions";
}

/**
 * `‹ October 2026 ›` for the top app bar. The title opens a month picker.
 * Months after the current one can't be selected. Picking a month goes to
 * `to`, the destination showing the switcher; other params carry over.
 */
export function MonthSwitcher({ to }: MonthSwitcherProps) {
    const month = useSelectedMonth();
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(month);

    const previous = addMonths(month, -1);
    const next = addMonths(month, 1);

    return (
        <div className={"flex min-w-0 items-center"}>
            <Button
                variant={"ghost"}
                size={"icon"}
                aria-label={m.month_previous()}
                asChild
            >
                <Link to={to} search={{ month: toMonthParam(previous) }}>
                    <ChevronLeft />
                </Link>
            </Button>

            <Popover
                open={isPickerOpen}
                onOpenChange={(open) => {
                    setIsPickerOpen(open);
                    setPickerYear(month);
                }}
            >
                <PopoverTrigger
                    className={`state-layer flex h-10 min-w-0 cursor-pointer
                        items-center gap-1 rounded-full px-3 text-title-large
                        text-on-surface focus-ring`}
                    aria-label={m.month_choose()}
                >
                    <span className={"truncate"}>
                        {formatMonthYear(month, getLocale())}
                    </span>
                    <ChevronDown
                        className={"size-5 shrink-0 text-on-surface-variant"}
                    />
                </PopoverTrigger>
                <PopoverContent className={"p-3"}>
                    <div className={"mb-2 flex items-center justify-between"}>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={m.month_previous_year()}
                            onClick={() =>
                                setPickerYear((year) => addYears(year, -1))
                            }
                        >
                            <ChevronLeft />
                        </Button>
                        <span className={"text-title-medium text-on-surface"}>
                            {pickerYear.getFullYear()}
                        </span>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            aria-label={m.month_next_year()}
                            disabled={isFuture(
                                startOfMonth(
                                    setMonth(addYears(pickerYear, 1), 0),
                                ),
                            )}
                            onClick={() =>
                                setPickerYear((year) => addYears(year, 1))
                            }
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                    <div className={"grid grid-cols-3 gap-1"}>
                        {Array.from({ length: 12 }, (_, index) => {
                            const option = startOfMonth(
                                setMonth(pickerYear, index),
                            );
                            const label = formatShortMonth(option, getLocale());
                            const isSelected =
                                option.getTime() === month.getTime();
                            const className = cn(
                                `flex h-10 items-center justify-center
                                rounded-full text-label-large`,
                                isSelected
                                    ? "bg-primary text-on-primary"
                                    : "text-on-surface",
                            );

                            if (isFuture(option)) {
                                return (
                                    <span
                                        key={index}
                                        className={cn(
                                            className,
                                            "text-on-surface/38",
                                        )}
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
                                    className={cn(
                                        className,
                                        "state-layer focus-ring",
                                    )}
                                    onClick={() => setIsPickerOpen(false)}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            {isFuture(next) ? (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.month_next()}
                    disabled
                >
                    <ChevronRight />
                </Button>
            ) : (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.month_next()}
                    asChild
                >
                    <Link to={to} search={{ month: toMonthParam(next) }}>
                        <ChevronRight />
                    </Link>
                </Button>
            )}
        </div>
    );
}

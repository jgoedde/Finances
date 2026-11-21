import { useState } from "react";
import CalendarIcon from "~icons/material-symbols/calendar-today-outline-rounded";
import CheckIcon from "~icons/material-symbols/check-rounded";
import { isToday, isYesterday, subDays } from "date-fns";
import { formatShortDate } from "@finances/shared";
import { Badge, FilterChip } from "#/components/ui/badge.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

const SELECTED_CHIP_CLASS_NAME =
    "border-transparent bg-secondary-container text-on-secondary-container";

interface DateChipsProps {
    date: Date;
    onChange: (date: Date) => void;

    /**
     * Shown below the chips, e.g. why they are disabled.
     */
    hint?: string;
    disabled?: boolean;
}

/**
 * The transaction's day as chips: today, yesterday, or any other day picked
 * in a calendar. Another day shows as its own selected chip.
 */
export function DateChips({
    date,
    onChange,
    hint,
    disabled = false,
}: DateChipsProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const isOtherDay = !isToday(date) && !isYesterday(date);

    return (
        <Field>
            <FieldLabel id={"date-label"}>{m.transaction_date()}</FieldLabel>
            <div
                role={"group"}
                aria-labelledby={"date-label"}
                className={"flex flex-wrap gap-2"}
            >
                {/* Tapping a selected chip keeps the date and its time. */}
                <FilterChip
                    disabled={disabled}
                    selected={isToday(date)}
                    className={cn(isToday(date) && SELECTED_CHIP_CLASS_NAME)}
                    onSelect={() => onChange(new Date())}
                >
                    {isToday(date) && <CheckIcon aria-hidden />}
                    {m.transaction_date_today()}
                </FilterChip>
                <FilterChip
                    disabled={disabled}
                    selected={isYesterday(date)}
                    className={cn(
                        isYesterday(date) && SELECTED_CHIP_CLASS_NAME,
                    )}
                    onSelect={() => onChange(subDays(new Date(), 1))}
                >
                    {isYesterday(date) && <CheckIcon aria-hidden />}
                    {m.transaction_date_yesterday()}
                </FilterChip>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Badge asChild variant={"md3"}>
                            <button
                                type={"button"}
                                disabled={disabled}
                                aria-pressed={isOtherDay}
                                className={cn(
                                    isOtherDay && SELECTED_CHIP_CLASS_NAME,
                                )}
                            >
                                {isOtherDay ? (
                                    <CheckIcon aria-hidden />
                                ) : (
                                    <CalendarIcon aria-hidden />
                                )}
                                {isOtherDay
                                    ? formatShortDate(date, getLocale())
                                    : m.transaction_choose_date()}
                            </button>
                        </Badge>
                    </PopoverTrigger>
                    <PopoverContent className={"w-auto p-0"} align={"start"}>
                        <Calendar
                            mode={"single"}
                            selected={date}
                            defaultMonth={date}
                            onSelect={(day) => {
                                // Tapping the selected day unselects it in
                                // the calendar; the date stays.
                                if (day) {
                                    onChange(day);
                                }
                                setIsCalendarOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            {hint !== undefined && <FieldDescription>{hint}</FieldDescription>}
        </Field>
    );
}

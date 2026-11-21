import { useState } from "react";
import CalendarIcon from "~icons/material-symbols/calendar-today-outline-rounded";
import { isToday, isYesterday, subDays } from "date-fns";
import { formatShortDate } from "@finances/shared";
import { FilterChip } from "#/components/ui/chip.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

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
                    onSelect={() => onChange(new Date())}
                >
                    {m.transaction_date_today()}
                </FilterChip>
                <FilterChip
                    disabled={disabled}
                    selected={isYesterday(date)}
                    onSelect={() => onChange(subDays(new Date(), 1))}
                >
                    {m.transaction_date_yesterday()}
                </FilterChip>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        {/* The trigger opens the calendar on every tap. */}
                        <FilterChip
                            disabled={disabled}
                            selected={isOtherDay}
                            icon={CalendarIcon}
                            onSelect={() => setIsCalendarOpen(true)}
                        >
                            {isOtherDay
                                ? formatShortDate(date, getLocale())
                                : m.transaction_choose_date()}
                        </FilterChip>
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

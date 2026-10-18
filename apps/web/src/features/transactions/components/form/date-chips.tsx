import { useState } from "react";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { isToday, isYesterday, subDays } from "date-fns";
import { formatShortDate } from "@finances/shared";
import { Badge } from "#/components/ui/badge.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import { Field, FieldLabel } from "#/components/ui/field.tsx";
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
}

/**
 * The transaction's day as chips: today, yesterday, or any other day picked
 * in a calendar. Another day shows as its own selected chip.
 */
export function DateChips({ date, onChange }: DateChipsProps) {
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
                <Badge asChild variant={"md3"}>
                    <button
                        type={"button"}
                        aria-pressed={isToday(date)}
                        className={cn(
                            isToday(date) && SELECTED_CHIP_CLASS_NAME,
                        )}
                        // Keeps the time of a date that already is today.
                        onClick={() => !isToday(date) && onChange(new Date())}
                    >
                        {isToday(date) && <CheckIcon aria-hidden />}
                        {m.transaction_date_today()}
                    </button>
                </Badge>
                <Badge asChild variant={"md3"}>
                    <button
                        type={"button"}
                        aria-pressed={isYesterday(date)}
                        className={cn(
                            isYesterday(date) && SELECTED_CHIP_CLASS_NAME,
                        )}
                        onClick={() =>
                            !isYesterday(date) &&
                            onChange(subDays(new Date(), 1))
                        }
                    >
                        {isYesterday(date) && <CheckIcon aria-hidden />}
                        {m.transaction_date_yesterday()}
                    </button>
                </Badge>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Badge asChild variant={"md3"}>
                            <button
                                type={"button"}
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
        </Field>
    );
}

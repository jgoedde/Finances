import { formatLongDate } from "@finances/shared";
import ChevronDownIcon from "~icons/material-symbols/keyboard-arrow-down-rounded";
import { Button } from "#/components/ui/button.tsx";
import { Calendar } from "#/components/ui/calendar.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";

interface DatePickerButtonProps {
    id: string;
    value: Date | undefined;
    onSelect: (day: Date | undefined) => void;

    /**
     * Shown without a value.
     */
    placeholder?: string;
}

/**
 * A date picked from a calendar popover; the trigger is styled like an MD3
 * outlined text field.
 */
export function DatePickerButton({
    id,
    value,
    onSelect,
    placeholder,
}: DatePickerButtonProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"ghost"}
                    shape={"square"}
                    data-empty={!value}
                    className={cn(
                        `border-outline text-on-surface text-body-large
                        hover:border-on-surface h-14 w-full justify-between
                        rounded-xs border px-4 text-left
                        [&_svg]:text-on-surface-variant`,
                        "data-[empty=true]:text-on-surface-variant",
                    )}
                >
                    {value ? (
                        formatLongDate(value, getLocale())
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-auto p-0"} align={"start"}>
                <Calendar
                    mode={"single"}
                    selected={value}
                    onSelect={onSelect}
                    defaultMonth={value}
                />
            </PopoverContent>
        </Popover>
    );
}

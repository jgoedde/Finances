import * as React from "react";
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import {
    type DayButton,
    DayPicker,
    getDefaultClassNames,
} from "react-day-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn.ts";

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                `bg-surface-container-high group/calendar p-3
                [--cell-size:--spacing(10)]
                [[data-slot=card-content]_&]:bg-transparent
                [[data-slot=popover-content]_&]:bg-transparent`,
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className,
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString("default", { month: "short" }),
                ...formatters,
            }}
            classNames={{
                root: cn("w-fit", defaultClassNames.root),
                months: cn(
                    "flex gap-4 flex-col md:flex-row relative",
                    defaultClassNames.months,
                ),
                month: cn(
                    "flex flex-col w-full gap-4",
                    defaultClassNames.month,
                ),
                nav: cn(
                    "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
                    defaultClassNames.nav,
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "size-(--cell-size) aria-disabled:opacity-38 p-0 select-none",
                    defaultClassNames.button_previous,
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    "size-(--cell-size) aria-disabled:opacity-38 p-0 select-none",
                    defaultClassNames.button_next,
                ),
                month_caption: cn(
                    "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
                    defaultClassNames.month_caption,
                ),
                dropdowns: cn(
                    "w-full flex items-center text-title-small justify-center h-(--cell-size) gap-1.5",
                    defaultClassNames.dropdowns,
                ),
                dropdown_root: cn(
                    "relative border border-outline has-focus:border-2 has-focus:border-primary rounded-xs",
                    defaultClassNames.dropdown_root,
                ),
                dropdown: cn(
                    "absolute bg-surface-container inset-0 opacity-0",
                    defaultClassNames.dropdown,
                ),
                caption_label: cn(
                    "select-none text-title-small text-on-surface-variant",
                    captionLayout === "label"
                        ? ""
                        : "rounded-full pl-2 pr-1 flex items-center gap-1 h-8 [&>svg]:text-on-surface-variant [&>svg]:size-[18px]",
                    defaultClassNames.caption_label,
                ),
                month_grid: "w-full border-collapse",
                weekdays: cn("flex", defaultClassNames.weekdays),
                weekday: cn(
                    "text-on-surface rounded-full flex-1 text-body-large select-none",
                    defaultClassNames.weekday,
                ),
                week: cn("flex w-full mt-2", defaultClassNames.week),
                week_number_header: cn(
                    "select-none w-(--cell-size)",
                    defaultClassNames.week_number_header,
                ),
                week_number: cn(
                    "text-body-small select-none text-on-surface-variant",
                    defaultClassNames.week_number,
                ),
                day: cn(
                    "relative w-full h-full p-0 text-center group/day aspect-square select-none",
                    defaultClassNames.day,
                ),
                range_start: cn(
                    "rounded-l-full bg-secondary-container",
                    defaultClassNames.range_start,
                ),
                range_middle: cn(
                    "rounded-none",
                    defaultClassNames.range_middle,
                ),
                range_end: cn(
                    "rounded-r-full bg-secondary-container",
                    defaultClassNames.range_end,
                ),
                today: cn(
                    "[&>button]:border [&>button]:border-primary [&>button]:text-primary",
                    defaultClassNames.today,
                ),
                outside: cn(
                    "text-on-surface-variant aria-selected:text-on-surface-variant",
                    defaultClassNames.outside,
                ),
                disabled: cn(
                    "text-on-surface opacity-38",
                    defaultClassNames.disabled,
                ),
                hidden: cn("invisible", defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    );
                },
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === "left") {
                        return (
                            <ChevronLeftIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        );
                    }

                    if (orientation === "right") {
                        return (
                            <ChevronRightIcon
                                className={cn("size-4", className)}
                                {...props}
                            />
                        );
                    }

                    return (
                        <ChevronDownIcon
                            className={cn("size-4", className)}
                            {...props}
                        />
                    );
                },
                DayButton: CalendarDayButton,
                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div
                                className="flex size-(--cell-size) items-center
                                    justify-center text-center"
                            >
                                {children}
                            </div>
                        </td>
                    );
                },
                ...components,
            }}
            {...props}
        />
    );
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    ...props
}: React.ComponentProps<typeof DayButton>) {
    const defaultClassNames = getDefaultClassNames();

    const ref = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
        if (modifiers.focused) ref.current?.focus();
    }, [modifiers.focused]);

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            data-day={day.date.toLocaleDateString()}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                `text-on-surface text-body-large
                data-[selected-single=true]:bg-primary
                data-[selected-single=true]:text-on-primary
                data-[range-middle=true]:text-on-secondary-container
                data-[range-start=true]:bg-primary
                data-[range-start=true]:text-on-primary
                data-[range-end=true]:bg-primary
                data-[range-end=true]:text-on-primary [&>span]:text-label-small
                flex aspect-square size-auto w-full min-w-(--cell-size) flex-col
                gap-1 rounded-full leading-none
                group-data-[focused=true]/day:relative
                group-data-[focused=true]/day:z-10
                data-[range-middle=true]:rounded-none [&>span]:opacity-70`,
                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    );
}

export { Calendar, CalendarDayButton };

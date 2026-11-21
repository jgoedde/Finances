import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { addMonths } from "date-fns";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "#/components/ui/popover.tsx";
import { toMonthParam, useSelectedMonth } from "#/features/month/month.ts";
import { isFuture } from "#/features/month/month-switcher-utils.ts";
import { useMonthSwipe } from "#/features/month/use-month-swipe.ts";
import { MonthTitle } from "#/features/month/month-title.tsx";
import { MonthChevron } from "#/features/month/month-chevron.tsx";
import { MonthPicker } from "#/features/month/month-picker.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

interface MonthSwitcherProps {
    /**
     * The destination showing the switcher.
     */
    to: "/" | "/transactions";
}

/**
 * `‹ October 2026 ›` for the top app bar. The title opens a month picker and
 * can be swiped (touch only) to the previous or next month, one month at a
 * time: the track only holds the neighbours and re-centres on the selected
 * month after every change. The chevrons slide the title too. On touch the
 * chevrons are hidden and the title peeks until the first swipe. Months after
 * the current one can't be selected. Picking a month goes to `to`, the destination
 * showing the switcher; other params carry over.
 */
export function MonthSwitcher({ to }: MonthSwitcherProps) {
    const month = useSelectedMonth();

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerYear, setPickerYear] = useState(month);

    const navigate = useNavigate();

    const previous = addMonths(month, -1);
    const next = addMonths(month, 1);

    // No slide after the current month.
    const hasNext = !isFuture(next);
    const slides = hasNext ? [previous, month, next] : [previous, month];

    // The peek plays once per mount, so slides added later don't replay it.
    const [hasPeeked, setHasPeeked] = useState(false);

    const { trackRef, hasSwiped, onScrollEnd, onChevronClick } = useMonthSwipe({
        month,
        slides,
        goTo: (target) => {
            void navigate({ to, search: { month: toMonthParam(target) } });
        },
    });

    return (
        <div className={"flex min-w-0 items-center"}>
            <MonthChevron
                direction={"previous"}
                to={to}
                target={previous}
                onClick={onChevronClick}
            />

            <Popover
                open={isPickerOpen}
                onOpenChange={(open) => {
                    setIsPickerOpen(open);
                    setPickerYear(month);
                }}
            >
                <div
                    ref={trackRef}
                    className={cn(
                        `flex w-56 min-w-0 shrink snap-x snap-mandatory
                        scrollbar-none overflow-x-auto overscroll-x-contain`,
                        !hasSwiped &&
                            !hasPeeked &&
                            "pointer-coarse:motion-safe:*:animate-month-peek",
                    )}
                    onScrollEnd={onScrollEnd}
                    onAnimationEnd={() => setHasPeeked(true)}
                >
                    {slides.map((slide) => (
                        <div
                            key={slide.getTime()}
                            className={
                                "w-full shrink-0 snap-center snap-always"
                            }
                        >
                            {slide.getTime() === month.getTime() ? (
                                <PopoverTrigger
                                    className={`state-layer flex h-10 w-full
                                        min-w-0 cursor-pointer items-center
                                        justify-center gap-1 rounded-full px-3
                                        text-title-large text-on-surface
                                        focus-ring`}
                                    aria-label={m.month_choose()}
                                >
                                    <MonthTitle month={month} />
                                </PopoverTrigger>
                            ) : (
                                <div
                                    className={`flex h-10 w-full min-w-0
                                        items-center justify-center gap-1
                                        rounded-full px-3 text-title-large
                                        text-on-surface`}
                                    aria-hidden
                                >
                                    <MonthTitle month={slide} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <PopoverContent className={"p-3"}>
                    <MonthPicker
                        month={month}
                        to={to}
                        year={pickerYear}
                        onYearChange={setPickerYear}
                        onPick={() => setIsPickerOpen(false)}
                    />
                </PopoverContent>
            </Popover>

            <MonthChevron
                direction={"next"}
                to={to}
                target={next}
                disabled={!hasNext}
                onClick={onChevronClick}
            />
        </div>
    );
}

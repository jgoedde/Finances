import { formatMonthYear, formatShortMonth } from "@finances/shared";
import { useLocalStorage } from "@mantine/hooks";
import { type MouseEvent, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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

// Set after the first swipe; until then the title peeks to hint at swiping.
const SWIPED_KEY = "finances-month-swiped";

/**
 * The title's label and dropdown arrow, shared by the picker trigger and the
 * other months it swipes to.
 */
function titleContent(month: Date) {
    return (
        <>
            <span className={"truncate"}>
                {formatMonthYear(month, getLocale())}
            </span>
            <ChevronDown
                className={"size-5 shrink-0 text-on-surface-variant"}
            />
        </>
    );
}

interface MonthSwitcherProps {
    /**
     * The destination showing the switcher.
     */
    to: "/" | "/transactions";
}

// The selected month's slide; the previous month always comes before it.
const SELECTED_INDEX = 1;

/**
 * Whether a click should open the link the browser's way (new tab, window…)
 * instead of sliding to the month. `Link` checks the same, but only after our
 * `onClick` has run.
 */
function isModifiedClick(event: MouseEvent) {
    return (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    );
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

    const trackRef = useRef<HTMLDivElement>(null);
    const [hasSwiped, setHasSwiped] = useLocalStorage({
        key: SWIPED_KEY,
        defaultValue: false,
    });

    const navigate = useNavigate();

    const previous = addMonths(month, -1);
    const next = addMonths(month, 1);

    // No slide after the current month.
    const hasNext = !isFuture(next);
    const slides = hasNext ? [previous, month, next] : [previous, month];

    // The peek plays once per mount, so slides added later don't replay it.
    const [hasPeeked, setHasPeeked] = useState(false);

    // Set while a chevron slides the title, so it doesn't count as a swipe.
    const isChevronSlideRef = useRef(false);

    // Re-centre on the selected month after every change (swipe, chevrons,
    // picker, history) and on mount, before paint.
    const monthTime = month.getTime();
    useLayoutEffect(() => {
        const track = trackRef.current;
        if (track) {
            track.scrollTo({
                left: SELECTED_INDEX * track.clientWidth,
                behavior: "instant",
            });
        }
    }, [monthTime]);

    function goTo(target: Date) {
        void navigate({ to, search: { month: toMonthParam(target) } });
    }

    // Swiping, or a chevron's slide, goes to the month once its slide has
    // snapped into place.
    function onScrollEnd() {
        const track = trackRef.current;
        if (!track) {
            return;
        }
        const target = slides[Math.round(track.scrollLeft / track.clientWidth)];
        const isSliding = isChevronSlideRef.current;
        isChevronSlideRef.current = false;
        if (target && target.getTime() !== monthTime) {
            if (!isSliding) {
                setHasSwiped(true);
            }
            goTo(target);
        }
    }

    // A chevron slides the title to the neighbour; `onScrollEnd` then goes
    // there. Without `scrollend` support it goes there right away.
    function onChevronClick(event: MouseEvent, target: Date) {
        const track = trackRef.current;
        if (!track || isModifiedClick(event)) {
            return;
        }
        event.preventDefault();
        if (!("onscrollend" in window)) {
            goTo(target);
            return;
        }
        isChevronSlideRef.current = true;
        track.scrollTo({
            left: slides.indexOf(target) * track.clientWidth,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
        });
    }

    return (
        <div className={"flex min-w-0 items-center"}>
            <Button
                variant={"ghost"}
                size={"icon"}
                className={"pointer-coarse:hidden"}
                aria-label={m.month_previous()}
                asChild
            >
                <Link
                    to={to}
                    search={{ month: toMonthParam(previous) }}
                    onClick={(event) => onChevronClick(event, previous)}
                >
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
                                    {titleContent(month)}
                                </PopoverTrigger>
                            ) : (
                                <div
                                    className={`flex h-10 w-full min-w-0
                                        items-center justify-center gap-1
                                        rounded-full px-3 text-title-large
                                        text-on-surface`}
                                    aria-hidden
                                >
                                    {titleContent(slide)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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

            {!hasNext ? (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"pointer-coarse:hidden"}
                    aria-label={m.month_next()}
                    disabled
                >
                    <ChevronRight />
                </Button>
            ) : (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"pointer-coarse:hidden"}
                    aria-label={m.month_next()}
                    asChild
                >
                    <Link
                        to={to}
                        search={{ month: toMonthParam(next) }}
                        onClick={(event) => onChevronClick(event, next)}
                    >
                        <ChevronRight />
                    </Link>
                </Button>
            )}
        </div>
    );
}

import { type MouseEvent, useLayoutEffect, useRef } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { isModifiedClick } from "#/features/month/month-switcher-utils.ts";
import * as haptics from "#/lib/haptics.ts";

// Set after the first swipe; until then the title peeks to hint at swiping.
const SWIPED_KEY = "finances-month-swiped";

// The selected month's slide; the previous month always comes before it.
const SELECTED_INDEX = 1;

interface MonthSwipeOptions {
    month: Date;

    /**
     * The months on the track: the previous one, the selected one and, if
     * selectable, the next one.
     */
    slides: Date[];
    goTo: (month: Date) => void;
}

/**
 * The swipeable track of months: re-centres on the selected month, goes to
 * the month a swipe or a chevron's slide snaps to, and remembers the first
 * swipe.
 */
export function useMonthSwipe({ month, slides, goTo }: MonthSwipeOptions) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [hasSwiped, setHasSwiped] = useLocalStorage({
        key: SWIPED_KEY,
        defaultValue: false,
    });

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
                // A chevron click is already a tap; only a swipe ticks.
                haptics.tick();
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

    return { trackRef, hasSwiped, onScrollEnd, onChevronClick };
}

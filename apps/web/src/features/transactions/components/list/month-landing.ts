import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { addDays, startOfDay } from "date-fns";
import { toMonthParam } from "#/features/month/month.ts";

/**
 * Where "Show in month" lands in the month list: a day's section or the
 * upcoming section, with the transactions to highlight there. Travels in
 * the router's history state, so a reload or a shared link doesn't
 * highlight again.
 */
export interface MonthLanding {
    /**
     * The day's start in milliseconds, or the upcoming section.
     */
    anchor: number | "upcoming";
    ids: string[];
}

// How long the landing's transactions stay highlighted (see the
// `highlight-fade` animation in globals.css).
const HIGHLIGHT_MS = 2000;

/**
 * Opens the month list of `day`'s month, scrolled to that day with
 * `ids` highlighted. Upcoming days open the current month, whose upcoming
 * section lists them.
 */
export function useShowInMonth(): (day: Date, ids: string[]) => void {
    const navigate = useNavigate();
    return (day, ids) => {
        const isUpcoming =
            day.getTime() >= startOfDay(addDays(new Date(), 1)).getTime();
        const landing: MonthLanding = {
            anchor: isUpcoming ? "upcoming" : startOfDay(day).getTime(),
            ids,
        };
        void navigate({
            to: "/transactions",
            search: {
                month: isUpcoming ? undefined : toMonthParam(day),
                q: undefined,
                older: undefined,
                category: undefined,
            },
            state: (state) => ({ ...state, monthLanding: landing }),
            // The month list scrolls to the landing itself.
            resetScroll: false,
        });
    };
}

/**
 * The landing the month list was opened with. Once `isReady` (its data is
 * there), scrolls the landing's section right under the search bar and
 * returns the ids to highlight until the highlight has faded.
 */
export function useMonthLanding(isReady: boolean): ReadonlySet<string> {
    const navigate = useNavigate();
    const initial = useLocation({ select: (it) => it.state.monthLanding });
    // The list mounts when the landing navigation leaves the search.
    const [landing, setLanding] = useState(initial);

    useEffect(() => {
        if (initial === undefined) {
            return;
        }
        // Drop it from the history entry, so a reload doesn't land again.
        // A navigation, not `history.replace`, so the router keeps the
        // scroll position.
        void navigate({
            to: ".",
            search: (search) => search,
            state: (state) => ({ ...state, monthLanding: undefined }),
            replace: true,
            resetScroll: false,
        });
    }, [initial, navigate]);

    useEffect(() => {
        if (landing === undefined) {
            return;
        }
        const section = isReady
            ? document.querySelector(
                  `[data-landing-anchor="${String(landing.anchor)}"]`,
              )
            : null;
        if (section) {
            section.scrollIntoView({ block: "start" });
        } else {
            window.scrollTo({ top: 0 });
        }
        if (!isReady) {
            return;
        }
        const timer = setTimeout(() => setLanding(undefined), HIGHLIGHT_MS);
        return () => clearTimeout(timer);
    }, [landing, isReady]);

    // Only once the list is there, so the fade and the timer start together.
    return new Set(isReady ? landing?.ids : undefined);
}

import type { ReactNode } from "react";
import {
    CalendarDays,
    Coins,
    Repeat2,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import {
    formatCurrency,
    formatPercent,
    formatWeekday,
    type Pattern,
} from "@finances/shared";
import { m } from "#/paraglide/messages.js";

/**
 * How a pattern is shown; `link` opens the transactions behind it.
 */
interface PatternView<P extends Pattern> {
    icon: (pattern: P) => ReactNode;
    text: (pattern: P, locale: string) => string;
    link: (pattern: P) => { category?: string; q?: string } | null;
}

/**
 * One view per kind of pattern; a new kind fails to compile until it has one.
 */
const PATTERN_VIEWS: {
    [K in Pattern["kind"]]: PatternView<Extract<Pattern, { kind: K }>>;
} = {
    categoryDrift: {
        icon: ({ change }) => (change > 0 ? <TrendingUp /> : <TrendingDown />),
        text: ({ category, change }, locale) =>
            m.pattern_drift({
                category: category.categoryName,
                change: formatPercent(change, locale, { signed: true }),
            }),
        link: ({ category }) => ({ category: category.categoryId }),
    },
    weekdayRhythm: {
        icon: () => <CalendarDays />,
        text: ({ category, share, firstWeekday, lastWeekday }, locale) =>
            m.pattern_rhythm({
                share: formatPercent(share, locale),
                category: category.categoryName,
                first: formatWeekday(firstWeekday, locale),
                last: formatWeekday(lastWeekday, locale),
            }),
        link: ({ category }) => ({ category: category.categoryId }),
    },
    recurringName: {
        icon: () => <Repeat2 />,
        text: ({ name, count, average }, locale) =>
            m.pattern_recurring({
                name,
                count,
                average: formatCurrency(average, locale),
            }),
        link: ({ name }) => ({ q: name }),
    },
    smallPurchases: {
        icon: () => <Coins />,
        text: ({ count, limit, total, topName }, locale) => {
            const values = {
                count,
                limit: formatCurrency(limit, locale),
                total: formatCurrency(total, locale),
            };
            return topName
                ? m.pattern_small_top({ ...values, name: topName })
                : m.pattern_small(values);
        },
        link: () => null,
    },
};

/**
 * The view for a pattern of any kind.
 */
export function viewOf(pattern: Pattern): PatternView<Pattern> {
    // TypeScript can't relate `pattern.kind` to the view's parameter type;
    // the table above checks each view against its own kind.
    return PATTERN_VIEWS[pattern.kind] as PatternView<Pattern>;
}

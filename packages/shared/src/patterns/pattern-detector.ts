import type { DatedTransaction } from "../spending.ts";

export interface PatternCategory {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
}

/**
 * What every detector looks at: expenses without exceptional transactions,
 * in the window and in the window before it.
 */
export interface PatternContext {
    current: DatedTransaction[];

    /**
     * Days the current window covers; a month in progress counts up to today.
     */
    currentDays: number;
    previous: DatedTransaction[];
    previousDays: number;
    category: (id: string) => PatternCategory | undefined;
}

/**
 * Finds one kind of pattern. Stays silent below its own thresholds, so
 * little data means no patterns.
 */
export interface PatternDetector<P extends { kind: string }> {
    detect: (context: PatternContext) => P[];
}

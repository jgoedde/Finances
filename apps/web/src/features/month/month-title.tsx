import { formatMonthYear } from "@finances/shared";
import ChevronDown from "~icons/material-symbols/keyboard-arrow-down-rounded";
import { getLocale } from "#/paraglide/runtime.js";

/**
 * The title's label and dropdown arrow, shared by the picker trigger and the
 * other months it swipes to.
 */
export function MonthTitle({ month }: { month: Date }) {
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

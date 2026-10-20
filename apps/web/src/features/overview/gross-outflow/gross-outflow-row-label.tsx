import type { CSSProperties } from "react";
import { formatCurrency, formatPercent } from "@finances/shared";
import { getLocale } from "#/paraglide/runtime.js";

interface GrossOutflowRowLabelProps {
    name: string;
    total: number;
    share: number;

    /**
     * Tone of the dot (see `ranked-tone`); no dot without it.
     */
    toneStyle?: CSSProperties;
}

/**
 * Dot, name, amount and share of a row in the gross outflow list. Long
 * names are truncated and shown in full on hover.
 */
export function GrossOutflowRowLabel({
    name,
    total,
    share,
    toneStyle,
}: GrossOutflowRowLabelProps) {
    return (
        <>
            {toneStyle && (
                <span
                    aria-hidden
                    className={
                        "size-3 shrink-0 rounded-full bg-(--tone) ranked-tone"
                    }
                    style={toneStyle}
                />
            )}
            <span
                title={name}
                className={
                    "min-w-0 grow truncate text-body-large text-on-surface"
                }
            >
                {name}
            </span>
            <span className={"shrink-0 text-label-large text-on-surface"}>
                {formatCurrency(total, getLocale())}
                <span className={"text-on-surface-variant"}>
                    {` · ${formatPercent(share, getLocale())}`}
                </span>
            </span>
        </>
    );
}

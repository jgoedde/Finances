import type { CSSProperties } from "react";
import {
    argbFromHex,
    hexFromArgb,
    TonalPalette,
} from "@material/material-color-utilities";

export function convertHexToTonal(
    inputColorHex: string,
    tone: { light: number; dark: number } = { light: 90, dark: 40 },
) {
    const argb = argbFromHex(inputColorHex);

    const tonalPalette = TonalPalette.fromInt(argb);

    const containerLight = hexFromArgb(tonalPalette.tone(tone.light));
    const onContainerLight = hexFromArgb(tonalPalette.tone(tone.dark));

    const containerDark = hexFromArgb(tonalPalette.tone(tone.dark));
    const onContainerDark = hexFromArgb(tonalPalette.tone(tone.light));

    return {
        light: {
            container: containerLight,
            onContainer: onContainerLight,
        },
        dark: {
            container: containerDark,
            onContainer: onContainerDark,
        },
    };
}

/**
 * The light scheme's primary (`--md-sys-color-primary`); its tonal palette
 * is the primary palette of both schemes.
 */
const PRIMARY_PALETTE = TonalPalette.fromInt(argbFromHex("#465d91"));

/**
 * Tones of the largest and the smallest rank: the darkest step on light
 * surfaces, the lightest step on dark ones.
 */
const RANK_TONES = {
    light: { first: 35, last: 85 },
    dark: { first: 85, last: 35 },
} as const;

/**
 * A tonal step of the primary palette for the `rank`-th (0 = largest) of
 * `count` ranked entries, plus a readable content color on it. Fades from
 * strong to weak with the rank. Apply the `ranked-tone` utility with this
 * style, then use `bg-(--tone)`/`fill-(--tone)` and `text-(--on-tone)`.
 */
export function getRankedToneStyle(rank: number, count: number): CSSProperties {
    const position = count > 1 ? rank / (count - 1) : 0;
    const tone = (scheme: keyof typeof RANK_TONES) => {
        const { first, last } = RANK_TONES[scheme];
        return Math.round(first + (last - first) * position);
    };
    const hex = (tone: number) => hexFromArgb(PRIMARY_PALETTE.tone(tone));
    // MD3 pairs light tones with tone 10 content and dark ones with 100.
    const onHex = (tone: number) => hex(tone >= 60 ? 10 : 100);

    return {
        "--tone-light": hex(tone("light")),
        "--on-tone-light": onHex(tone("light")),
        "--tone-dark": hex(tone("dark")),
        "--on-tone-dark": onHex(tone("dark")),
    } as CSSProperties;
}

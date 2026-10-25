import type { CSSProperties } from "react";
import {
    argbFromHex,
    hexFromArgb,
    TonalPalette,
} from "@material/material-color-utilities";

/**
 * Chroma of hue colors: vivid enough to tell hues apart, muted enough for
 * containers.
 */
const HUE_CHROMA = 48;

export function paletteFromHex(hex: string): TonalPalette {
    return TonalPalette.fromInt(argbFromHex(hex));
}

export function paletteFromHue(hue: number): TonalPalette {
    return TonalPalette.fromHueAndChroma(hue, HUE_CHROMA);
}

/**
 * A palette's tone and the content tone on it, per scheme: tone 70 on light
 * surfaces (tone 90 containers barely stand out from them), 40 on dark ones.
 * Apply the `tone` utility with this style, then use
 * `bg-(--tone)`/`fill-(--tone)` and `text-(--on-tone)`.
 */
export function toneStyle(palette: TonalPalette): CSSProperties {
    const hex = (tone: number) => hexFromArgb(palette.tone(tone));

    return {
        "--tone-light": hex(70),
        "--on-tone-light": hex(10),
        "--tone-dark": hex(40),
        "--on-tone-dark": hex(90),
    } as CSSProperties;
}

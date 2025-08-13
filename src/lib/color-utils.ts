import {
    argbFromHex,
    hexFromArgb,
    TonalPalette,
} from "@material/material-color-utilities";
import { useColorScheme } from "@mantine/hooks";

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

export function useTonalColor(
    inputColorHex: string,
    tone: { dark: number; light: number },
) {
    const theme = useColorScheme();
    const isDark = theme === "dark";
    const argb = argbFromHex(inputColorHex);
    const tonalPalette = TonalPalette.fromInt(argb);

    return hexFromArgb(tonalPalette.tone(isDark ? tone.dark : tone.light));
}

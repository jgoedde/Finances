import {
    argbFromHex,
    hexFromArgb,
    TonalPalette,
} from "@material/material-color-utilities";

export function convertHexToTonal(inputColorHex: string) {
    const argb = argbFromHex(inputColorHex);

    const tonalPalette = TonalPalette.fromInt(argb);

    const containerLight = hexFromArgb(tonalPalette.tone(90));
    const onContainerLight = hexFromArgb(tonalPalette.tone(40));

    const containerDark = hexFromArgb(tonalPalette.tone(30));
    const onContainerDark = hexFromArgb(tonalPalette.tone(90));

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

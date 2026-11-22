import { useEffect } from "react";
import { useColorScheme } from "@mantine/hooks";

type SurfaceRole = "surface" | "surface-container";

/**
 * Sets the browser's theme color (status bar, title bar of the installed app)
 * to an MD3 surface role of the active color scheme while mounted. Falls back
 * to the static `theme-color` metas in `index.html` once unmounted.
 */
export function useThemeColor(role: SurfaceRole) {
    // The ThemeProvider switches the scheme class in a layout effect, which
    // runs before this effect, so the CSS variable below is already current.
    const scheme = useColorScheme();

    useEffect(() => {
        const color = getComputedStyle(document.documentElement)
            .getPropertyValue(`--md-sys-color-${role}`)
            .trim();
        if (!color) {
            return;
        }

        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = color;
        // The first matching theme-color meta wins, so this one must come
        // before the static ones with a media query.
        document.head.prepend(meta);

        return () => meta.remove();
    }, [role, scheme]);
}

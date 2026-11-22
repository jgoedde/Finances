import { type ReactNode, useLayoutEffect } from "react";
import { useColorScheme } from "@mantine/hooks";

type Props = {
    children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
    const theme = useColorScheme();

    // A layout effect, so effects that read the scheme's CSS variables
    // (useThemeColor) see the new class.
    useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        root.classList.add(theme);
    }, [theme]);

    return children;
}

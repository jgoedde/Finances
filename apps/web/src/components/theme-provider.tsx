import { type ReactNode, useEffect } from "react";
import { useColorScheme } from "@mantine/hooks";

type Props = {
    children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
    const theme = useColorScheme();

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        root.classList.add(theme);
    }, [theme]);

    return children;
}

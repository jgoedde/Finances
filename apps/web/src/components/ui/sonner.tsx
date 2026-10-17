import { Toaster as Sonner, type ToasterProps } from "sonner";
import type { CSSProperties } from "react";
import { useColorScheme } from "@mantine/hooks";

// Styled as MD3 snackbar (https://m3.material.io/components/snackbar/specs).
const Toaster = ({ ...props }: ToasterProps) => {
    const theme = useColorScheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--color-inverse-surface)",
                    "--normal-text": "var(--color-inverse-on-surface)",
                    "--normal-border": "transparent",
                } as CSSProperties
            }
            mobileOffset={{ bottom: "96px" }}
            toastOptions={{
                classNames: {
                    toast: "!rounded-xs !min-h-12 !shadow-elevation-3 !py-3.5 !px-4",
                    title: "!text-inverse-on-surface !text-body-medium",
                    actionButton:
                        "!bg-transparent !text-inverse-primary !text-label-large !h-10 !px-3 !rounded-full",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

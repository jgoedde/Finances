import { Toaster as Sonner, type ToasterProps } from "sonner";
import type { CSSProperties } from "react";
import { useColorScheme } from "@mantine/hooks";

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
                    "--normal-border": "var(--border)",
                } as CSSProperties
            }
            mobileOffset={{ bottom: "96px" }}
            toastOptions={{
                classNames: {
                    toast: "!rounded-sm !h-12",
                    title: "!text-inverse-on-surface !font-normal",
                    actionButton:
                        "!bg-transparent !text-inverse-primary !font-medium",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

import { Banknote } from "lucide-react";
import { useRipple } from "#/hooks/use-ripple.ts";
import { useIsScrolled } from "#/hooks/use-is-scrolled.ts";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

const VARIANT_CLASS = {
    // Compact only: floats above the navigation bar (see below). Like
    // Gmail's "Compose", it shows a label until the page is scrolled.
    floating: `flex h-14 items-center px-4 text-label-large shadow-elevation-3
        hover:shadow-elevation-4`,
    // At the top of the navigation rail.
    rail: "size-14 hover:shadow-elevation-1",
    // At the top of the navigation drawer, like Gmail's "Compose".
    extended: `flex h-14 items-center gap-3 px-4 text-label-large
        hover:shadow-elevation-1`,
} as const;

interface NewTransactionFABProps {
    variant: keyof typeof VARIANT_CLASS;
}

export function NewTransactionFAB({ variant }: NewTransactionFABProps) {
    const ripple = useRipple();

    const navigate = useNavigate();

    const isScrolled = useIsScrolled();

    const button = (
        <button
            type={"button"}
            className={cn(
                `ripple-container state-layer shrink-0 cursor-pointer rounded-lg
                bg-primary-container text-on-primary-container focus-ring
                transition-shadow duration-200 ease-standard`,
                VARIANT_CLASS[variant],
            )}
            aria-label={
                variant === "extended" ? undefined : m.transaction_new()
            }
            data-ripple-color="bg-on-surface/10"
            {...ripple}
            onClick={(e) => {
                ripple.onClick(e);

                setTimeout(() => {
                    void navigate({ to: "/new" });
                }, 100);
            }}
        >
            <Banknote
                className={cn(
                    "size-6 shrink-0",
                    variant === "rail" && "mx-auto",
                )}
            />
            {variant === "extended" && m.transaction_new()}
            {variant === "floating" && (
                <span
                    aria-hidden={true}
                    className={cn(
                        `overflow-hidden whitespace-nowrap
                        transition-[max-width,margin,opacity] duration-200
                        ease-standard`,
                        isScrolled
                            ? "ml-0 max-w-0 opacity-0"
                            : "ml-3 max-w-40 opacity-100",
                    )}
                >
                    {m.transaction_fab()}
                </span>
            )}
        </button>
    );

    // `state-layer` makes the button `relative`, so a wrapper floats it.
    return variant === "floating" ? (
        <div
            className={`fixed right-4
                bottom-[calc(6rem+env(safe-area-inset-bottom))] z-20
                medium:hidden`}
        >
            {button}
        </div>
    ) : (
        button
    );
}

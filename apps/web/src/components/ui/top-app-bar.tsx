import type { ReactNode } from "react";
import { useWindowScroll } from "@mantine/hooks";
import { BackArrowButton } from "#/components/ui/back-arrow-button.tsx";
import { cn } from "#/lib/cn.ts";

interface Props {
    title: ReactNode;
    /** Show the back arrow. Off on top-level destinations. */
    back?: boolean;
    /** Trailing action items (icon buttons or a single text button). */
    actions?: ReactNode;
    className?: string;
}

/**
 * MD3 small top app bar (https://m3.material.io/components/top-app-bar/specs)
 * with an optional back navigation icon. Switches from surface to surface-container
 * once content scrolls beneath it.
 */
export function TopAppBar({ title, back = true, actions, className }: Props) {
    const [scroll] = useWindowScroll();
    const isScrolled = scroll.y > 0;

    return (
        <header
            className={cn(
                `sticky top-0 z-10 flex h-16 w-full shrink-0 items-center gap-1
                transition-colors duration-200 ease-standard`,
                isScrolled ? "bg-surface-container" : "bg-surface",
                !back && "pl-4",
                className,
            )}
        >
            {back && <BackArrowButton />}
            <h1
                className={
                    "min-w-0 grow truncate text-title-large text-on-surface"
                }
            >
                {title}
            </h1>
            {actions && (
                <div className={"mr-1 flex items-center gap-1"}>{actions}</div>
            )}
        </header>
    );
}

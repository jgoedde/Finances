import type { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

/**
 * Explains why a control is disabled while offline. Wraps it in a focusable
 * span because disabled elements don't fire the events tooltips need.
 */
export function OfflineHint({
    active,
    children,
}: {
    /** Usually `!isOnline`. */
    active: boolean;
    children: ReactNode;
}) {
    if (!active) {
        return children;
    }
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span tabIndex={0} className={"inline-flex"}>
                    {children}
                </span>
            </TooltipTrigger>
            <TooltipContent>Offline nicht verfügbar</TooltipContent>
        </Tooltip>
    );
}

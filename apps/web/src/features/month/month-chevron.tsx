import type { MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import ChevronLeft from "~icons/material-symbols/chevron-left-rounded";
import ChevronRight from "~icons/material-symbols/chevron-right-rounded";
import { Button } from "#/components/ui/button.tsx";
import { toMonthParam } from "#/features/month/month.ts";
import { m } from "#/paraglide/messages.js";

interface MonthChevronProps {
    direction: "previous" | "next";
    to: "/" | "/transactions";
    target: Date;
    disabled?: boolean;
    onClick: (event: MouseEvent, target: Date) => void;
}

/**
 * Links to the previous or next month; hidden on touch, where the title is
 * swiped instead.
 */
export function MonthChevron({
    direction,
    to,
    target,
    disabled = false,
    onClick,
}: MonthChevronProps) {
    const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
    const label =
        direction === "previous" ? m.month_previous() : m.month_next();

    if (disabled) {
        return (
            <Button
                variant={"ghost"}
                size={"icon"}
                className={"pointer-coarse:hidden"}
                aria-label={label}
                disabled
            >
                <Icon />
            </Button>
        );
    }
    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            className={"pointer-coarse:hidden"}
            aria-label={label}
            asChild
        >
            <Link
                to={to}
                search={{ month: toMonthParam(target) }}
                onClick={(event) => onClick(event, target)}
            >
                <Icon />
            </Link>
        </Button>
    );
}

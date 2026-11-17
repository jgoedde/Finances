// PROTOTYPE (#429), throwaway: four day-header variants for the search
// results, switchable via `?variant=A|B|C|D` on /transactions?q=…
// Question: how do we make it obvious a day header jumps to the month list?
import { useEffect, type ReactNode } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { isSameYear, startOfMonth } from "date-fns";
import type { Transaction } from "@finances/shared";
import {
    ArrowUpRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { TransactionListItem } from "#/features/transactions/components/list/transaction-list-item.tsx";
import { toMonthParam } from "#/features/month/month.ts";
import { useRipple } from "#/hooks/use-ripple.ts";
import { getLocale } from "#/paraglide/runtime.js";

const VARIANTS = {
    A: "Whole row + label",
    B: "Trailing icon button",
    C: "Date chip",
    D: "Card with footer action",
} as const;
type VariantKey = keyof typeof VARIANTS;
const KEYS = Object.keys(VARIANTS) as VariantKey[];

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

function useVariant(): VariantKey {
    const { variant } = transactionsRoute.useSearch();
    return KEYS.includes(variant as VariantKey) ? (variant as VariantKey) : "A";
}

function heading(day: Date) {
    return day.toLocaleDateString(getLocale(), {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: isSameYear(day, new Date()) ? undefined : "numeric",
    });
}

function useJump(day: Date) {
    const navigate = useNavigate();
    return () =>
        void navigate({
            to: "/transactions",
            search: {
                month: toMonthParam(startOfMonth(day)),
                q: undefined,
                older: undefined,
                category: undefined,
            },
        });
}

const LABEL = "Im Monat anzeigen";

interface DayProps {
    day: Date;
    transactions: Transaction[];
}

function Rows({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className={"flex flex-col gap-y-1.5 px-2"}>
            {transactions.map((it) => (
                <TransactionListItem key={it.id} transaction={it} />
            ))}
        </div>
    );
}

// A: the whole sticky header is a button; primary label + chevron on the right.
function VariantA({ day, transactions }: DayProps) {
    const jump = useJump(day);
    const ripple = useRipple();
    return (
        <section className={"flex flex-col pb-2"}>
            <button
                type={"button"}
                className={`ripple-container state-layer sticky top-18 z-[5]
                    flex w-full cursor-pointer items-center gap-2 bg-surface
                    px-4 py-2 text-left focus-ring`}
                data-ripple-color={"bg-on-surface/10"}
                {...ripple}
                onClick={(e) => {
                    ripple.onClick(e);
                    jump();
                }}
            >
                <span
                    className={"grow text-title-small text-on-surface-variant"}
                >
                    {heading(day)}
                </span>
                <span
                    className={`inline-flex items-center gap-1 text-label-large
                        text-primary`}
                >
                    {LABEL}
                    <ChevronRight className={"size-4"} />
                </span>
            </button>
            <Rows transactions={transactions} />
        </section>
    );
}

// B: plain heading, a standard icon button at the end.
function VariantB({ day, transactions }: DayProps) {
    const jump = useJump(day);
    return (
        <section className={"flex flex-col pb-2"}>
            <div
                className={`sticky top-18 z-[5] flex items-center bg-surface
                    py-0.5 pr-2 pl-4`}
            >
                <h2 className={"grow text-title-small text-on-surface-variant"}>
                    {heading(day)}
                </h2>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={LABEL}
                    title={LABEL}
                    onClick={jump}
                >
                    <ArrowUpRight />
                </Button>
            </div>
            <Rows transactions={transactions} />
        </section>
    );
}

// C: the date itself is an assist chip with a calendar icon.
function VariantC({ day, transactions }: DayProps) {
    const jump = useJump(day);
    return (
        <section className={"flex flex-col pb-2"}>
            <div className={"sticky top-18 z-[5] bg-surface px-4 py-1.5"}>
                <button
                    type={"button"}
                    onClick={jump}
                    className={`state-layer inline-flex h-8 cursor-pointer
                        items-center gap-2 rounded-sm border
                        border-outline-variant pr-3 pl-2 text-label-large
                        text-on-surface focus-ring`}
                >
                    <CalendarDays className={"size-[18px] text-primary"} />
                    {heading(day)}
                    <ChevronRight
                        className={"size-4 text-on-surface-variant"}
                    />
                </button>
            </div>
            <Rows transactions={transactions} />
        </section>
    );
}

// D: no sticky header; each day is a card with a text button at the bottom.
function VariantD({ day, transactions }: DayProps) {
    const jump = useJump(day);
    return (
        <section
            className={`mx-2 mb-3 flex flex-col rounded-md
                bg-surface-container-low pt-3 pb-1`}
        >
            <h2 className={"px-4 pb-1 text-title-small text-on-surface"}>
                {heading(day)}
            </h2>
            <Rows transactions={transactions} />
            <div className={"flex justify-end px-2 pt-1"}>
                <Button variant={"text"} onClick={jump}>
                    {LABEL}
                    <ArrowUpRight />
                </Button>
            </div>
        </section>
    );
}

export function PrototypeDayGroup(props: DayProps) {
    switch (useVariant()) {
        case "A":
            return <VariantA {...props} />;
        case "B":
            return <VariantB {...props} />;
        case "C":
            return <VariantC {...props} />;
        case "D":
            return <VariantD {...props} />;
    }
}

export function PrototypeSwitcher(): ReactNode {
    const variant = useVariant();
    const navigate = useNavigate();

    function go(step: number) {
        const index =
            (KEYS.indexOf(variant) + step + KEYS.length) % KEYS.length;
        void navigate({
            to: ".",
            search: (prev) => ({ ...prev, variant: KEYS[index] }),
            replace: true,
        });
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const target = e.target as HTMLElement;
            if (target.closest("input, textarea, [contenteditable]")) return;
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    if (import.meta.env.PROD) return null;
    return (
        <div
            className={`fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2
                items-center gap-2 rounded-full bg-inverse-surface px-2 py-1
                text-label-large text-inverse-on-surface shadow-elevation-3`}
        >
            <button type={"button"} onClick={() => go(-1)} className={"p-1"}>
                <ChevronLeft className={"size-5"} />
            </button>
            <span>
                {variant} ({VARIANTS[variant]})
            </span>
            <button type={"button"} onClick={() => go(1)} className={"p-1"}>
                <ChevronRight className={"size-5"} />
            </button>
        </div>
    );
}

/*
 * PROTOTYPE, throwaway. Question: how does a main expense's row show its
 * amount (own vs. total incl. attached expenses), with its attached expenses
 * indented below? Four variants, switchable via `?variant=A|B|C|D`, rendered
 * on top of the real transaction list with stub data. Dev builds only.
 */
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@finances/shared";
import { paletteFromHex, toneStyle } from "#/utils/color.ts";
import { cn } from "#/lib/cn.ts";
import { getLocale } from "#/paraglide/runtime.js";

type IconName = ComponentProps<typeof DynamicIcon>["name"];

interface StubExpense {
    id: string;
    counterparty: string;
    description: string | null;
    category: { name: string; icon: IconName; color: string };
    amount: number;
}

interface StubMain extends StubExpense {
    attached: StubExpense[];
}

const restaurant = { name: "Restaurant", icon: "utensils", color: "#e57373" } as const;
const shopping = { name: "Online-Shopping", icon: "shopping-bag", color: "#ba68c8" } as const;
const delivery = { name: "Lieferkosten", icon: "truck", color: "#64b5f6" } as const;
const groceries = { name: "Lebensmittel", icon: "shopping-cart", color: "#81c784" } as const;
const fuel = { name: "Mobilität", icon: "fuel", color: "#ffb74d" } as const;
const carCare = { name: "Auto", icon: "car", color: "#4db6ac" } as const;
const kiosk = { name: "Snacks", icon: "cookie", color: "#a1887f" } as const;

const mains: StubMain[] = [
    {
        id: "m1",
        counterparty: "Trattoria Luigi",
        description: "Pizza & Wein",
        category: restaurant,
        amount: 15,
        attached: [
            { id: "a1", counterparty: "Bedienung", description: "Trinkgeld", category: restaurant, amount: 2.5 },
        ],
    },
    {
        id: "m2",
        counterparty: "Amazon",
        description: "Kopfhörer, Kabel",
        category: shopping,
        amount: 40,
        attached: [
            { id: "a2", counterparty: "Amazon", description: "Versand", category: delivery, amount: 4.99 },
            { id: "a3", counterparty: "DHL", description: "Expresszuschlag", category: delivery, amount: 3 },
        ],
    },
    {
        id: "m3",
        counterparty: "Aral",
        description: "Tanken",
        category: fuel,
        amount: 62.3,
        attached: [
            { id: "a4", counterparty: "Aral", description: "Waschstraße", category: carCare, amount: 12 },
            { id: "a5", counterparty: "Aral", description: "Kaffee & Brezel", category: kiosk, amount: 4.8 },
            { id: "a6", counterparty: "Aral", description: "Zeitschrift", category: groceries, amount: 5.5 },
        ],
    },
];

const plain: StubExpense = {
    id: "p1",
    counterparty: "Rewe",
    description: null,
    category: groceries,
    amount: 23.41,
};

const eur = (amount: number) => formatCurrency(amount, getLocale());
const total = (main: StubMain) =>
    main.amount + main.attached.reduce((sum, it) => sum + it.amount, 0);

function Avatar({ expense, small = false }: { expense: StubExpense; small?: boolean }) {
    return (
        <div
            className={cn(
                `flex shrink-0 items-center justify-center rounded-full
                bg-(--tone) text-(--on-tone) tone`,
                small ? "size-7" : "size-10",
            )}
            style={toneStyle(paletteFromHex(expense.category.color))}
        >
            <DynamicIcon name={expense.category.icon} className={small ? "size-4" : "size-6"} />
        </div>
    );
}

/** The regular row, as in `TransactionListItem`. */
function Row({ expense, amount, below }: { expense: StubExpense; amount?: string; below?: string }) {
    return (
        <div className={"flex min-h-14 flex-row items-center gap-x-4 rounded-md px-2 py-2 state-layer"}>
            <Avatar expense={expense} />
            <div className={"flex min-w-0 flex-1 flex-col"}>
                <div className={"inline-flex items-center gap-x-1 text-body-large text-on-surface"}>
                    {expense.counterparty}
                    <ChevronRight className={"size-4 shrink-0 text-on-surface-variant"} />
                </div>
                <div className={"text-body-medium text-on-surface-variant"}>
                    {expense.description ?? expense.category.name}
                </div>
            </div>
            <div className={"flex shrink-0 flex-col items-end"}>
                <div className={"text-label-large text-on-surface"}>{amount ?? eur(expense.amount)}</div>
                {below && <div className={"text-label-small text-on-surface-variant"}>{below}</div>}
            </div>
        </div>
    );
}

/** A: own amount big, total small; attached rows indented, compact, on a line. */
function VariantA() {
    return (
        <>
            {mains.map((main) => (
                <div key={main.id}>
                    <Row expense={main} below={`gesamt ${eur(total(main))}`} />
                    <div className={"ml-7 border-l-2 border-outline-variant pl-3"}>
                        {main.attached.map((it) => (
                            <div key={it.id} className={"flex min-h-10 items-center gap-x-3 rounded-md px-2 py-1 state-layer"}>
                                <Avatar expense={it} small />
                                <div className={"flex min-w-0 flex-1 flex-col"}>
                                    <span className={"text-body-medium text-on-surface"}>{it.description}</span>
                                    <span className={"text-body-small text-on-surface-variant"}>
                                        {it.counterparty} · {it.category.name}
                                    </span>
                                </div>
                                <span className={"text-label-medium text-on-surface"}>{eur(it.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <Row expense={plain} />
        </>
    );
}

/** B: total as the head, collapsed; expanding shows a receipt incl. the main expense's own line. */
function VariantB() {
    const [open, setOpen] = useState<ReadonlySet<string>>(new Set(["m1"]));
    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    return (
        <>
            {mains.map((main) => (
                <div key={main.id} className={cn("rounded-md", open.has(main.id) && "bg-surface-container-low")}>
                    <button
                        type={"button"}
                        onClick={() => toggle(main.id)}
                        className={"flex min-h-14 w-full items-center gap-x-4 rounded-md px-2 py-2 text-left state-layer focus-ring"}
                    >
                        <Avatar expense={main} />
                        <div className={"flex min-w-0 flex-1 flex-col"}>
                            <span className={"text-body-large text-on-surface"}>{main.counterparty}</span>
                            <span className={"text-body-medium text-on-surface-variant"}>
                                {main.description} · {main.attached.length + 1} Posten
                            </span>
                        </div>
                        <span className={"text-label-large text-on-surface"}>{eur(total(main))}</span>
                        <ChevronDown
                            className={cn(
                                "size-5 text-on-surface-variant transition-transform",
                                open.has(main.id) && "rotate-180",
                            )}
                        />
                    </button>
                    {open.has(main.id) && (
                        <ul className={"flex flex-col pr-11 pb-2 pl-16"}>
                            {[main, ...main.attached].map((it) => (
                                <li key={it.id} className={"flex items-baseline gap-x-2 py-1 text-body-medium"}>
                                    <span className={"text-on-surface"}>{it.description}</span>
                                    <span className={"flex-1 truncate text-body-small text-on-surface-variant"}>
                                        {it.category.name}
                                    </span>
                                    <span className={"text-label-medium text-on-surface"}>{eur(it.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <Row expense={plain} />
        </>
    );
}

/** C: all rows full size with own amounts, joined by a thread through the avatars; total in a footer. */
function VariantC() {
    return (
        <>
            {mains.map((main) => (
                <div key={main.id} className={"relative"}>
                    {/* Thread from the main avatar down to the last attached one. */}
                    <div className={"absolute top-10 bottom-10 left-[1.75rem] w-0.5 bg-outline-variant"} />
                    <Row expense={main} />
                    {main.attached.map((it) => (
                        <div key={it.id} className={"pl-4"}>
                            <Row expense={it} />
                        </div>
                    ))}
                    <div className={"flex justify-end px-2 pb-1 text-label-medium text-on-surface-variant"}>
                        {main.counterparty} gesamt {eur(total(main))}
                    </div>
                </div>
            ))}
            <Row expense={plain} />
        </>
    );
}

/** Other categories of the attached expenses, without the main expense's. */
function otherCategories(main: StubMain): StubExpense[] {
    const seen = new Set([main.category.name]);
    return main.attached.filter((it) => !seen.has(it.category.name) && seen.add(it.category.name));
}

function SingleRow({ main, badge, text }: { main: StubMain; badge: ReactNode; text: string }) {
    return (
        <div className={"flex min-h-14 items-center gap-x-4 rounded-md px-2 py-2 state-layer"}>
            <div className={"relative size-10 shrink-0"}>
                <Avatar expense={main} />
                {badge}
            </div>
            <div className={"flex min-w-0 flex-1 flex-col"}>
                <span className={"text-body-large text-on-surface"}>{main.counterparty}</span>
                <span className={"line-clamp-2 text-body-medium text-on-surface-variant"}>{text}</span>
            </div>
            <span className={"text-label-large text-on-surface"}>{eur(total(main))}</span>
        </div>
    );
}

const fullBreakdown = (main: StubMain) =>
    [main, ...main.attached].map((it) => `${it.description} ${eur(it.amount)}`).join(" + ");

const badgeClass = "absolute -right-1 -bottom-1 rounded-full ring-2 ring-surface";

/** D: badge = icon of the first attached expense; full breakdown, two lines at most. */
function VariantD() {
    return (
        <>
            {mains.map((main) => (
                <SingleRow
                    key={main.id}
                    main={main}
                    text={fullBreakdown(main)}
                    badge={<div className={badgeClass}><Avatar expense={main.attached[0] ?? main} small /></div>}
                />
            ))}
            <Row expense={plain} />
        </>
    );
}

/** E: badge = count of attached expenses; text = own part + "N weitere". */
function VariantE() {
    return (
        <>
            {mains.map((main) => (
                <SingleRow
                    key={main.id}
                    main={main}
                    text={`${main.description} ${eur(main.amount)} + ${main.attached.length === 1 ? (main.attached[0]?.description ?? "") : `${main.attached.length} weitere`} ${eur(total(main) - main.amount)}`}
                    badge={
                        <div
                            className={`${badgeClass} flex size-6 items-center justify-center
                                bg-secondary-container text-label-small text-on-secondary-container`}
                        >
                            +{main.attached.length}
                        </div>
                    }
                />
            ))}
            <Row expense={plain} />
        </>
    );
}

/** F: badge = stacked icons of the other categories (max 2, then +N); full breakdown. */
function VariantF() {
    return (
        <>
            {mains.map((main) => {
                const others = otherCategories(main);
                const shown = others.slice(0, others.length > 2 ? 1 : 2);
                const rest = others.length - shown.length;
                return (
                    <SingleRow
                        key={main.id}
                        main={main}
                        text={fullBreakdown(main)}
                        badge={
                            <div className={"absolute -right-2 -bottom-1 flex flex-row-reverse"}>
                                {rest > 0 && (
                                    <div
                                        className={`-ml-2 flex size-7 items-center justify-center rounded-full
                                            bg-secondary-container text-label-small text-on-secondary-container
                                            ring-2 ring-surface`}
                                    >
                                        +{rest}
                                    </div>
                                )}
                                {shown.map((it) => (
                                    <div key={it.id} className={"-ml-2 rounded-full ring-2 ring-surface"}>
                                        <Avatar expense={it} small />
                                    </div>
                                ))}
                            </div>
                        }
                    />
                );
            })}
            <Row expense={plain} />
        </>
    );
}

const variants = {
    A: { name: "Eigener Betrag, Summe klein", Component: VariantA },
    B: { name: "Summe als Kopf, aufklappbar", Component: VariantB },
    C: { name: "Volle Zeilen mit Faden", Component: VariantC },
    D: { name: "Eine Zeile, Badge = erste Kategorie", Component: VariantD },
    E: { name: "Eine Zeile, Badge = Anzahl", Component: VariantE },
    F: { name: "Eine Zeile, Badge = andere Kategorien gestapelt", Component: VariantF },
} as const;
type Key = keyof typeof variants;
const keys = Object.keys(variants) as Key[];

function readVariant(): Key {
    const value = new URLSearchParams(window.location.search).get("variant");
    return keys.includes(value as Key) ? (value as Key) : "A";
}

export function AttachedExpensesPrototype() {
    const [current, setCurrent] = useState<Key>(readVariant);

    function go(step: number) {
        const next = keys[(keys.indexOf(current) + step + keys.length) % keys.length] ?? "A";
        const url = new URL(window.location.href);
        url.searchParams.set("variant", next);
        window.history.replaceState(window.history.state, "", url);
        setCurrent(next);
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const target = e.target as HTMLElement | null;
            if (target?.closest("input, textarea, [contenteditable]")) return;
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    const { Component, name } = variants[current];
    return (
        <section className={"flex flex-col pb-2"}>
            <div className={"px-4 py-2 text-title-small text-primary"}>Prototyp · Heute</div>
            <div className={"flex flex-col gap-y-1.5 px-2"}>
                <Component />
            </div>
            <div
                className={`fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2
                    items-center gap-x-2 rounded-full bg-inverse-surface px-2 py-1
                    text-label-large text-inverse-on-surface shadow-elevation-3`}
            >
                <button type={"button"} onClick={() => go(-1)} className={"rounded-full p-1"} aria-label={"Vorherige"}>
                    <ChevronLeft className={"size-5"} />
                </button>
                <span>
                    {current} ({name})
                </span>
                <button type={"button"} onClick={() => go(1)} className={"rounded-full p-1"} aria-label={"Nächste"}>
                    <ChevronRight className={"size-5"} />
                </button>
            </div>
        </section>
    );
}

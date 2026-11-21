import type { TransactionKind } from "@finances/shared";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

const KIND_TABS = {
    expense: m.categories_tab_expense,
    income: m.categories_tab_income,
} as const satisfies Record<TransactionKind, () => string>;

interface CategoryKindTabsProps {
    kind: TransactionKind;
    onKindChange: (kind: TransactionKind) => void;
    isMediumWindow: boolean;
}

/**
 * Tabs switching between expense and income categories.
 */
export function CategoryKindTabs({
    kind,
    onKindChange,
    isMediumWindow,
}: CategoryKindTabsProps) {
    return (
        <Tabs
            value={kind}
            onValueChange={(value) => onKindChange(value as TransactionKind)}
        >
            <TabsList
                className={cn(isMediumWindow && "px-6 *:max-w-60 *:flex-none")}
            >
                {(Object.keys(KIND_TABS) as TransactionKind[]).map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                        {KIND_TABS[tab]()}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}

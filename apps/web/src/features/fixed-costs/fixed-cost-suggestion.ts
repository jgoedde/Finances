import { onlineManager } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
    counterpartyKey,
    type FixedCostSuggestion,
    type FixedCostSuggestionQuery,
    type Transaction,
} from "@finances/shared";
import { toast } from "sonner";
import { apiFetch, toQueryString } from "#/api/api-client.ts";
import { ACTION_TOAST_DURATION } from "#/components/ui/sonner.tsx";
import { m } from "#/paraglide/messages.js";

// What the user decided about a counterparty's fixed cost suggestion, per
// device and keyed by `counterpartyKey`. Either one stops further
// suggestions; a snackbar that times out decides nothing.
const STORAGE_KEY = "finances-fixed-cost-suggestions";

type Decision = "accepted" | "dismissed";

function loadDecisions(): Partial<Record<string, Decision>> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored
            ? (JSON.parse(stored) as Partial<Record<string, Decision>>)
            : {};
    } catch {
        return {};
    }
}

function decide(counterparty: string, decision: Decision): void {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            ...loadDecisions(),
            [counterpartyKey(counterparty)]: decision,
        }),
    );
}

/**
 * Records that the fixed cost prefilled from the counterparty's suggestion
 * was saved.
 */
export function acceptFixedCostSuggestion(counterparty: string): void {
    decide(counterparty, "accepted");
}

/**
 * Offers a fixed cost when a newly created expense completes a fixed cost
 * suggestion. Online only; never waits for or reports the check.
 */
export function useOfferFixedCostSuggestion(): (expense: Transaction) => void {
    const navigate = useNavigate();

    async function offer(expense: Transaction) {
        if (
            expense.kind !== "expense" ||
            expense.exceptional ||
            !onlineManager.isOnline() ||
            loadDecisions()[counterpartyKey(expense.counterparty)]
        ) {
            return;
        }
        const query: FixedCostSuggestionQuery = {
            id: expense.id,
            counterparty: expense.counterparty,
            amount: expense.amount,
            date: expense.date,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        const suggestion = await apiFetch<FixedCostSuggestion | null>(
            `/insights/fixed-cost-suggestion?${toQueryString(query)}`,
        );
        if (!suggestion) {
            return;
        }
        toast(m.fixed_cost_suggestion_detected(), {
            duration: ACTION_TOAST_DURATION,
            action: {
                label: m.action_create(),
                onClick: () =>
                    void navigate({
                        to: "/fixed-costs/new",
                        search: {
                            name: suggestion.counterparty,
                            amount: suggestion.amount,
                            interval: suggestion.interval,
                            startDate: suggestion.startDate,
                        },
                    }),
            },
            cancel: {
                label: m.action_dismiss(),
                onClick: () => decide(suggestion.counterparty, "dismissed"),
            },
        });
    }

    return (expense) => {
        // Only a missed suggestion if it fails.
        offer(expense).catch(() => {});
    };
}

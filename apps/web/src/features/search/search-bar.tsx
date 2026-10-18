import { useEffect, useState } from "react";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { AccountMenu } from "#/features/account/account-menu.tsx";
import { m } from "#/paraglide/messages.js";

const transactionsRoute = getRouteApi("/_authed/_shell/_transactions");

/** Delay before a typed term goes to the URL and runs the search. */
const SEARCH_DEBOUNCE_MS = 300;

/**
 * MD3 search bar (https://m3.material.io/components/search/specs) on top of
 * the transaction list, with the avatar trailing below expanded windows.
 * The term lives in `?q=`.
 */
export function SearchBar() {
    const { q = "" } = transactionsRoute.useSearch();
    const navigate = useNavigate();
    const [search, setSearch] = useState(q);

    // Follow outside changes, e.g. picking a category or going back.
    const [syncedQ, setSyncedQ] = useState(q);
    if (q !== syncedQ) {
        setSyncedQ(q);
        setSearch(q);
    }

    useEffect(() => {
        if (search === q) {
            return;
        }
        const timeout = setTimeout(() => {
            void navigate({
                to: "/transactions",
                search: {
                    q: search || undefined,
                    category: undefined,
                },
                replace: true,
            });
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [search, q, navigate]);

    return (
        <div
            className={`flex h-14 items-center gap-1 rounded-full
                bg-surface-container-high pr-1 pl-4`}
        >
            <Search className={"size-6 shrink-0 text-on-surface"} />
            <input
                type={"search"}
                aria-label={m.search_label()}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`h-full min-w-0 grow bg-transparent pl-3
                    text-body-large text-on-surface caret-primary outline-none
                    placeholder:text-on-surface-variant
                    [&::-webkit-search-cancel-button]:hidden`}
                placeholder={m.search_placeholder()}
            />
            {search !== "" && (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    aria-label={m.search_clear()}
                    onClick={() => setSearch("")}
                >
                    <X />
                </Button>
            )}
            <AccountMenu className={"medium:hidden"} />
        </div>
    );
}

import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AccountMenu } from "@/features/account/account-menu.tsx";

// MD3 search bar (https://m3.material.io/components/search/specs) with a
// trailing avatar; the bar opens the search view.
export function SearchBar() {
    return (
        <div
            className={`mx-auto mt-3 flex h-14 w-7/8 max-w-2xl shrink-0
                items-center rounded-full bg-surface-container-high pr-1`}
        >
            <Link
                to={"/transactions/search"}
                className={`state-layer flex h-full min-w-0 grow items-center
                    gap-4 rounded-full pl-4 focus-ring`}
            >
                <Search className={"size-6 shrink-0 text-on-surface"} />
                <span
                    className={
                        "truncate text-body-large text-on-surface-variant"
                    }
                >
                    Buchung/Transaktion suchen
                </span>
            </Link>
            <AccountMenu />
        </div>
    );
}

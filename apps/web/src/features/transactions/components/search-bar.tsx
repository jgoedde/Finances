import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AccountMenu } from "@/features/account/account-menu.tsx";

// MD3 search bar (https://m3.material.io/components/search/specs) with a
// trailing avatar; the bar opens the search view.
export function SearchBar() {
    return (
        <div
            className={`bg-surface-container-high mx-auto mt-3 flex h-14 w-7/8
                max-w-2xl shrink-0 items-center rounded-full pr-1`}
        >
            <Link
                to={"/transactions/search"}
                className={`state-layer focus-ring flex h-full min-w-0 grow
                    items-center gap-4 rounded-full pl-4`}
            >
                <Search className={"text-on-surface size-6 shrink-0"} />
                <span
                    className={
                        "text-on-surface-variant text-body-large truncate"
                    }
                >
                    Buchung/Transaktion suchen
                </span>
            </Link>
            <AccountMenu />
        </div>
    );
}

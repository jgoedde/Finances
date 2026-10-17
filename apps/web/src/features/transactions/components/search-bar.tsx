import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

// MD3 search bar (https://m3.material.io/components/search/specs); opens the search view.
export function SearchBar() {
    return (
        <Link
            to={"/transactions/search"}
            className={`bg-surface-container-high state-layer focus-ring mx-auto
                mt-3 flex h-14 w-7/8 max-w-2xl shrink-0 items-center gap-4
                rounded-full px-4`}
        >
            <Search className={"text-on-surface size-6"} />
            <span className={"text-on-surface-variant text-body-large"}>
                Buchung/Transaktion suchen
            </span>
        </Link>
    );
}

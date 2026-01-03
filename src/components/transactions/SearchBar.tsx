import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SearchBar() {
    return (
        <div
            className={
                "bg-surface-container-high mx-auto mt-3 flex h-14 w-7/8 shrink-0 content-center items-center rounded-full"
            }
        >
            <div className={"px-4"}>
                <Search className={"text-on-surface size-6"} />
            </div>
            <Link to={"/transactions/search"}>
                <button type={"button"} className={"text-on-surface-variant"}>
                    Search for transaction
                </button>
            </Link>
        </div>
    );
}

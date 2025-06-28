import { Search } from "lucide-react";
import { useLocation } from "wouter";

export function SearchBar() {
    const [, route] = useLocation();

    return (
        <div
            className={
                "bg-surface-container-high mx-auto mt-3 flex h-14 w-7/8 shrink-0 content-center items-center rounded-full"
            }
        >
            <div className={"px-4"}>
                <Search className={"text-on-surface size-6"} />
            </div>
            <button
                className={"text-on-surface-variant"}
                onClick={() => {
                    route("/expenses/search");
                }}
            >
                Search for expense
            </button>
        </div>
    );
}

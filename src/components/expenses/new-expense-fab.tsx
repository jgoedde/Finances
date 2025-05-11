import { Banknote } from "lucide-react";
import { useLocation } from "wouter";

export function NewExpenseFAB() {
    const [, route] = useLocation();

    return (
        <button
            className={
                "bg-primary-container text-on-primary-container absolute right-0 bottom-0 size-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-lg"
            }
            onClick={() => {
                route("/new");
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </button>
    );
}

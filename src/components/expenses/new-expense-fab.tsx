import { Banknote } from "lucide-react";
import { useLocation } from "wouter";

export function NewExpenseFAB() {
    const [, route] = useLocation();

    return (
        <button
            className={
                "bg-primary-container text-on-primary-container sticky left-full bottom-1 size-16 rounded-2xl shadow-lg"
            }
            onClick={() => {
                route("/new");
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </button>
    );
}

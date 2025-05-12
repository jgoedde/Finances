import { Banknote } from "lucide-react";
import { useLocation } from "wouter";

export function NewExpenseFAB() {
    const [, route] = useLocation();

    return (
        <div
            className={
                "bg-primary-container text-on-primary-container mb-3 mr-3 sticky left-full bottom-0 size-16 rounded-2xl shadow-lg"
            }
            onClick={() => {
                route("/new");
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </div>
    );
}

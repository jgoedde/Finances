import { Banknote } from "lucide-react";
import { useLocation } from "wouter";

export function NewExpenseFAB() {
    const [, route] = useLocation();

    return (
        <div
            className={
                "bg-primary-container text-on-primary-container sticky right-1 bottom-1 size-16 rounded-2xl shadow-lg"
            }
            onClick={() => {
                route("/new");
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </div>
    );
}

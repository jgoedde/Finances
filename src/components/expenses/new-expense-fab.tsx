import { Banknote } from "lucide-react";
import { useLocation } from "wouter";
import { useRipple } from "@/hooks/use-ripple.ts";

export function NewExpenseFAB() {
    const [, route] = useLocation();
    const ripple = useRipple();

    return (
        <button
            className={
                "ripple-container bg-primary-container text-on-primary-container sticky bottom-6 left-[87vw] size-16 shrink-0 -translate-x-1/2 rounded-2xl shadow-lg"
            }
            data-ripple-color="bg-on-surface/10"
            {...ripple}
            onClick={(e) => {
                ripple.onClick(e);

                setTimeout(() => {
                    route("/new");
                }, 100);
            }}
        >
            <Banknote className={"mx-auto size-10 h-full"} />
        </button>
    );
}

import { Banknote } from "lucide-react";
import { useLocation } from "wouter";
import { useRipple } from "@/hooks/use-ripple.ts";
import { cn } from "@/lib/utils.ts";

export function NewExpenseFAB() {
    const [, route] = useLocation();
    const ripple = useRipple();

    return (
        <button
            className={cn(
                "ripple-container bg-primary-container text-on-primary-container size-16 shrink-0 -translate-x-1/5 rounded-2xl shadow-lg",
            )}
            style={{
                position: "sticky",
                left: "100%",
                bottom: "calc(var(--spacing) * 4)",
            }}
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

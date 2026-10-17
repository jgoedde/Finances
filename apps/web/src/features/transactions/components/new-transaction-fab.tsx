import { Banknote } from "lucide-react";
import { useRipple } from "@/hooks/use-ripple.ts";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/cn.ts";

export function NewTransactionFAB() {
    const ripple = useRipple();

    const navigate = useNavigate();

    return (
        <button
            type={"button"}
            className={cn(
                `ripple-container state-layer focus-ring bg-primary-container
                text-on-primary-container shadow-elevation-3
                hover:shadow-elevation-4 ease-standard size-14 shrink-0
                -translate-x-1/4 cursor-pointer rounded-lg transition-shadow
                duration-200`,
            )}
            style={{
                position: "sticky",
                left: "100%",
                bottom: "calc(var(--spacing) * 4)",
            }}
            aria-label={"Neue Geldbewegung"}
            data-ripple-color="bg-on-surface/10"
            {...ripple}
            onClick={(e) => {
                ripple.onClick(e);

                setTimeout(() => {
                    void navigate({ to: "/new" });
                }, 100);
            }}
        >
            <Banknote className={"mx-auto size-6"} />
        </button>
    );
}

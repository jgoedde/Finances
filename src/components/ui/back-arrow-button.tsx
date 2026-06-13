import { type ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/cn.ts";

export function BackArrowButton({
    className,
    ...props
}: ComponentProps<"button">) {
    const router = useRouter();
    const canGoBack = useCanGoBack();
    const navigate = useNavigate();

    return (
        <button
            type={"button"}
            onClick={() =>
                canGoBack ? router.history.back() : void navigate({ to: "/" })
            }
            className={cn("text-on-surface cursor-pointer px-4", className)}
            {...props}
        >
            <ArrowLeft className={"size-6"} />
        </button>
    );
}

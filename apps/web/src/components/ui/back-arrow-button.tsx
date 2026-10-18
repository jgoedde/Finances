import { type ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

// Leading navigation icon of an MD3 top app bar.
export function BackArrowButton({
    className,
    ...props
}: ComponentProps<"button">) {
    const router = useRouter();
    const canGoBack = useCanGoBack();
    const navigate = useNavigate();

    return (
        <Button
            // Not a submit button, even inside a form (e.g. the edit page).
            type={"button"}
            variant={"ghost"}
            size={"icon"}
            aria-label={m.action_back()}
            onClick={() =>
                canGoBack ? router.history.back() : void navigate({ to: "/" })
            }
            className={cn("mx-1 text-on-surface", className)}
            {...props}
        >
            <ArrowLeft />
        </Button>
    );
}

import { type ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";
import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/cn.ts";

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
            variant={"ghost"}
            size={"icon"}
            aria-label={"Zurück"}
            onClick={() =>
                canGoBack ? router.history.back() : void navigate({ to: "/" })
            }
            className={cn("text-on-surface mx-1", className)}
            {...props}
        >
            <ArrowLeft />
        </Button>
    );
}

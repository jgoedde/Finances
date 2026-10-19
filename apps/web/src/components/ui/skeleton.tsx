import * as React from "react";
import { cn } from "#/lib/cn.ts";

// shadcn's skeleton in MD3 colors; text lines by default, `rounded-full` for
// icons and avatars.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot={"skeleton"}
            aria-hidden
            className={cn(
                `rounded-xs bg-surface-container-highest
                motion-safe:animate-pulse`,
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };

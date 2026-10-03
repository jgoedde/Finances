import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the MD3 theme tokens from globals.css. Without this,
// e.g. `text-title-large` is mistaken for a text color and dropped when
// combined with `text-on-surface`.
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            text: [
                "display-large",
                "display-medium",
                "display-small",
                "headline-large",
                "headline-medium",
                "headline-small",
                "title-large",
                "title-medium",
                "title-small",
                "body-large",
                "body-medium",
                "body-small",
                "label-large",
                "label-medium",
                "label-small",
            ],
            shadow: [
                "elevation-1",
                "elevation-2",
                "elevation-3",
                "elevation-4",
                "elevation-5",
            ],
            font: ["brand"],
            ease: [
                "standard",
                "standard-decelerate",
                "standard-accelerate",
                "emphasized",
                "emphasized-decelerate",
                "emphasized-accelerate",
            ],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

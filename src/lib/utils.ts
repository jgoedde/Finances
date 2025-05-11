import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IconName } from "lucide-react/dynamic";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function zer0IconToLucideIcon(icon: string): IconName {
    switch (icon) {
        case "food-fork-drink": {
            return "utensils";
        }
        case "cash": {
            return "shopping-basket";
        }
        case "gift-outline": {
            return "gift";
        }
        case "bandage": {
            return "heart";
        }
        case "bag-suitcase": {
            return "shirt";
        }
        case "youtube-gaming": {
            return "joystick";
        }
        case "airplane": {
            return "plane";
        }
        default:
            return icon as IconName;
    }
}

import type { IconName } from "lucide-react/dynamic";

export const categories: {
    name: string;
    icon: IconName;
    color: string;
}[] = [
    {
        name: "Auswärts essen",
        icon: "utensils",
        color: "#32CD32",
    },
    {
        name: "Einkäufe",
        icon: "shopping-basket",
        color: "#FFA500",
    },
    {
        name: "Geschenke",
        icon: "gift",
        color: "#FF6347",
    },
    {
        name: "Gesundheit",
        icon: "heart",
        color: "#32CD32",
    },
    {
        name: "Wohnung",
        icon: "sofa",
        color: "#9370DB",
    },
    {
        name: "Kleidung",
        icon: "shirt",
        color: "#00FA9A",
    },
    {
        name: "Freizeit",
        icon: "joystick",
        color: "#800080",
    },
    {
        name: "Urlaub",
        icon: "plane",
        color: "#87CEEB",
    },
];

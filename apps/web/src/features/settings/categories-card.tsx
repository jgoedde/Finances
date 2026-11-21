import { Link } from "@tanstack/react-router";
import Shapes from "~icons/material-symbols/category-outline-rounded";
import { Card } from "#/components/ui/card.tsx";
import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

export function CategoriesCard() {
    return (
        <Card className={"gap-3 p-4"}>
            <h2 className="font-brand text-title-large">
                {m.categories_title()}
            </h2>
            <p className="text-body-medium text-on-surface-variant">
                {m.settings_categories_description()}
            </p>
            <Button asChild variant={"filledTonal"} className={"self-start"}>
                <Link to={"/settings/categories"}>
                    <Shapes />
                    {m.settings_categories_open()}
                </Link>
            </Button>
        </Card>
    );
}

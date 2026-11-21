import { Button } from "#/components/ui/button.tsx";
import { m } from "#/paraglide/messages.js";

/**
 * The form's submit button. Compact: sticks to the bottom, within the
 * thumb's reach.
 */
export function SaveFooter() {
    return (
        <footer
            className={`sticky bottom-0 border-t border-outline-variant
                bg-surface px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]
                medium:static medium:border-none medium:pt-0`}
        >
            <div className={"mx-auto flex w-full max-w-md justify-end"}>
                <Button
                    type={"submit"}
                    variant={"filled"}
                    className={"w-full medium:w-auto"}
                >
                    {m.action_save()}
                </Button>
            </div>
        </footer>
    );
}

import { Button } from "#/components/ui/button.tsx";
import { OfflineHint } from "#/features/sync/offline-hint.tsx";
import { m } from "#/paraglide/messages.js";

interface WizardFooterProps {
    canGoBack: boolean;
    onBack: VoidFunction;
    onNext: VoidFunction;
    canNext: boolean;

    /**
     * Saving needs the server; the last step's button stays disabled offline.
     */
    isSaveBlocked: boolean;

    /**
     * Label of the next button: "next" or the final step's label.
     */
    nextLabel: string;
}

export function WizardFooter({
    canGoBack,
    onBack,
    onNext,
    canNext,
    isSaveBlocked,
    nextLabel,
}: WizardFooterProps) {
    return (
        <footer className="border-t border-outline-variant p-4">
            <div className="mx-auto flex w-full max-w-md gap-2">
                {canGoBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                    >
                        {m.action_back()}
                    </Button>
                )}
                <OfflineHint active={isSaveBlocked}>
                    <Button
                        variant="filled"
                        onClick={onNext}
                        className="flex-1"
                        disabled={!canNext || isSaveBlocked}
                    >
                        {nextLabel}
                    </Button>
                </OfflineHint>
            </div>
        </footer>
    );
}

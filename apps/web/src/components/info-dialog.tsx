import { createCallable } from "react-call";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { m } from "#/paraglide/messages.js";

/**
 * Matches the exit animation of `AlertDialogContent`.
 */
const UNMOUNTING_DELAY_MS = 200;

interface InfoDialogProps {
    title: string;
    description: string;
}

/**
 * MD3 basic dialog that only informs, replacing `window.alert`. Mount it
 * once (see `routes/__root.tsx`) and open it with `showInfo()`.
 */
export const InfoDialog = createCallable<InfoDialogProps>(
    ({ call, title, description }) => (
        <AlertDialog
            open={!call.ended}
            onOpenChange={(open) => {
                if (!open) {
                    call.end();
                }
            }}
        >
            {/* Clicking the scrim dismisses it, like OK. */}
            <AlertDialogContent onOverlayClick={() => call.end()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => call.end()}>
                        {m.action_ok()}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
    UNMOUNTING_DELAY_MS,
);

/**
 * Shows an info dialog; resolves once it is dismissed.
 */
export function showInfo(props: InfoDialogProps): Promise<void> {
    return InfoDialog.call(props);
}

import { createCallable } from "react-call";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog.tsx";
import { cn } from "#/lib/cn.ts";
import { m } from "#/paraglide/messages.js";

/**
 * Matches the exit animation of `AlertDialogContent`.
 */
const UNMOUNTING_DELAY_MS = 200;

interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmLabel: string;

    /**
     * Styles the confirm action as destructive (error color).
     */
    destructive?: boolean;
}

/**
 * MD3 basic dialog asking to confirm an action. Mount it once (see
 * `routes/__root.tsx`) and open it with `confirmAction()`.
 */
export const ConfirmDialog = createCallable<ConfirmDialogProps, boolean>(
    ({ call, title, description, confirmLabel, destructive }) => (
        <AlertDialog
            open={!call.ended}
            onOpenChange={(open) => {
                if (!open) {
                    call.end(false);
                }
            }}
        >
            {/* Clicking the scrim dismisses it, like Cancel. */}
            <AlertDialogContent onOverlayClick={() => call.end(false)}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{m.action_cancel()}</AlertDialogCancel>
                    <AlertDialogAction
                        className={cn(destructive && "text-error")}
                        onClick={() => call.end(true)}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
    UNMOUNTING_DELAY_MS,
);

/**
 * Asks to confirm an action; resolves to `true` if confirmed.
 */
export function confirmAction(props: ConfirmDialogProps): Promise<boolean> {
    return ConfirmDialog.call(props);
}

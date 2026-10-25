import { Toaster as Sonner, type ToasterProps } from "sonner";
import type { CSSProperties } from "react";
import { X } from "lucide-react";
import { m } from "#/paraglide/messages.js";

/** Duration for toasts with an action, so there is time to tap it. */
export const ACTION_TOAST_DURATION = 8000;

/**
 * MD3 snackbar (https://m3.material.io/components/snackbar/specs): one at a
 * time, no status icons, centered and 344–672px wide (full width on compact
 * screens). Sonner's own CSS is unlayered and beats Tailwind classes, so it
 * runs unstyled and keeps only positioning and swiping; the motion lives in
 * globals.css.
 */
const Toaster = ({ ...props }: ToasterProps) => (
    <Sonner
        className="toaster group"
        style={{ "--width": "min(672px, 100vw - 32px)" } as CSSProperties}
        position="bottom-center"
        mobileOffset={{ bottom: "96px" }}
        visibleToasts={1}
        icons={{
            success: null,
            info: null,
            warning: null,
            error: null,
            close: <X />,
        }}
        toastOptions={{
            unstyled: true,
            closeButtonAriaLabel: m.action_close(),
            classNames: {
                toast: `inset-x-0 mx-auto flex min-h-12 w-fit min-w-[min(344px,100%)]
                    max-w-full flex-wrap items-center gap-x-2 rounded-xs
                    bg-inverse-surface py-1 ps-4 pe-4 text-inverse-on-surface
                    shadow-elevation-3 has-data-button:pe-2
                    has-data-close-button:pe-1`,
                content: "min-w-0 flex-[1_1_10rem] py-2.5",
                title: "text-body-medium",
                actionButton: `ms-auto h-10 shrink-0 cursor-pointer rounded-full px-3
                    text-label-large text-inverse-primary state-layer focus-ring`,
                closeButton: `order-last grid size-10 shrink-0 cursor-pointer
                    place-items-center rounded-full text-inverse-on-surface
                    state-layer focus-ring [&_svg]:size-6`,
            },
        }}
        {...props}
    />
);

export { Toaster };

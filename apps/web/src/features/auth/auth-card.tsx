import type { ReactNode } from "react";

/** Centered card for the signed-out pages (login, invites). */
export function AuthCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div
            className={`bg-surface-container flex min-h-dvh items-center
                justify-center p-6`}
        >
            <div
                className="bg-surface-container-high text-on-surface
                    shadow-elevation-3 w-full max-w-sm rounded-xl p-6"
            >
                <h1 className="font-brand text-headline-small mb-6 text-center">
                    {title}
                </h1>
                {children}
            </div>
        </div>
    );
}

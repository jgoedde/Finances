import type { PropsWithChildren } from "react";

interface AuthCardProps {
    title: string;
}

/**
 * Centered card for the signed-out pages (login, invites).
 */
export function AuthCard({
    title,
    children,
}: PropsWithChildren<AuthCardProps>) {
    return (
        <div
            className={`flex min-h-dvh items-center justify-center
                bg-surface-container p-6`}
        >
            <div
                className="w-full max-w-sm rounded-xl bg-surface-container-high
                    p-6 text-on-surface shadow-elevation-3"
            >
                <h1 className="mb-6 text-center font-brand text-headline-small">
                    {title}
                </h1>
                {children}
            </div>
        </div>
    );
}

import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const ROW_CLASS = "flex items-center gap-3 rounded-md px-3 py-2";

interface PatternRowLayoutProps {
    icon: ReactNode;
    /**
     * Opens the transactions behind the pattern; without it the row is
     * static.
     */
    search?: { category?: string; q?: string };
}

/**
 * The shared look of a pattern row: icon and sentence, linked to its
 * transactions if it has any to show.
 */
export function PatternRowLayout({
    icon,
    search,
    children,
}: PropsWithChildren<PatternRowLayoutProps>) {
    const content = (
        <>
            <span
                className={`flex size-10 shrink-0 items-center justify-center
                    rounded-full bg-secondary-container
                    text-on-secondary-container [&_svg]:size-5`}
            >
                {icon}
            </span>
            <span className={"text-body-medium text-on-surface"}>
                {children}
            </span>
        </>
    );

    if (!search) {
        return <div className={ROW_CLASS}>{content}</div>;
    }
    return (
        <Link
            to={"/transactions"}
            search={{
                category: search.category,
                q: search.q,
                older: undefined,
            }}
            className={`${ROW_CLASS} state-layer focus-ring`}
        >
            {content}
        </Link>
    );
}

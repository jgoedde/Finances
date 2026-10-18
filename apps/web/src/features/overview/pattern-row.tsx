import { Link } from "@tanstack/react-router";
import type { Pattern } from "@finances/shared";
import { viewOf } from "#/features/overview/pattern-views.tsx";
import { getLocale } from "#/paraglide/runtime.js";

interface PatternRowProps {
    pattern: Pattern;
}

/**
 * One pattern as a sentence, opening its transactions where there are any
 * to show.
 */
export function PatternRow({ pattern }: PatternRowProps) {
    const view = viewOf(pattern);
    const link = view.link(pattern);
    const className = "flex items-center gap-3 rounded-md px-3 py-2";
    const content = (
        <>
            <span
                className={`flex size-10 shrink-0 items-center justify-center
                    rounded-full bg-secondary-container
                    text-on-secondary-container [&_svg]:size-5`}
            >
                {view.icon(pattern)}
            </span>
            <span className={"text-body-medium text-on-surface"}>
                {view.text(pattern, getLocale())}
            </span>
        </>
    );

    if (!link) {
        return <div className={className}>{content}</div>;
    }
    return (
        <Link
            to={"/transactions"}
            search={{
                category: link.category,
                q: link.q,
                older: undefined,
            }}
            className={`${className} state-layer focus-ring`}
        >
            {content}
        </Link>
    );
}

import { Card } from "#/components/ui/card.tsx";
import { PatternRow } from "#/features/overview/patterns/pattern-row.tsx";
import { usePatterns } from "#/features/overview/overview-queries.ts";
import { m } from "#/paraglide/messages.js";

interface PatternsCardProps {
    month: Date;
}

/**
 * Regularities in the last three months' spending. Hidden when nothing
 * stands out.
 */
export function PatternsCard({ month }: PatternsCardProps) {
    const patterns = usePatterns(month);

    if (patterns.length === 0) {
        return null;
    }
    return (
        <Card className={"gap-1 px-2 py-4"}>
            <div className={"mb-1 flex flex-col px-3"}>
                <h2 className={"font-brand text-title-large text-on-surface"}>
                    {m.patterns_title()}
                </h2>
                <span className={"text-body-small text-on-surface-variant"}>
                    {m.patterns_hint()}
                </span>
            </div>
            {patterns.map((pattern) => (
                // Patterns have no id; their content is unique.
                <PatternRow key={JSON.stringify(pattern)} pattern={pattern} />
            ))}
        </Card>
    );
}

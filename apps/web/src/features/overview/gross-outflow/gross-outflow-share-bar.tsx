import type { GrossOutflowView } from "#/features/overview/gross-outflow/gross-outflow.ts";
import { m } from "#/paraglide/messages.js";

interface GrossOutflowShareBarProps {
    outflow: GrossOutflowView;
}

/**
 * The gross outflow as one 100 % stacked bar: fixed costs, then spending,
 * each by category, largest first, with a wider gap between the two.
 * Decorative: the list below carries the numbers.
 */
export function GrossOutflowShareBar({ outflow }: GrossOutflowShareBarProps) {
    return (
        <div
            role={"img"}
            aria-label={m.overview_gross_outflow_title()}
            className={"flex h-4 gap-1 overflow-hidden rounded-xs"}
        >
            {outflow.sides.map((side) => (
                <div
                    key={side.kind}
                    className={"flex min-w-0.5 gap-0.5"}
                    style={{ flex: `${side.total} 0 0` }}
                >
                    {side.categories.map((category) => (
                        <div
                            key={category.id}
                            className={"min-w-0.5 bg-(--tone) tone"}
                            style={{
                                ...category.toneStyle,
                                flex: `${category.total} 0 0`,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

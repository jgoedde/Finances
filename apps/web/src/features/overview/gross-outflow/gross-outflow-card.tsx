import { formatCurrency, type MonthOverview } from "@finances/shared";
import { Card } from "#/components/ui/card.tsx";
import { useGrossOutflow } from "#/features/overview/gross-outflow/gross-outflow.ts";
import { GrossOutflowShareBar } from "#/features/overview/gross-outflow/gross-outflow-share-bar.tsx";
import { GrossOutflowSideSection } from "#/features/overview/gross-outflow/gross-outflow-side-section.tsx";
import { GrossOutflowTreemap } from "#/features/overview/gross-outflow/gross-outflow-treemap.tsx";
import { useIsMediumWindow } from "#/hooks/use-is-medium-window.ts";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";

interface GrossOutflowCardProps {
    overview: MonthOverview;
}

/**
 * Where the month's money went: its gross outflow by fixed costs and
 * spending, then by category, with amounts and shares. A treemap from the
 * medium window size, else a stacked bar above a list. Hidden without
 * gross outflow.
 */
export function GrossOutflowCard({ overview }: GrossOutflowCardProps) {
    const outflow = useGrossOutflow(overview);
    const isMediumWindow = useIsMediumWindow();
    const { pace, exceptional } = overview;

    if (outflow.total <= 0) {
        return null;
    }

    return (
        <Card className={"gap-3 px-2 py-4"}>
            <div className={"flex flex-wrap items-end gap-x-4 px-3"}>
                <div className={"flex grow flex-col"}>
                    <h2
                        className={
                            "font-brand text-title-large text-on-surface"
                        }
                    >
                        {m.overview_gross_outflow_title()}
                    </h2>
                    <span className={"text-body-small text-on-surface-variant"}>
                        {pace.day === null
                            ? m.overview_gross_outflow_hint()
                            : m.overview_gross_outflow_so_far()}
                    </span>
                </div>
                <span className={"font-brand text-title-large text-on-surface"}>
                    {formatCurrency(outflow.total, getLocale())}
                </span>
            </div>
            {isMediumWindow ? (
                <div className={"px-3"}>
                    <GrossOutflowTreemap outflow={outflow} />
                </div>
            ) : (
                <>
                    <div className={"px-3"}>
                        <GrossOutflowShareBar outflow={outflow} />
                    </div>
                    {outflow.sides.map((side) => (
                        <GrossOutflowSideSection key={side.kind} side={side} />
                    ))}
                </>
            )}
            {exceptional.count > 0 && (
                <p className={"px-3 text-body-small text-on-surface-variant"}>
                    {m.overview_gross_outflow_exceptional({
                        count: exceptional.count,
                        amount: formatCurrency(
                            exceptional.netSpending,
                            getLocale(),
                        ),
                    })}
                </p>
            )}
        </Card>
    );
}

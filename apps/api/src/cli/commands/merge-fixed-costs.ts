import type { FixedCost } from "@finances/shared";
import type { Command } from "commander";
import {
    applyFixedCostMerges,
    type FixedCostChain,
    gapDays,
    planFixedCostMerges,
} from "#/features/fixed-costs/fixed-cost-chains.ts";
import type { CommandContext, Output, RunCommand } from "../command.ts";

/**
 * Merges fixed costs that model a price change by hand into one fixed cost
 * with price changes. A dry run unless `apply`.
 */
export async function mergeFixedCosts(
    { db, out }: CommandContext,
    { apply }: { apply: boolean },
): Promise<number> {
    const { chains, ambiguous } = await planFixedCostMerges(db);
    for (const chain of chains) {
        printChain(out, chain);
    }
    if (ambiguous.length > 0) {
        out.info("Skipped as ambiguous (a fixed cost has several candidates):");
        for (const { username, fixedCosts } of ambiguous) {
            out.info(
                `  ${username}: ${fixedCosts.map((it) => `${it.name} (${it.id})`).join(", ")}`,
            );
        }
    }

    if (chains.length === 0) {
        out.info("No fixed costs to merge.");
    } else if (apply) {
        await applyFixedCostMerges(db, chains);
        out.info(`Merged ${chains.length} chain(s).`);
    } else {
        out.info(
            `Dry run: ${chains.length} chain(s) to merge. Run \`finances merge-fixed-costs --apply\` to merge them.`,
        );
    }
    return 0;
}

function printChain(out: Output, { username, links, merged }: FixedCostChain) {
    out.info(`${username}: ${merged.name}`);
    links.forEach((link, index) => {
        const previous = links[index - 1];
        const gap =
            previous?.endDate == null
                ? ""
                : `  ${describeGap(gapDays(previous.endDate, link.startDate))}`;
        out.info(
            `  ${link.id}  ${describeRange(link)}  ${describeAmount(link.initialAmount, link)}${gap}`,
        );
    });
    out.info(
        `  merged into ${merged.id}: ${describeRange(merged)}  ${describeAmount(merged.initialAmount, merged)}`,
    );
    for (const change of merged.priceChanges) {
        out.info(
            `    from ${change.date}: ${describeAmount(change.amount, merged)}`,
        );
    }
    for (const link of links) {
        if (
            link.description !== null &&
            link.description !== merged.description
        ) {
            out.info(
                `  drops the description of ${link.id}: ${JSON.stringify(link.description)}`,
            );
        }
    }
}

function describeRange({ startDate, endDate }: FixedCost): string {
    return `${startDate} to ${endDate ?? "open end"}`;
}

function describeAmount(amount: number, { currency }: FixedCost): string {
    return `${amount} ${currency}`;
}

function describeGap(days: number): string {
    if (days === 0) {
        return "next day";
    }
    return days > 0 ? `gap of ${days} day(s)` : `overlap of ${-days} day(s)`;
}

export function registerMergeFixedCosts(program: Command, run: RunCommand) {
    program
        .command("merge-fixed-costs")
        .description(
            "merge fixed costs that model a price change by hand (dry run unless --apply)",
        )
        .option("--apply", "write the merge")
        .action((options: { apply?: boolean }) =>
            run((context) =>
                mergeFixedCosts(context, { apply: options.apply === true }),
            ),
        );
}

import type { FixedCost } from "@finances/shared";
import _ from "lodash";
import type { DB } from "#/db/database.ts";
import {
    readFixedCosts,
    writePriceChanges,
} from "#/features/fixed-costs/fixed-costs.ts";

// Merges fixed costs that model a price change by hand (A ends, then a copy
// B starts) into one fixed cost with price changes. Used by the
// `merge-fixed-costs` command; see GitHub issue #377 for the rules.

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * How far B may start from the day after A ends, in days, either way.
 */
const MAX_GAP_DAYS = 7;

/**
 * Fixed costs where each one continues the one before, oldest first.
 */
export interface FixedCostChain {
    userId: string;
    username: string;
    links: FixedCost[];

    /**
     * The first link after the merge.
     */
    merged: FixedCost;
}

/**
 * Fixed costs that would form a chain, if one of them didn't have more than
 * one candidate successor or predecessor.
 */
interface AmbiguousChain {
    username: string;
    fixedCosts: FixedCost[];
}

export interface FixedCostMergePlan {
    chains: FixedCostChain[];
    ambiguous: AmbiguousChain[];
}

/**
 * Days from the day after `endDate` to `startDate`: 0 for the next day,
 * positive for a gap, negative for an overlap.
 */
export function gapDays(endDate: string, startDate: string): number {
    return (Date.parse(startDate) - Date.parse(endDate)) / DAY_MS - 1;
}

/**
 * Whether B continues A. B must also start after A, so that the merged price
 * changes come after the start date.
 */
function continues(a: FixedCost, b: FixedCost): boolean {
    return (
        a.endDate !== null &&
        a.id !== b.id &&
        a.categoryId === b.categoryId &&
        a.interval === b.interval &&
        a.currency === b.currency &&
        a.active === b.active &&
        foldName(a.name) === foldName(b.name) &&
        b.startDate > a.startDate &&
        Math.abs(gapDays(a.endDate, b.startDate)) <= MAX_GAP_DAYS
    );
}

function foldName(name: string): string {
    return name.trim().toLowerCase();
}

/**
 * Splits one user's fixed costs into chains (each at least two links) and
 * ambiguous groups. Fixed costs in neither stay as they are.
 */
function findChains(fixedCosts: FixedCost[]): {
    chains: FixedCost[][];
    ambiguous: FixedCost[][];
} {
    const successors = new Map<string, FixedCost[]>();
    const predecessors = new Map<string, FixedCost[]>();
    for (const a of fixedCosts) {
        for (const b of fixedCosts) {
            if (continues(a, b)) {
                successors.set(a.id, [...(successors.get(a.id) ?? []), b]);
                predecessors.set(b.id, [...(predecessors.get(b.id) ?? []), a]);
            }
        }
    }

    const chains: FixedCost[][] = [];
    const ambiguous: FixedCost[][] = [];
    const seen = new Set<string>();
    for (const fixedCost of fixedCosts) {
        if (seen.has(fixedCost.id)) {
            continue;
        }
        // Everything linked to it, in either direction.
        const group: FixedCost[] = [];
        const queue = [fixedCost];
        seen.add(fixedCost.id);
        for (let next = queue.pop(); next; next = queue.pop()) {
            group.push(next);
            for (const linked of [
                ...(successors.get(next.id) ?? []),
                ...(predecessors.get(next.id) ?? []),
            ]) {
                if (!seen.has(linked.id)) {
                    seen.add(linked.id);
                    queue.push(linked);
                }
            }
        }
        if (group.length < 2) {
            continue;
        }

        const isFork = group.some(
            (it) =>
                (successors.get(it.id)?.length ?? 0) > 1 ||
                (predecessors.get(it.id)?.length ?? 0) > 1,
        );
        // Without forks the group is a path, as B always starts after A.
        if (isFork) {
            ambiguous.push(_.sortBy(group, "startDate"));
        } else {
            chains.push(_.sortBy(group, "startDate"));
        }
    }
    return { chains, ambiguous };
}

/**
 * The first link, running from its start date to the last link's end date,
 * with each later link as a price change at its start date. Price changes of
 * a link from the next link's start date on are dropped, since the later
 * link's amount applies from then.
 */
function mergeChain(links: FixedCost[]): FixedCost {
    const first = links[0];
    const last = links.at(-1);
    if (!first || !last) {
        throw new Error("A chain has at least one link");
    }
    const priceChanges = links.flatMap((link, index) => {
        const next = links[index + 1];
        const own = link.priceChanges.filter(
            (change) => next === undefined || change.date < next.startDate,
        );
        return index === 0
            ? own
            : [{ date: link.startDate, amount: link.initialAmount }, ...own];
    });
    return {
        ...first,
        name: last.name,
        description: last.description,
        priceChanges,
        endDate: last.endDate,
    };
}

/**
 * Finds the chains of all users.
 */
export async function planFixedCostMerges(db: DB): Promise<FixedCostMergePlan> {
    const users = await db
        .selectFrom("user")
        .select(["id", "username"])
        .orderBy("username")
        .execute();
    const plan: FixedCostMergePlan = { chains: [], ambiguous: [] };
    for (const user of users) {
        const username = user.username ?? user.id;
        const { chains, ambiguous } = findChains(
            await readFixedCosts(db, user.id),
        );
        plan.chains.push(
            ...chains.map((links) => ({
                userId: user.id,
                username,
                links,
                merged: mergeChain(links),
            })),
        );
        plan.ambiguous.push(
            ...ambiguous.map((fixedCosts) => ({ username, fixedCosts })),
        );
    }
    return plan;
}

/**
 * Writes the merged fixed costs and deletes their later links, all in one
 * transaction.
 */
export async function applyFixedCostMerges(
    db: DB,
    chains: FixedCostChain[],
): Promise<void> {
    await db.transaction().execute(async (trx) => {
        for (const { userId, links, merged } of chains) {
            await trx
                .deleteFrom("fixed_costs")
                .where("user_id", "=", userId)
                .where(
                    "id",
                    "in",
                    links.slice(1).map((link) => link.id),
                )
                .execute();
            await trx
                .updateTable("fixed_costs")
                .set({
                    name: merged.name,
                    description: merged.description,
                    end_date: merged.endDate,
                })
                .where("user_id", "=", userId)
                .where("id", "=", merged.id)
                .execute();
            await writePriceChanges(
                trx,
                userId,
                merged.id,
                merged.priceChanges,
            );
        }
    });
}

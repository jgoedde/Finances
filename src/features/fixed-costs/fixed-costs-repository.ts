// Raw DB row — 1:1 mapping to SQLite columns
import type { FixedCost, FixedCostCategory } from "@/persistence/types.ts";
import {
    type FixedCostPayload,
    rowsFromResult,
    toFixedCost,
} from "@/persistence/row-mapper.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";
import { dbEventEmitter } from "@/persistence/db-event-emitter.ts";

export interface FixedCostRecord {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    interval: "monthly" | "quarterly" | "yearly";
    category_id: number;
    active: 0 | 1;
    start_date: string; // "YYYY-MM-DD"
    end_date: string | null; // "YYYY-MM-DD" | null
}

type FixedCostRow = FixedCostRecord & {
    category_name: string;
    category_description: string | null;
};

function mapRow(row: FixedCostRow): FixedCost {
    const category = {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description ?? undefined,
    } satisfies FixedCostCategory;
    return toFixedCost(row, category);
}

const JOIN_CATEGORIES = `
    SELECT fc.*,
           c.name       AS category_name,
           c.description       AS category_description
    FROM fixed_costs fc
             JOIN fixed_cost_categories c ON c.id = fc.category_id`;

export const fixedCostRepository = {
    async add(entity: FixedCostPayload): Promise<void> {
        const query = `
            INSERT INTO fixed_costs (name, description, amount, currency, interval, category_id, active, start_date, end_date)
            VALUES (:name, :description, :amount, :currency, :interval, :categoryId, :active, :startDate, :endDate)`;
        const params = {
            ":name": entity.name,
            ":description": entity.description ?? null,
            ":amount": entity.amount,
            ":currency": entity.currency,
            ":interval": entity.interval,
            ":categoryId": entity.category_id,
            ":active": entity.active,
            ":startDate": entity.start_date,
            ":endDate": entity.end_date ?? null,
        };
        PersistentDatabase.get().run(query, params);
        await PersistentDatabase.persist();
        dbEventEmitter.emit("fixedCosts:changed");
    },

    async update(id: number, patch: Partial<FixedCostPayload>): Promise<void> {
        const allowed: Array<keyof FixedCostPayload> = [
            "name",
            "description",
            "amount",
            "currency",
            "interval",
            "category_id",
            "active",
            "start_date",
            "end_date",
        ];
        const fields = (
            Object.keys(patch) as Array<keyof FixedCostPayload>
        ).filter((k) => allowed.includes(k));

        if (fields.length === 0) {
            return;
        }

        const setClauses = fields.map((k) => `${k} = :${k}`).join(", ");
        const params = Object.fromEntries(
            fields.map((k) => [`:${k}`, patch[k] ?? null]),
        );
        params[":id"] = id;

        PersistentDatabase.get().run(
            `UPDATE fixed_costs SET ${setClauses} WHERE id = :id`,
            params,
        );
        await PersistentDatabase.persist();
        dbEventEmitter.emit("fixedCosts:changed");
    },

    async remove(id: number): Promise<void> {
        PersistentDatabase.get().run(`DELETE FROM fixed_costs WHERE id = :id`, {
            ":id": id,
        });
        await PersistentDatabase.persist();
        dbEventEmitter.emit("fixedCosts:changed");
    },

    findById(id: number): FixedCost | undefined {
        const rows = rowsFromResult<FixedCostRow>(
            PersistentDatabase.get().exec(
                `${JOIN_CATEGORIES} WHERE fc.id = :id`,
                { ":id": id },
            ),
        );
        return rows[0] ? mapRow(rows[0]) : undefined;
    },

    findAll(): FixedCost[] {
        const rows = rowsFromResult<FixedCostRow>(
            PersistentDatabase.get().exec(
                `${JOIN_CATEGORIES} ORDER BY fc.name`,
            ),
        );
        return rows.map(mapRow);
    },

    findAllActive(): FixedCost[] {
        const rows = rowsFromResult<FixedCostRow>(
            PersistentDatabase.get().exec(`
                ${JOIN_CATEGORIES}
                WHERE fc.active = 1
                  AND fc.start_date <= date('now')
                  AND (fc.end_date IS NULL OR fc.end_date >= date('now'))
                ORDER BY fc.name
            `),
        );
        return rows.map(mapRow);
    },

    count(): number {
        const result = PersistentDatabase.get().exec(
            `SELECT COUNT(*) AS count FROM fixed_costs`,
        );
        if (result.length === 0 || result[0]?.values.length === 0) return 0;
        const count = result[0]?.values[0]?.[0];
        return typeof count === "number" ? count : 0;
    },

    monthlyTotal(): number {
        const result = PersistentDatabase.get().exec(`
            SELECT SUM(
                CASE interval
                    WHEN 'monthly'   THEN amount
                    WHEN 'quarterly' THEN amount / 3.0
                    WHEN 'yearly'    THEN amount / 12.0
                END 
            ) AS total
            FROM fixed_costs
            WHERE active = 1
              AND start_date <= date('now')
              AND (end_date IS NULL OR end_date >= date('now'))
        `);
        const val = result[0]?.values[0]?.[0];
        return typeof val === "number" ? val : 0;
    },
};

import SQLite from "better-sqlite3";

// Reads the database file of the old browser-only app (sql.js). Its schema:
// `categories` and `fixed_cost_categories` with integer ids, `expenses` with
// a signed amount (negative = income) and `fixed_costs` whose dates may be
// full ISO timestamps.

const SQLITE_HEADER = "SQLite format 3\0";

export function isSqliteFile(bytes: Uint8Array): boolean {
    return (
        bytes.length >= SQLITE_HEADER.length &&
        Buffer.from(bytes.subarray(0, SQLITE_HEADER.length)).toString(
            "latin1",
        ) === SQLITE_HEADER
    );
}

interface LegacyCategory {
    id: number;
    name: string;
    color: string;
    icon_name: string;
}

interface LegacyFixedCostCategory {
    id: number;
    name: string;
    description: string | null;
}

interface LegacyExpense {
    id: string;
    date: number;
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    category_id: number;
    exceptional: number | null;
}

interface LegacyFixedCost {
    id: number;
    name: string;
    description: string | null;
    amount: number;
    currency: string;
    interval: string;
    category_id: number;
    active: number;
    start_date: string;
    end_date: string | null;
}

/**
 * Copy of the file with the header switched to rollback-journal mode. A file
 * once opened by a desktop tool may say WAL (header bytes 18/19 = 2), and
 * SQLite can't open a WAL database from memory ("unable to open database
 * file"). The data itself is in the main file either way.
 */
function withRollbackJournal(bytes: Uint8Array): Buffer {
    const copy = Buffer.from(bytes);
    copy[18] = 1;
    copy[19] = 1;
    return copy;
}

/**
 * Converts a legacy database into the export format. The result is not
 * validated yet; the import validates it like any uploaded export.
 */
export function readLegacyDatabase(bytes: Uint8Array): unknown {
    const db = new SQLite(withRollbackJournal(bytes), { readonly: true });
    try {
        const all = <T>(sql: string) => db.prepare(sql).all() as T[];
        const tables = new Set(
            all<{ name: string }>(
                "SELECT name FROM sqlite_master WHERE type = 'table'",
            ).map((t) => t.name),
        );
        const rows = <T>(table: string) =>
            tables.has(table) ? all<T>(`SELECT * FROM ${table}`) : [];

        return {
            format: "finances-export",
            version: 1,
            exportedAt: new Date().toISOString(),
            categories: rows<LegacyCategory>("categories").map((c) => ({
                id: String(c.id),
                name: c.name,
                color: c.color,
                iconName: c.icon_name,
            })),
            fixedCostCategories: rows<LegacyFixedCostCategory>(
                "fixed_cost_categories",
            ).map((c) => ({
                id: String(c.id),
                name: c.name,
                description: c.description,
            })),
            fixedCosts: rows<LegacyFixedCost>("fixed_costs").map((f) => ({
                id: String(f.id),
                name: f.name,
                description: f.description,
                amount: Number(f.amount),
                currency: f.currency,
                interval: f.interval,
                categoryId: String(f.category_id),
                active: f.active === 1,
                startDate: f.start_date.slice(0, 10),
                endDate: f.end_date ? f.end_date.slice(0, 10) : null,
            })),
            transactions: rows<LegacyExpense>("expenses").map((e) => ({
                id: e.id,
                date: e.date,
                name: e.name,
                description: e.description,
                kind: Number(e.amount) < 0 ? "income" : "expense",
                amount: Math.abs(Number(e.amount)),
                currency: e.currency,
                categoryId: String(e.category_id),
                exceptional: e.exceptional === 1,
            })),
        };
    } finally {
        db.close();
    }
}

import type { Database } from "sql.js";
import { dbEventEmitter } from "@/persistence/db-event-emitter.ts";
import type { Category, Expense, ExpenseWithCategory } from "@/persistence/types.ts";
import CryptoJS from "crypto-js";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const expensesRepository = {
    async add(entity: Expense, key: string) {
        const encrypted = encryptEntity(entity, key, EXPENSES_ENCRYPTED_FIELDS);

        const query = `            
            INSERT INTO expenses (id, date, name, description, amount, currency, category_id, exceptional)
            VALUES (:id, :date, :name, :description, :amount, :currency, :categoryId, :isExceptional)`;

        const params = {
            ":id": encrypted.id,
            ":date": encrypted.date,
            ":name": encrypted.name,
            ":description": encrypted.description ?? null,
            ":amount": encrypted.amount,
            ":currency": encrypted.currency,
            ":categoryId": encrypted.category_id,
            ":isExceptional": encrypted.exceptional ? 1 : 0,
        };

        PersistentDatabase.get().run(query, params);

        await PersistentDatabase.persist();

        dbEventEmitter.emit("expenses:changed");
    },

    checkMasterPassword(key: string): boolean {
        const query = `            
            SELECT name
            FROM expenses
            LIMIT 1`;

        const result = rowsFromResult<{ name: string }>(
            PersistentDatabase.get().exec(query),
        );

        if (result.length === 0) {
            throw new Error("No expenses found in the database.");
        }

        try {
            // @ts-expect-error intentially want to ignore the return value
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = decryptValue(result[0].name, key, false);
            return true;
        } catch (error) {
            if (error instanceof DecryptionError) {
                console.error("Decryption failed:", error.message, error.value);
            } else {
                console.error("Unexpected error during decryption:", error);
            }
            return false;
        }
    },

    getTop(options: { start: Date; end: Date; limit: number }, key: string) {
        const query = `            
            SELECT *
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND amount > 0
            ORDER BY amount DESC
            LIMIT :limit
            `;

        const params = {
            ":start": options.start.getTime(),
            ":end": options.end.getTime(),
            ":limit": options.limit,
        };

        return rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            {
                key,
                encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
            },
        );
    },
    getWeekDayMostSpentOn({ start, end }: { start: Date; end: Date }):
        | {
              day: string;
              total: number;
          }
        | undefined {
        const query = `
            SELECT
                CASE strftime('%w', datetime(date / 1000, 'unixepoch'))
                    WHEN '0' THEN 'Sonntag'
                    WHEN '1' THEN 'Montag'
                    WHEN '2' THEN 'Dienstag'
                    WHEN '3' THEN 'Mittwoch'
                    WHEN '4' THEN 'Donnerstag'
                    WHEN '5' THEN 'Freitag'
                    WHEN '6' THEN 'Samstag'
                    END AS day,
                SUM(amount) AS total
            FROM expenses
            WHERE amount > 0
              AND date >= :start
              AND date <= :end
            GROUP BY day
            ORDER BY total DESC
            LIMIT 1`;

        const params = {
            ":start": start.getTime(),
            ":end": end.getTime(),
        };

        const result = rowsFromResult<{ day: string; total: number }>(
            PersistentDatabase.get().exec(query, params),
        );
        return result[0];
    },
    count() {
        const query = `            
            SELECT COUNT(*) as count
            FROM expenses`;

        const result = PersistentDatabase.get().exec(query);
        if (result.length === 0 || result[0].values.length === 0) {
            return 0;
        }
        const count = result[0].values[0][0];
        return typeof count === "number" ? count : 0;
    },

    getAll(key: string, onlyPositive: boolean = false): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            WHERE (amount > 0 OR :onlyPositive = 0)
            ORDER BY date DESC`;

        const params = {
            ":onlyPositive": onlyPositive ? 1 : 0,
        };

        return rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            {
                key,
                encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
            },
        );
    },

    findById(id: string, key: string): Expense | undefined {
        const query = `            
            SELECT *
            FROM expenses
            WHERE id = :id`;

        const params = {
            ":id": id,
        };

        const rows = rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            { key, encryptedFields: EXPENSES_ENCRYPTED_FIELDS },
        );
        return rows[0];
    },

    findByIdWithCategory(
        id: string,
        key: string,
    ): ExpenseWithCategory | undefined {
        const query = `            
            SELECT e.*, c.name as category_name, c.icon_name as category_icon_name, c.color as category_color
            FROM expenses e
                     JOIN categories c on c.id = category_id
            WHERE e.id = :id`;

        const params = {
            ":id": id,
        };

        const rows = rowsFromResult<{
            id: string;
            date: number;
            name: string;
            description?: string;
            amount: number;
            currency: string;
            category_id: number;
            exceptional: boolean;
            category_name: string;
            category_icon_name: string;
            category_color: string;
        }>(PersistentDatabase.get().exec(query, params), {
            key,
            encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
        });
        return mapExpenseWithCategory(rows[0]);
    },

    getByCategoryId(categoryId: number, key: string): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            WHERE category_id = :categoryId
            ORDER BY date DESC`;

        const params = {
            ":categoryId": categoryId,
        };

        return rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            {
                key,
                encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
            },
        );
    },

    getSpentAmountByTimeRange(
        startTimestamp: number,
        endTimestamp: number,
        categoryId?: number,
        onlyPositive: boolean = false,
    ): number {
        const query = `            
            SELECT SUM(amount) as total
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND (category_id = :categoryId OR :categoryId IS NULL)
              AND (amount > 0 OR :onlyPositive = 0)`;

        const params = {
            ":start": startTimestamp,
            ":end": endTimestamp,
            ":categoryId": categoryId ?? null,
            ":onlyPositive": onlyPositive ? 1 : 0,
        };

        const result = PersistentDatabase.get().exec(query, params);

        if (result.length === 0 || result[0].values.length === 0) {
            return 0;
        }

        const total = result[0].values[0][0];
        return typeof total === "number" ? total : 0;
    },

    getByTimeRange(
        startTimestamp: number,
        endTimestamp: number,
        key: string,
        categoryId?: number,
        onlyPositive: boolean = false,
        excludeExceptional: boolean = false,
    ): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND (category_id = :categoryId OR :categoryId IS NULL)
              AND (amount > 0 OR :onlyPositive = 0)
              AND (exceptional = 0 OR :excludeExceptional = 0)
            ORDER BY date DESC`;

        const params = {
            ":start": startTimestamp,
            ":end": endTimestamp,
            ":categoryId": categoryId ?? null,
            ":onlyPositive": onlyPositive ? 1 : 0,
            ":excludeExceptional": excludeExceptional ? 1 : 0,
        };

        return rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            {
                key,
                encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
            },
        );
    },

    getTrend() {
        const sql = `            
            SELECT date(date / 1000, 'unixepoch') AS day,
                   SUM(amount)                    AS total
            FROM expenses
            WHERE amount > 0
              AND exceptional = 0
              AND date(date / 1000, 'unixepoch') >= (date('now', '-30 days'))
            GROUP BY day`;

        return rowsFromResult<{
            day: string;
            total: number;
        }>(PersistentDatabase.get().exec(sql));
    },

    /**
     * Gets the day with the highest amount spent in the last 30 days.
     */
    getSpike() {
        const sql = `
            WITH daily_category_totals AS (SELECT date(date / 1000, 'unixepoch') AS day,
                                                  c.id                           as category_id,
                                                  c.name                         as category_name,
                                                  c.color                        as category_color,
                                                  SUM(amount)                    AS total
                                           FROM expenses
                                                    INNER JOIN main.categories c on c.id = expenses.category_id
                                           WHERE amount > 0
                                             AND exceptional = 0
                                             AND date(date / 1000, 'unixepoch') >= (date('now', '-30 days'))
                                           GROUP BY day, category_id, category_name,
                                                    category_color),
                 ranked AS (SELECT day,
                                   total,
                                   category_name,
                                   category_color,
                                   RANK() OVER (PARTITION BY day ORDER BY total DESC) AS rnk
                            FROM daily_category_totals)
            SELECT day, MAX(total) as total, category_name, category_color
            FROM ranked
            WHERE rnk = 1`;

        return rowsFromResult<{
            day: string;
            total: number;
            category_name: number;
            category_color: string;
        }>(PersistentDatabase.get().exec(sql))[0];
    },
    getChangeOverMonth() {
        const sql = `
            WITH current_month AS (SELECT strftime('%d', datetime(date / 1000, 'unixepoch')) AS day,
                                          SUM(amount)                                        AS total
                                   FROM expenses
                                   WHERE amount > 0
                                     AND exceptional = 0
                                     AND
                                       strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) = strftime('%Y-%m', 'now')
                                   GROUP BY day),
                 previous_month AS (SELECT strftime('%d', datetime(date / 1000, 'unixepoch')) AS day,
                                           SUM(amount)                                        AS total
                                    FROM expenses
                                    WHERE amount > 0
                                      AND exceptional = 0
                                      AND strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) =
                                          strftime('%Y-%m', 'now', '-1 month')
                                    GROUP BY day)
            SELECT COALESCE(SUM(c.total), 0) AS current_total,
                   COALESCE(SUM(p.total), 0) AS previous_total,
                   round(CASE
                             WHEN SUM(p.total) = 0 THEN NULL
                             ELSE (SUM(c.total) - SUM(p.total)) * 100.0 / SUM(p.total)
                             END, 0)         AS change_percentage
            FROM current_month c
                     LEFT JOIN previous_month p ON c.day = p.day;`;

        return rowsFromResult<{
            current_total: number;
            previous_total: number;
            change_percentage: number | null;
        }>(PersistentDatabase.get().exec(sql))[0];
    },
    getSpentPerCategory() {
        const sql = `
            SELECT c.id as category_id,
                   c.name as category_name,
                   c.color as category_color,
                   c.icon_name as category_icon_name,
                   SUM(e.amount) AS total,
                   COUNT(e.id) as expenses_count,
                   round(AVG(e.amount),2) as avg_expense_amount
            FROM expenses e
                     JOIN categories c ON c.id = e.category_id
            WHERE e.amount > 0
              AND e.exceptional = 0
              AND strftime('%Y-%m', datetime(e.date / 1000, 'unixepoch')) = strftime('%Y-%m', 'now')
            GROUP BY c.id, c.name, c.color, c.icon_name
            ORDER BY total DESC`;

        return rowsFromResult<{
            category_id: number;
            category_name: string;
            category_color: string;
            category_icon_name: string;
            total: number;
            expenses_count: number;
            avg_expense_amount: number;
        }>(PersistentDatabase.get().exec(sql));
    },

    /** 2) Hour with most “impulse” purchases (< threshold) */
    getImpulsePurchaseHour(
        threshold = 20,
    ): { hour: string; small_purchases: number } | undefined {
        const sql = `            
            SELECT strftime('%H', datetime(date / 1000, 'unixepoch')) AS hour,
                   COUNT(*)                                           AS small_purchases
            FROM expenses
            WHERE amount > 0
              AND amount < :threshold
              AND exceptional = 0
            GROUP BY hour
            ORDER BY small_purchases DESC
            LIMIT 1;
                `;
        const rows = rowsFromResult<{ hour: string; small_purchases: number }>(
            PersistentDatabase.get().exec(sql, { ":threshold": threshold }),
        );
        return rows[0];
    },

    /** 3) Categories that most often exceed a soft monthly budget */
    getCategoryMonthsOverBudget(
        budget = 100,
    ): { name: string; months_over_budget: number }[] {
        const sql = `            
            WITH monthly_category_totals AS (SELECT strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) AS month,
                                                    category_id,
                                                    SUM(amount)                                           AS total
                                             FROM expenses
                                             WHERE amount > 0
                                               AND exceptional = 0
                                             GROUP BY month, category_id)
            SELECT c.name,
                   COUNT(*) AS months_over_budget
            FROM monthly_category_totals m
                     JOIN categories c ON c.id = m.category_id
            WHERE m.total > :budget
            GROUP BY c.name
            ORDER BY months_over_budget DESC;
                `;
        return rowsFromResult<{ name: string; months_over_budget: number }>(
            PersistentDatabase.get().exec(sql, { ":budget": budget }),
        );
    },

    /** 4) “Leakage” categories: many small purchases */
    getLeakageCategories(
        threshold = 15,
        top = 3,
    ): { name: string; purchase_count: number; total_spent: number }[] {
        const sql = `            
            SELECT c.name,
                   COUNT(*)    AS purchase_count,
                   SUM(amount) AS total_spent
            FROM expenses e
                     JOIN categories c ON c.id = e.category_id
            WHERE amount > 0
              AND amount < :threshold
              AND exceptional = 0
            GROUP BY c.name
            ORDER BY purchase_count DESC
            LIMIT :top;`;

        return rowsFromResult<{
            name: string;
            purchase_count: number;
            total_spent: number;
        }>(
            PersistentDatabase.get().exec(sql, {
                ":threshold": threshold,
                ":top": top,
            }),
        );
    },

    /** 5) Seasonal peaks: average spend by calendar month across years */
    getSeasonalSpendingAverages(): { month: string; avg_spent: number }[] {
        const sql = `            
            SELECT month,
                   AVG(total) AS avg_spent
            FROM (SELECT strftime('%Y', datetime(date / 1000, 'unixepoch')) AS year,
                         strftime('%m', datetime(date / 1000, 'unixepoch')) AS month,
                         SUM(amount)                                        AS total
                  FROM expenses
                  WHERE amount > 0
                    AND exceptional = 0
                  GROUP BY year, month)
            GROUP BY month
            ORDER BY avg_spent DESC;
                `;

        return rowsFromResult<{ month: string; avg_spent: number }>(
            PersistentDatabase.get().exec(sql),
        );
    },

    /** 6) Weekend vs weekday spending totals in the past 3 months */
    getWeekendVsWeekdayTotals(): [
        {
            day_type: "Weekday";
            total_spent: number;
        },
        {
            day_type: "Weekend";
            total_spent: number;
        },
    ] {
        const sql = `
            SELECT CASE strftime('%w', datetime(date / 1000, 'unixepoch'))
                       WHEN '0' THEN 'Weekend'
                       WHEN '6' THEN 'Weekend'
                       ELSE 'Weekday'
                       END               AS day_type,
                   round(SUM(amount), 2) AS total_spent
            FROM expenses
            WHERE amount > 0
              AND exceptional = 0
              AND datetime(date / 1000, 'unixepoch') >= (date('now', '-3 months'))
            GROUP BY day_type
            ORDER BY day_type DESC
        `;

        const rows = rowsFromResult(PersistentDatabase.get().exec(sql));
        return [rows[0], rows[1]] as ReturnType<
            typeof expensesRepository.getWeekendVsWeekdayTotals
        >;
    },

    /** 7) Longest streak with no spending (days). Note: gap is between spending days; no-spend days ≈ gap - 1 */
    getLongestNoSpendStreakDays(): number {
        const sql = `            
            WITH days AS (SELECT DISTINCT date(date / 1000, 'unixepoch') AS day
                          FROM expenses),
                 gaps AS (SELECT day,
                                 julianday(day) - LAG(julianday(day)) OVER (ORDER BY day) AS gap
                          FROM days)
            SELECT COALESCE(MAX(gap) - 1, 0) AS longest_gap_days
            FROM gaps;
                `;
        const rows = rowsFromResult<{ longest_gap_days: number }>(
            PersistentDatabase.get().exec(sql),
        );
        return Number(rows[0]?.longest_gap_days ?? 0);
    },

    /** 8) Fastest-growing category (MoM absolute increase) */
    getFastestGrowingCategory(limit = 1): {
        category: string;
        month: string;
        total: number;
        prev_total: number;
        change: number;
    }[] {
        const sql = `            
            WITH monthly_totals AS (SELECT strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) AS month,
                                           category_id,
                                           SUM(amount)                                           AS total
                                    FROM expenses
                                    WHERE amount > 0
                                      AND exceptional = 0
                                    GROUP BY month, category_id),
                 with_prev AS (SELECT m.month,
                                      m.category_id,
                                      m.total,
                                      LAG(m.total) OVER (PARTITION BY m.category_id ORDER BY m.month) AS prev_total
                               FROM monthly_totals m)
            SELECT c.name                                   AS category,
                   with_prev.month,
                   with_prev.total,
                   with_prev.prev_total,
                   (with_prev.total - with_prev.prev_total) AS change
            FROM with_prev
                     JOIN categories c ON c.id = with_prev.category_id
            WHERE with_prev.prev_total IS NOT NULL
            ORDER BY change DESC
            LIMIT :limit;
                `;
        return rowsFromResult<{
            category: string;
            month: string;
            total: number;
            prev_total: number;
            change: number;
        }>(PersistentDatabase.get().exec(sql, { ":limit": limit }));
    },

    getMonths() {
        const query = `            
            WITH monthly_category_totals AS (SELECT strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) AS month,
                                                    category_id,
                                                    SUM(amount)                                           AS total
                                             FROM expenses
                                             WHERE amount > 0
                                             GROUP BY month, category_id)
            SELECT month,
                   c.name AS category,
                   c.icon_name as category_icon_name,
                   total
            FROM monthly_category_totals m
                     JOIN categories c ON c.id = m.category_id
            ORDER BY month DESC, category asc;
`;

        return rowsFromResult<{
            month: string;
            category: string;
            category_icon_name: string;
            total: number;
        }>(PersistentDatabase.get().exec(query));
    },

    async update(entity: Expense, key: string) {
        const encrypted = encryptEntity(entity, key, EXPENSES_ENCRYPTED_FIELDS);

        const query = `            
            UPDATE expenses
            SET date        = :date,
                name        = :name,
                description = :description,
                amount      = :amount,
                currency    = :currency,
                category_id = :categoryId,
                exceptional = :exceptional
            WHERE id = :id`;

        const params = {
            ":id": encrypted.id,
            ":date": encrypted.date,
            ":name": encrypted.name,
            ":description": encrypted.description ?? null,
            ":amount": encrypted.amount,
            ":currency": encrypted.currency,
            ":categoryId": encrypted.category_id,
            ":exceptional": encrypted.exceptional ? 1 : 0,
        };

        PersistentDatabase.get().run(query, params);

        await PersistentDatabase.persist();

        dbEventEmitter.emit("expenses:changed");
    },

    async delete(id: string) {
        const query = `            
            DELETE
            FROM expenses
            WHERE id = :id`;

        const params = {
            ":id": id,
        };

        PersistentDatabase.get().run(query, params);

        await PersistentDatabase.persist();

        dbEventEmitter.emit("expenses:changed");
    },
};

export const categoriesRepository = {
    getAll(): Category[] {
        const query = `            
            SELECT *
            FROM categories
            ORDER BY name`;

        return rowsFromResult<Category>(PersistentDatabase.get().exec(query));
    },

    findById(id: string): Category | undefined {
        const query = `            
            SELECT *
            FROM categories
            WHERE id = :id`;

        const params = {
            ":id": id,
        };

        const rows = rowsFromResult<Category>(
            PersistentDatabase.get().exec(query, params),
        );
        return rows[0];
    },
};

export const EXPENSES_ENCRYPTED_FIELDS: (keyof Expense)[] = [
    "name",
    "description",
];

class DecryptionError extends Error {
    public value: string;

    constructor(message: string, value: string) {
        super(message);
        this.value = value;
        this.name = "DecryptionError";
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decryptValue(value: any, key: string, silent: boolean = true): any {
    if (typeof value !== "string") return value;

    const bytes = CryptoJS.AES.decrypt(value, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
        if (silent) return "";
        throw new DecryptionError("Decryption failed", value);
    }

    return decrypted;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsFromResult<T = any>(
    result: ReturnType<Database["exec"]>,
    encryptionConfig?: { key: string; encryptedFields: (keyof T)[] },
): T[] {
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        columns.forEach((col, i) => {
            const shouldDecrypt =
                encryptionConfig != null &&
                encryptionConfig.encryptedFields.includes(col as keyof T);
            obj[col] = shouldDecrypt
                ? decryptValue(row[i], encryptionConfig.key)
                : row[i];
        });
        return obj as T;
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encryptValue(value: any, key: string): string {
    return CryptoJS.AES.encrypt(String(value ?? ""), key).toString();
}

function encryptEntity<T extends object>(
    entity: T,
    key: string,
    encryptedFields: (keyof T)[],
): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const copy: any = { ...entity };
    encryptedFields.forEach((field) => {
        if (
            copy[field] == null ||
            (typeof copy[field] === "string" && copy[field].trim() === "")
        ) {
            return; // Skip if field is null or undefined
        }
        copy[field] = encryptValue(copy[field], key);
    });
    return copy;
}

function mapExpenseWithCategory(
    row: Record<string, unknown>,
): ExpenseWithCategory {
    return {
        id: row.id as string,
        date: row.date as number,
        name: row.name as string,
        description: row.description as string,
        amount: Number(row.amount),
        currency: row.currency as string,
        category_id: row.category_id as number,
        exceptional: Boolean(row.exceptional),
        category: {
            id: row.category_id as number,
            name: row.category_name as string,
            color: row.category_color as string,
            icon_name: row.category_icon_name as string,
        },
    };
}

import type {
    Transaction,
    TransactionWithCategory,
} from "@/persistence/types.ts";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";
import { dbEventEmitter } from "@/persistence/db-event-emitter.ts";
import {
    mapExpenseWithCategory,
    rowsFromResult,
} from "@/persistence/row-mapper.ts";

export const transactionRepository = {
    async add(entity: Transaction) {
        const query = `            
            INSERT INTO expenses (id, date, name, description, amount, currency, category_id, exceptional)
            VALUES (:id, :date, :name, :description, :amount, :currency, :categoryId, :isExceptional)`;

        const params = {
            ":id": entity.id,
            ":date": entity.date,
            ":name": entity.name,
            ":description": entity.description ?? null,
            ":amount": entity.amount,
            ":currency": entity.currency,
            ":categoryId": entity.category_id,
            ":isExceptional": entity.exceptional ? 1 : 0,
        };

        PersistentDatabase.get().run(query, params);

        await PersistentDatabase.persist();

        dbEventEmitter.emit("expenses:changed");
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

    findByIdWithCategory(id: string): TransactionWithCategory | undefined {
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
        }>(PersistentDatabase.get().exec(query, params));
        return mapExpenseWithCategory(rows[0]);
    },

    getSpentAmountByTimeRange(
        startTimestamp: number,
        endTimestamp: number,
        categoryId?: number,
        onlyPositive: boolean = false,
    ): number {
        const query = `            
            SELECT round(SUM(amount),2) as total
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
        categoryId?: number,
        onlyPositive: boolean = false,
        excludeExceptional: boolean = false,
    ): Transaction[] {
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

        return rowsFromResult<Transaction>(
            PersistentDatabase.get().exec(query, params),
        );
    },

    getTrend() {
        const sql = `            
            SELECT date(date / 1000, 'unixepoch') AS day,
                   round(SUM(amount),2)                    AS total
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
                                   round(total,2) as total,
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
    getSpentPerCategory() {
        const sql = `
            SELECT c.id as category_id,
                   c.name as category_name,
                   c.color as category_color,
                   c.icon_name as category_icon_name,
                   round(SUM(e.amount),2) AS total,
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

    getMonths() {
        const query = `            
            WITH monthly_category_totals AS (SELECT strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) AS month,
                                                    category_id,
                                                    SUM(amount)                                           AS total
                                             FROM expenses
                                             WHERE amount > 0 AND exceptional = 0
                                             GROUP BY month, category_id)
            SELECT month,
                   c.name AS category,
                   c.icon_name as category_icon_name,
                   round(total,2) AS total
            FROM monthly_category_totals m
                     JOIN categories c ON c.id = m.category_id
            ORDER BY month DESC, category;
`;

        return rowsFromResult<{
            month: string;
            category: string;
            category_icon_name: string;
            total: number;
        }>(PersistentDatabase.get().exec(query));
    },

    async update(entity: Transaction) {
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
            ":id": entity.id,
            ":date": entity.date,
            ":name": entity.name,
            ":description": entity.description ?? null,
            ":amount": entity.amount,
            ":currency": entity.currency,
            ":categoryId": entity.category_id,
            ":exceptional": entity.exceptional ? 1 : 0,
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

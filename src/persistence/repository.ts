import type { Database } from "sql.js";
import { dbEventEmitter } from "@/persistence/db-event-emitter.ts";
import type {
    Category,
    Expense,
    ExpenseWithCategory,
} from "@/persistence/types.ts";
import CryptoJS from "crypto-js";
import { PersistentDatabase } from "@/persistence/persistent-database.ts";

export const expensesRepository = {
    async add(entity: Expense, key: string) {
        const encrypted = encryptEntity(entity, key, EXPENSES_ENCRYPTED_FIELDS);

        const query = `            
            INSERT INTO expenses (id, date, name, description, amount, currency, category_id)
            VALUES (:id, :date, :name, :description, :amount, :currency, :categoryId)`;

        const params = {
            ":id": encrypted.id,
            ":date": encrypted.date,
            ":name": encrypted.name,
            ":description": encrypted.description ?? null,
            ":amount": encrypted.amount,
            ":currency": encrypted.currency,
            ":categoryId": encrypted.category_id,
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

        const rows = rowsFromResult<Expense>(
            PersistentDatabase.get().exec(query, params),
            { key, encryptedFields: EXPENSES_ENCRYPTED_FIELDS },
        );
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
    ): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND (category_id = :categoryId OR :categoryId IS NULL)
              AND (amount > 0 OR :onlyPositive = 0)
            ORDER BY date DESC`;

        const params = {
            ":start": startTimestamp,
            ":end": endTimestamp,
            ":categoryId": categoryId ?? null,
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

    async update(entity: Expense, key: string) {
        const encrypted = encryptEntity(entity, key, EXPENSES_ENCRYPTED_FIELDS);

        const query = `            
            UPDATE expenses
            SET date        = :date,
                name        = :name,
                description = :description,
                amount      = :amount,
                currency    = :currency,
                category_id = :categoryId
            WHERE id = :id`;

        const params = {
            ":id": encrypted.id,
            ":date": encrypted.date,
            ":name": encrypted.name,
            ":description": encrypted.description ?? null,
            ":amount": encrypted.amount,
            ":currency": encrypted.currency,
            ":categoryId": encrypted.category_id,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapExpenseWithCategory(row: Record<string, any>): ExpenseWithCategory {
    return {
        id: row.id,
        date: row.date,
        name: row.name,
        description: row.description,
        amount: Number(row.amount),
        currency: row.currency,
        category_id: row.category_id,
        category: {
            id: row.category_id,
            name: row.category_name,
            color: row.category_color,
            icon_name: row.category_icon_name,
        },
    };
}

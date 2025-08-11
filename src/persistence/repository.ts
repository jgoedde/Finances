import type { Database } from "sql.js";
import { dbEvents } from "@/persistence/db-events.ts";
import { getDatabase, persistDatabase } from "@/persistence/db.ts";
import type { Category, Expense } from "@/persistence/types.ts";
import { formatISO } from "date-fns";
import CryptoJS from "crypto-js";

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

        getDatabase().run(query, params);

        await persistDatabase();

        dbEvents.emit("expenses:changed");
    },

    count() {
        const query = `            
            SELECT COUNT(*) as count
            FROM expenses`;

        const result = getDatabase().exec(query);
        if (result.length === 0 || result[0].values.length === 0) {
            return 0;
        }
        const count = result[0].values[0][0];
        return typeof count === "number" ? count : 0;
    },

    getAll(key: string): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            ORDER BY date DESC`;

        return rowsFromResult<Expense>(
            getDatabase().exec(query),
            key,
            EXPENSES_ENCRYPTED_FIELDS,
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
            getDatabase().exec(query, params),
            key,
            EXPENSES_ENCRYPTED_FIELDS,
        );
        return rows[0];
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
            getDatabase().exec(query, params),
            key,
            EXPENSES_ENCRYPTED_FIELDS,
        );
    },

    getSpentAmountByTimeRange(
        startTimestamp: number,
        endTimestamp: number,
        categoryId?: number,
    ): number {
        const startISO = formatISO(startTimestamp);
        const endISO = formatISO(endTimestamp);

        const query = `            
            SELECT SUM(amount) as total
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND (category_id = :categoryId OR :categoryId IS NULL)`;

        const params = {
            ":start": startISO,
            ":end": endISO,
            ":categoryId": categoryId ?? null,
        };

        const result = getDatabase().exec(query, params);

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
    ): Expense[] {
        const startISO = formatISO(startTimestamp);
        const endISO = formatISO(endTimestamp);

        const query = `            
            SELECT *
            FROM expenses
            WHERE date >= :start
              AND date <= :end
              AND (category_id = :categoryId OR :categoryId IS NULL)
            ORDER BY date DESC`;

        const params = {
            ":start": startISO,
            ":end": endISO,
            ":categoryId": categoryId ?? null,
        };

        return rowsFromResult<Expense>(
            getDatabase().exec(query, params),
            key,
            EXPENSES_ENCRYPTED_FIELDS,
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

        getDatabase().run(query, params);

        await persistDatabase();

        dbEvents.emit("expenses:changed");
    },

    async delete(id: string) {
        const query = `            
            DELETE
            FROM expenses
            WHERE id = :id`;

        const params = {
            ":id": id,
        };

        getDatabase().run(query, params);

        await persistDatabase();

        dbEvents.emit("expenses:changed");
    },
};

export const categoriesRepo = {
    getAll(key: string): Category[] {
        const query = `            
            SELECT *
            FROM categories
            ORDER BY name`;

        return rowsFromResult<Category>(
            getDatabase().exec(query),
            key,
            CATEGORIES_ENCRYPTED_FIELDS,
        );
    },

    findById(id: string, key: string): Category | undefined {
        const query = `            
            SELECT *
            FROM categories
            WHERE id = :id`;

        const params = {
            ":id": id,
        };

        const rows = rowsFromResult<Category>(
            getDatabase().exec(query, params),
            key,
            CATEGORIES_ENCRYPTED_FIELDS,
        );
        return rows[0];
    },
};

export const EXPENSES_ENCRYPTED_FIELDS: (keyof Expense)[] = [
    "name",
    "description",
];
export const CATEGORIES_ENCRYPTED_FIELDS: (keyof Category)[] = ["name"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decryptValue(value: any, key: string): any {
    if (typeof value !== "string") return value;
    try {
        const bytes = CryptoJS.AES.decrypt(value, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
        return value; // fallback if not encrypted
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsFromResult<T = any>(
    result: ReturnType<Database["exec"]>,
    key: string,
    encryptedFields: (keyof T)[] = [],
): T[] {
    if (result.length === 0) return [];
    const { columns, values } = result[0];
    return values.map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        columns.forEach((col, i) => {
            const shouldDecrypt = encryptedFields.includes(col as keyof T);
            obj[col] = shouldDecrypt ? decryptValue(row[i], key) : row[i];
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
        copy[field] = encryptValue(copy[field], key);
    });
    return copy;
}

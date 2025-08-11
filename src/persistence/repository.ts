import type { Database } from "sql.js";
import { dbEvents } from "@/persistence/db-events.ts";
import { getDatabase, persistDatabase } from "@/persistence/db.ts";
import type {
    Category,
    Expense,
    ExpenseWithCategory,
} from "@/persistence/types.ts";
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

    getAll(key: string, onlyPositive: boolean = false): Expense[] {
        const query = `            
            SELECT *
            FROM expenses
            WHERE (amount > 0 OR :onlyPositive = 0)
            ORDER BY date DESC`;

        const params = {
            ":onlyPositive": onlyPositive ? 1 : 0,
        };

        return rowsFromResult<Expense>(getDatabase().exec(query, params), {
            key,
            encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
        });
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
            getDatabase().exec(query, params),
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

        return rowsFromResult<Expense>(getDatabase().exec(query, params), {
            key,
            encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
        });
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

        return rowsFromResult<Expense>(getDatabase().exec(query, params), {
            key,
            encryptedFields: EXPENSES_ENCRYPTED_FIELDS,
        });
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

export const categoriesRepository = {
    getAll(): Category[] {
        const query = `            
            SELECT *
            FROM categories
            ORDER BY name`;

        return rowsFromResult<Category>(getDatabase().exec(query));
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
            getDatabase().exec(query, params),
        );
        return rows[0];
    },
};

export const EXPENSES_ENCRYPTED_FIELDS: (keyof Expense)[] = [
    "name",
    "description",
];

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

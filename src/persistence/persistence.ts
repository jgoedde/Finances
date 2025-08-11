import { type Category, type Expense } from "./types";

export function getCategories(): Category[] {
    // const db = getDatabase();
    // const result = db.exec("SELECT * FROM categories ORDER BY name");
    // return (
    //     result[0]?.values.map((row) => ({
    //         id: row[0] as number,
    //         name: row[1] as string,
    //         color: row[2] as string,
    //         icon_name: row[3] as string,
    //     })) ?? []
    // );

    return [];
}

export async function addCategory(_cat: Omit<Category, "id">): Promise<void> {
    // const db = getDatabase();
    // db.run("INSERT INTO categories (name, color, icon_name) VALUES (?, ?, ?)", [
    //     cat.name,
    //     cat.color,
    //     cat.icon_name,
    // ]);
    // await persistDatabase();
}

export function getExpenses(): Expense[] {
    // const db = getDatabase();
    // const result = db.exec("SELECT * FROM expenses ORDER BY date DESC");
    // return (
    //     result[0]?.values.map((row) => ({
    //         id: row[0] as string,
    //         date: row[1] as string,
    //         name: row[2] as string,
    //         description: row[3] as string,
    //         amount: Number(row[4]),
    //         currency: row[5] as string,
    //         category_id: row[6] as number,
    //     })) ?? []
    // );

    return [];
}

export async function addExpense(
    _exp: Omit<Expense, "id" | "date">,
): Promise<void> {
    // const db = getDatabase();
    // db.run(
    //     `
    //     INSERT INTO expenses (id, date, name, description, amount, currency, category_id)
    //     VALUES (?, datetime('now'), ?, ?, ?, ?, ?)
    // `,
    //     [
    //         uuidv4(),
    //         exp.name,
    //         exp.description ?? null,
    //         exp.amount,
    //         exp.currency,
    //         exp.category_id,
    //     ],
    // );
    // await persistDatabase();
}

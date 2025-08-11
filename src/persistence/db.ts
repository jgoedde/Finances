import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { type IDBPDatabase, openDB } from "idb";

const DB_NAME = "finances";
const DB_STORE = "sqlite-db";
const DB_KEY = "main";
type SQLiteData = Uint8Array;

let sql: SqlJsStatic | null = null;
let dbInstance: Database | null = null;

async function ensurePersistentStorage(): Promise<void> {
    if (navigator.storage && navigator.storage.persist) {
        if (!(await navigator.storage.persisted())) {
            await navigator.storage.persist();
        }
    }
}

async function openIndexedDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(DB_STORE)) {
                db.createObjectStore(DB_STORE);
            }
        },
    });
}

async function loadFromIndexedDB(): Promise<SQLiteData | undefined> {
    const idb = await openIndexedDB();
    return (await idb.get(DB_STORE, DB_KEY)) as SQLiteData | undefined;
}

async function saveToIndexedDB(db: Database): Promise<void> {
    const data: SQLiteData = db.export();
    const idb = await openIndexedDB();
    await idb.put(DB_STORE, data, DB_KEY);
}

export async function initDatabase(): Promise<Database> {
    await ensurePersistentStorage();

    if (!sql) {
        sql = await initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });
    }

    const savedData = await loadFromIndexedDB();
    dbInstance = savedData ? new sql.Database(savedData) : new sql.Database();

    if (!savedData) {
        const schema = await fetch("/schema.sql").then((r) => r.text());
        dbInstance.run(schema);
        await saveToIndexedDB(dbInstance);
    }

    return dbInstance;
}

export function getDatabase(): Database {
    if (!dbInstance) {
        throw new Error("Database not initialized. Call initDatabase() first.");
    }
    return dbInstance;
}

export async function persistDatabase(): Promise<void> {
    if (!dbInstance) throw new Error("Database not initialized.");
    await saveToIndexedDB(dbInstance);
}

export async function exportFile() {
    const data = await loadFromIndexedDB();
    if (!data) throw new Error("No database found");

    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "finances.sqlite";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export async function importFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const idb = await openIndexedDB();
    await idb.put(DB_STORE, data, DB_KEY);
}

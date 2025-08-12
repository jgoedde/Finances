import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { type IDBPDatabase, openDB } from "idb";
import { dbEventEmitter } from "@/persistence/db-event-emitter.ts";

export class PersistentDatabase {
    private static sql: SqlJsStatic | null = null;
    private static dbInstance: Database | null = null;
    public static readonly DB_NAME = "finances";
    public static readonly DB_STORE = "sqlite-db";
    public static readonly DB_KEY = "main";

    private static async ensurePersistentStorage(): Promise<void> {
        if (navigator.storage && navigator.storage.persist) {
            if (!(await navigator.storage.persisted())) {
                await navigator.storage.persist();
            }
        }
    }

    private static async openIndexedDB(): Promise<IDBPDatabase<unknown>> {
        return openDB(this.DB_NAME, 1, {
            upgrade(db) {
                if (
                    !db.objectStoreNames.contains(PersistentDatabase.DB_STORE)
                ) {
                    db.createObjectStore(PersistentDatabase.DB_STORE);
                }
            },
        });
    }

    private static async loadFromIndexedDB(): Promise<Uint8Array | undefined> {
        const idb = await this.openIndexedDB();
        return (await idb.get(this.DB_STORE, this.DB_KEY)) as
            | Uint8Array
            | undefined;
    }

    private static async saveToIndexedDB(db: Database): Promise<void> {
        const data: Uint8Array = db.export();
        const idb = await this.openIndexedDB();
        await idb.put(this.DB_STORE, data, this.DB_KEY);
    }

    public static async init(): Promise<Database> {
        await this.ensurePersistentStorage();

        if (!this.sql) {
            this.sql = await initSqlJs({
                locateFile: (file) => `https://sql.js.org/dist/${file}`,
            });
        }

        const savedData = await this.loadFromIndexedDB();
        this.dbInstance = savedData
            ? new this.sql.Database(savedData)
            : new this.sql.Database();

        if (!savedData) {
            const schema = await fetch("/schema.sql").then((r) => r.text());
            this.dbInstance.run(schema);
            await this.saveToIndexedDB(this.dbInstance);
        }

        return this.dbInstance;
    }

    public static get(): Database {
        if (!this.dbInstance) {
            throw new Error(
                "Database not initialized. Call PersistentDatabase.init() first.",
            );
        }
        return this.dbInstance;
    }

    public static async persist(): Promise<void> {
        if (!this.dbInstance) throw new Error("Database not initialized.");
        await this.saveToIndexedDB(this.dbInstance);
    }

    public static async exportFile() {
        const data = await this.loadFromIndexedDB();
        if (!data) throw new Error("No database found");

        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${new Date().toISOString()}-finance.enc.sqlite`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    public static async importFile(file: File) {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);

        const idb = await PersistentDatabase.openIndexedDB();
        await idb.put(this.DB_STORE, data, this.DB_KEY);

        await PersistentDatabase.init();

        dbEventEmitter.emit("categories:changed");
        dbEventEmitter.emit("expenses:changed");
    }
}

export type DBEventName =
    | "expenses:changed"
    | "categories:changed"
    | "fixedCosts:changed";

type DBEventHandler = () => void;

class DBEventEmitter {
    private listeners: Map<DBEventName, Set<DBEventHandler>> = new Map();

    on(event: DBEventName, handler: DBEventHandler) {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event)!.add(handler);
    }

    off(event: DBEventName, handler: DBEventHandler) {
        this.listeners.get(event)?.delete(handler);
    }

    emit(event: DBEventName) {
        console.debug(
            "emitting event",
            event,
            "for listeners",
            this.listeners.get(event),
        );
        this.listeners.get(event)?.forEach((fn) => fn());
    }
}

export const dbEventEmitter = new DBEventEmitter();

import * as React from "react";
import { useEffect, useState } from "react";
import {
    dbEventEmitter,
    type DBEventName,
} from "@/persistence/db-event-emitter.ts";

export function useTableSubscription<T>(
    queryFn: () => T,
    deps: React.DependencyList,
    eventName: DBEventName,
): T {
    const [data, setData] = useState<T>(() => queryFn());

    useEffect(() => {
        const load = () => setData(queryFn());
        load();
        dbEventEmitter.on(eventName, load);
        return () => dbEventEmitter.off(eventName, load);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return data;
}

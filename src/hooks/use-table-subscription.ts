import * as React from "react";
import { useEffect, useState } from "react";
import { type DBEventName, dbEvents } from "@/persistence/db-events.ts";

export function useTableSubscription<T>(
    queryFn: () => T,
    deps: React.DependencyList,
    eventName: DBEventName,
): T {
    const [data, setData] = useState<T>(() => queryFn());

    useEffect(() => {
        const load = () => setData(queryFn());
        load();
        dbEvents.on(eventName, load);
        return () => dbEvents.off(eventName, load);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return data;
}

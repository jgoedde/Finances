import { useMatches } from "@tanstack/react-router";

/** Whether a detail route (see `StaticDataRouteOption`) is showing. */
export function useIsDetailOpen(): boolean {
    return useMatches({
        select: (matches) => matches.some((match) => match.staticData.detail),
    });
}

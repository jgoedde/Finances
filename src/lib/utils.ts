import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function levenshtein(a: string, b: string): number {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0),
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
        }
    }

    return dp[a.length][b.length];
}

export function mergeSimilarKeys<T>(
    dict: Record<string, T[]>,
    threshold = 2,
): Record<string, T[]> {
    const keys = Object.keys(dict);
    const merged: Record<string, T[]> = {};
    const visited = new Set<string>();

    for (let i = 0; i < keys.length; i++) {
        const baseKey = keys[i];
        if (visited.has(baseKey)) continue;

        const combinedArray = [...dict[baseKey]];
        visited.add(baseKey);

        for (let j = i + 1; j < keys.length; j++) {
            const compareKey = keys[j];
            if (visited.has(compareKey)) continue;

            if (levenshtein(baseKey, compareKey) <= threshold) {
                combinedArray.push(...dict[compareKey]);
                visited.add(compareKey);
            }
        }

        merged[baseKey] = combinedArray;
    }

    return merged;
}

export function mergeSimilarStrings(list: string[], threshold = 2): string[] {
    const result: string[] = [];
    const visited = new Set<number>(); // track indices we've merged

    for (let i = 0; i < list.length; i++) {
        if (visited.has(i)) continue;

        const baseStr = list[i];
        visited.add(i);

        for (let j = i + 1; j < list.length; j++) {
            if (visited.has(j)) continue;

            const compareStr = list[j];

            if (
                levenshtein(baseStr.toLowerCase(), compareStr.toLowerCase()) <=
                threshold
            ) {
                visited.add(j);
            }
        }

        result.push(baseStr);
    }

    return result;
}

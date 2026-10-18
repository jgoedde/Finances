/**
 * Edit distance between two strings, keeping one row of the table at a time.
 */
function levenshtein(a: string, b: string): number {
    let previous = Array.from({ length: b.length + 1 }, (_, j) => j);

    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            current.push(
                Math.min(
                    previous[j]! + 1,
                    current[j - 1]! + 1,
                    previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
                ),
            );
        }
        previous = current;
    }

    return previous[b.length]!;
}

/**
 * Merges the values of keys within `threshold` edits into the first key.
 */
export function mergeSimilarKeys<T>(
    dict: Record<string, T[]>,
    threshold = 2,
): Record<string, T[]> {
    const entries = Object.entries(dict);
    const merged: Record<string, T[]> = {};
    const visited = new Set<string>();

    for (const [i, [baseKey, values]] of entries.entries()) {
        if (visited.has(baseKey)) continue;

        const combined = [...values];
        visited.add(baseKey);

        for (const [compareKey, compareValues] of entries.slice(i + 1)) {
            if (visited.has(compareKey)) continue;

            if (levenshtein(baseKey, compareKey) <= threshold) {
                combined.push(...compareValues);
                visited.add(compareKey);
            }
        }

        merged[baseKey] = combined;
    }

    return merged;
}

/**
 * Drops strings within `threshold` edits (ignoring case) of an earlier one.
 */
export function mergeSimilarStrings(list: string[], threshold = 2): string[] {
    const result: string[] = [];
    const visited = new Set<number>();

    for (const [i, baseStr] of list.entries()) {
        if (visited.has(i)) continue;
        visited.add(i);

        for (const [j, compareStr] of list.entries()) {
            if (j <= i || visited.has(j)) continue;

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

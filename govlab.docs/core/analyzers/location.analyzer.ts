import type { Collision, DocEntry, DocRegistries, LocationOptions } from "#types/location.types";
import { computeLocation } from "#core/resolvers/location.resolver";

export const collidePaths = function collidePaths(
    entries: readonly DocEntry[],
    registries: DocRegistries,
    options: LocationOptions = {},
): Collision[] {
    const byPath = new Map<string, string[]>();
    for (const entry of entries) {
        const result = computeLocation({ ...entry, options, registries });
        if (result.ok) {
            byPath.set(result.path, [...(byPath.get(result.path) ?? []), entry.source]);
        }
    }
    return [...byPath].filter(([, sources]) => sources.length > 1).map(([path, sources]) => ({ path, sources }));
};

import type { EntrySeed, PackageJsonLike } from "#types/code.types";
import { MODULE_ID } from "#configuration/constants/graph.constants";
import { barrelExports } from "#core/parsers/export.parser";
import { basename } from "node:path";
import { resolveSourceBarrels } from "#core/resolvers/barrel.resolver";

const seedKey = function seedKey(seed: EntrySeed): string {
    return `${seed.axis} ${seed.label}`;
};

const seedsForBarrel = function seedsForBarrel(axis: string, barrel: string, appLabel: string): EntrySeed[] {
    const exported = barrelExports(barrel);
    if (exported.length === 0) {
        return [{ axis, barrel, label: appLabel, name: MODULE_ID }];
    }
    return exported.map(({ name, label }) => ({ axis, barrel, label, name }));
};

export const entrySeeds = function entrySeeds(moduleDir: string, pkg: PackageJsonLike): EntrySeed[] {
    const appLabel = basename(moduleDir);
    return resolveSourceBarrels(moduleDir, pkg)
        .flatMap(({ axis, barrel }) => seedsForBarrel(axis, barrel, appLabel))
        .toSorted((left, right) => seedKey(left).localeCompare(seedKey(right)));
};

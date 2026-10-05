import type { ModuleUnit } from "#types/code.types";
import { keyOf } from "#core/formatters/definition.formatter";

interface ImportEdge {
    key: string;
    importer: string;
}

const edgesOf = function edgesOf(unit: ModuleUnit, packageMap: ReadonlyMap<string, string>): ImportEdge[] {
    return unit.imports.flatMap((binding) => {
        const target = packageMap.get(binding.source);
        if (target === undefined || target === unit.moduleDir) {
            return [];
        }
        return binding.importedNames.map((name) => ({ importer: unit.moduleDir, key: keyOf(target, name) }));
    });
};

export const crossModuleFanIn = function crossModuleFanIn(
    units: readonly ModuleUnit[],
    packageMap: ReadonlyMap<string, string>,
): Map<string, number> {
    const importers = new Map<string, Set<string>>();
    for (const edge of units.flatMap((unit) => edgesOf(unit, packageMap))) {
        importers.set(edge.key, (importers.get(edge.key) ?? new Set<string>()).add(edge.importer));
    }
    return new Map([...importers].map(([key, set]) => [key, set.size]));
};

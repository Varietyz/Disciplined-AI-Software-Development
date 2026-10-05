import type { ModuleEdge, ModuleUnit } from "#types/code.types";
import type { ModuleScope, RepoContext } from "#types/package.types";
import { buildPackageMap, sourceFiles } from "#core/loaders/package.loader";
import { relative, sep } from "node:path";
import { crossModuleFanIn } from "#core/counters/dependency.counter";
import { ingestImports } from "#core/parsers/code.parser";
import { moduleImportCycleFindings } from "#core/analyzers/dependency.analyzer";
import { readSourceOrEmpty } from "#core/loaders/source.loader";

const PATH_SEP = "/";

const importsOf = async function importsOf(moduleDir: string, scope: ModuleScope): Promise<ModuleUnit> {
    const files = sourceFiles(moduleDir, scope.pruned);
    const perFile = await Promise.all(files.map(async (file) => ingestImports(readSourceOrEmpty(file), file)));
    return { imports: perFile.flat(), moduleDir };
};

const importEdges = function importEdges(
    units: readonly ModuleUnit[],
    packageMap: ReadonlyMap<string, string>,
): ModuleEdge[] {
    return units.flatMap((unit) =>
        unit.imports.flatMap((binding) => {
            const target = packageMap.get(binding.source);
            return target !== undefined && target !== unit.moduleDir ? [{ from: unit.moduleDir, to: target }] : [];
        }),
    );
};

export const buildContext = async function buildContext(
    modules: readonly string[],
    scope: ModuleScope,
): Promise<RepoContext> {
    const packageMap = buildPackageMap(modules);
    const units = await Promise.all(modules.map(async (moduleDir) => importsOf(moduleDir, scope)));
    const repoRel = function repoRel(file: string): string {
        return relative(scope.root, file).split(sep).join(PATH_SEP);
    };
    return {
        fanIn: crossModuleFanIn(units, packageMap),
        importCycles: moduleImportCycleFindings(importEdges(units, packageMap), repoRel),
        packageMap,
    };
};

export const emptyContext = function emptyContext(): RepoContext {
    return { fanIn: new Map(), importCycles: new Map(), packageMap: new Map() };
};

import type { AnalysisStats, ModuleAnalysis } from "#types/code.types";
import { arrayField, field, numberField, stringField } from "#core/selectors/field.selector";
import { ANALYSIS_SEARCH_DEPTH } from "#configuration/constants/code.constants";
import type { PathExclusion } from "@govlab/quality/config";
import { TOP_MODULES } from "#configuration/constants/metric.constants";
import { isRecord } from "#core/predicates/record.predicate";
import path from "node:path";
import { readJson } from "#core/loaders/data.loader";
import { readdirSafe } from "#core/loaders/folder.loader";
import { relativePath } from "@ssot/paths";

const findAnalysisFiles = function findAnalysisFiles(absDir: string, depth: number, ignore: PathExclusion): string[] {
    const hexDir = relativePath("moduleInfo.root");
    const entries = readdirSafe(absDir);
    const here = entries.some((entry) => entry.isDirectory() && entry.name === hexDir)
        ? [path.join(absDir, relativePath("moduleInfo.analysis"))]
        : [];
    if (depth > ANALYSIS_SEARCH_DEPTH) {
        return here;
    }
    const deeper = entries
        .filter((entry) => entry.isDirectory() && entry.name !== hexDir)
        .map((entry) => path.join(absDir, entry.name))
        .filter((dir) => !ignore(dir))
        .flatMap((dir) => findAnalysisFiles(dir, depth + 1, ignore));
    return [...here, ...deeper];
};

const readModuleAnalysis = function readModuleAnalysis(file: string): ModuleAnalysis | null {
    const data = readJson(file);
    if (!isRecord(data)) {
        return null;
    }
    const summary = field(data, "summary");
    return {
        definitions: numberField(summary, "definitions", 0),
        edges: numberField(summary, "edges", 0),
        flows: arrayField(data, "definitions")
            .map((definition) => stringField(definition, "flow"))
            .filter((flow) => flow.length > 0),
        module: stringField(data, "module"),
        unresolvedCalls: numberField(summary, "unresolvedCalls", 0),
    };
};

const flowCounts = function flowCounts(modules: readonly ModuleAnalysis[]): Map<string, number> {
    const counts = new Map<string, number>();
    for (const flow of modules.flatMap((module) => module.flows)) {
        counts.set(flow, (counts.get(flow) ?? 0) + 1);
    }
    return counts;
};

const sumOf = function sumOf(modules: readonly ModuleAnalysis[], pick: (module: ModuleAnalysis) => number): number {
    return modules.reduce((total, module) => total + pick(module), 0);
};

export const collectAnalysis = function collectAnalysis(root: string, ignore: PathExclusion): AnalysisStats {
    const modules = findAnalysisFiles(root, 0, ignore)
        .map((file) => readModuleAnalysis(file))
        .filter((module): module is ModuleAnalysis => module !== null);
    const edges = sumOf(modules, (module) => module.edges);
    const unresolvedCalls = sumOf(modules, (module) => module.unresolvedCalls);
    return {
        byFlow: flowCounts(modules),
        definitions: sumOf(modules, (module) => module.definitions),
        edges,
        modulesAnalyzed: modules.length,
        producer: relativePath("govlab.patterns"),
        resolutionRate: edges > 0 ? (edges - unresolvedCalls) / edges : 0,
        topByDefinitions: modules
            .toSorted((left, right) => right.definitions - left.definitions)
            .slice(0, TOP_MODULES)
            .map((module) => ({ definitions: module.definitions, module: module.module })),
        unresolvedCalls,
    };
};

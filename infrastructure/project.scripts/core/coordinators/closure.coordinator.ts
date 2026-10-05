import { GRAPH_VERSION, TEST_MARK } from "#configuration/constants/closure.constants";
import type { ClosureGraph } from "#types/closure.types";
import { collectExternalConsumers } from "#core/analyzers/export.analyzer";
import { collectGlobEdges } from "#core/analyzers/barrel.analyzer";
import { fileDeltas } from "#core/analyzers/closure.analyzer";
import { foldDeltas } from "#core/converters/closure.converter";
import { manifestOf } from "#core/loaders/manifest.loader";
import { selfImportTargets } from "#core/resolvers/specifier.resolver";
import { sourceFilesUnder } from "#core/loaders/source.loader";

export const buildClosureGraph = function buildClosureGraph(root: string): ClosureGraph {
    const files = sourceFilesUnder(root).filter((file) => !file.includes(TEST_MARK));
    const targets = selfImportTargets(manifestOf(root));
    const deltas = files.flatMap((file) => fileDeltas(file, root, targets));
    const exports = deltas.flatMap((delta) => delta.exports ?? []);
    return {
        ...foldDeltas([
            ...deltas,
            { sideEffectImports: collectGlobEdges(root, files) },
            { externalConsumers: collectExternalConsumers(root, exports) },
        ]),
        version: GRAPH_VERSION,
    };
};

export const graphCounts = function graphCounts(graph: ClosureGraph): Readonly<Record<string, number>> {
    return {
        consumers: graph.consumers.length,
        emits: graph.emits.length,
        exports: graph.exports.length,
        icons: graph.iconsExports.length,
        "id consts": graph.idsExports.length,
        imports: graph.imports.length,
        interfaces: graph.interfaces.length,
        registers: graph.registers.length,
        strings: graph.stringsExports.length,
        subscribes: graph.subscribes.length,
    };
};

import type { AnalyzeRequest, Analyzer, EntrySeed, ProgramAnalysis } from "#types/code.types";
import { CallVisitor } from "#core/visitors/code.typescript.visitor";
import type { CodeGraph } from "#types/graph.types";
import { GraphStore } from "#core/stores/graph.store";
import { TsGraphBuilder } from "#core/factories/graph.typescript.factory";
import { detectProtocol } from "#core/analyzers/orchestration.analyzer";
import { detectState } from "#core/analyzers/machine.analyzer";
import { entrySeeds } from "#core/factories/seed.factory";
import { moduleCompilerOptions } from "#core/resolvers/program.resolver";
import { relFromModules } from "#core/resolvers/source.resolver";
import { resolve } from "node:path";
import { resolveSourceBarrels } from "#core/resolvers/barrel.resolver";
import ts from "typescript";
import { unresolvedCalls } from "#configuration/strings/code.strings";

const createAnalysis = function createAnalysis(moduleDir: string, seeds: readonly EntrySeed[]): ProgramAnalysis {
    const program = ts.createProgram({
        options: moduleCompilerOptions(moduleDir),
        rootNames: [...new Set(seeds.map((seed) => seed.barrel))],
    });
    return { checker: program.getTypeChecker(), dirPosix: resolve(moduleDir).split("\\").join("/"), program };
};

const buildGraph = function buildGraph(
    request: AnalyzeRequest,
    analysis: ProgramAnalysis,
    seeds: readonly EntrySeed[],
): CodeGraph {
    const store = new GraphStore();
    const visitor = new CallVisitor({ ...analysis, recognizers: request.recognizers, store });
    const builder = new TsGraphBuilder(analysis, store, visitor);
    builder.seedAll(seeds);
    if (builder.unresolved > 0) {
        request.logger?.(unresolvedCalls(relFromModules(request.moduleDir), builder.unresolved));
    }
    return builder.result();
};

export const analyzer: Analyzer = {
    analyze(request) {
        const seeds = entrySeeds(request.moduleDir, request.pkg);
        if (seeds.length === 0) {
            return null;
        }
        const analysis = createAnalysis(request.moduleDir, seeds);
        const graph = buildGraph(request, analysis, seeds);
        if (graph.nodes.length === 0) {
            return null;
        }
        return {
            edges: graph.edges,
            nodes: graph.nodes,
            protocol: detectProtocol(analysis),
            state: detectState(analysis),
        };
    },
    canAnalyze(dir, pkg) {
        return resolveSourceBarrels(dir, pkg ?? {}).length > 0;
    },
    ecosystem: "typescript",
};

import type { Analyzer, Recognizer } from "#types/code.types";
import type { CodeGraph } from "#types/graph.types";
import { loadAnalyzers } from "#core/loaders/code.loader";
import { loadRecognizers } from "#core/loaders/syntax.loader";

const loaded: { analyzers?: Promise<Analyzer[]>; recognizers?: Promise<Recognizer[]> } = {};

export const deriveCodeGraph = async function deriveCodeGraph(
    moduleDir: string,
    pkg: Record<string, unknown>,
    logger?: (message: string) => void,
): Promise<CodeGraph | null> {
    loaded.analyzers ??= loadAnalyzers();
    loaded.recognizers ??= loadRecognizers();
    const analyzer = (await loaded.analyzers).find((candidate) => candidate.canAnalyze(moduleDir, pkg));
    if (!analyzer) {
        return null;
    }
    const recognizers = await loaded.recognizers;
    return analyzer.analyze({ moduleDir, pkg, recognizers, ...(logger ? { logger } : {}) });
};

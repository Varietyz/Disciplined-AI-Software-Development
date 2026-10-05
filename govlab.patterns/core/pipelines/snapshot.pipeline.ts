import type { AnalyzeOptions, AnalyzeReport, WindowSnapshot } from "#types/record.types";
import { assemble, feed } from "#core/coordinators/field.coordinator";
import type { FieldAnalyzer } from "#core/analyzers/field.analyzer";
import type { FieldSchema } from "#types/schema.types";
import { buildAnalyzers } from "#core/factories/field.factory";
import { detectSchema } from "#core/analyzers/schema.analyzer";
import { graphOf } from "#core/factories/graph.factory";
import { inferMapping } from "#core/resolvers/representation.resolver";
import { toReport } from "#core/converters/report.converter";

interface StreamContext {
    analyzers: Map<string, FieldAnalyzer>;
    schema: FieldSchema[];
}

interface StreamState {
    context: StreamContext | null;
    processed: number;
}

const contextOf = function contextOf(window: readonly unknown[], options: AnalyzeOptions): StreamContext {
    const schema = detectSchema(window, options.floatFields);
    return { analyzers: buildAnalyzers(options.mapping ?? inferMapping(schema)), schema };
};

const snapshotOf = function snapshotOf(context: StreamContext, processed: number): AnalyzeReport {
    const { nodes, findings } = assemble(context.analyzers);
    return toReport(processed, { findings, graph: graphOf(nodes), schema: context.schema });
};

const stepWindow = function stepWindow(
    window: readonly unknown[],
    state: StreamState,
    options: AnalyzeOptions,
): { state: StreamState; snapshot: WindowSnapshot } {
    const context = state.context ?? contextOf(window, options);
    feed(context.analyzers, window);
    const processed = state.processed + window.length;
    return { snapshot: { count: processed, report: snapshotOf(context, processed) }, state: { context, processed } };
};

export const windowedReports = function* windowedReports(
    records: readonly unknown[],
    windowSize: number,
    options: AnalyzeOptions = {},
): Generator<WindowSnapshot> {
    const context = contextOf(records, options);
    const size = windowSize > 0 ? windowSize : records.length;
    let processed = 0;
    for (let start = 0; start < records.length; start += size) {
        const chunk = records.slice(start, start + size);
        feed(context.analyzers, chunk);
        processed += chunk.length;
        yield { count: processed, report: snapshotOf(context, processed) };
    }
};

const emitWindow = function* emitWindow(
    window: readonly unknown[],
    state: StreamState,
    options: AnalyzeOptions,
): Generator<WindowSnapshot, StreamState> {
    const step = stepWindow(window, state, options);
    yield step.snapshot;
    return step.state;
};

export const streamReports = async function* streamReports(
    source: AsyncIterable<unknown> | Iterable<unknown>,
    windowSize: number,
    options: AnalyzeOptions = {},
): AsyncGenerator<WindowSnapshot> {
    const window: unknown[] = [];
    let state: StreamState = { context: null, processed: 0 };
    for await (const record of source) {
        window.push(record);
        if (window.length >= windowSize) {
            state = yield* emitWindow(window, state, options);
            window.length = 0;
        }
    }
    if (window.length > 0) {
        yield* emitWindow(window, state, options);
    }
};

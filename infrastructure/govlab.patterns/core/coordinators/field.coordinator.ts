import type { FieldAnalyzer } from "#core/analyzers/field.analyzer";
import type { FieldOutput } from "#types/record.types";
import { sourceNode } from "#core/factories/node.factory";

export const feed = function feed(analyzers: ReadonlyMap<string, FieldAnalyzer>, chunk: readonly unknown[]): void {
    for (const analyzer of analyzers.values()) {
        analyzer.update(chunk);
    }
};

export const assemble = function assemble(analyzers: ReadonlyMap<string, FieldAnalyzer>): FieldOutput {
    const outputs = [...analyzers.values()].map((analyzer) => analyzer.produce());
    return {
        findings: outputs.flatMap((output) => output.findings),
        nodes: [sourceNode(), ...outputs.flatMap((output) => output.nodes)],
    };
};

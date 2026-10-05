import { analysisNode, findingNode } from "#core/factories/node.factory";
import type { FieldOutput } from "#types/record.types";
import type { RepresentationRuntime } from "#types/representation.types";
import { runtimeFor } from "#core/selectors/representation.selector";

interface BoundRuntime {
    representation: string;
    runtime: RepresentationRuntime;
}

const bind = function bind(field: string, representations: readonly string[]): BoundRuntime[] {
    return representations.flatMap((representation) => {
        const factory = runtimeFor(representation);
        return factory ? [{ representation, runtime: factory(field) }] : [];
    });
};

export class FieldAnalyzer {
    private readonly field: string;
    private readonly runtimes: readonly BoundRuntime[];

    public constructor(field: string, representations: readonly string[]) {
        this.field = field;
        this.runtimes = bind(field, representations);
    }

    public update(chunk: readonly unknown[]): void {
        for (const { runtime } of this.runtimes) {
            runtime.update(chunk);
        }
    }

    public produce(): FieldOutput {
        const fragments = this.runtimes.map((bound) => this.emit(bound));
        return {
            findings: fragments.flatMap((fragment) => fragment.findings),
            nodes: fragments.flatMap((fragment) => fragment.nodes),
        };
    }

    private emit(bound: BoundRuntime): FieldOutput {
        const produced = bound.runtime.findings();
        if (produced.length === 0) {
            return { findings: [], nodes: [] };
        }
        const analysis = analysisNode(this.field, bound.representation);
        const findingNodes = produced.map((finding) => findingNode(analysis.id, finding.name, finding.coordinate));
        return { findings: produced, nodes: [analysis, ...findingNodes] };
    }
}

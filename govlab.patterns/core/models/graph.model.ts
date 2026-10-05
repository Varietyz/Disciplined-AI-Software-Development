import type { Node } from "#types/graph.types";
import { validateGraph } from "#core/validators/graph.validator";

export class AnalysisGraph {
    public readonly nodes: readonly Node[];

    public constructor(nodes: readonly Node[]) {
        this.nodes = nodes;
    }

    public validate(): void {
        validateGraph(this.nodes);
    }
}

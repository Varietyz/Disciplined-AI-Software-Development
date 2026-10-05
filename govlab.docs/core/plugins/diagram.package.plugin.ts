import { DIAGRAM_LEGENDS, DIAGRAM_TITLES } from "#configuration/strings/figure.strings";
import type { DiagramKind } from "#types/figure.types";
import { depGraphOf } from "#core/converters/graph.converter";
import { emitGraph } from "#core/formatters/diagram.formatter";

export const diagram: DiagramKind = {
    appliesTo(context) {
        return depGraphOf(context.moduleDeps, context.keepIsolated === true).nodes.length > 0;
    },
    id: "dependency",
    order: 3,
    render(context) {
        const model = depGraphOf(context.moduleDeps, context.keepIsolated === true);
        if (model.nodes.length === 0) {
            return null;
        }
        return { legend: DIAGRAM_LEGENDS.dependency, mermaid: emitGraph(model), sources: [] };
    },
    title: DIAGRAM_TITLES.dependency,
};

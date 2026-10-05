import { defineProducer } from "#core/factories/producer.factory";
import { evidenceEdges } from "#core/converters/graph.link.converter";

export default defineProducer({
    name: "evidence",
    produce: (context) => ({
        edges: evidenceEdges(context.scope.web, context.evidenceTarget, context.evidenceSubjects),
        nodes: [],
    }),
});

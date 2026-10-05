import { partGraph, siteNodes } from "#core/converters/graph.site.converter";
import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({
    name: "section",
    produce: (context) => {
        const { plans } = context.scope;
        const parts = partGraph(plans, context.numbers, context.codes, context.vocabulary.contains);
        return { edges: parts.edges, nodes: [...siteNodes(plans, context.numbers, context.codes), ...parts.nodes] };
    },
});

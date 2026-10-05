import { defineProducer } from "#core/factories/producer.factory";
import { sourceGraph } from "#core/converters/graph.source.converter";

export default defineProducer({
    name: "source",
    produce: (context) => sourceGraph(context.trees, context.ids, context.vocabulary),
});

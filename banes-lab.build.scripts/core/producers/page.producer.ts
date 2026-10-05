import { defineProducer } from "#core/factories/producer.factory";
import { routeGraph } from "#core/converters/graph.site.converter";

export default defineProducer({
    name: "page",
    produce: (context) =>
        routeGraph(context.discovery.routes, context.scope.plans, context.codes, context.vocabulary.contains),
});

import { concernLayerEdges, concernScopeOf } from "#core/converters/graph.concern.converter";
import { CONCERN_LAYER_RELATION } from "@banes-lab/web/constants/graph.constants";
import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({
    name: "layer",
    produce: (context) => ({ edges: concernLayerEdges(concernScopeOf(context), CONCERN_LAYER_RELATION), nodes: [] }),
});

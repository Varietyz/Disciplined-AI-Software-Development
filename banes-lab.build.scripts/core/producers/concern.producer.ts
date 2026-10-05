import { concernEdges, concernScopeOf } from "#core/converters/graph.concern.converter";
import { CONCERN_RELATION } from "@banes-lab/web/constants/graph.constants";
import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({
    name: "concern",
    produce: (context) => ({ edges: concernEdges(concernScopeOf(context), CONCERN_RELATION), nodes: [] }),
});

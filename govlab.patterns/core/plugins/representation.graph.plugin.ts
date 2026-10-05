import { GraphAccumulator } from "#core/aggregators/representation.graph.aggregator";
import { graphFindings } from "#core/converters/finding.graph.converter";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";

registerRepresentation({
    applicable: ["structure", "relation", "fractal"],
    create(field) {
        return runtimeOf(new GraphAccumulator(field), (summary) => graphFindings(field, summary));
    },
    name: "graph",
});

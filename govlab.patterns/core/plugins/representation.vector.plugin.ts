import { VectorAccumulator } from "#core/aggregators/representation.vector.aggregator";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";
import { vectorFindings } from "#core/converters/finding.vector.converter";

registerRepresentation({
    applicable: ["statistical", "space", "anomaly"],
    create(field) {
        return runtimeOf(new VectorAccumulator(field), (summary) => vectorFindings(field, summary));
    },
    name: "vector",
});

import { SequenceAccumulator } from "#core/aggregators/representation.sequence.aggregator";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";
import { sequenceFindings } from "#core/converters/finding.sequence.converter";

registerRepresentation({
    applicable: ["time", "sequential", "frequency", "fractal"],
    create(field) {
        return runtimeOf(new SequenceAccumulator(field), (summary) => sequenceFindings(field, summary));
    },
    name: "sequence",
});

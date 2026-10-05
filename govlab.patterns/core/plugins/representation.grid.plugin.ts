import { GridAccumulator } from "#core/aggregators/representation.grid.aggregator";
import { gridFindings } from "#core/converters/finding.grid.converter";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";

registerRepresentation({
    applicable: ["space", "time", "fractal"],
    create(field) {
        return runtimeOf(new GridAccumulator(field), (summary) => gridFindings(field, summary));
    },
    name: "grid",
});

import { DistributionAccumulator } from "#core/aggregators/representation.distribution.aggregator";
import { distributionFindings } from "#core/converters/finding.distribution.converter";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";

registerRepresentation({
    applicable: ["statistical", "frequency", "anomaly"],
    create(field) {
        return runtimeOf(new DistributionAccumulator(field), (summary) => distributionFindings(field, summary));
    },
    name: "distribution",
});

import { TreeAccumulator } from "#core/aggregators/representation.tree.aggregator";
import { registerRepresentation } from "#core/registries/representation.registry";
import { runtimeOf } from "#core/factories/representation.factory";
import { treeFindings } from "#core/converters/finding.tree.converter";

registerRepresentation({
    applicable: ["structure", "relation", "fractal"],
    create(field) {
        return runtimeOf(new TreeAccumulator(field), (summary) => treeFindings(field, summary));
    },
    name: "tree",
});

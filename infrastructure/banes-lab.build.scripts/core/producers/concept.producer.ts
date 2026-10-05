import { CONCEPTS } from "@govlab/context";
import { CONCEPT_RELATION } from "@banes-lab/web/constants/graph.constants";
import { conceptEdges } from "#core/converters/graph.concept.converter";
import { createResolver } from "#core/resolvers/ontology.resolver";
import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({
    name: "concept",
    produce: (context) => ({
        edges: conceptEdges(CONCEPTS, createResolver(context.built.context), CONCEPT_RELATION),
        nodes: [],
    }),
});

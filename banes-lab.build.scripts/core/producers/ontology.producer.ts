import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({
    name: "ontology",
    produce: (context) => ({ edges: context.ontology.edges, nodes: context.ontology.nodes }),
});

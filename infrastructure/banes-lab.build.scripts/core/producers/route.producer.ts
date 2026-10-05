import { defineProducer } from "#core/factories/producer.factory";

export default defineProducer({ name: "route", produce: (context) => ({ edges: context.route.edges, nodes: [] }) });

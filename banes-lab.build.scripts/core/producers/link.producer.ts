import { defineProducer } from "#core/factories/producer.factory";
import { linkEdges } from "#core/converters/graph.link.converter";

export default defineProducer({ name: "link", produce: (context) => ({ edges: linkEdges(context.scope), nodes: [] }) });

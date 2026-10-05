import type { GraphProducer } from "#types/graph.types";
import { registerProducer } from "#core/registries/producer.registry";

export const defineProducer = function defineProducer(producer: GraphProducer): GraphProducer {
    registerProducer(producer);
    return producer;
};

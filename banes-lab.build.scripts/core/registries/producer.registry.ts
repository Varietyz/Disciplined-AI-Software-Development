import type { GraphProducer } from "#types/graph.types";
import { duplicateProducer } from "#configuration/strings/graph.strings";

const producers = new Map<string, GraphProducer>();

export const registerProducer = function registerProducer(producer: GraphProducer): void {
    if (producers.has(producer.name)) {
        throw new Error(duplicateProducer(producer.name));
    }
    producers.set(producer.name, producer);
};

export const registeredProducers = function registeredProducers(): readonly GraphProducer[] {
    return [...producers.values()];
};

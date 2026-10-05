import type { CatalogProducer } from "#types/catalog.types";
import { duplicateProducer } from "#configuration/strings/catalog.strings";

const PRODUCERS = new Map<string, CatalogProducer>();

export const defineProducer = function defineProducer(producer: CatalogProducer): CatalogProducer {
    if (PRODUCERS.has(producer.name)) {
        throw new Error(duplicateProducer(producer.name));
    }
    PRODUCERS.set(producer.name, producer);
    return producer;
};

export const registeredProducers = function registeredProducers(): CatalogProducer[] {
    return [...PRODUCERS.values()].toSorted((a, b) => a.name.localeCompare(b.name));
};

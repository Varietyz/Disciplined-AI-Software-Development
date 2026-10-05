import type { CatalogProducer } from "#types/catalog.types";
import { importFolder } from "#core/loaders/folder.loader";
import { registeredProducers } from "#core/registries/producer.registry";

const PRODUCER_SUFFIX = ".producer.ts";

export const loadProducers = async function loadProducers(): Promise<CatalogProducer[]> {
    await importFolder("govlab.quality.producers", PRODUCER_SUFFIX);
    return registeredProducers();
};

import type { CatalogProducer, CatalogRequest, CatalogWriter, KnobEntry } from "#types/catalog.types";
import { REGENERATED, productLine, unknownProducer } from "#configuration/strings/catalog.strings";
import { catalogWriter, writeKnobs, writeProduct } from "#core/persistence/catalog.persistence";
import { discoverSteps, runSteps } from "#core/pipelines/catalog.pipeline";
import { loadProducers } from "#core/loaders/producer.loader";

const EVERY_PRODUCER = "all";
const SUMMARY_INDENT = 2;

const select = function select(producers: readonly CatalogProducer[], names: readonly string[]): CatalogProducer[] {
    if (names.includes(EVERY_PRODUCER)) {
        return [...producers];
    }
    const known = new Map(producers.map((producer) => [producer.name, producer]));
    return names.map((name) => {
        const producer = known.get(name);
        if (!producer) {
            throw new Error(unknownProducer(name, [...known.keys()].join(", ")));
        }
        return producer;
    });
};

const refreshRules = async function refreshRules(
    producers: readonly CatalogProducer[],
    writer: CatalogWriter,
    write: (line: string) => void,
): Promise<void> {
    const [producer, ...rest] = producers;
    if (producer === undefined) {
        return;
    }
    const products = await producer.produce();
    await Promise.all(products.map(async (product) => writeProduct(writer, product)));
    for (const product of products) {
        write(productLine(product.source, JSON.stringify(product.summary, null, SUMMARY_INDENT)));
    }
    await refreshRules(rest, writer, write);
};

const refreshKnobs = async function refreshKnobs(
    producers: readonly CatalogProducer[],
    writer: CatalogWriter,
): Promise<void> {
    const entries = await Promise.all(
        producers.flatMap((producer) =>
            producer.knobs ? [producer.knobs().then((knobs): [string, KnobEntry[]] => [producer.name, knobs])] : [],
        ),
    );
    if (entries.length > 0) {
        await writeKnobs(writer, new Map(entries));
    }
};

export const regenerateCatalog = async function regenerateCatalog(
    request: CatalogRequest,
    write: (line: string) => void,
): Promise<void> {
    const producers = await loadProducers();
    const writer = await catalogWriter();
    const requested = select(producers, request.rules);
    const builds = producers.filter((producer) => producer.refresh === "build" && !requested.includes(producer));
    await refreshRules([...builds, ...requested], writer, write);
    await refreshKnobs(select(producers, request.knobs), writer);
    await runSteps(await discoverSteps(), writer, write);
    write(REGENERATED);
};

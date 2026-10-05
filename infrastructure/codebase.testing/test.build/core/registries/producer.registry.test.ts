import { describe, expect, it } from "vitest";
import { registerProducer, registeredProducers } from "@banes-lab/build-scripts/core/registries/producer.registry.ts";
import { PRODUCER_SUFFIX } from "@banes-lab/build-scripts/configuration/constants/graph.constants.ts";
import { defineProducer } from "@banes-lab/build-scripts/core/factories/producer.factory.ts";
import { duplicateProducer } from "@banes-lab/build-scripts/configuration/strings/graph.strings.ts";
import { importFolder } from "@banes-lab/build-scripts/core/loaders/folder.loader.ts";

const EMPTY = { edges: [], nodes: [] };

describe("the graph producer registry", () => {
    it("registers every producer file the discovery folder holds, once each", async () => {
        await importFolder("app.graphProducers", PRODUCER_SUFFIX);
        const names = registeredProducers().map((producer) => producer.name);
        expect(names).toContain("ontology");
        expect(names).toContain("source");
        expect(new Set(names).size).toBe(names.length);
    });

    it("refuses a second producer under a registered name", () => {
        defineProducer({ name: "probe-producer", produce: () => EMPTY });
        expect(() => defineProducer({ name: "probe-producer", produce: () => EMPTY })).toThrow(
            duplicateProducer("probe-producer"),
        );
    });

    it("lists a producer registered directly among the registered ones", () => {
        const producer = { name: "direct-producer", produce: () => EMPTY };
        registerProducer(producer);
        expect(registeredProducers()).toContain(producer);
    });
});

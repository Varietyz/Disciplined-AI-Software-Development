import { defineProducer, registeredProducers } from "@govlab/quality/core/registries/producer.registry.ts";
import { expect, test } from "vitest";

const produce = async (): Promise<[]> => {
    await Promise.resolve();
    return [];
};

test("defineProducer registers each producer once, and registeredProducers lists them by name", () => {
    defineProducer({ name: "zeta", produce, refresh: "manual" });
    defineProducer({ name: "alpha", produce, refresh: "build" });
    expect(registeredProducers().map((producer) => producer.name)).toStrictEqual(["alpha", "zeta"]);
    expect(() => defineProducer({ name: "alpha", produce, refresh: "build" })).toThrow('"alpha"');
});
